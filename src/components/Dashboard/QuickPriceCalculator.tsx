import React, { useState, useCallback, useEffect } from 'react';
import styles from './QuickPriceCalculator.module.css';

interface PriceEstimate {
  standard: number;
  member: number;
  savings: number;
  hours: number;
  distance: number;
  breakdown: {
    baseRate: number;
    timeCharge: number;
    distanceCharge: number;
    total: number;
  };
}

type ServiceType = 'standard' | 'executive' | 'shadow';

interface ServiceOption {
  id: ServiceType;
  name: string;
  rate: number;
  icon: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'standard', name: 'Essential', rate: 45, icon: '🚗' },
  { id: 'executive', name: 'Executive', rate: 75, icon: '🏆' },
  { id: 'shadow', name: 'Shadow', rate: 65, icon: '🛡️' }
];

export function QuickPriceCalculator() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceType>('shadow');
  const [estimate, setEstimate] = useState<PriceEstimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState("");

  // Load saved addresses as suggestions
  useEffect(() => {
    const homeAddress = localStorage.getItem('armora_home_address');
    const workAddress = localStorage.getItem('armora_work_address');

    if (homeAddress && !from) {
      setFrom(homeAddress.split(',')[0]); // Use first part of address
    }
  }, [from]);

  // Simulate distance calculation (in real app would use Maps API)
  const getDistance = useCallback(async (fromAddr: string, toAddr: string): Promise<number> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock distance based on common London routes
    const routes: Record<string, number> = {
      'home-heathrow': 25,
      'home-city': 12,
      'home-westfield': 8,
      'office-home': 15,
      'hotel-airport': 30,
      'default': 18
    };

    const routeKey = `${fromAddr.toLowerCase()}-${toAddr.toLowerCase()}`;
    return routes[routeKey] || routes.default || (Math.random() * 20 + 5);
  }, []);

  const calculatePrice = useCallback(async () => {
    if (!from.trim() || !to.trim()) {
      setError("Please enter both pickup and destination");
      return;
    }

    setError("");
    setIsCalculating(true);

    try {
      // Get distance and calculate travel time
      const distance = await getDistance(from, to);
      const estimatedTravelTime = (distance * 2.5) + 15; // 2.5 min per km + 15 min buffer
      const hours = Math.max(2, Math.ceil(estimatedTravelTime / 60)); // Minimum 2 hours

      // Pricing structure based on selected service
      const selectedServiceOption = SERVICE_OPTIONS.find(s => s.id === selectedService);
      const baseRate = selectedServiceOption?.rate || 45;
      const timeCharge = hours * baseRate;
      const distanceCharge = distance * 2.5; // £2.50 per km
      const total = timeCharge + distanceCharge;

      // Member discount (20% savings)
      const memberPrice = total * 0.8;
      const savings = total - memberPrice;

      const priceEstimate: PriceEstimate = {
        standard: Math.round(total),
        member: Math.round(memberPrice),
        savings: Math.round(savings),
        hours,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        breakdown: {
          baseRate,
          timeCharge: Math.round(timeCharge),
          distanceCharge: Math.round(distanceCharge),
          total: Math.round(total)
        }
      };

      setEstimate(priceEstimate);

      // Analytics
      console.log('[Analytics] Price calculation completed', {
        from,
        to,
        distance,
        hours,
        estimate: priceEstimate.standard,
        timestamp: Date.now()
      });

    } catch (err) {
      setError("Unable to calculate price. Please try again.");
      console.error('Price calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  }, [from, to, getDistance]);

  const handleQuickFill = (type: 'home' | 'work' | 'airport') => {
    switch (type) {
      case 'home':
        setFrom('Home');
        break;
      case 'work':
        setTo('Office');
        break;
      case 'airport':
        setTo('Heathrow Airport');
        break;
    }
  };

  const handleBookWithEstimate = () => {
    if (estimate) {
      // Store calculation context for booking
      localStorage.setItem('armora_price_estimate', JSON.stringify(estimate));
      localStorage.setItem('armora_estimated_route', JSON.stringify({ from, to }));
      localStorage.setItem('armora_selected_service', selectedService);

      console.log('[Analytics] Book with price estimate', {
        estimate: estimate.standard,
        route: `${from} → ${to}`,
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className={styles.priceCalculator}>
      <div className={styles.calculatorHeader}>
        <h3 className={styles.calculatorTitle}>Quick Protection Estimate</h3>
        <span className={styles.calculatorSubtitle}>Get instant pricing for your journey</span>
      </div>

      <div className={styles.calculatorInputs}>
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>📍</span>
            <input
              className={styles.locationInput}
              type="text"
              placeholder="From (pickup location)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className={styles.routeArrow}>→</div>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>🏁</span>
            <input
              className={styles.locationInput}
              type="text"
              placeholder="To (destination)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.serviceSelector}>
          <span className={styles.serviceSelectorLabel}>Protection Level:</span>
          <div className={styles.serviceButtons}>
            {SERVICE_OPTIONS.map((service) => (
              <button
                key={service.id}
                className={`${styles.serviceButton} ${selectedService === service.id ? styles.selected : ''}`}
                onClick={() => setSelectedService(service.id)}
                type="button"
              >
                <span className={styles.serviceIcon}>{service.icon}</span>
                <span className={styles.serviceName}>{service.name}</span>
                <span className={styles.serviceRate}>£{service.rate}/h</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.quickFillButtons}>
          <button
            className={styles.quickFillBtn}
            onClick={() => handleQuickFill('home')}
            type="button"
          >
            🏠 Home
          </button>
          <button
            className={styles.quickFillBtn}
            onClick={() => handleQuickFill('work')}
            type="button"
          >
            🏢 Office
          </button>
          <button
            className={styles.quickFillBtn}
            onClick={() => handleQuickFill('airport')}
            type="button"
          >
            ✈️ Airport
          </button>
        </div>

        <button
          className={`${styles.calculateButton} ${isCalculating ? styles.calculating : ''}`}
          onClick={calculatePrice}
          disabled={isCalculating || !from.trim() || !to.trim()}
        >
          {isCalculating ? (
            <>
              <span className={styles.spinner}>⏳</span>
              Calculating...
            </>
          ) : (
            <>
              <span className={styles.calculateIcon}>💰</span>
              Calculate Price
            </>
          )}
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {estimate && (
        <div className={styles.priceResult}>
          <div className={styles.resultHeader}>
            <h4 className={styles.resultTitle}>Your Protection Estimate</h4>
            <span className={styles.resultRoute}>{from} → {to}</span>
          </div>

          <div className={styles.priceBreakdown}>
            <div className={styles.priceRow}>
              <span>Protection time:</span>
              <span>{estimate.hours} hours</span>
            </div>
            <div className={styles.priceRow}>
              <span>Distance:</span>
              <span>{estimate.distance} km</span>
            </div>
            <div className={styles.priceRow}>
              <span>Standard price:</span>
              <span className={styles.standardPrice}>£{estimate.standard}</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.membershipPrice}>
                <span>Member price:</span>
                <span className={styles.savingsBadge}>Save £{estimate.savings}</span>
              </span>
              <span className={styles.memberPrice}>£{estimate.member}</span>
            </div>
          </div>

          <div className={styles.resultActions}>
            <button className={styles.membershipCTA}>
              Start Free Trial - Save £{estimate.savings}
            </button>
            <button className={styles.bookButton} onClick={handleBookWithEstimate}>
              Book Now - £{estimate.standard}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}