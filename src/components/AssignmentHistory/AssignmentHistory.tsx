/**
 * Assignment History Component
 * Displays a user's past protection assignments with details
 */

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { Button } from '../UI/Button';
import styles from './AssignmentHistory.module.css';

export interface Assignment {
  id: string;
  created_at: string;
  scheduled_time: string;
  completed_at?: string;
  status: 'scheduled' | 'confirmed' | 'en_route' | 'in_progress' | 'completed' | 'cancelled';
  service_type: string;
  service_level?: string;
  pickup_location: string;
  dropoff_location: string;
  estimated_duration: number;
  actual_duration?: number;
  estimated_cost: number;
  final_cost?: number;
  officer?: {
    id: string;
    name: string;
    designation: string;
  };
  payment_status: 'pending' | 'completed' | 'refunded';
  rating?: number;
  feedback?: string;
}

interface AssignmentHistoryProps {
  limit?: number;
  showFilters?: boolean;
}

export function AssignmentHistory({
  limit,
  showFilters = true,
}: AssignmentHistoryProps) {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'scheduled' | 'cancelled'>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Fetch assignments from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchAssignments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('protection_assignments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setAssignments(data || []);
        setFilteredAssignments(data || []);
      } catch (err: any) {
        console.error('Error fetching assignments:', err);
        setError(err.message || 'Failed to load assignment history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, [user, limit]);

  // Filter assignments
  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredAssignments(assignments);
    } else {
      setFilteredAssignments(
        assignments.filter((a) => {
          if (selectedFilter === 'completed') return a.status === 'completed';
          if (selectedFilter === 'scheduled')
            return a.status === 'scheduled' || a.status === 'confirmed';
          if (selectedFilter === 'cancelled') return a.status === 'cancelled';
          return true;
        })
      );
    }
  }, [selectedFilter, assignments]);

  // Get status badge class
  const getStatusBadge = (status: Assignment['status']) => {
    const badges = {
      scheduled: { label: 'Scheduled', class: styles.statusScheduled },
      confirmed: { label: 'Confirmed', class: styles.statusConfirmed },
      en_route: { label: 'En Route', class: styles.statusEnRoute },
      in_progress: { label: 'In Progress', class: styles.statusInProgress },
      completed: { label: 'Completed', class: styles.statusCompleted },
      cancelled: { label: 'Cancelled', class: styles.statusCancelled },
    };

    return badges[status] || { label: status, class: styles.statusDefault };
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get service icon
  const getServiceIcon = (serviceType: string) => {
    const icons: Record<string, string> = {
      essential: '🛡️',
      executive: '💼',
      shadow: '🎯',
      client_vehicle: '🚗',
    };

    return icons[serviceType.toLowerCase()] || '🛡️';
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" message="Loading assignment history..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🛡️</div>
        <h3>No Protection Assignments Yet</h3>
        <p>Your protection assignment history will appear here</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Filters */}
      {showFilters && (
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${
              selectedFilter === 'all' ? styles.filterActive : ''
            }`}
            onClick={() => setSelectedFilter('all')}
          >
            All ({assignments.length})
          </button>
          <button
            className={`${styles.filterButton} ${
              selectedFilter === 'completed' ? styles.filterActive : ''
            }`}
            onClick={() => setSelectedFilter('completed')}
          >
            Completed (
            {assignments.filter((a) => a.status === 'completed').length})
          </button>
          <button
            className={`${styles.filterButton} ${
              selectedFilter === 'scheduled' ? styles.filterActive : ''
            }`}
            onClick={() => setSelectedFilter('scheduled')}
          >
            Upcoming (
            {
              assignments.filter(
                (a) => a.status === 'scheduled' || a.status === 'confirmed'
              ).length
            }
            )
          </button>
          <button
            className={`${styles.filterButton} ${
              selectedFilter === 'cancelled' ? styles.filterActive : ''
            }`}
            onClick={() => setSelectedFilter('cancelled')}
          >
            Cancelled (
            {assignments.filter((a) => a.status === 'cancelled').length})
          </button>
        </div>
      )}

      {/* Assignment List */}
      <div className={styles.assignmentList}>
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className={styles.assignmentCard}
            onClick={() => setSelectedAssignment(assignment)}
          >
            {/* Header */}
            <div className={styles.cardHeader}>
              <div className={styles.serviceInfo}>
                <span className={styles.serviceIcon}>
                  {getServiceIcon(assignment.service_type)}
                </span>
                <span className={styles.serviceType}>
                  {assignment.service_level || assignment.service_type}
                </span>
              </div>
              <span
                className={`${styles.statusBadge} ${
                  getStatusBadge(assignment.status).class
                }`}
              >
                {getStatusBadge(assignment.status).label}
              </span>
            </div>

            {/* Date & Time */}
            <div className={styles.dateTime}>
              <span className={styles.date}>
                {formatDate(assignment.scheduled_time)}
              </span>
              <span className={styles.time}>
                {formatTime(assignment.scheduled_time)}
              </span>
            </div>

            {/* Locations */}
            <div className={styles.locations}>
              <div className={styles.location}>
                <span className={styles.locationIcon}>📍</span>
                <span className={styles.locationText}>
                  {assignment.pickup_location}
                </span>
              </div>
              <div className={styles.locationDivider}>→</div>
              <div className={styles.location}>
                <span className={styles.locationIcon}>🎯</span>
                <span className={styles.locationText}>
                  {assignment.dropoff_location}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.cardFooter}>
              <div className={styles.cost}>
                £{(assignment.final_cost || assignment.estimated_cost).toFixed(2)}
              </div>
              {assignment.officer && (
                <div className={styles.officer}>
                  CPO: {assignment.officer.name}
                </div>
              )}
              {assignment.rating && (
                <div className={styles.rating}>
                  {'⭐'.repeat(assignment.rating)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <div
          className={styles.modal}
          onClick={() => setSelectedAssignment(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setSelectedAssignment(null)}
            >
              ✕
            </button>

            <h2 className={styles.modalTitle}>Assignment Details</h2>

            <div className={styles.detailSection}>
              <h3>Service Information</h3>
              <p>
                <strong>Type:</strong> {selectedAssignment.service_level || selectedAssignment.service_type}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                {getStatusBadge(selectedAssignment.status).label}
              </p>
              <p>
                <strong>Scheduled:</strong>{' '}
                {formatDate(selectedAssignment.scheduled_time)} at{' '}
                {formatTime(selectedAssignment.scheduled_time)}
              </p>
              {selectedAssignment.completed_at && (
                <p>
                  <strong>Completed:</strong>{' '}
                  {formatDate(selectedAssignment.completed_at)} at{' '}
                  {formatTime(selectedAssignment.completed_at)}
                </p>
              )}
            </div>

            <div className={styles.detailSection}>
              <h3>Route</h3>
              <p>
                <strong>Commencement:</strong> {selectedAssignment.pickup_location}
              </p>
              <p>
                <strong>Destination:</strong> {selectedAssignment.dropoff_location}
              </p>
              <p>
                <strong>Duration:</strong>{' '}
                {Math.round(
                  (selectedAssignment.actual_duration ||
                    selectedAssignment.estimated_duration) / 60
                )}{' '}
                minutes
              </p>
            </div>

            {selectedAssignment.officer && (
              <div className={styles.detailSection}>
                <h3>Protection Officer</h3>
                <p>
                  <strong>Name:</strong> {selectedAssignment.officer.name}
                </p>
                <p>
                  <strong>Designation:</strong>{' '}
                  {selectedAssignment.officer.designation}
                </p>
              </div>
            )}

            <div className={styles.detailSection}>
              <h3>Payment</h3>
              <p>
                <strong>Amount:</strong> £
                {(selectedAssignment.final_cost || selectedAssignment.estimated_cost).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {selectedAssignment.payment_status}
              </p>
            </div>

            {selectedAssignment.feedback && (
              <div className={styles.detailSection}>
                <h3>Your Feedback</h3>
                <p>{selectedAssignment.feedback}</p>
                {selectedAssignment.rating && (
                  <div className={styles.rating}>
                    {'⭐'.repeat(selectedAssignment.rating)}
                  </div>
                )}
              </div>
            )}

            <div className={styles.modalActions}>
              {selectedAssignment.status === 'completed' &&
                !selectedAssignment.rating && (
                  <Button variant="primary">Rate Assignment</Button>
                )}
              <Button
                variant="secondary"
                onClick={() => setSelectedAssignment(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
