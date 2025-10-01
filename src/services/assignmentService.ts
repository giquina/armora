import { supabase } from '../lib/supabase';
import { ProtectionAssignmentData } from '../types';

/**
 * Protection Assignment Service
 * Handles creation and management of protection assignments in database
 * SIA-COMPLIANT: Uses security industry terminology
 */
export const assignmentService = {
  /**
   * Create a new protection assignment in database
   * @param assignmentData Protection assignment details
   * @returns Created assignment record
   */
  async createAssignment(assignmentData: ProtectionAssignmentData) {
    try {
      const { data, error } = await supabase
        .from('protection_assignments')
        .insert({
          principal_id: assignmentData.principalId,
          commencement_point: assignmentData.commencementPoint,
          secure_destination: assignmentData.secureDestination,
          protection_tier: assignmentData.protectionTier,
          scheduled_commencement: assignmentData.scheduledDateTime,
          estimated_duration: assignmentData.estimatedDuration,
          service_fee: assignmentData.serviceFee,
          protection_status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Protection assignment created:', data.id);
      return { success: true, assignment: data };
    } catch (error) {
      console.error('❌ Error creating protection assignment:', error);
      return { success: false, error };
    }
  },

  /**
   * Retrieve protection assignment by ID
   * @param assignmentId Assignment identifier
   */
  async getAssignmentById(assignmentId: string) {
    const { data, error } = await supabase
      .from('protection_assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    return { data, error };
  },

  /**
   * Update protection assignment status
   * @param assignmentId Assignment identifier
   * @param status New protection status
   */
  async updateAssignmentStatus(
    assignmentId: string,
    status: 'pending' | 'officer_assigned' | 'protection_active' | 'completed' | 'cancelled'
  ) {
    const { data, error } = await supabase
      .from('protection_assignments')
      .update({ protection_status: status, updated_at: new Date().toISOString() })
      .eq('id', assignmentId)
      .select()
      .single();

    return { data, error };
  },

  /**
   * Get all assignments for a principal
   * @param principalId Principal user identifier
   */
  async getAssignmentsByPrincipal(principalId: string) {
    const { data, error } = await supabase
      .from('protection_assignments')
      .select('*')
      .eq('principal_id', principalId)
      .order('created_at', { ascending: false });

    return { data, error };
  }
};
