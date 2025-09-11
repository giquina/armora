// Utility functions for consistent time estimate formatting across the app

export function getRemainingMinutes(totalSteps: number, currentStep: number): number {
  // Remaining steps includes current and those ahead to reflect overall flow time
  const remainingSteps = Math.max(0, totalSteps - currentStep + 1);
  // Use the same heuristic as the top progress indicator
  return Math.max(1, Math.round(remainingSteps * 1.1));
}

export function formatMinutesLeft(minutes: number): string {
  return minutes === 1 ? '1 minute left' : `${minutes} minutes left`;
}
