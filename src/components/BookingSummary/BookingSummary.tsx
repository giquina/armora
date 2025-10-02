import { useState, useEffect } from 'react';
import { ProtectionAssignmentData } from '../../types';
import styles from './BookingSummary.module.css';

interface BookingSummaryProps {
  protectionAssignmentData: ProtectionAssignmentData;
  loading?: boolean;
}

interface FeeBreakdown {
  baseRate: number;
  hours: number;
  subtotal: number;
  clientPays: number;
  platformFee: number;
  cpoReceives: number;
  breakdown: {
    clientMarkup: number;
    platformFeePercentage: number;
    cpoPercentage: number;
  };
}

export function BookingSummary({ protectionAssignmentData, loading = false }: BookingSummaryProps) {
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { service, estimatedDuration, estimatedCost } = protectionAssignmentData;

  // Map service ID to protection level for API
  const getProtectionLevel = (serviceId: string): string => {
    const mapping: Record<string, string> = {
      'essential': 'essential',
      'executive': 'executive',
      'shadow-protocol': 'shadow_protocol',
      'client-vehicle': 'client_vehicle',
    };
    return mapping[serviceId] || 'essential';
  };

  useEffect(() => {
    const calculateFees = async () => {
      setIsCalculating(true);
      setError(null);

      try {
        // Calculate base rate from estimated cost
        // estimatedCost is what client pays (120% of base)
        // So base = estimatedCost / 1.20
        const baseRate = estimatedCost / 1.20;
        const hours = estimatedDuration / 60; // Convert minutes to hours
        const protectionLevel = getProtectionLevel(service.id);

        // Call calculate-marketplace-fees Edge Function
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://jmzvrqwjmlnvxojculee.supabase.co';
        const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

        const response = await fetch(`${supabaseUrl}/functions/v1/calculate-marketplace-fees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            baseRate: Math.round(baseRate), // Round to nearest pound
            hours: Math.round(hours * 10) / 10, // Round to 1 decimal place
            protectionLevel,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to calculate fees');
        }

        const data: FeeBreakdown = await response.json();
        setFeeBreakdown(data);
      } catch (err: any) {
        console.error('Fee calculation error:', err);
        setError(err.message || 'Failed to calculate pricing breakdown');

        // Fallback to local calculation if Edge Function fails
        const baseRate = estimatedCost / 1.20;
        const hours = estimatedDuration / 60;
        const subtotal = baseRate * hours;

        setFeeBreakdown({
          baseRate: Math.round(baseRate),
          hours: Math.round(hours * 10) / 10,
          subtotal: Math.round(subtotal),
          clientPays: estimatedCost,
          platformFee: Math.round(subtotal * 0.35),
          cpoReceives: Math.round(subtotal * 0.85),
          breakdown: {
            clientMarkup: 0.20,
            platformFeePercentage: 0.35,
            cpoPercentage: 0.85,
          },
        });
      } finally {
        setIsCalculating(false);
      }
    };

    calculateFees();
  }, [estimatedCost, estimatedDuration, service.id]);

  if (loading || isCalculating) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLine}></div>
        </div>
      </div>
    );
  }

  if (!feeBreakdown) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Transparent Pricing</h3>
        <p className={styles.subtitle}>Fair marketplace for Principals and CPOs</p>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorText}>Using offline calculation</span>
        </div>
      )}

      <div className={styles.breakdown}>
        {/* Base Rate */}
        <div className={styles.row}>
          <div className={styles.label}>
            <span className={styles.labelText}>Base Rate</span>
            <span className={styles.labelDetail}>
              £{feeBreakdown.baseRate}/hr × {feeBreakdown.hours.toFixed(1)} hrs
            </span>
          </div>
          <div className={styles.value}>£{feeBreakdown.subtotal.toFixed(2)}</div>
        </div>

        {/* Service Fee */}
        <div className={styles.row}>
          <div className={styles.label}>
            <span className={styles.labelText}>Service Fee</span>
            <span className={styles.labelDetail}>
              {(feeBreakdown.breakdown.clientMarkup * 100).toFixed(0)}% marketplace fee
            </span>
          </div>
          <div className={styles.value}>
            £{(feeBreakdown.clientPays - feeBreakdown.subtotal).toFixed(2)}
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Total */}
        <div className={`${styles.row} ${styles.totalRow}`}>
          <div className={styles.label}>
            <span className={styles.labelText}>Total</span>
            <span className={styles.labelDetail}>What you pay</span>
          </div>
          <div className={`${styles.value} ${styles.totalValue}`}>
            £{feeBreakdown.clientPays.toFixed(2)}
          </div>
        </div>
      </div>

      {/* CPO Earnings Note */}
      <div className={styles.cpoNote}>
        <div className={styles.cpoNoteHeader}>
          <span className={styles.cpoIcon}>👮</span>
          <span className={styles.cpoTitle}>CPO Earnings</span>
        </div>
        <p className={styles.cpoText}>
          Your assigned CPO receives <strong>£{feeBreakdown.cpoReceives.toFixed(2)}</strong> ({(feeBreakdown.breakdown.cpoPercentage * 100).toFixed(0)}% of base rate).
          Armora takes a {(feeBreakdown.breakdown.platformFeePercentage * 100).toFixed(0)}% platform fee to maintain security infrastructure,
          insurance, and 24/7 support.
        </p>
      </div>

      {/* Transparency Statement */}
      <div className={styles.transparencyNote}>
        <p className={styles.transparencyText}>
          💡 <strong>Our Commitment:</strong> We believe in transparent pricing. Every pound you pay is
          clearly broken down, ensuring fair compensation for our professional CPOs while maintaining
          world-class security infrastructure.
        </p>
      </div>
    </div>
  );
}
