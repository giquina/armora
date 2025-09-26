import { ProtectionHub } from './types';

export const mockProtectionHubs: ProtectionHub[] = [
  {
    id: 'hub-london-central',
    name: 'London Central Protection Hub',
    location: {
      address: 'Canary Wharf, London E14 5HP',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    coverage: {
      radius: 25,
      areas: ['Central London', 'City of London', 'Westminster', 'Kensington', 'Chelsea'],
      primaryZones: ['Zone 1', 'Zone 2']
    },
    status: 'available',
    officers: {
      total: 45,
      available: 12,
      active: 8
    },
    response: {
      averageTime: 8,
      currentLoad: 'medium'
    },
    services: {
      essential: true,
      executive: true,
      shadow: true
    },
    ratings: {
      overall: 4.9,
      totalReviews: 342
    },
    specializations: ['Corporate Executive Protection', 'VIP Transport', 'Event Security', 'Airport Services'],
    contact: {
      phone: '+44 20 7123 4567',
      emergencyPhone: '+44 20 7999 0001'
    },
    operatingHours: {
      start: '00:00',
      end: '23:59',
      is24h: true
    },
    distance: 2.3,
    isFavorite: true
  },
  {
    id: 'hub-london-west',
    name: 'West London Protection Hub',
    location: {
      address: 'Hammersmith, London W6 8DL',
      coordinates: { lat: 51.4927, lng: -0.2339 }
    },
    coverage: {
      radius: 20,
      areas: ['Hammersmith', 'Fulham', 'Chiswick', 'Ealing', 'Richmond'],
      primaryZones: ['Zone 2', 'Zone 3']
    },
    status: 'available',
    officers: {
      total: 28,
      available: 8,
      active: 4
    },
    response: {
      averageTime: 12,
      currentLoad: 'low'
    },
    services: {
      essential: true,
      executive: true,
      shadow: false
    },
    ratings: {
      overall: 4.7,
      totalReviews: 189
    },
    specializations: ['Residential Security', 'School Runs', 'Local Transport', 'Shopping Escorts'],
    contact: {
      phone: '+44 20 8123 4567',
      emergencyPhone: '+44 20 7999 0002'
    },
    operatingHours: {
      start: '06:00',
      end: '22:00',
      is24h: false
    },
    distance: 5.7,
    isFavorite: false
  },
  {
    id: 'hub-london-north',
    name: 'North London Protection Hub',
    location: {
      address: 'Camden, London NW1 7BY',
      coordinates: { lat: 51.5392, lng: -0.1426 }
    },
    coverage: {
      radius: 18,
      areas: ['Camden', 'Islington', 'Hackney', 'Hampstead', 'Highgate'],
      primaryZones: ['Zone 2', 'Zone 3']
    },
    status: 'busy',
    officers: {
      total: 22,
      available: 3,
      active: 15
    },
    response: {
      averageTime: 18,
      currentLoad: 'high'
    },
    services: {
      essential: true,
      executive: true,
      shadow: true
    },
    ratings: {
      overall: 4.6,
      totalReviews: 156
    },
    specializations: ['Night Security', 'Entertainment Venues', 'Private Events', 'Medical Escorts'],
    contact: {
      phone: '+44 20 7456 7890',
      emergencyPhone: '+44 20 7999 0003'
    },
    operatingHours: {
      start: '00:00',
      end: '23:59',
      is24h: true
    },
    distance: 4.1,
    isFavorite: false
  },
  {
    id: 'hub-heathrow',
    name: 'Heathrow Airport Protection Hub',
    location: {
      address: 'Heathrow Airport, Hounslow TW6 1AP',
      coordinates: { lat: 51.4700, lng: -0.4543 }
    },
    coverage: {
      radius: 30,
      areas: ['Heathrow', 'Hayes', 'Uxbridge', 'Slough', 'Windsor'],
      primaryZones: ['Airport Zone', 'West London']
    },
    status: 'available',
    officers: {
      total: 35,
      available: 10,
      active: 6
    },
    response: {
      averageTime: 5,
      currentLoad: 'low'
    },
    services: {
      essential: true,
      executive: true,
      shadow: true
    },
    ratings: {
      overall: 4.8,
      totalReviews: 278
    },
    specializations: ['Airport Security', 'International Travel', 'Diplomatic Protection', 'Flight Connections'],
    contact: {
      phone: '+44 20 8745 6789',
      emergencyPhone: '+44 20 7999 0004'
    },
    operatingHours: {
      start: '00:00',
      end: '23:59',
      is24h: true
    },
    distance: 18.5,
    isFavorite: true
  },
  {
    id: 'hub-birmingham',
    name: 'Birmingham Protection Hub',
    location: {
      address: 'Birmingham City Centre, B1 2EA',
      coordinates: { lat: 52.4862, lng: -1.8904 }
    },
    coverage: {
      radius: 35,
      areas: ['Birmingham', 'Solihull', 'Wolverhampton', 'Coventry', 'Worcester'],
      primaryZones: ['West Midlands']
    },
    status: 'available',
    officers: {
      total: 32,
      available: 14,
      active: 5
    },
    response: {
      averageTime: 15,
      currentLoad: 'low'
    },
    services: {
      essential: true,
      executive: true,
      shadow: false
    },
    ratings: {
      overall: 4.5,
      totalReviews: 98
    },
    specializations: ['Regional Coverage', 'Business Travel', 'Industrial Security', 'Conference Security'],
    contact: {
      phone: '+44 121 456 7890',
      emergencyPhone: '+44 121 999 0001'
    },
    operatingHours: {
      start: '05:00',
      end: '23:00',
      is24h: false
    },
    distance: 120.4,
    isFavorite: false
  },
  {
    id: 'hub-manchester',
    name: 'Manchester Protection Hub',
    location: {
      address: 'Manchester City Centre, M1 5GD',
      coordinates: { lat: 53.4808, lng: -2.2426 }
    },
    coverage: {
      radius: 40,
      areas: ['Manchester', 'Salford', 'Stockport', 'Bolton', 'Liverpool'],
      primaryZones: ['Greater Manchester', 'Merseyside']
    },
    status: 'offline',
    officers: {
      total: 18,
      available: 0,
      active: 0
    },
    response: {
      averageTime: 25,
      currentLoad: 'low'
    },
    services: {
      essential: true,
      executive: false,
      shadow: false
    },
    ratings: {
      overall: 4.2,
      totalReviews: 67
    },
    specializations: ['Northern Coverage', 'Football Security', 'Music Venues', 'Industrial Zones'],
    contact: {
      phone: '+44 161 789 0123',
      emergencyPhone: '+44 161 999 0001'
    },
    operatingHours: {
      start: '06:00',
      end: '20:00',
      is24h: false
    },
    distance: 199.8,
    isFavorite: false
  }
];