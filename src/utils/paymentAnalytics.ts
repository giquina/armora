// Payment Analytics Utilities
// Comprehensive tracking for payment funnel optimization

export interface PaymentAnalyticsEvent {
  event: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  properties: Record<string, any>;
}

export interface PaymentFunnelMetrics {
  step: 'confirmation' | 'corporate-billing' | 'payment' | 'processing' | 'success' | 'error';
  timestamp: number;
  timeSpent?: number;
  previousStep?: string;
  metadata: {
    serviceType?: string;
    amount?: number;
    paymentMethod?: string;
    corporateBooking?: boolean;
    userType?: string;
    errorCode?: string;
    errorType?: string;
  };
}

class PaymentAnalytics {
  private sessionId: string;
  private funnelStartTime: number;
  private stepStartTime: number;
  private events: PaymentAnalyticsEvent[] = [];
  private currentStep: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.funnelStartTime = Date.now();
    this.stepStartTime = Date.now();
  }

  private generateSessionId(): string {
    return `payment_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  public track(event: string, properties: Record<string, any> = {}): void {
    const analyticsEvent: PaymentAnalyticsEvent = {
      event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.getUserId(),
      properties: {
        ...properties,
        sessionDuration: Date.now() - this.funnelStartTime,
        stepDuration: Date.now() - this.stepStartTime
      }
    };

    this.events.push(analyticsEvent);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
    }

    // In production, send to analytics service
    this.sendToAnalyticsService(analyticsEvent);
  }

  private getUserId(): string | undefined {
    try {
      const userData = localStorage.getItem('armoraUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user.email;
      }
    } catch (error) {
      console.warn('Failed to get user ID for analytics:', error);
    }
    return undefined;
  }

  private sendToAnalyticsService(event: PaymentAnalyticsEvent): void {
    // In production, this would send to your analytics platform
    // Examples: Google Analytics, Mixpanel, Amplitude, etc.

    // Mock implementation - store events locally for now
    try {
      const existingEvents = JSON.parse(localStorage.getItem('armora_payment_analytics') || '[]');
      existingEvents.push(event);

      // Keep only last 100 events to prevent localStorage bloat
      if (existingEvents.length > 100) {
        existingEvents.splice(0, existingEvents.length - 100);
      }

      localStorage.setItem('armora_payment_analytics', JSON.stringify(existingEvents));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }

  // Funnel Step Tracking
  trackFunnelStep(step: PaymentFunnelMetrics['step'], metadata: PaymentFunnelMetrics['metadata'] = {}): void {
    const timeSpent = this.currentStep ? Date.now() - this.stepStartTime : undefined;

    this.track('payment_funnel_step', {
      step,
      previousStep: this.currentStep,
      timeSpent,
      ...metadata
    });

    this.currentStep = step;
    this.stepStartTime = Date.now();
  }

  // Payment Method Selection
  trackPaymentMethodSelected(method: string, properties: Record<string, any> = {}): void {
    this.track('payment_method_selected', {
      paymentMethod: method,
      ...properties
    });
  }

  // Corporate Billing
  trackCorporateBillingStarted(companyName: string): void {
    this.track('corporate_billing_started', {
      companyName,
      timestamp: Date.now()
    });
  }

  trackVATValidation(vatNumber: string, isValid: boolean, errorMessage?: string): void {
    this.track('vat_validation', {
      vatNumber: vatNumber.substring(0, 4) + '***', // Partial VAT for privacy
      isValid,
      errorMessage
    });
  }

  // Payment Processing
  trackPaymentAttempt(amount: number, currency: string, paymentMethod: string): void {
    this.track('payment_attempt', {
      amount,
      currency,
      paymentMethod,
      attemptNumber: this.getPaymentAttemptNumber()
    });
  }

  trackPaymentSuccess(paymentIntentId: string, amount: number, paymentMethod: string): void {
    this.track('payment_success', {
      paymentIntentId,
      amount,
      paymentMethod,
      totalFunnelTime: Date.now() - this.funnelStartTime,
      conversionSuccessful: true
    });
  }

  trackPaymentError(errorCode: string, errorMessage: string, paymentMethod: string, retryable: boolean): void {
    this.track('payment_error', {
      errorCode,
      errorMessage,
      paymentMethod,
      retryable,
      attemptNumber: this.getPaymentAttemptNumber()
    });
  }

  // Express Payment (Apple Pay, Google Pay)
  trackExpressPaymentShown(availableMethods: string[]): void {
    this.track('express_payment_shown', {
      availableMethods,
      browserSupport: {
        applePay: this.checkApplePaySupport(),
        googlePay: this.checkGooglePaySupport()
      }
    });
  }

  trackExpressPaymentUsed(method: 'apple_pay' | 'google_pay', success: boolean): void {
    this.track('express_payment_used', {
      method,
      success,
      timeToComplete: Date.now() - this.stepStartTime
    });
  }

  // Saved Payment Methods
  trackSavedMethodUsed(methodId: string, methodType: string): void {
    this.track('saved_method_used', {
      methodId: methodId.substring(0, 8) + '***', // Partial ID for privacy
      methodType,
      timeToComplete: Date.now() - this.stepStartTime
    });
  }

  // User Behavior
  trackFormFieldInteraction(fieldName: string, action: 'focus' | 'blur' | 'change'): void {
    this.track('form_field_interaction', {
      fieldName,
      action,
      step: this.currentStep
    });
  }

  trackFormValidationError(fieldName: string, errorType: string): void {
    this.track('form_validation_error', {
      fieldName,
      errorType,
      step: this.currentStep
    });
  }

  // Conversion Optimization
  trackAbandonmentPoint(step: string, reason?: string): void {
    this.track('payment_abandonment', {
      abandonedAtStep: step,
      reason,
      timeInFunnel: Date.now() - this.funnelStartTime,
      stepsCompleted: this.getCompletedSteps()
    });
  }

  trackRetryAttempt(step: string, previousError?: string): void {
    this.track('payment_retry', {
      step,
      previousError,
      retryNumber: this.getRetryCount(step)
    });
  }

  // Mobile vs Desktop Tracking
  trackDeviceCapabilities(): void {
    this.track('device_capabilities', {
      isMobile: window.innerWidth <= 768,
      supportsTouch: 'ontouchstart' in window,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      userAgent: navigator.userAgent.substring(0, 100), // Truncated for privacy
      paymentRequestSupported: 'PaymentRequest' in window
    });
  }

  // Receipt and Completion
  trackReceiptDownload(bookingId: string, format: string): void {
    this.track('receipt_download', {
      bookingId,
      format,
      downloadTime: Date.now()
    });
  }

  // Helper Methods
  private getPaymentAttemptNumber(): number {
    return this.events.filter(e => e.event === 'payment_attempt').length + 1;
  }

  private getCompletedSteps(): string[] {
    return [...new Set(this.events
      .filter(e => e.event === 'payment_funnel_step')
      .map(e => e.properties.step))];
  }

  private getRetryCount(step: string): number {
    return this.events.filter(e =>
      e.event === 'payment_retry' && e.properties.step === step
    ).length + 1;
  }

  private checkApplePaySupport(): boolean {
    return 'ApplePaySession' in window && (window as any).ApplePaySession?.canMakePayments();
  }

  private checkGooglePaySupport(): boolean {
    return 'PaymentRequest' in window;
  }

  // Analytics Reporting
  getSessionSummary(): {
    sessionId: string;
    totalEvents: number;
    sessionDuration: number;
    completedSteps: string[];
    conversionSuccessful: boolean;
  } {
    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      sessionDuration: Date.now() - this.funnelStartTime,
      completedSteps: this.getCompletedSteps(),
      conversionSuccessful: this.events.some(e => e.event === 'payment_success')
    };
  }

  getConversionFunnelData(): Record<string, number> {
    const stepCounts: Record<string, number> = {};

    this.events
      .filter(e => e.event === 'payment_funnel_step')
      .forEach(e => {
        const step = e.properties.step;
        stepCounts[step] = (stepCounts[step] || 0) + 1;
      });

    return stepCounts;
  }

  // Export data for analysis
  exportAnalyticsData(): PaymentAnalyticsEvent[] {
    return [...this.events];
  }

  // Clear session data
  clearSession(): void {
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.funnelStartTime = Date.now();
    this.stepStartTime = Date.now();
    this.currentStep = null;
  }
}

// Singleton instance
export const paymentAnalytics = new PaymentAnalytics();

// Convenience function for quick tracking
export const trackPaymentEvent = (event: string, properties: Record<string, any> = {}) => {
  paymentAnalytics.track(event, properties);
};

// React Hook for payment analytics
export const usePaymentAnalytics = () => {
  return {
    analytics: paymentAnalytics,
    trackStep: paymentAnalytics.trackFunnelStep.bind(paymentAnalytics),
    trackPaymentMethod: paymentAnalytics.trackPaymentMethodSelected.bind(paymentAnalytics),
    trackSuccess: paymentAnalytics.trackPaymentSuccess.bind(paymentAnalytics),
    trackError: paymentAnalytics.trackPaymentError.bind(paymentAnalytics),
    trackAbandonment: paymentAnalytics.trackAbandonmentPoint.bind(paymentAnalytics),
    getSessionSummary: paymentAnalytics.getSessionSummary.bind(paymentAnalytics)
  };
};