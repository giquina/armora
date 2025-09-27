// Venue Management System Integration
// API integrations for Bookteq, Hallmaster, EventPro and other venue management platforms

export interface VenueManagementSystem {
  name: string;
  apiVersion: string;
  baseUrl: string;
  authentication: 'API_KEY' | 'OAuth2' | 'Bearer_Token' | 'Basic_Auth';
  capabilities: VenueCapability[];
  integration: VenueIntegration;
}

export interface VenueCapability {
  feature: 'event_sync' | 'booking_sync' | 'capacity_check' | 'layout_data' | 'contact_sync' | 'payment_sync';
  supported: boolean;
  endpoint?: string;
  rateLimits?: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
}

export interface VenueIntegration {
  clientId?: string;
  apiKey?: string;
  webhookUrl?: string;
  syncFrequency: 'real_time' | 'hourly' | 'daily' | 'manual';
  lastSync?: Date;
  syncStatus: 'connected' | 'disconnected' | 'error' | 'syncing';
  errorMessage?: string;
}

export interface VenueEvent {
  id: string;
  name: string;
  type: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  expectedAttendance: number;
  venueId: string;
  venueName: string;
  venueAddress: string;
  organizer: EventOrganizer;
  securityRequirements?: SecurityRequirement[];
  status: 'planned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  bookingReference: string;
  specialInstructions?: string;
}

export interface EventOrganizer {
  name: string;
  company?: string;
  email: string;
  phone: string;
  role: string;
  securityContact?: boolean;
}

export interface SecurityRequirement {
  type: 'door_supervision' | 'close_protection' | 'crowd_control' | 'bag_screening' | 'perimeter_security';
  officers: number;
  duration: number; // hours
  specializations?: string[];
  equipment?: string[];
}

export interface VenueLayout {
  venueId: string;
  floorPlans: FloorPlan[];
  capacityBreakdown: CapacityBreakdown;
  securityFeatures: SecurityFeature[];
  emergencyInfo: EmergencyInfo;
  accessPoints: AccessPoint[];
}

export interface FloorPlan {
  id: string;
  name: string;
  level: number;
  imageUrl?: string;
  dimensions: { width: number; height: number };
  areas: VenueArea[];
}

export interface VenueArea {
  id: string;
  name: string;
  type: 'main_hall' | 'breakout_room' | 'foyer' | 'bar' | 'kitchen' | 'storage' | 'office' | 'emergency_exit';
  capacity: number;
  coordinates: { x: number; y: number; width: number; height: number };
  securityLevel: 'public' | 'restricted' | 'private' | 'secure';
}

export interface CapacityBreakdown {
  totalCapacity: number;
  seatedCapacity?: number;
  standingCapacity?: number;
  receptionCapacity?: number;
  emergencyCapacity: number;
  areas: { [areaId: string]: number };
}

export interface SecurityFeature {
  type: 'cctv' | 'access_control' | 'alarm_system' | 'fire_suppression' | 'emergency_lighting' | 'panic_buttons';
  location: string;
  coverage: string;
  operational: boolean;
  lastMaintenance?: Date;
}

export interface EmergencyInfo {
  emergencyExits: number;
  assemblyPoints: string[];
  emergencyContacts: EmergencyContact[];
  evacuationProcedures: string;
  nearestHospital: string;
  policeStation: string;
}

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  email?: string;
  priority: 'primary' | 'secondary' | 'backup';
}

export interface AccessPoint {
  id: string;
  name: string;
  type: 'main_entrance' | 'secondary_entrance' | 'emergency_exit' | 'loading_bay' | 'vip_entrance';
  controlled: boolean;
  securityLevel: 'public' | 'restricted' | 'secure';
  operatingHours?: string;
  accessControl?: {
    type: 'manual' | 'keycard' | 'biometric' | 'code';
    staffRequired: boolean;
  };
}

