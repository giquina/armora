import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  address: string;
  coordinates?: Coordinates;
  placeId?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  eta: string;
  features: string[];
  vehicleType: string;
  securityLevel: string;
  badge?: string;
  isRecommended?: boolean;
  isEco?: boolean;
}

export interface BookingData {
  pickupLocation?: Location;
  pickup?: Location; // Alias for compatibility
  destination?: Location;
  selectedService?: ServiceOption;
  paymentMethod?: {
    id: string;
    type: 'card' | 'wallet' | 'account';
    last4?: string;
    brand?: string;
    name: string;
  };
  bookingTime?: Date;
  specialRequests?: string;
  estimatedDuration?: string;
  estimatedDistance?: string;
}

// Actions
type BookingAction =
  | { type: 'SET_PICKUP_LOCATION'; payload: Location }
  | { type: 'SET_DESTINATION'; payload: Location }
  | { type: 'SET_SELECTED_SERVICE'; payload: ServiceOption }
  | { type: 'SET_PAYMENT_METHOD'; payload: BookingData['paymentMethod'] }
  | { type: 'SET_BOOKING_TIME'; payload: Date }
  | { type: 'SET_SPECIAL_REQUESTS'; payload: string }
  | { type: 'SET_ROUTE_INFO'; payload: { duration: string; distance: string } }
  | { type: 'CLEAR_BOOKING' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<BookingData> };

// Initial state
const initialState: BookingData = {
  paymentMethod: {
    id: 'default-card',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    name: 'Default Card'
  }
};

// Reducer
function bookingReducer(state: BookingData, action: BookingAction): BookingData {
  switch (action.type) {
    case 'SET_PICKUP_LOCATION':
      return { ...state, pickupLocation: action.payload };
    case 'SET_DESTINATION':
      return { ...state, destination: action.payload };
    case 'SET_SELECTED_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_BOOKING_TIME':
      return { ...state, bookingTime: action.payload };
    case 'SET_SPECIAL_REQUESTS':
      return { ...state, specialRequests: action.payload };
    case 'SET_ROUTE_INFO':
      return {
        ...state,
        estimatedDuration: action.payload.duration,
        estimatedDistance: action.payload.distance
      };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    case 'CLEAR_BOOKING':
      return initialState;
    default:
      return state;
  }
}

// Context
interface BookingContextType {
  bookingData: BookingData;
  dispatch: React.Dispatch<BookingAction>;
  // Helper functions
  setPickupLocation: (location: Location) => void;
  setDestination: (location: Location) => void;
  setSelectedService: (service: ServiceOption) => void;
  setPaymentMethod: (method: BookingData['paymentMethod']) => void;
  clearBooking: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

// Provider
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, dispatch] = useReducer(bookingReducer, initialState);

  // Helper functions
  const setPickupLocation = (location: Location) => {
    dispatch({ type: 'SET_PICKUP_LOCATION', payload: location });
  };

  const setDestination = (location: Location) => {
    dispatch({ type: 'SET_DESTINATION', payload: location });
  };

  const setSelectedService = (service: ServiceOption) => {
    dispatch({ type: 'SET_SELECTED_SERVICE', payload: service });
  };

  const setPaymentMethod = (method: BookingData['paymentMethod']) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const clearBooking = () => {
    dispatch({ type: 'CLEAR_BOOKING' });
    localStorage.removeItem('armora_booking_data');
  };

  const saveToStorage = () => {
    localStorage.setItem('armora_booking_data', JSON.stringify(bookingData));
  };

  const loadFromStorage = () => {
    const stored = localStorage.getItem('armora_booking_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: data });
      } catch (error) {
        console.error('Error loading booking data from storage:', error);
      }
    }

    // Also load from legacy storage keys
    const destination = localStorage.getItem('armora_destination');
    const destinationCoords = localStorage.getItem('armora_destination_coords');

    if (destination) {
      let coordinates;
      try {
        coordinates = destinationCoords ? JSON.parse(destinationCoords) : undefined;
      } catch (e) {
        coordinates = undefined;
      }

      setDestination({ address: destination, coordinates });
    }
  };

  const value: BookingContextType = {
    bookingData,
    dispatch,
    setPickupLocation,
    setDestination,
    setSelectedService,
    setPaymentMethod,
    clearBooking,
    saveToStorage,
    loadFromStorage
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

// Hook
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

// Service options data
export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'standard',
    name: 'Standard Protection',
    description: 'SIA Level 2, Professional drivers',
    price: 32.50,
    originalPrice: 65.00,
    discount: '50% off first ride',
    eta: '4 min',
    features: ['SIA Level 2 Certified', 'GPS Tracking', 'Professional Service'],
    vehicleType: 'BMW 5 Series',
    securityLevel: 'Level 2',
    badge: 'Recommended',
    isRecommended: true
  },
  {
    id: 'executive',
    name: 'Executive Shield',
    description: 'Premium BMW, SIA Level 3',
    price: 49.40,
    eta: '3 min',
    features: ['SIA Level 3 Certified', 'Premium Vehicle', 'Enhanced Security'],
    vehicleType: 'BMW X5',
    securityLevel: 'Level 3'
  },
  {
    id: 'shadow',
    name: 'Shadow Protocol',
    description: 'Unmarked vehicles, Covert protection',
    price: 41.25,
    eta: '5 min',
    features: ['Covert Protection', 'Unmarked Vehicle', 'Discrete Service'],
    vehicleType: 'Unmarked',
    securityLevel: 'Covert'
  },
  {
    id: 'green',
    name: 'Green Guard',
    description: 'Electric vehicles, Carbon neutral',
    price: 36.50,
    eta: '6 min',
    features: ['Electric Vehicle', 'Carbon Neutral', 'Eco-Friendly'],
    vehicleType: 'Tesla Model S',
    securityLevel: 'Level 2',
    badge: 'ECO',
    isEco: true
  }
];