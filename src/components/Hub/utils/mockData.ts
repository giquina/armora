export interface Booking {
  id: string;
  status: 'active' | 'scheduled' | 'completed' | 'cancelled';
  serviceType: 'standard' | 'executive' | 'shadow';
  serviceName: string;
  commencementLocation: {
    address: string;
    coordinates: [number, number];
  };
  secureDestination: {
    address: string;
    coordinates: [number, number];
  };
  scheduledTime: Date;
  actualPickupTime?: Date;
  completedTime?: Date;
  protectionOfficer: {
    name: string;
    photo: string;
    rating: number;
    vehicle: string;
    plate: string;
    phone: string;
  };
  pricing: {
    baseFare: number;
    timeFare: number;
    distanceFare: number;
    total: number;
    currency: string;
  };
  route: {
    distance: number;
    duration: number;
    polyline: string;
  };
  payment: {
    method: string;
    status: 'pending' | 'completed' | 'failed';
  };
}

export interface FavoriteRoute {
  id: string;
  nickname: string;
  from: string;
  to: string;
  frequency: number;
  lastUsed: Date;
  estimatedPrice: number;
  preferredService: string;
}

export interface UserStats {
  totalTrips: number;
  totalSaved: number;
  averageRating: number;
  activeBookings: number;
}

// Mock data
export const mockBookings: Booking[] = [
  {
    id: 'AR-2024-001',
    status: 'active',
    serviceType: 'executive',
    serviceName: 'Executive Security',
    commencementLocation: {
      address: '1 Knightsbridge, London SW1X 7XL',
      coordinates: [-0.1611, 51.5020]
    },
    secureDestination: {
      address: 'London Heathrow Airport, Terminal 5',
      coordinates: [-0.4877, 51.4700]
    },
    scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    protectionOfficer: {
      name: 'Marcus Thompson',
      photo: '/avatars/marcus.jpg',
      rating: 4.9,
      vehicle: 'BMW 5 Series',
      plate: 'AR24 MRA',
      phone: '+44 7700 900123'
    },
    pricing: {
      baseFare: 35,
      timeFare: 45,
      distanceFare: 25,
      total: 105,
      currency: 'GBP'
    },
    route: {
      distance: 25.4,
      duration: 45,
      polyline: 'encoded_polyline_data'
    },
    payment: {
      method: 'Card ending in 4531',
      status: 'completed'
    }
  },
  {
    id: 'AR-2024-002',
    status: 'scheduled',
    serviceType: 'standard',
    serviceName: 'Standard Protection',
    commencementLocation: {
      address: 'The Shard, 32 London Bridge St',
      coordinates: [-0.0865, 51.5045]
    },
    secureDestination: {
      address: 'Canary Wharf Station, London E14 5AB',
      coordinates: [-0.0189, 51.5054]
    },
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    protectionOfficer: {
      name: 'Sarah Collins',
      photo: '/avatars/sarah.jpg',
      rating: 4.8,
      vehicle: 'BMW 3 Series',
      plate: 'AR24 SRC',
      phone: '+44 7700 900456'
    },
    pricing: {
      baseFare: 25,
      timeFare: 30,
      distanceFare: 15,
      total: 70,
      currency: 'GBP'
    },
    route: {
      distance: 8.2,
      duration: 25,
      polyline: 'encoded_polyline_data_2'
    },
    payment: {
      method: 'Card ending in 4531',
      status: 'pending'
    }
  },
  {
    id: 'AR-2024-003',
    status: 'completed',
    serviceType: 'shadow',
    serviceName: 'Shadow Protection',
    commencementLocation: {
      address: 'Mayfair, London W1K 6DJ',
      coordinates: [-0.1419, 51.5074]
    },
    secureDestination: {
      address: 'Westminster, London SW1A 0AA',
      coordinates: [-0.1276, 51.4994]
    },
    scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    actualPickupTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    completedTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
    protectionOfficer: {
      name: 'David Kumar',
      photo: '/avatars/david.jpg',
      rating: 4.7,
      vehicle: 'Unmarked Audi A4',
      plate: 'AR24 DKM',
      phone: '+44 7700 900789'
    },
    pricing: {
      baseFare: 30,
      timeFare: 35,
      distanceFare: 18,
      total: 83,
      currency: 'GBP'
    },
    route: {
      distance: 4.1,
      duration: 18,
      polyline: 'encoded_polyline_data_3'
    },
    payment: {
      method: 'Card ending in 4531',
      status: 'completed'
    }
  }
];

export const mockFavoriteRoutes: FavoriteRoute[] = [
  {
    id: 'route-001',
    nickname: 'Home to Office',
    from: 'Kensington, London',
    to: 'The City, London',
    frequency: 15,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    estimatedPrice: 45,
    preferredService: 'standard'
  },
  {
    id: 'route-002',
    nickname: 'Airport Runs',
    from: 'Central London',
    to: 'Heathrow Airport',
    frequency: 8,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    estimatedPrice: 95,
    preferredService: 'executive'
  },
  {
    id: 'route-003',
    nickname: 'Evening Commute',
    from: 'Canary Wharf',
    to: 'Richmond, London',
    frequency: 12,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    estimatedPrice: 55,
    preferredService: 'shadow'
  }
];

export const mockUserStats: UserStats = {
  totalTrips: 47,
  totalSaved: 2847,
  averageRating: 4.9,
  activeBookings: 2
};

export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getTimeBasedSuggestion = (): { icon: string; title: string; subtitle: string } => {
  const hour = new Date().getHours();
  const day = new Date().getDay(); // 0 = Sunday, 6 = Saturday

  if (hour >= 6 && hour < 10) {
    return {
      icon: '☀️',
      title: 'Start your day with secure transport',
      subtitle: 'Book your morning commute'
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      icon: '🌆',
      title: 'Book your safe Assignment home',
      subtitle: 'Secure evening transport'
    };
  } else if (day === 0 || day === 6) {
    return {
      icon: '🎯',
      title: 'Plan your weekend travels',
      subtitle: 'Leisure and social security'
    };
  } else {
    return {
      icon: '🛡️',
      title: 'Stay protected on the move',
      subtitle: 'Professional security transport'
    };
  }
};