// Supported venue management systems
export const VENUE_MANAGEMENT_SYSTEMS: Record<string, VenueManagementSystem> = {
  bookteq: {
    name: 'Bookteq',
    apiVersion: 'v2',
    baseUrl: 'https://api.bookteq.com/v2',
    authentication: 'API_KEY',
    capabilities: [
      { feature: 'event_sync', supported: true, endpoint: '/events' },
      { feature: 'booking_sync', supported: true, endpoint: '/bookings' },
      { feature: 'capacity_check', supported: true, endpoint: '/venues/{id}/capacity' },
      { feature: 'layout_data', supported: true, endpoint: '/venues/{id}/layout' },
      { feature: 'contact_sync', supported: true, endpoint: '/contacts' },
      { feature: 'payment_sync', supported: false }
    ],
    integration: {
      syncFrequency: 'real_time',
      syncStatus: 'disconnected'
    }
  },
  hallmaster: {
    name: 'Hallmaster',
    apiVersion: 'v1',
    baseUrl: 'https://api.hallmaster.co.uk/v1',
    authentication: 'OAuth2',
    capabilities: [
      { feature: 'event_sync', supported: true, endpoint: '/events' },
      { feature: 'booking_sync', supported: true, endpoint: '/bookings' },
      { feature: 'capacity_check', supported: true, endpoint: '/venues/{id}' },
      { feature: 'layout_data', supported: false },
      { feature: 'contact_sync', supported: true, endpoint: '/contacts' },
      { feature: 'payment_sync', supported: true, endpoint: '/payments' }
    ],
    integration: {
      syncFrequency: 'hourly',
      syncStatus: 'disconnected'
    }
  },
  eventpro: {
    name: 'EventPro',
    apiVersion: 'v3',
    baseUrl: 'https://api.eventpro.com/v3',
    authentication: 'Bearer_Token',
    capabilities: [
      { feature: 'event_sync', supported: true, endpoint: '/events' },
      { feature: 'booking_sync', supported: true, endpoint: '/reservations' },
      { feature: 'capacity_check', supported: true, endpoint: '/venues/{id}/details' },
      { feature: 'layout_data', supported: true, endpoint: '/venues/{id}/floorplan' },
      { feature: 'contact_sync', supported: true, endpoint: '/clients' },
      { feature: 'payment_sync', supported: true, endpoint: '/transactions' }
    ],
    integration: {
      syncFrequency: 'real_time',
      syncStatus: 'disconnected'
    }
  }
};

/**
 * Connect to venue management system
 */
export async function connectVenueManagementSystem(
  systemName: string,
  credentials: { apiKey?: string; clientId?: string; clientSecret?: string; token?: string }
): Promise<{ success: boolean; message: string; connectionId?: string }> {

  const system = VENUE_MANAGEMENT_SYSTEMS[systemName];
  if (!system) {
    return { success: false, message: 'Unsupported venue management system' };
  }

  try {
    // Simulate API connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Validate credentials based on authentication type
    let isValid = false;
    switch (system.authentication) {
      case 'API_KEY':
        isValid = !!credentials.apiKey && credentials.apiKey.length > 10;
        break;
      case 'OAuth2':
        isValid = !!credentials.clientId && !!credentials.clientSecret;
        break;
      case 'Bearer_Token':
        isValid = !!credentials.token && credentials.token.startsWith('bearer_');
        break;
      case 'Basic_Auth':
        isValid = !!credentials.apiKey;
        break;
    }

    if (!isValid) {
      return { success: false, message: 'Invalid credentials provided' };
    }

    // Update integration status
    system.integration.syncStatus = 'connected';
    system.integration.lastSync = new Date();

    if (credentials.apiKey) {
      system.integration.apiKey = credentials.apiKey;
    }
    if (credentials.clientId) {
      system.integration.clientId = credentials.clientId;
    }

    return {
      success: true,
      message: `Successfully connected to ${system.name}`,
      connectionId: `conn_${systemName}_${Date.now()}`
    };

  } catch (error) {
    system.integration.syncStatus = 'error';
    system.integration.errorMessage = 'Connection failed';
    return { success: false, message: 'Connection failed' };
  }
}

/**
 * Sync events from venue management system
 */
