import { createContext, useContext, useReducer, ReactNode } from 'react';

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

export interface ProtectionAssignmentData {
  commencementLocation?: Location;
  commencementPoint?: Location; // Alias for compatibility
  secureDestination?: Location;
  selectedService?: ServiceOption;
  paymentMethod?: {
    id: string;
    type: 'card' | 'wallet' | 'account';
    last4?: string;
    brand?: string;
    name: string;
  };
  assignmentTime?: Date;
  specialRequests?: string;
  estimatedDuration?: string;
  estimatedDistance?: string;
}

// Legacy alias for backward compatibility during transition
export interface BookingData extends ProtectionAssignmentData {
  bookingTime?: Date;
}

// Actions
type ProtectionAssignmentAction =
  | { type: 'SET_PICKUP_LOCATION'; payload: Location }
  | { type: 'SET_DESTINATION'; payload: Location }
  | { type: 'SET_SELECTED_SERVICE'; payload: ServiceOption }
  | { type: 'SET_PAYMENT_METHOD'; payload: ProtectionAssignmentData['paymentMethod'] }
  | { type: 'SET_ASSIGNMENT_TIME'; payload: Date }
  | { type: 'SET_SPECIAL_REQUESTS'; payload: string }
  | { type: 'SET_ROUTE_INFO'; payload: { duration: string; distance: string } }
  | { type: 'CLEAR_ASSIGNMENT' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<ProtectionAssignmentData> };

// Legacy action type alias for backward compatibility
type BookingAction = ProtectionAssignmentAction | { type: 'SET_BOOKING_TIME'; payload: Date } | { type: 'CLEAR_BOOKING' };

// Initial state
const initialState: ProtectionAssignmentData = {
  paymentMethod: {
    id: 'default-card',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    name: 'Default Card'
  }
};

// Reducer
function protectionAssignmentReducer(state: ProtectionAssignmentData, action: ProtectionAssignmentAction | BookingAction): ProtectionAssignmentData {
  switch (action.type) {
    case 'SET_PICKUP_LOCATION':
      return { ...state, commencementLocation: action.payload };
    case 'SET_DESTINATION':
      return { ...state, secureDestination: action.payload };
    case 'SET_SELECTED_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_ASSIGNMENT_TIME':
      return { ...state, assignmentTime: action.payload };
    case 'SET_BOOKING_TIME': // Legacy support
      return { ...state, assignmentTime: action.payload };
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
    case 'CLEAR_ASSIGNMENT':
    case 'CLEAR_BOOKING': // Legacy support
      return initialState;
    default:
      return state;
  }
}

// Context
interface ProtectionAssignmentContextType {
  protectionAssignmentData: ProtectionAssignmentData;
  dispatch: React.Dispatch<ProtectionAssignmentAction>;
  // Helper functions
  setPickupLocation: (location: Location) => void;
  setDestination: (location: Location) => void;
  setSelectedService: (service: ServiceOption) => void;
  setPaymentMethod: (method: ProtectionAssignmentData['paymentMethod']) => void;
  clearAssignment: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

// Legacy context type alias for backward compatibility
interface BookingContextType {
  bookingData: BookingData;
  dispatch: React.Dispatch<BookingAction>;
  setPickupLocation: (location: Location) => void;
  setDestination: (location: Location) => void;
  setSelectedService: (service: ServiceOption) => void;
  setPaymentMethod: (method: BookingData['paymentMethod']) => void;
  clearBooking: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const ProtectionAssignmentContext = createContext<ProtectionAssignmentContextType | null>(null);
const BookingContext = ProtectionAssignmentContext; // Legacy alias

// Provider
export function ProtectionAssignmentProvider({ children }: { children: ReactNode }) {
  const [protectionAssignmentData, dispatch] = useReducer(protectionAssignmentReducer, initialState);

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

  const setPaymentMethod = (method: ProtectionAssignmentData['paymentMethod']) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const clearAssignment = () => {
    dispatch({ type: 'CLEAR_ASSIGNMENT' });
    localStorage.removeItem('armora_assignment_data'); // SIA-compliant storage key
  };

  const saveToStorage = () => {
    localStorage.setItem('armora_assignment_data', JSON.stringify(protectionAssignmentData));
  };

  const loadFromStorage = () => {
    const stored = localStorage.getItem('armora_assignment_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: data });
      } catch (error) {
        console.error('Error loading protection assignment data from storage:', error);
      }
    }

    // Also load from legacy storage keys
    const secureDestination = localStorage.getItem('armora_destination');
    const destinationCoords = localStorage.getItem('armora_destination_coords');

    if (secureDestination) {
      let coordinates;
      try {
        coordinates = destinationCoords ? JSON.parse(destinationCoords) : undefined;
      } catch (e) {
        coordinates = undefined;
      }

      setDestination({ address: secureDestination, coordinates });
    }
  };

  const value: ProtectionAssignmentContextType = {
    protectionAssignmentData,
    dispatch,
    setPickupLocation,
    setDestination,
    setSelectedService,
    setPaymentMethod,
    clearAssignment,
    saveToStorage,
    loadFromStorage
  };

  return (
    <ProtectionAssignmentContext.Provider value={value}>
      {children}
    </ProtectionAssignmentContext.Provider>
  );
}

// Legacy provider alias for backward compatibility
export const BookingProvider = ProtectionAssignmentProvider;

// Hook
export function useProtectionAssignment() {
  const context = useContext(ProtectionAssignmentContext);
  if (!context) {
    throw new Error('useProtectionAssignment must be used within a ProtectionAssignmentProvider');
  }
  return context;
}

// Legacy hook alias for backward compatibility
export function useBooking(): BookingContextType {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }

  // Adapt new context to legacy interface
  return {
    bookingData: {
      ...context.protectionAssignmentData,
      bookingTime: context.protectionAssignmentData.assignmentTime
    },
    dispatch: context.dispatch as React.Dispatch<BookingAction>,
    setPickupLocation: context.setPickupLocation,
    setDestination: context.setDestination,
    setSelectedService: context.setSelectedService,
    setPaymentMethod: context.setPaymentMethod,
    clearBooking: context.clearAssignment,
    saveToStorage: context.saveToStorage,
    loadFromStorage: context.loadFromStorage
  };
}

// Service options data
export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'standard',
    name: 'Standard Protection',
    description: 'SIA Level 2, Professional Protection Officers',
    price: 32.50,
    originalPrice: 65.00,
    discount: '50% off first Assignment',
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