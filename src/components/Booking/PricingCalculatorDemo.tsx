import React, { useState } from 'react';
import { PricingCalculator } from './PricingCalculator';
import styles from './PricingCalculatorDemo.module.css';

/**
 * Demo component to showcase the new Pricing Calculator functionality
 * This demonstrates the exact pricing layout requested:
 *
 * ─────────────────────────
 * Calculating your protection...
 * Distance: 22 miles
 * Time needed: 45 minutes
 * Protection hours: 2 (minimum)
 *
 * YOUR INVESTMENT:
 * Protection Officer: £100
 * Secure vehicle: £55
 * ─────────────────────────
 * Total: £155
 *
 * Members pay: £124 (SAVE £31)
 * [Become a member]
 */
export function PricingCalculatorDemo() {
  const [destination, setDestination] = useState('Heathrow Airport Terminal 5');
  const [serviceLevel, setServiceLevel] = useState<'essential' | 'executive' | 'shadow' | 'client-vehicle'>('shadow');
  const [userType, setUserType] = useState<'guest' | 'registered'>('guest');

  const handlePriceCalculated = (breakdown: any) => {
    console.log('Demo: Price calculated', breakdown);
  };

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoHeader}>
        <h2>Enhanced Pricing Calculator Demo</h2>
        <p>Crystal clear pricing breakdown with trust-building elements</p>
      </div>

      <div className={styles.demoControls}>
        <div className={styles.controlGroup}>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={styles.demoInput}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Service Level:</label>
          <select
            value={serviceLevel}
            onChange={(e) => setServiceLevel(e.target.value as any)}
            className={styles.demoSelect}
          >
            <option value="essential">Essential (£50/hr)</option>
            <option value="executive">Executive (£75/hr)</option>
            <option value="shadow">Shadow (£65/hr)</option>
            <option value="client-vehicle">Client Vehicle (£45/hr)</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label>User Type:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as any)}
            className={styles.demoSelect}
          >
            <option value="guest">Guest (see membership CTA)</option>
            <option value="registered">Member (20% savings)</option>
          </select>
        </div>
      </div>

      <div className={styles.calculatorDemo}>
        <h3>Live Pricing Calculator:</h3>
        <PricingCalculator
          destination={destination}
          serviceLevel={serviceLevel}
          onPriceCalculated={handlePriceCalculated}
          autoCalculate={true}
          showMembershipCTA={userType === 'guest'}
        />
      </div>

      <div className={styles.demoFeatures}>
        <h3>Key Features Implemented:</h3>
        <ul>
          <li>✅ Real-time calculation as user enters destination</li>
          <li>✅ Clear breakdown: Protection Officer vs Secure Vehicle costs</li>
          <li>✅ "Investment" terminology (not "Cost")</li>
          <li>✅ Member savings highlighted in green</li>
          <li>✅ 2-hour minimum clearly shown</li>
          <li>✅ SIA Licensed Officers trust badge</li>
          <li>✅ Trust signals: insurance, GPS tracking, emergency support</li>
          <li>✅ Professional service level descriptions</li>
          <li>✅ Membership CTA for guests</li>
          <li>✅ Mobile-first responsive design</li>
        </ul>
      </div>
    </div>
  );
}

export default PricingCalculatorDemo;