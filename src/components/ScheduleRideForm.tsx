import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Calendar, MapPin, Clock } from "@phosphor-icons/react"
import { scheduledRidesStore } from '../lib/scheduledRidesStore'
import { toast } from 'sonner'

interface ScheduleRideFormProps {
  isOpen: boolean
  onClose: () => void
  initialPickup?: string
  initialDropoff?: string
}

export function ScheduleRideForm({ isOpen, onClose, initialPickup = '', initialDropoff = '' }: ScheduleRideFormProps) {
  const [formData, setFormData] = useState({
    pickupLocation: initialPickup,
    dropoffLocation: initialDropoff,
    pickupTime: '',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.pickupLocation.trim()) {
        toast.error('Pickup location is required')
        return
      }
      if (!formData.dropoffLocation.trim()) {
        toast.error('Dropoff location is required')
        return
      }
      if (!formData.pickupTime) {
        toast.error('Pickup time is required')
        return
      }

      // Validate pickup time is in the future
      const pickupDateTime = new Date(formData.pickupTime)
      const now = new Date()
      if (pickupDateTime <= now) {
        toast.error('Pickup time must be in the future')
        return
      }

      // Add scheduled ride
      const newRide = scheduledRidesStore.add({
        userId: 'current_user', // In a real app, this would come from auth
        pickupLocation: formData.pickupLocation.trim(),
        dropoffLocation: formData.dropoffLocation.trim(),
        pickupTimeISO: pickupDateTime.toISOString(),
        status: 'scheduled',
        notes: formData.notes.trim() || undefined
      })

      toast.success('Ride scheduled successfully!')
      
      // Reset form and close
      setFormData({
        pickupLocation: '',
        dropoffLocation: '',
        pickupTime: '',
        notes: ''
      })
      onClose()

    } catch (error) {
      toast.error('Failed to schedule ride')
      console.error('Error scheduling ride:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Schedule a Ride</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X size={16} />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                Pickup Location
              </label>
              <Input
                placeholder="Enter pickup address"
                value={formData.pickupLocation}
                onChange={(e) => handleChange('pickupLocation', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                Dropoff Location
              </label>
              <Input
                placeholder="Enter destination address"
                value={formData.dropoffLocation}
                onChange={(e) => handleChange('dropoffLocation', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock size={16} />
                Pickup Time
              </label>
              <Input
                type="datetime-local"
                value={formData.pickupTime}
                onChange={(e) => handleChange('pickupTime', e.target.value)}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                placeholder="Add any special instructions..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Scheduling...' : 'Schedule Ride'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}