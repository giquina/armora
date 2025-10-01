/**
 * Real-time Tracking Service
 * Manages live location tracking for Protection Officers during active assignments
 */

import { ref, onValue, set, update, off, get } from 'firebase/database';
import { database } from '../lib/firebase';

export interface OfficerLocation {
  officerId: string;
  assignmentId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  accuracy: number;
  timestamp: number;
  status: 'en_route' | 'arrived' | 'in_progress' | 'completed';
}

export interface RouteProgress {
  distanceRemaining: number;
  estimatedTimeArrival: number;
  percentComplete: number;
}

export class RealtimeTrackingService {
  /**
   * Start tracking an officer's location
   */
  static async startTracking(
    assignmentId: string,
    officerId: string
  ): Promise<void> {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    const trackingRef = ref(database, `tracking/${assignmentId}`);

    await set(trackingRef, {
      assignmentId,
      officerId,
      status: 'en_route',
      startedAt: Date.now(),
      active: true,
    });
  }

  /**
   * Update officer's current location
   */
  static async updateLocation(
    assignmentId: string,
    location: Omit<OfficerLocation, 'assignmentId'>
  ): Promise<void> {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    const locationRef = ref(database, `tracking/${assignmentId}/location`);

    await set(locationRef, {
      ...location,
      assignmentId,
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe to officer location updates
   */
  static subscribeToLocation(
    assignmentId: string,
    callback: (location: OfficerLocation | null) => void
  ): () => void {
    if (!database) {
      console.error('Firebase database not initialized');
      return () => {};
    }

    const locationRef = ref(database, `tracking/${assignmentId}/location`);

    onValue(locationRef, (snapshot) => {
      const location = snapshot.val();
      callback(location);
    });

    // Return unsubscribe function
    return () => {
      off(locationRef);
    };
  }

  /**
   * Get officer's current location (one-time read)
   */
  static async getLocation(assignmentId: string): Promise<OfficerLocation | null> {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    const locationRef = ref(database, `tracking/${assignmentId}/location`);
    const snapshot = await get(locationRef);

    return snapshot.val();
  }

  /**
   * Update assignment status
   */
  static async updateStatus(
    assignmentId: string,
    status: OfficerLocation['status']
  ): Promise<void> {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    const statusRef = ref(database, `tracking/${assignmentId}`);

    await update(statusRef, {
      status,
      lastUpdated: Date.now(),
    });
  }

  /**
   * Calculate route progress
   */
  static async updateRouteProgress(
    assignmentId: string,
    progress: RouteProgress
  ): Promise<void> {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    const progressRef = ref(database, `tracking/${assignmentId}/progress`);

    await set(progressRef, {
      ...progress,
      timestamp: Date.now(),
    });
  }

  /**
   * Subscribe to route progress updates
   */
  static subscribeToProgress(
    assignmentId: string,
    callback: (progress: RouteProgress | null) => void
  ): () => void {
    if (!database) {
      console.error('Firebase database not initialized');
      return () => {};
    }

    const progressRef = ref(database, `tracking/${assignmentId}/progress`);

    onValue(progressRef, (snapshot) => {
      const progress = snapshot.val();
      callback(progress);
    });

    return () => {
      off(progressRef);
    };
  }

  /**
   * End tracking session
   */
  static async stopTracking(assignmentId: string): Promise<void> {
    if (!database) {
      throw new Error('Firebase database not initialized');
    }

    const trackingRef = ref(database, `tracking/${assignmentId}`);

    await update(trackingRef, {
      active: false,
      endedAt: Date.now(),
      status: 'completed',
    });
  }

  /**
   * Simulate officer movement (for testing/demo)
   */
  static simulateMovement(
    assignmentId: string,
    officerId: string,
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    durationMinutes: number = 15
  ): () => void {
    let intervalId: NodeJS.Timeout;
    let progress = 0;
    const steps = (durationMinutes * 60) / 2; // Update every 2 seconds

    intervalId = setInterval(async () => {
      if (progress >= 1) {
        clearInterval(intervalId);
        await this.updateStatus(assignmentId, 'arrived');
        return;
      }

      progress += 1 / steps;
      const currentLat = startLat + (endLat - startLat) * progress;
      const currentLng = startLng + (endLng - startLng) * progress;

      // Calculate bearing (heading)
      const deltaLng = endLng - currentLng;
      const deltaLat = endLat - currentLat;
      const heading = (Math.atan2(deltaLng, deltaLat) * 180) / Math.PI;

      // Simulate speed (30-50 mph in meters/second)
      const speed = 15 + Math.random() * 10;

      await this.updateLocation(assignmentId, {
        officerId,
        latitude: currentLat,
        longitude: currentLng,
        heading,
        speed,
        accuracy: 10,
        timestamp: Date.now(),
        status: 'en_route',
      });

      // Update progress
      const distance = this.calculateDistance(currentLat, currentLng, endLat, endLng);
      const eta = (distance / speed) * 1000; // ETA in milliseconds

      await this.updateRouteProgress(assignmentId, {
        distanceRemaining: distance,
        estimatedTimeArrival: Date.now() + eta,
        percentComplete: progress * 100,
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }

  /**
   * Calculate distance between two coordinates (in meters)
   * Using Haversine formula
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
