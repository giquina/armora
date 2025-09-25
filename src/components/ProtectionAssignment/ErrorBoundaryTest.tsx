import React, { useState } from 'react';

interface ErrorBoundaryTestProps {
  shouldThrow?: boolean;
}

/**
 * Test component to verify error boundary functionality
 * Only available in development mode
 */
export function ErrorBoundaryTest({ shouldThrow = false }: ErrorBoundaryTestProps) {
  const [triggerError, setTriggerError] = useState(shouldThrow);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (triggerError) {
    // Intentionally throw an error to test error boundary
    throw new Error('Test error for BookingErrorBoundary - This is expected in development');
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      zIndex: 9999,
      background: '#ff6b6b',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <button
        onClick={() => setTriggerError(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        🧪 Test Error Boundary
      </button>
    </div>
  );
}