import { ScheduledRide } from '../types/ScheduledRide'

// In-memory store for scheduled rides
let scheduledRides: ScheduledRide[] = []

export const scheduledRidesStore = {
  // Get all scheduled rides
  getAll: (): ScheduledRide[] => {
    return [...scheduledRides]
  },

  // Get upcoming rides (pickupTime > now)
  getUpcoming: (): ScheduledRide[] => {
    const now = new Date().toISOString()
    return scheduledRides
      .filter(ride => ride.pickupTimeISO > now && ride.status === 'scheduled')
      .sort((a, b) => a.pickupTimeISO.localeCompare(b.pickupTimeISO))
  },

  // Add a new scheduled ride
  add: (ride: Omit<ScheduledRide, 'id'>): ScheduledRide => {
    const newRide: ScheduledRide = {
      ...ride,
      id: `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    scheduledRides.push(newRide)
    return newRide
  },

  // Get ride by ID
  getById: (id: string): ScheduledRide | undefined => {
    return scheduledRides.find(ride => ride.id === id)
  }
}