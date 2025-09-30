// Armora Payment History Component
// Display payment transactions, filter by date, export functionality

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './PaymentHistory.module.css';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'cancelled';
  payment_method_type: string;
  created_at: string;
  succeeded_at: string | null;
  refunded_at: string | null;
  assignment_id: string | null;
  metadata: Record<string, any>;
  assignment?: {
    id: string;
    service_level: string;
    pickup_location: string;
    dropoff_location: string | null;
    scheduled_time: string;
  };
}

interface PaymentHistoryProps {
  userId: string;
  limit?: number;
  showFilters?: boolean;
  showExport?: boolean;
}

export function PaymentHistory({
  userId,
  limit,
  showFilters = true,
  showExport = true
}: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | '90days' | 'year'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'succeeded' | 'refunded' | 'failed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPayments();
  }, [userId, dateFilter, statusFilter]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('payments')
        .select(`
          *,
          assignment:protection_assignments(
            id,
            service_level,
            pickup_location,
            dropoff_location,
            scheduled_time
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate: Date;

        switch (dateFilter) {
          case '7days':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case '30days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case '90days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }

        query = query.gte('created_at', startDate.toISOString());
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply limit if specified
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setPayments(data || []);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error loading payments:', err);
      setError(err.message || 'Failed to load payment history');
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { label: 'Paid', color: 'success' },
      pending: { label: 'Pending', color: 'warning' },
      failed: { label: 'Failed', color: 'error' },
      refunded: { label: 'Refunded', color: 'info' },
      cancelled: { label: 'Cancelled', color: 'neutral' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.cancelled;
    return (
      <span className={`${styles.statusBadge} ${styles[config.color]}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (type: string): string => {
    const icons: Record<string, string> = {
      card: '💳',
      apple_pay: '🍎',
      google_pay: 'G',
      paypal: 'P',
    };
    return icons[type] || '💳';
  };

  const getServiceName = (serviceLevel: string): string => {
    const services: Record<string, string> = {
      essential: 'Essential',
      executive: 'Executive',
      shadow: 'Shadow Protocol',
      client_vehicle: 'Client Vehicle'
    };
    return services[serviceLevel] || serviceLevel;
  };

  const handleExport = () => {
    // Convert payments to CSV
    const headers = ['Date', 'Amount', 'Status', 'Service', 'Route', 'Payment Method'];
    const rows = filteredPayments.map(payment => [
      formatDate(payment.created_at),
      formatAmount(payment.amount, payment.currency),
      payment.status,
      payment.assignment ? getServiceName(payment.assignment.service_level) : 'N/A',
      payment.assignment
        ? `${payment.assignment.pickup_location} → ${payment.assignment.dropoff_location || 'N/A'}`
        : 'N/A',
      payment.payment_method_type
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `armora-payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Filter payments by search term
  const filteredPayments = payments.filter(payment => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      payment.id.toLowerCase().includes(searchLower) ||
      payment.assignment?.pickup_location?.toLowerCase().includes(searchLower) ||
      payment.assignment?.dropoff_location?.toLowerCase().includes(searchLower) ||
      payment.assignment?.service_level?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading payment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <span className={styles.errorIcon}>⚠️</span>
        <p>{error}</p>
        <button onClick={loadPayments} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Payment History</h2>
        {showExport && filteredPayments.length > 0 && (
          <button onClick={handleExport} className={styles.exportButton}>
            📥 Export CSV
          </button>
        )}
      </div>

      {showFilters && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Date Range:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className={styles.filterSelect}
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={styles.filterSelect}
            >
              <option value="all">All Statuses</option>
              <option value="succeeded">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <input
              type="text"
              placeholder="Search by location or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      )}

      {filteredPayments.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💳</div>
          <h3 className={styles.emptyTitle}>No Payments Found</h3>
          <p className={styles.emptyText}>
            {payments.length === 0
              ? 'You haven\'t made any payments yet.'
              : 'No payments match your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className={styles.paymentsTable}>
          {filteredPayments.map((payment) => (
            <div key={payment.id} className={styles.paymentRow}>
              <div className={styles.paymentMain}>
                <div className={styles.paymentHeader}>
                  <div className={styles.paymentDate}>
                    {formatDate(payment.created_at)}
                  </div>
                  {getStatusBadge(payment.status)}
                </div>

                <div className={styles.paymentDetails}>
                  {payment.assignment ? (
                    <div className={styles.assignmentInfo}>
                      <div className={styles.serviceType}>
                        {getServiceName(payment.assignment.service_level)}
                      </div>
                      <div className={styles.route}>
                        📍 {payment.assignment.pickup_location}
                        {payment.assignment.dropoff_location && (
                          <> → 🏁 {payment.assignment.dropoff_location}</>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noAssignment}>
                      Payment (No Assignment)
                    </div>
                  )}
                </div>

                <div className={styles.paymentFooter}>
                  <div className={styles.paymentMethod}>
                    <span className={styles.methodIcon}>
                      {getPaymentMethodIcon(payment.payment_method_type)}
                    </span>
                    {payment.payment_method_type}
                  </div>
                  <div className={styles.paymentAmount}>
                    {formatAmount(payment.amount, payment.currency)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!limit && filteredPayments.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Transactions:</span>
            <span className={styles.summaryValue}>{filteredPayments.length}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Spent:</span>
            <span className={styles.summaryValue}>
              {formatAmount(
                filteredPayments
                  .filter(p => p.status === 'succeeded')
                  .reduce((sum, p) => sum + p.amount, 0),
                filteredPayments[0]?.currency || 'gbp'
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
