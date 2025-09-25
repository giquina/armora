import React, { Component, ReactNode } from 'react';
import { ServiceLevel, ProtectionAssignmentData } from '../../types';
import styles from './BookingErrorBoundary.module.css';

interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

interface BookingErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

interface BookingErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: 'where-when' | 'vehicle-selection' | 'location-picker' | 'booking-confirmation';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  onNavigateBack?: () => void;
  preservedState?: {
    selectedService?: ServiceLevel | null;
    protectionAssignmentData?: ProtectionAssignmentData | null;
    bookingId?: string;
  };
}

export class BookingErrorBoundary extends Component<BookingErrorBoundaryProps, BookingErrorBoundaryState> {
  private maxRetries = 3;
  
  constructor(props: BookingErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<BookingErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BookingErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your error reporting service (e.g., Sentry, LogRocket)
      console.error('Booking flow error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        fallbackComponent: this.props.fallbackComponent,
        timestamp: new Date().toISOString(),
      });
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
      });

      if (this.props.onRetry) {
        this.props.onRetry();
      }
    }
  };

  handleNavigateBack = () => {
    if (this.props.onNavigateBack) {
      this.props.onNavigateBack();
    }
    
    // Reset error state when navigating back
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  handleReportIssue = () => {
    const { error } = this.state;
    
    // Create a pre-filled support email or redirect to support form
    const subject = encodeURIComponent('Protection Service Error Report - Armora Security Transport');
    const body = encodeURIComponent(`
Hello Armora Support Team,

I encountered an error while trying to arrange my protection service. Here are the details:

Error: ${error?.message || 'Unknown error'}
Component: ${this.props.fallbackComponent || 'Protection service flow'}
Time: ${new Date().toLocaleString()}

${this.props.preservedState?.selectedService ? `Selected Service: ${this.props.preservedState.selectedService.name}` : ''}

Please help me arrange my protection service.

Thank you,
[Your name]
    `);
    
    window.location.href = `mailto:support@armora.com?subject=${subject}&body=${body}`;
  };

  render() {
    if (this.state.hasError) {
      const { retryCount } = this.state;
      const canRetry = retryCount < this.maxRetries;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { preservedState, fallbackComponent } = this.props;

      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>⚠️</div>
            
            <h2 className={styles.errorTitle}>
              Protection Service Error
            </h2>

            <p className={styles.errorMessage}>
              We encountered an issue while arranging your protection service. 
              {preservedState?.selectedService && (
                <>
                  {' '}Your {preservedState.selectedService.name} selection has been saved.
                </>
              )}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className={styles.errorDetails}>
                <summary>Error Details (Development)</summary>
                <pre className={styles.errorStack}>
                  {this.state.error?.message}
                  {'\n\n'}
                  {this.state.error?.stack}
                </pre>
              </details>
            )}

            <div className={styles.actionButtons}>
              {canRetry && (
                <button
                  className={styles.retryButton}
                  onClick={this.handleRetry}
                >
                  Try Again ({this.maxRetries - retryCount} attempts left)
                </button>
              )}
              
              {this.props.onNavigateBack && (
                <button
                  className={styles.backButton}
                  onClick={this.handleNavigateBack}
                >
                  ← Go Back
                </button>
              )}
              
              <button
                className={styles.supportButton}
                onClick={this.handleReportIssue}
              >
                Contact Support
              </button>
            </div>

            <div className={styles.preservedStateInfo}>
              {preservedState?.selectedService && (
                <div className={styles.preservedItem}>
                  <span className={styles.preservedLabel}>Saved Service:</span>
                  <span className={styles.preservedValue}>
                    {preservedState.selectedService.name}
                  </span>
                </div>
              )}
              
              {preservedState?.protectionAssignmentData && (
                <>
                  <div className={styles.preservedItem}>
                    <span className={styles.preservedLabel}>Starting Point:</span>
                    <span className={styles.preservedValue}>
                      {preservedState.protectionAssignmentData.commencementPoint}
                    </span>
                  </div>
                  <div className={styles.preservedItem}>
                    <span className={styles.preservedLabel}>Secure Destination:</span>
                    <span className={styles.preservedValue}>
                      {preservedState.protectionAssignmentData.secureDestination}
                    </span>
                  </div>
                  <div className={styles.preservedItem}>
                    <span className={styles.preservedLabel}>Estimated Cost:</span>
                    <span className={styles.preservedValue}>
                      £{preservedState.protectionAssignmentData.estimatedCost}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className={styles.helpText}>
              <p>
                Don't worry - your protection service information is safe. You can try again
                or contact our support team for immediate assistance.
              </p>
              <p className={styles.supportInfo}>
                📞 Priority Support: +44 20 7946 0958<br />
                ✉️ Email: support@armora.com
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}