import { supabase } from '../lib/supabase';

/**
 * Assignment Broadcast Service
 * Broadcasts protection assignments to available CPOs and manages real-time responses
 * SIA-COMPLIANT: Professional security terminology throughout
 */
export const assignmentBroadcastService = {
  /**
   * Broadcast protection assignment to nearby available CPOs
   * Creates a broadcast record that CPOs can monitor and respond to
   *
   * @param assignmentId Protection assignment identifier
   * @param assignmentData Assignment details for broadcasting
   * @returns Broadcast record and subscription channel
   */
  async broadcastAssignment(assignmentId: string, assignmentData: {
    principalId: string;
    commencementPoint: { latitude: number; longitude: number; address: string };
    secureDestination: { latitude: number; longitude: number; address: string };
    protectionTier: string;
    estimatedDuration: number;
    serviceFee: number;
  }) {
    try {
      // Create broadcast record for CPOs to see
      const { data, error } = await supabase
        .from('assignment_broadcasts')
        .insert({
          assignment_id: assignmentId,
          principal_user_id: assignmentData.principalId,
          principal_latitude: assignmentData.commencementPoint.latitude,
          principal_longitude: assignmentData.commencementPoint.longitude,
          commencement_address: assignmentData.commencementPoint.address,
          destination_address: assignmentData.secureDestination.address,
          protection_tier: assignmentData.protectionTier,
          estimated_duration: assignmentData.estimatedDuration,
          service_fee: assignmentData.serviceFee,
          status: 'pending',
          broadcast_radius_km: 10, // 10km radius for officer search
          expires_at: new Date(Date.now() + 60000).toISOString() // 60 second acceptance window
        })
        .select()
        .single();

      if (error) throw error;

      console.log('📡 Assignment broadcast created:', data.id);
      console.log('⏱️ CPOs have 60 seconds to accept');

      // Start listening for CPO responses
      const channel = this.subscribeToOfficerResponses(data.id);

      return { success: true, broadcast: data, channel };
    } catch (error) {
      console.error('❌ Error broadcasting assignment:', error);
      return { success: false, error };
    }
  },

  /**
   * Subscribe to real-time updates for CPO assignment responses
   * Monitors when a CPO accepts the broadcast assignment
   *
   * @param broadcastId Broadcast identifier to monitor
   * @returns Realtime subscription channel
   */
  subscribeToOfficerResponses(broadcastId: string) {
    const channel = supabase
      .channel(`assignment-broadcast:${broadcastId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assignment_broadcasts',
          filter: `id=eq.${broadcastId}`
        },
        (payload) => {
          const updatedBroadcast = payload.new;

          if (updatedBroadcast.status === 'accepted') {
            console.log('✅ Assignment accepted by Protection Officer:', updatedBroadcast.accepted_by_cpo_id);

            // Trigger notification to Principal
            this.notifyPrincipalOfAcceptance(updatedBroadcast);

            // Close channel - assignment is claimed
            supabase.removeChannel(channel);
          } else if (updatedBroadcast.status === 'expired') {
            console.log('⏰ Assignment broadcast expired - no officers available');

            // Notify Principal that no officers accepted
            this.notifyPrincipalOfExpiry(updatedBroadcast);

            supabase.removeChannel(channel);
          }
        }
      )
      .subscribe();

    console.log('👂 Listening for CPO responses on broadcast:', broadcastId);
    return channel;
  },

  /**
   * Notify principal when a protection officer accepts their assignment
   */
  async notifyPrincipalOfAcceptance(broadcast: any) {
    // Fetch CPO details
    const { data: cpoProfile } = await supabase
      .from('cpo_profiles')
      .select('id, first_name, last_name, sia_license_number, rating, vehicle_registration')
      .eq('id', broadcast.accepted_by_cpo_id)
      .single();

    if (cpoProfile) {
      console.log('🛡️ Protection Officer Details:', {
        name: `${cpoProfile.first_name} ${cpoProfile.last_name}`,
        siaLicense: cpoProfile.sia_license_number,
        rating: cpoProfile.rating,
        vehicle: cpoProfile.vehicle_registration
      });

      // TODO: Send push notification to Principal app
      // "Your protection officer [Name] has been assigned and is en route"
    }
  },

  /**
   * Notify principal when broadcast expires without acceptance
   */
  notifyPrincipalOfExpiry(broadcast: any) {
    console.log('⚠️ No protection officers available in your area');

    // TODO: Send notification suggesting:
    // - Increase broadcast radius
    // - Schedule for later time
    // - Contact support for immediate assistance
  },

  /**
   * Cancel an active broadcast (Principal cancelled before acceptance)
   */
  async cancelBroadcast(broadcastId: string) {
    const { data, error } = await supabase
      .from('assignment_broadcasts')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', broadcastId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error cancelling broadcast:', error);
      return { success: false, error };
    }

    console.log('🚫 Assignment broadcast cancelled:', broadcastId);
    return { success: true, data };
  },

  /**
   * Get broadcast status for Principal to monitor acceptance progress
   */
  async getBroadcastStatus(broadcastId: string) {
    const { data, error } = await supabase
      .from('assignment_broadcasts')
      .select(`
        *,
        cpo_profiles(
          id,
          first_name,
          last_name,
          sia_license_number,
          rating
        )
      `)
      .eq('id', broadcastId)
      .single();

    return { data, error };
  }
};
