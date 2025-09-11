// Armora Security Transport - Subscription Data

import { SubscriptionPlan } from '../types';

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    tier: 'essential',
    name: 'Armora Prime Essential',
    price: 14.99,
    monthlyPrice: '£14.99',
    discount: 10,
    features: [
      '10% discount on all bookings',
      'Priority 2-hour response time',
      '£0 booking fees (save £5 per trip)',
      'Flexible cancellation policy',
      'Member-only vehicle preferences',
      'SMS booking confirmations',
      'First aid trained drivers',
      'SIA Close Protection Officers'
    ],
    description: 'Perfect for regular travelers who want reliable savings and priority service.',
    isAvailable: true,
    isPopular: true,
    trialDays: 30,
    responseTime: '2 hours',
    bookingFee: 0,
    originalBookingFee: 5
  },
  {
    tier: 'executive',
    name: 'Armora Prime Executive',
    price: 34.99,
    monthlyPrice: '£34.99',
    originalPrice: 44.99,
    discount: 20,
    features: [
      '20% discount on all bookings',
      'Dedicated Security Manager',
      'Priority 45-minute response time',
      'Luxury vehicle fleet access',
      'Advanced route planning',
      'Real-time tracking & updates',
      '24/7 emergency support line',
      'Complimentary travel risk assessment',
      'First aid trained drivers',
      'SIA Close Protection Officers'
    ],
    description: 'Comprehensive security transport for executives and high-profile clients.',
    isAvailable: false,
    responseTime: '45 minutes',
    bookingFee: 0,
    originalBookingFee: 5
  },
  {
    tier: 'elite',
    name: 'Armora Prime Elite',
    price: 59.99,
    monthlyPrice: '£59.99',
    originalPrice: 79.99,
    discount: 30,
    features: [
      '30% discount on all bookings',
      'Senior Security Manager assignment',
      'Priority 30-minute response time',
      'Access to all service tiers',
      'Multiple vehicle coordination',
      'Advance security reconnaissance',
      'VIP lounge access at airports',
      'Concierge travel arrangements',
      'Personal protection consultation',
      'First aid trained drivers',
      'SIA Close Protection Officers'
    ],
    description: 'Ultimate VIP experience with maximum security and luxury benefits.',
    isAvailable: false,
    responseTime: '30 minutes',
    bookingFee: 0,
    originalBookingFee: 5
  }
];

export const getSubscriptionPlan = (tier: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.tier === tier);
};

export const getAvailablePlans = (): SubscriptionPlan[] => {
  return subscriptionPlans.filter(plan => plan.isAvailable);
};

export const getComingSoonPlans = (): SubscriptionPlan[] => {
  return subscriptionPlans.filter(plan => !plan.isAvailable);
};

export const calculateSavings = (servicePrice: number, tier: string): number => {
  const plan = getSubscriptionPlan(tier);
  if (!plan) return 0;
  
  const discountSavings = servicePrice * (plan.discount / 100);
  const feeSavings = plan.originalBookingFee - plan.bookingFee;
  
  return discountSavings + feeSavings;
};

export const formatSavings = (amount: number): string => {
  return `£${amount.toFixed(2)}`;
};

export const getTrialMessage = (tier: string): string => {
  const plan = getSubscriptionPlan(tier);
  if (!plan || !plan.trialDays) return '';
  
  return `🎁 FREE for first ${plan.trialDays} days!`;
};

export const getMembershipBenefitSummary = (tier: string): string => {
  const plan = getSubscriptionPlan(tier);
  if (!plan) return '';
  
  return `${plan.discount}% savings + ${plan.responseTime} response + £0 booking fees`;
};