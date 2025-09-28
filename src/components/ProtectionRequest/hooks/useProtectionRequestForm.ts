/**
 * Custom hook for managing protection request form state
 * Handles validation, pricing calculations, and form submission logic
 */

import { useState, useCallback, useMemo } from 'react';
import { ServiceTier } from '../components/ServiceSelection/ServiceSelection';
import { TimeOption } from '../components/TimeSelection/TimeSelection';

export interface FormData {
  selectedServiceId: string;
  destination: string;
  selectedTime: string;
  scheduledDateTime?: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface PricingBreakdown {
  basePrice: number;
  discountAmount?: number;
  finalPrice: number;
  hasDiscount?: boolean;
  originalPrice?: number;
}

interface UseProtectionRequestFormProps {
  serviceTiers: ServiceTier[];
  timeOptions: TimeOption[];
  onSubmit: (formData: FormData, pricing: PricingBreakdown) => void;
  hasUserDiscount?: boolean;
}

export const useProtectionRequestForm = ({
  serviceTiers,
  timeOptions,
  onSubmit,
  hasUserDiscount = false
}: UseProtectionRequestFormProps) => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    selectedServiceId: serviceTiers[0]?.id || '',
    destination: '',
    selectedTime: timeOptions[0]?.value || '',
    scheduledDateTime: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Update service selection
  const updateService = useCallback((service: ServiceTier) => {
    setFormData(prev => ({ ...prev, selectedServiceId: service.id }));
  }, []);

  // Update destination
  const updateDestination = useCallback((destination: string) => {
    setFormData(prev => ({ ...prev, destination }));
  }, []);

  // Update time selection
  const updateTime = useCallback((timeValue: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTime: timeValue,
      // Clear scheduled time if not scheduling
      scheduledDateTime: timeValue === 'schedule' ? prev.scheduledDateTime : ''
    }));
  }, []);

  // Update scheduled date/time
  const updateScheduledDateTime = useCallback((dateTime: string) => {
    setFormData(prev => ({ ...prev, scheduledDateTime: dateTime }));
  }, []);

  // Get selected service tier
  const selectedService = useMemo(() => {
    return serviceTiers.find(service => service.id === formData.selectedServiceId);
  }, [serviceTiers, formData.selectedServiceId]);

  // Calculate pricing
  const pricing = useMemo((): PricingBreakdown => {
    if (!selectedService) {
      return {
        basePrice: 0,
        finalPrice: 0,
        hasDiscount: false
      };
    }

    const basePrice = selectedService.hourlyRate * 2; // 2-hour minimum
    const hasDiscount = hasUserDiscount;
    const discountAmount = hasDiscount ? basePrice * 0.5 : 0;
    const finalPrice = basePrice - discountAmount;

    return {
      basePrice,
      discountAmount: hasDiscount ? discountAmount : undefined,
      finalPrice,
      hasDiscount,
      originalPrice: hasDiscount ? basePrice : undefined
    };
  }, [selectedService, hasUserDiscount]);

  // Form validation
  const validation = useMemo((): FormValidation => {
    const errors: Record<string, string> = {};

    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    }

    if (formData.selectedTime === 'schedule' && !formData.scheduledDateTime) {
      errors.scheduledDateTime = 'Please select a date and time';
    }

    if (formData.selectedTime === 'schedule' && formData.scheduledDateTime) {
      const selectedDate = new Date(formData.scheduledDateTime);
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      if (selectedDate < twoHoursFromNow) {
        errors.scheduledDateTime = 'Minimum 2 hours advance booking required';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validation.isValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await onSubmit(formData, pricing);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, pricing, validation.isValid, onSubmit]);

  // Get deployment info for display
  const deploymentInfo = useMemo(() => {
    if (!selectedService) return '';

    switch (formData.selectedTime) {
      case 'now':
        return `CPO deployment: ${selectedService.responseTime}`;
      case '30min':
        return 'Protection commences in 30 minutes';
      case '1hour':
        return 'Protection commences in 1 hour';
      case 'schedule':
        if (formData.scheduledDateTime) {
          const date = new Date(formData.scheduledDateTime);
          return `Protection commences: ${date.toLocaleString('en-GB')}`;
        }
        return 'Select date and time';
      default:
        return '';
    }
  }, [formData.selectedTime, formData.scheduledDateTime, selectedService]);

  return {
    // Form state
    formData,
    selectedService,
    pricing,
    validation,
    isSubmitting,
    submitError,
    deploymentInfo,

    // Form actions
    updateService,
    updateDestination,
    updateTime,
    updateScheduledDateTime,
    handleSubmit
  };
};