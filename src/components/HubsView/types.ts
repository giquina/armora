export interface ProtectionHub {
  id: string;
  name: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  coverage: {
    radius: number; // in miles
    areas: string[]; // coverage areas
    primaryZones: string[];
  };
  status: 'available' | 'busy' | 'offline';
  officers: {
    total: number;
    available: number;
    active: number;
  };
  response: {
    averageTime: number; // in minutes
    currentLoad: 'low' | 'medium' | 'high';
  };
  services: {
    essential: boolean;
    executive: boolean;
    shadow: boolean;
  };
  ratings: {
    overall: number;
    totalReviews: number;
  };
  specializations: string[];
  contact: {
    phone: string;
    emergencyPhone: string;
  };
  operatingHours: {
    start: string;
    end: string;
    is24h: boolean;
  };
  distance?: number; // calculated distance from user
  isFavorite?: boolean;
}

export interface HubFilters {
  status: string[];
  services: string[];
  maxDistance: number;
  minRating: number;
  availability: string;
}