export async function syncEventsFromVMS(
  systemName: string,
  dateRange?: { start: Date; end: Date }
): Promise<{ success: boolean; events: VenueEvent[]; errors: string[] }> {

  const system = VENUE_MANAGEMENT_SYSTEMS[systemName];
  if (!system || system.integration.syncStatus !== 'connected') {
    return { success: false, events: [], errors: ['System not connected'] };
  }

  const eventCapability = system.capabilities.find(cap => cap.feature === 'event_sync');
  if (!eventCapability?.supported) {
    return { success: false, events: [], errors: ['Event sync not supported'] };
  }

  try {
    system.integration.syncStatus = 'syncing';

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock event data (in production, this would come from actual API)
    const mockEvents: VenueEvent[] = [
      {
        id: 'evt_001',
        name: 'Corporate Annual Gala',
        type: 'corporate',
        startDate: new Date('2024-12-15T19:00:00Z'),
        endDate: new Date('2024-12-15T23:00:00Z'),
        capacity: 300,
        expectedAttendance: 280,
        venueId: 'venue_001',
        venueName: 'Grand Ballroom',
        venueAddress: '123 Park Lane, London W1K 1QA',
        organizer: {
          name: 'Sarah Johnson',
          company: 'TechCorp Ltd',
          email: 'sarah.johnson@techcorp.com',
          phone: '+44 20 7123 4567',
          role: 'Event Manager',
          securityContact: true
        },
        securityRequirements: [
          {
            type: 'close_protection',
            officers: 3,
            duration: 8,
            specializations: ['Corporate Events', 'Executive Protection']
          }
        ],
        status: 'confirmed',
        bookingReference: 'BOOK-2024-001',
        specialInstructions: 'VIP arrival at 18:30. Media present for first hour.'
      },
      {
        id: 'evt_002',
        name: 'Wedding Reception',
        type: 'wedding',
        startDate: new Date('2024-12-20T14:00:00Z'),
        endDate: new Date('2024-12-20T24:00:00Z'),
        capacity: 120,
        expectedAttendance: 115,
        venueId: 'venue_002',
        venueName: 'Garden Pavilion',
        venueAddress: '456 Country Estate, Surrey RH1 2AB',
        organizer: {
          name: 'Michael Brown',
          email: 'michael.brown@email.com',
          phone: '+44 77 8901 2345',
          role: 'Groom'
        },
        securityRequirements: [
          {
            type: 'door_supervision',
            officers: 2,
            duration: 12,
            specializations: ['Wedding Security', 'Crowd Management']
          }
        ],
        status: 'confirmed',
        bookingReference: 'BOOK-2024-002',
        specialInstructions: 'Outdoor ceremony. Weather contingency required.'
      }
    ];

    system.integration.syncStatus = 'connected';
    system.integration.lastSync = new Date();

    return { success: true, events: mockEvents, errors: [] };

  } catch (error) {
    system.integration.syncStatus = 'error';
    system.integration.errorMessage = 'Sync failed';
    return { success: false, events: [], errors: ['Failed to sync events'] };
  }
}

/**
 * Get venue layout and security information
 */
