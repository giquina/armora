import { PersonalizationData } from '../types';

export type UserStatus = 
  | 'NEW_USER' 
  | 'RETURNING_INCOMPLETE' 
  | 'RETURNING_NEW'
  | 'ASSESSMENT_COMPLETE' 
  | 'EXISTING_CUSTOMER';

export interface UserData {
  // Identity
  userName: string | null;
  userId: string | null;
  
  // Assessment
  assessmentComplete: boolean;
  assessmentStep: number;
  assessmentAnswers: PersonalizationData | null;
  assessmentStartDate: string | null;
  assessmentCompleteDate: string | null;
  
  // Activity
  firstVisit: string | null;
  lastVisit: string | null;
  visitCount: number;
  
  // Bookings
  bookingCount: number;
  lastBookingDate: string | null;
  membershipTier: string;
  
  // Preferences
  skipNamePrompt: boolean;
  preferredLanguage: string;
}

export const DEFAULT_USER_DATA: UserData = {
  userName: null,
  userId: null,
  assessmentComplete: false,
  assessmentStep: 0,
  assessmentAnswers: null,
  assessmentStartDate: null,
  assessmentCompleteDate: null,
  firstVisit: null,
  lastVisit: null,
  visitCount: 0,
  bookingCount: 0,
  lastBookingDate: null,
  membershipTier: 'Standard',
  skipNamePrompt: false,
  preferredLanguage: 'en'
};

// Generate a unique user ID
export const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

// Get user data from localStorage
export const getUserData = (): UserData => {
  try {
    const stored = localStorage.getItem('armora_user_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_USER_DATA, ...parsed };
    }
  } catch (error) {
    console.error('Failed to parse user data:', error);
  }
  return DEFAULT_USER_DATA;
};

// Save user data to localStorage
export const saveUserData = (userData: Partial<UserData>): void => {
  try {
    const current = getUserData();
    const updated = { ...current, ...userData };
    localStorage.setItem('armora_user_data', JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

// Get user status based on current data
export const getUserStatus = (): UserStatus => {
  const userData = getUserData();
  
  // New user - no prior data
  if (!userData.userName && !userData.lastVisit) {
    return 'NEW_USER';
  }
  
  // Existing customer - has completed assessment and has bookings
  if (userData.assessmentComplete && userData.bookingCount > 0) {
    return 'EXISTING_CUSTOMER';
  }
  
  // Assessment complete but no bookings yet
  if (userData.assessmentComplete) {
    return 'ASSESSMENT_COMPLETE';
  }
  
  // Has name and started assessment but not finished
  if (userData.userName && userData.assessmentStep > 0) {
    return 'RETURNING_INCOMPLETE';
  }
  
  // Has name but hasn't started assessment
  if (userData.userName) {
    return 'RETURNING_NEW';
  }
  
  // Fallback for edge cases
  return 'NEW_USER';
};

// Record a visit
export const recordVisit = (): void => {
  const userData = getUserData();
  const now = new Date().toISOString();
  
  saveUserData({
    firstVisit: userData.firstVisit || now,
    lastVisit: now,
    visitCount: userData.visitCount + 1,
    userId: userData.userId || generateUserId()
  });
};

// Get time-based greeting
export const getTimeBasedGreeting = (userName?: string): string => {
  const hour = new Date().getHours();
  const name = userName ? `, ${userName}` : '';
  
  if (hour < 12) return `Good morning${name}`;
  if (hour < 17) return `Good afternoon${name}`;
  if (hour < 21) return `Good evening${name}`;
  return `Good night${name}`;
};

// Get days since assessment completion
export const getDaysSinceAssessment = (): number => {
  const userData = getUserData();
  if (!userData.assessmentCompleteDate) return 0;
  
  const completedDate = new Date(userData.assessmentCompleteDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - completedDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get membership tier based on booking count
export const getMembershipTier = (bookingCount: number): string => {
  if (bookingCount >= 20) return 'Platinum';
  if (bookingCount >= 10) return 'Gold';
  if (bookingCount >= 5) return 'Silver';
  return 'Standard';
};

// Update membership tier
export const updateMembershipTier = (): void => {
  const userData = getUserData();
  const newTier = getMembershipTier(userData.bookingCount);
  saveUserData({ membershipTier: newTier });
};

// Mark assessment as started
export const markAssessmentStarted = (step: number = 1): void => {
  const userData = getUserData();
  saveUserData({
    assessmentStep: step,
    assessmentStartDate: userData.assessmentStartDate || new Date().toISOString()
  });
};

// Mark assessment as complete
export const markAssessmentComplete = (answers: PersonalizationData): void => {
  saveUserData({
    assessmentComplete: true,
    assessmentCompleteDate: new Date().toISOString(),
    assessmentAnswers: answers,
    assessmentStep: 9
  });
};

// Record a booking
export const recordBooking = (): void => {
  const userData = getUserData();
  const newCount = userData.bookingCount + 1;
  
  saveUserData({
    bookingCount: newCount,
    lastBookingDate: new Date().toISOString(),
    membershipTier: getMembershipTier(newCount)
  });
};

// Clear user data (for testing)
export const clearUserData = (): void => {
  localStorage.removeItem('armora_user_data');
  // Also clear legacy keys
  localStorage.removeItem('armora_user_name');
  localStorage.removeItem('armora_name_confirmed');
  localStorage.removeItem('armora_name_confirmation_timestamp');
  localStorage.removeItem('armora_questionnaire_progress');
};