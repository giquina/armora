export { VehicleSelection } from './VehicleSelection';
export { LocationPicker } from './LocationPicker';
export { default as QuickProtectionEstimate } from './QuickProtectionEstimate';

// Legacy exports pointing to new ProtectionAssignment directory
export { ProtectionAssignmentConfirmation as BookingConfirmation } from '../ProtectionAssignment/ProtectionAssignmentConfirmation';
export { ProtectionAssignmentSuccess as BookingSuccess } from '../ProtectionAssignment/ProtectionAssignmentSuccess';
export { ProtectionAssignmentErrorBoundary as BookingErrorBoundary } from '../ProtectionAssignment/ProtectionAssignmentErrorBoundary';
export { WhereWhenView } from '../ProtectionAssignment/WhereWhenView';