export async function getVenueLayout(
  systemName: string,
  venueId: string
): Promise<{ success: boolean; layout?: VenueLayout; error?: string }> {

  const system = VENUE_MANAGEMENT_SYSTEMS[systemName];
  if (!system || system.integration.syncStatus !== 'connected') {
    return { success: false, error: 'System not connected' };
  }

  const layoutCapability = system.capabilities.find(cap => cap.feature === 'layout_data');
  if (!layoutCapability?.supported) {
    return { success: false, error: 'Layout data not supported by this system' };
  }

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock layout data
    const mockLayout: VenueLayout = {
      venueId,
      floorPlans: [
        {
          id: 'floor_ground',
          name: 'Ground Floor',
          level: 0,
          imageUrl: '/venue-layouts/ground-floor.png',
          dimensions: { width: 50, height: 30 },
          areas: [
            {
              id: 'main_hall',
              name: 'Main Hall',
              type: 'main_hall',
              capacity: 200,
              coordinates: { x: 10, y: 10, width: 30, height: 15 },
              securityLevel: 'public'
            },
            {
              id: 'foyer',
              name: 'Entrance Foyer',
              type: 'foyer',
              capacity: 50,
              coordinates: { x: 5, y: 5, width: 15, height: 8 },
              securityLevel: 'public'
            }
          ]
        }
      ],
      capacityBreakdown: {
        totalCapacity: 300,
        seatedCapacity: 200,
        standingCapacity: 300,
        receptionCapacity: 250,
        emergencyCapacity: 280,
        areas: {
          'main_hall': 200,
          'foyer': 50,
          'bar_area': 50
        }
      },
      securityFeatures: [
        {
          type: 'cctv',
          location: 'Main Hall',
          coverage: 'Full room coverage with 8 cameras',
          operational: true,
          lastMaintenance: new Date('2024-10-15')
        },
        {
          type: 'access_control',
          location: 'Main Entrance',
          coverage: 'Electronic access control system',
          operational: true
        }
      ],
      emergencyInfo: {
        emergencyExits: 4,
        assemblyPoints: ['Car Park A', 'Garden Area'],
        emergencyContacts: [
          {
            name: 'Security Control',
            role: 'Security Manager',
            phone: '+44 20 7000 0001',
            priority: 'primary'
          }
        ],
        evacuationProcedures: 'Proceed to nearest emergency exit. Assemble at designated points.',
        nearestHospital: 'St. Mary\'s Hospital - 2.3 miles',
        policeStation: 'Local Police Station - 1.8 miles'
      },
      accessPoints: [
        {
          id: 'main_entrance',
          name: 'Main Entrance',
          type: 'main_entrance',
          controlled: true,
          securityLevel: 'public',
          operatingHours: '08:00-23:00',
          accessControl: {
            type: 'manual',
            staffRequired: true
          }
        },
        {
          id: 'vip_entrance',
          name: 'VIP Entrance',
          type: 'vip_entrance',
          controlled: true,
          securityLevel: 'restricted',
          accessControl: {
            type: 'keycard',
            staffRequired: false
          }
        }
      ]
    };

    return { success: true, layout: mockLayout };

  } catch (error) {
    return { success: false, error: 'Failed to retrieve venue layout' };
  }
}

/**
 * Create security protection assignment in venue management system
 */
export async function createSecurityBooking(
  systemName: string,
  eventId: string,
  securityDetails: {
    serviceType: 'door_supervision' | 'close_protection' | 'elite_protection';
    officers: number;
    startTime: Date;
    duration: number;
    specialRequirements: string[];
    cost: number;
  }
): Promise<{ success: boolean; bookingId?: string; error?: string }> {

  const system = VENUE_MANAGEMENT_SYSTEMS[systemName];
  if (!system || system.integration.syncStatus !== 'connected') {
    return { success: false, error: 'System not connected' };
  }

  try {
    // Simulate API call to create protection assignment
    await new Promise(resolve => setTimeout(resolve, 2000));

    const bookingId = `sec_booking_${Date.now()}`;

    // In production, this would make actual API call to venue management system
    // to create or update the event with security details

    return { success: true, bookingId };

  } catch (error) {
    return { success: false, error: 'Failed to create security protection assignment' };
  }
}

/**
 * Monitor venue management system integrations
 */
export function monitorVMSIntegrations(): {
  systems: Array<{
    name: string;
    status: string;
    lastSync: Date | undefined;
    health: 'healthy' | 'warning' | 'error';
    issues: string[];
  }>;
  overallHealth: 'healthy' | 'warning' | 'error';
} {
  const systems = Object.entries(VENUE_MANAGEMENT_SYSTEMS).map(([key, system]) => {
    const issues: string[] = [];
    let health: 'healthy' | 'warning' | 'error' = 'healthy';

    if (system.integration.syncStatus === 'error') {
      health = 'error';
      issues.push(system.integration.errorMessage || 'Unknown error');
    } else if (system.integration.syncStatus === 'disconnected') {
      health = 'warning';
      issues.push('System disconnected');
    } else if (system.integration.lastSync) {
      const hoursSinceSync = (Date.now() - system.integration.lastSync.getTime()) / (1000 * 60 * 60);
      if (hoursSinceSync > 24) {
        health = 'warning';
        issues.push('No sync in over 24 hours');
      }
    }

    return {
      name: system.name,
      status: system.integration.syncStatus,
      lastSync: system.integration.lastSync,
      health,
      issues
    };
  });

  const errorCount = systems.filter(s => s.health === 'error').length;
  const warningCount = systems.filter(s => s.health === 'warning').length;

  let overallHealth: 'healthy' | 'warning' | 'error' = 'healthy';
  if (errorCount > 0) {
    overallHealth = 'error';
  } else if (warningCount > 0) {
    overallHealth = 'warning';
  }

  return { systems, overallHealth };
}

