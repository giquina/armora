export interface ScheduledRide {
  id: string
  userId: string
  pickupLocation: string
  dropoffLocation: string
  pickupTimeISO: string
  status: 'scheduled' | 'canceled' | 'completed'
  notes?: string
}