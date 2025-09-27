import { useState } from 'react';
import styles from './JourneyCostCalculator.module.css';

interface JourneyCostCalculatorProps {
  onCalculate?: (result: CalculationResult) => void;
}

interface CalculationResult {
  distance: number;
  estimatedTime: number;
  protectionCost: number;
  transportCost: number;
  total: number;
  memberPrice: number;
  service: string;
}

export function JourneyCostCalculator({ onCalculate }: JourneyCostCalculatorProps) {
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [selectedService, setSelectedService] = useState('essential');
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const serviceRates = {
    essential: { protection: 50, transport: 2.5, name: 'Essential Protection' },
    executive: { protection: 75, transport: 2.5, name: 'Executive Protection' },
    shadow: { protection: 65, transport: 2.5, name: 'Shadow Protection' },
    personal: { protection: 55, transport: 0, name: 'Personal Vehicle Service' }
  };

  const handleCalculate = async () => {
    if (!fromAddress || !toAddress) return;

    setIsCalculating(true);

    // Simulate calculation (in real app, this would call a mapping API)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const distance = Math.random() * 20 + 5; // 5-25 miles
    const estimatedTime = Math.max(2, distance * 0.1 + Math.random() * 0.5); // Minimum 2 hours
    const rates = serviceRates[selectedService as keyof typeof serviceRates];

    const protectionCost = Math.ceil(estimatedTime) * rates.protection;
    const transportCost = rates.transport * distance;
    const total = protectionCost + transportCost;
    const memberPrice = total * 0.8; // 20% discount

    const result: CalculationResult = {
      distance: Math.round(distance * 10) / 10,
      estimatedTime: Math.round(estimatedTime * 10) / 10,
      protectionCost,
      transportCost: Math.round(transportCost * 100) / 100,
      total: Math.round(total * 100) / 100,
      memberPrice: Math.round(memberPrice * 100) / 100,
      service: rates.name
    };

    setCalculation(result);
    setIsCalculating(false);
    onCalculate?.(result);
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <h3 className={styles.title}>Protection Cost Calculator</h3>
        <p className={styles.subtitle}>Get instant pricing for your journey</p>
      </div>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>From</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter Commencement Point address or postcode"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>To</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Enter secureDestination address or postcode"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Service</label>
          <select
            className={styles.select}
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="essential">Essential Protection - £50/hr</option>
            <option value="executive">Executive Protection - £75/hr</option>
            <option value="shadow">Shadow Protection - £65/hr</option>
            <option value="personal">Personal Vehicle Service - £55/hr</option>
          </select>
        </div>

        <button
          className={styles.calculateButton}
          onClick={handleCalculate}
          disabled={!fromAddress || !toAddress || isCalculating}
        >
          {isCalculating ? 'Calculating...' : 'Calculate Journey Cost'}
        </button>
      </div>

      {calculation && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <h4 className={styles.resultTitle}>Instant Calculation</h4>
            <div className={styles.serviceInfo}>
              <span className={styles.serviceName}>{calculation.service}</span>
            </div>
          </div>

          <div className={styles.calculations}>
            <div className={styles.calcRow}>
              <span className={styles.calcLabel}>Distance:</span>
              <span className={styles.calcValue}>{calculation.distance} miles</span>
            </div>
            <div className={styles.calcRow}>
              <span className={styles.calcLabel}>Est. time:</span>
              <span className={styles.calcValue}>{calculation.estimatedTime} hours (min 2)</span>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.calcRow}>
              <span className={styles.calcLabel}>Protection:</span>
              <span className={styles.calcValue}>£{calculation.protectionCost}</span>
            </div>
            <div className={styles.calcRow}>
              <span className={styles.calcLabel}>Transport:</span>
              <span className={styles.calcValue}>
                {selectedService === 'personal' ? 'No charge' : `£${calculation.transportCost}`}
              </span>
            </div>
            <div className={styles.separator}></div>
            <div className={styles.calcRow}>
              <span className={styles.calcLabel}>Total:</span>
              <span className={styles.calcValueTotal}>£{calculation.total}</span>
            </div>
            <div className={styles.calcRow}>
              <span className={styles.calcLabel}>Member price:</span>
              <span className={styles.calcValueMember}>£{calculation.memberPrice} (Save 20%)</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.bookButton}>
              Request This Journey
            </button>
            <button className={styles.shareButton}>
              Share Quote
            </button>
          </div>
        </div>
      )}
    </div>
  );
}