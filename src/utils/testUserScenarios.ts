import { clearUserData, saveUserData } from './userStatus';
import { PersonalizationData } from '../types';

// Development utility for testing different user scenarios
export const testUserScenarios = {
  // Scenario 1: New User (first time visitor)
  newUser: () => {
    clearUserData();
    console.log('✅ Scenario: NEW_USER - Cleared all data');
  },

  // Scenario 2: Returning user with incomplete assessment
  returningIncomplete: (name: string = 'John', step: number = 4) => {
    clearUserData();
    saveUserData({
      userName: name,
      assessmentStep: step,
      assessmentStartDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      visitCount: 3,
      lastVisit: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
      firstVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
    });
    console.log(`✅ Scenario: RETURNING_INCOMPLETE - Name: ${name}, Step: ${step}`);
  },

  // Scenario 3: Returning user who has name but hasn't started assessment
  returningNew: (name: string = 'Sarah') => {
    clearUserData();
    saveUserData({
      userName: name,
      assessmentStep: 0,
      visitCount: 2,
      lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      firstVisit: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    });
    console.log(`✅ Scenario: RETURNING_NEW - Name: ${name}, no assessment started`);
  },

  // Scenario 4: Assessment completed but no bookings
  assessmentComplete: (name: string = 'Alex') => {
    clearUserData();
    const mockAnswers: PersonalizationData = {
      firstName: name,
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      recommendedService: 'Executive'
    };
    
    saveUserData({
      userName: name,
      assessmentComplete: true,
      assessmentStep: 9,
      assessmentCompleteDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      assessmentAnswers: mockAnswers,
      visitCount: 5,
      membershipTier: 'Standard'
    });
    console.log(`✅ Scenario: ASSESSMENT_COMPLETE - Name: ${name}, completed 5 days ago`);
  },

  // Scenario 5: Existing customer with multiple bookings
  existingCustomer: (name: string = 'Victoria', bookings: number = 12) => {
    clearUserData();
    const mockAnswers: PersonalizationData = {
      firstName: name,
      completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      recommendedService: 'Shadow'
    };
    
    const membershipTier = bookings >= 20 ? 'Platinum' : bookings >= 10 ? 'Gold' : bookings >= 5 ? 'Silver' : 'Standard';
    
    saveUserData({
      userName: name,
      assessmentComplete: true,
      assessmentStep: 9,
      assessmentCompleteDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      assessmentAnswers: mockAnswers,
      bookingCount: bookings,
      lastBookingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      visitCount: bookings + 5,
      membershipTier
    });
    console.log(`✅ Scenario: EXISTING_CUSTOMER - Name: ${name}, ${bookings} bookings, ${membershipTier} tier`);
  },

  // Quick test all scenarios
  testAll: () => {
    console.log('🧪 Testing all user scenarios...');
    
    setTimeout(() => {
      testUserScenarios.newUser();
    }, 1000);
    
    setTimeout(() => {
      testUserScenarios.returningIncomplete('Emma', 3);
    }, 2000);
    
    setTimeout(() => {
      testUserScenarios.returningNew('Michael');
    }, 3000);
    
    setTimeout(() => {
      testUserScenarios.assessmentComplete('Jessica');
    }, 4000);
    
    setTimeout(() => {
      testUserScenarios.existingCustomer('David', 15);
    }, 5000);
    
    console.log('🔄 Will cycle through scenarios every 1 second. Refresh page to see changes.');
  },

  // Get current status info
  getCurrentStatus: () => {
    const userData = localStorage.getItem('armora_user_data');
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log('📊 Current User Data:', parsed);
    } else {
      console.log('📊 No user data found - NEW_USER scenario');
    }
  }
};

// Make available globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).testUserScenarios = testUserScenarios;
  console.log('🛠️ Development Tools Available:');
  console.log('• window.testUserScenarios.newUser()');
  console.log('• window.testUserScenarios.returningIncomplete("Name", stepNumber)');
  console.log('• window.testUserScenarios.returningNew("Name")');
  console.log('• window.testUserScenarios.assessmentComplete("Name")');
  console.log('• window.testUserScenarios.existingCustomer("Name", bookingCount)');
  console.log('• window.testUserScenarios.testAll()');
  console.log('• window.testUserScenarios.getCurrentStatus()');
}