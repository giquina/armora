/**
 * ARMORA PROTECTION SERVICE - SUPABASE DATA HOOKS
 * Custom React hooks for real-time protection service data
 * Version: 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import {
  supabase,
  getUserAssignments,
  getProtectionOfficers,
  getUserProfile,
  subscribeToAssignmentUpdates,
  getSafeRideFundStats,
  getOfficerReviews,
  findNearbyOfficers,
} from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for fetching user's protection assignments
 */
export function useProtectionAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    if (!user?.id) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await getUserAssignments(user.id);

      if (fetchError) throw fetchError;

      setAssignments(data || []);
    } catch (err: any) {
      console.error('Error fetching protection assignments:', err);
      setError(err.message);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Subscribe to real-time updates for active assignments
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-assignments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'protection_assignments',
          filter: `principal_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Assignment update received:', payload);
          fetchAssignments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchAssignments]);

  return {
    assignments,
    loading,
    error,
    refetch: fetchAssignments,
  };
}

/**
 * Hook for fetching available protection officers
 */
export function useAvailableOfficers(location?: string) {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOfficers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await getProtectionOfficers(location);

      if (fetchError) throw fetchError;

      setOfficers(data || []);
    } catch (err: any) {
      console.error('Error fetching protection officers:', err);
      setError(err.message);
      setOfficers([]);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  return {
    officers,
    loading,
    error,
    refetch: fetchOfficers,
  };
}

/**
 * Hook for real-time assignment tracking
 */
export function useAssignmentTracking(assignmentId: string | null) {
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) {
      setAssignment(null);
      return;
    }

    let subscription: any;

    const setupTracking = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch initial assignment data
        const { data, error: fetchError } = await supabase
          .from('protection_assignments')
          .select(`
            *,
            protection_officers (
              full_name,
              sia_license_number,
              average_rating,
              vehicle_make_model,
              vehicle_registration
            ),
            profiles (
              full_name,
              phone_number
            )
          `)
          .eq('id', assignmentId)
          .single();

        if (fetchError) throw fetchError;
        setAssignment(data);

        // Subscribe to real-time updates
        subscription = subscribeToAssignmentUpdates(assignmentId, (payload) => {
          console.log('Real-time assignment update:', payload);
          if (payload.eventType === 'UPDATE') {
            setAssignment((prev: any) => ({
              ...prev,
              ...payload.new,
            }));
          }
        });

      } catch (err: any) {
        console.error('Error setting up assignment tracking:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setupTracking();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [assignmentId]);

  return {
    assignment,
    loading,
    error,
  };
}

/**
 * Hook for Safe Assignment Fund statistics
 */
export function useSafeRideFundStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await getSafeRideFundStats();

        if (fetchError) throw fetchError;

        setStats(data);
      } catch (err: any) {
        console.error('Error fetching Safe Assignment Fund stats:', err);
        setError(err.message);
        // Fallback to default stats
        setStats({
          total_rides_provided: 3741,
          total_contributions: 187050.00,
          total_contributors: 892,
          last_updated: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
  };
}

/**
 * Hook for protection officer reviews
 */
export function useOfficerReviews(officerId: string | null) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!officerId) {
      setReviews([]);
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await getOfficerReviews(officerId);

        if (fetchError) throw fetchError;

        setReviews(data || []);
      } catch (err: any) {
        console.error('Error fetching officer reviews:', err);
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [officerId]);

  return {
    reviews,
    loading,
    error,
  };
}

/**
 * Hook for finding nearby protection officers
 */
export function useNearbyOfficers(lat?: number, lng?: number, radiusKm: number = 10) {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNearby = useCallback(async (latitude?: number, longitude?: number) => {
    if (!latitude || !longitude) {
      setOfficers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await findNearbyOfficers(latitude, longitude, radiusKm);

      if (fetchError) throw fetchError;

      setOfficers(data || []);
    } catch (err: any) {
      console.error('Error finding nearby officers:', err);
      setError(err.message);
      setOfficers([]);
    } finally {
      setLoading(false);
    }
  }, [radiusKm]);

  useEffect(() => {
    if (lat && lng) {
      searchNearby(lat, lng);
    }
  }, [lat, lng, searchNearby]);

  return {
    officers,
    loading,
    error,
    searchNearby,
  };
}

/**
 * Hook for user profile with protection preferences
 */
export function useUserProfile() {
  const { user, profile, loading: authLoading } = useAuth();
  const [extendedProfile, setExtendedProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || authLoading) return;

    const fetchExtendedProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get extended profile data including preferences
        const { data, error: fetchError } = await getUserProfile(user.id);

        if (fetchError) throw fetchError;

        setExtendedProfile(data);
      } catch (err: any) {
        console.error('Error fetching extended profile:', err);
        setError(err.message);
        setExtendedProfile(profile);
      } finally {
        setLoading(false);
      }
    };

    fetchExtendedProfile();
  }, [user?.id, profile, authLoading]);

  return {
    profile: extendedProfile || profile,
    loading: loading || authLoading,
    error,
  };
}

/**
 * Hook for real-time notifications
 */
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          setNotifications(data);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time notifications
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    notifications,
    loading,
  };
}

/**
 * Hook for emergency activation status
 */
export function useEmergencyStatus() {
  const { user } = useAuth();
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [lastActivation, setLastActivation] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    const checkEmergencyStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('emergency_activations')
          .select('*')
          .eq('user_id', user.id)
          .eq('response_status', 'activated')
          .order('activated_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          setEmergencyActive(true);
          setLastActivation(data[0]);
        } else {
          setEmergencyActive(false);
          setLastActivation(null);
        }
      } catch (err) {
        console.error('Error checking emergency status:', err);
      }
    };

    checkEmergencyStatus();

    // Subscribe to emergency updates
    const channel = supabase
      .channel('emergency-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_activations',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          checkEmergencyStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    emergencyActive,
    lastActivation,
  };
}