/**
 * Generate venue security briefing document
 */
export function generateVenueSecurityBriefing(
  event: VenueEvent,
  layout: VenueLayout,
  securityPlan: {
    officers: Array<{ name: string; role: string; position: string }>;
    procedures: string[];
    communications: string;
    emergencyProtocols: string[];
  }
): {
  briefingDocument: {
    eventOverview: string;
    securityObjectives: string[];
    threatAssessment: string;
    venueAnalysis: string;
    operationalPlan: string;
    communicationPlan: string;
    emergencyProcedures: string[];
    postEventActions: string[];
  };
  checklistItems: Array<{ item: string; responsible: string; deadline: Date; completed: boolean }>;
} {

  const briefingDocument = {
    eventOverview: `Event: ${event.name}\nDate: ${event.startDate.toLocaleDateString()}\nVenue: ${event.venueName}\nCapacity: ${event.capacity}\nExpected Attendance: ${event.expectedAttendance}`,

    securityObjectives: [
      'Ensure safety and security of all attendees',
      'Protect venue property and assets',
      'Maintain emergency access routes',
      'Coordinate with venue staff and emergency services',
      'Manage crowd flow and prevent overcrowding'
    ],

    threatAssessment: `Risk Level: Medium\nPrimary Concerns: Crowd management, unauthorized access, medical emergencies\nSpecial Considerations: ${event.specialInstructions || 'None specified'}`,

    venueAnalysis: `Venue Capacity: ${layout.capacityBreakdown.totalCapacity}\nEmergency Exits: ${layout.emergencyInfo.emergencyExits}\nAccess Points: ${layout.accessPoints.length}\nSecurity Features: ${layout.securityFeatures.map(f => f.type).join(', ')}`,

    operationalPlan: `Officer Deployment: ${securityPlan.officers.length} officers\nPositions: ${securityPlan.officers.map(o => `${o.name} - ${o.position}`).join(', ')}\nDuration: ${event.startDate.toLocaleTimeString()} - ${event.endDate.toLocaleTimeString()}`,

    communicationPlan: securityPlan.communications,

    emergencyProcedures: [
      'Immediate threat response protocol',
      'Evacuation procedures',
      'Medical emergency response',
      'Fire emergency procedures',
      'Incident reporting protocol',
      ...securityPlan.emergencyProtocols
    ],

    postEventActions: [
      'Conduct post-event debrief',
      'Complete incident reports',
      'Update security procedures based on lessons learned',
      'Submit final security report to client'
    ]
  };

  const checklistItems = [
    { item: 'Venue reconnaissance completed', responsible: 'Lead Officer', deadline: new Date(event.startDate.getTime() - 7 * 24 * 60 * 60 * 1000), completed: false },
    { item: 'Security briefing conducted', responsible: 'Security Manager', deadline: new Date(event.startDate.getTime() - 24 * 60 * 60 * 1000), completed: false },
    { item: 'Communication equipment tested', responsible: 'Technical Team', deadline: new Date(event.startDate.getTime() - 2 * 60 * 60 * 1000), completed: false },
    { item: 'Emergency procedures reviewed', responsible: 'All Officers', deadline: new Date(event.startDate.getTime() - 1 * 60 * 60 * 1000), completed: false },
    { item: 'Positions confirmed with venue', responsible: 'Lead Officer', deadline: new Date(event.startDate.getTime() - 30 * 60 * 1000), completed: false }
  ];

  return { briefingDocument, checklistItems };
}