/**
 * useRealtimeTracking Hook
 * React hook for managing real-time officer tracking
 */

import { useState, useEffect, useCallback } from 'react';
import {
  RealtimeTrackingService,
  OfficerLocation,
  RouteProgress,
} from '../services/realtimeTrackingService';

export interface TrackingState {
  location: OfficerLocation | null;
  progress: RouteProgress | null;
  isLoading: boolean;
  error: string | null;
  isActive: boolean;
}

export function useRealtimeTracking(assignmentId: string | null) {
  const [state, setState] = useState<TrackingState>({
    location: null,
    progress: null,
    isLoading: true,
    error: null,
    isActive: false,
  });

  // Subscribe to location updates
  useEffect(() => {
    if (!assignmentId) {
      setState((prev) => ({ ...prev, isLoading: false, isActive: false }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    const unsubscribeLocation = RealtimeTrackingService.subscribeToLocation(
      assignmentId,
      (location) => {
        setState((prev) => ({
          ...prev,
          location,
          isLoading: false,
          isActive: location?.status !== 'completed',
        }));
      }
    );

    const unsubscribeProgress = RealtimeTrackingService.subscribeToProgress(
      assignmentId,
      (progress) => {
        setState((prev) => ({ ...prev, progress }));
      }
    );

    // Cleanup subscriptions
    return () => {
      unsubscribeLocation();
      unsubscribeProgress();
    };
  }, [assignmentId]);

  // Start tracking
  const startTracking = useCallback(
    async (officerId: string) => {
      if (!assignmentId) return;

      try {
        await RealtimeTrackingService.startTracking(assignmentId, officerId);
        setState((prev) => ({ ...prev, isActive: true, error: null }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || 'Failed to start tracking',
        }));
      }
    },
    [assignmentId]
  );

  // Stop tracking
  const stopTracking = useCallback(async () => {
    if (!assignmentId) return;

    try {
      await RealtimeTrackingService.stopTracking(assignmentId);
      setState((prev) => ({ ...prev, isActive: false }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Failed to stop tracking',
      }));
    }
  }, [assignmentId]);

  // Update status
  const updateStatus = useCallback(
    async (status: OfficerLocation['status']) => {
      if (!assignmentId) return;

      try {
        await RealtimeTrackingService.updateStatus(assignmentId, status);
      } catch (error: any) {
        console.error('Failed to update status:', error);
      }
    },
    [assignmentId]
  );

  // Start simulation (for testing)
  const startSimulation = useCallback(
    (
      officerId: string,
      startLat: number,
      startLng: number,
      endLat: number,
      endLng: number,
      durationMinutes?: number
    ) => {
      if (!assignmentId) return () => {};

      return RealtimeTrackingService.simulateMovement(
        assignmentId,
        officerId,
        startLat,
        startLng,
        endLat,
        endLng,
        durationMinutes
      );
    },
    [assignmentId]
  );

  return {
    ...state,
    startTracking,
    stopTracking,
    updateStatus,
    startSimulation,
  };
}
