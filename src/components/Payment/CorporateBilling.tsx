import { useState, useEffect } from 'react';
import { CorporateAccount, Address, PaymentFlow, PriceBreakdown } from '../../types';
import { Button } from '../UI/Button';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import styles from './CorporateBilling.module.css';

interface CorporateBillingProps {
  paymentFlow: PaymentFlow;
  corporateAccount?: CorporateAccount;
  onBillingConfirmed: (billingData: CorporateBillingData) => void;
  onCancel: () => void;
}

interface CorporateBillingData {
  companyName: string;
  vatNumber?: string;
  billingAddress: Address;
  paymentTerms: 'immediate' | 'net_7' | 'net_15' | 'net_30';
  purchaseOrderNumber?: string;
  costCenter?: string;
  approverEmail?: string;
  requiresApproval: boolean;
  priceBreakdown: PriceBreakdown;
}

export function CorporateBilling({
  paymentFlow,
  corporateAccount,
  onBillingConfirmed,
  onCancel
}: CorporateBillingProps) {
  const [companyName, setCompanyName] = useState(corporateAccount?.companyName || '');
  const [vatNumber, setVatNumber] = useState(corporateAccount?.vatNumber || '');
  const [billingAddress, setBillingAddress] = useState<Address>(
    corporateAccount?.billingAddress || {
      line1: '',
      line2: '',
      city: '',
      county: '',
      postcode: '',
      country: 'GB'
    }
  );
  const [paymentTerms, setPaymentTerms] = useState<CorporateBillingData['paymentTerms']>(
    corporateAccount?.paymentTerms || 'immediate'
  );
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [approverEmail, setApproverEmail] = useState('');
  const [requiresApproval, setRequiresApproval] = useState(false);

  const [isValidatingVat, setIsValidatingVat] = useState(false);
  const [vatValidationError, setVatValidationError] = useState<string | null>(null);
  const [vatValidated, setVatValidated] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate pricing with VAT
  useEffect(() => {
    const calculateCorporatePricing = () => {
      const basePrice = paymentFlow.amount;

      // Determine VAT rate based on validation
      let vatRate = 0.20; // Standard UK VAT rate
      let vatAmount = Math.round(basePrice * vatRate);

      // VAT exemptions or different rates based on validation
      if (vatValidated && vatNumber) {
        // In production, this would check VAT database
        if (vatNumber.startsWith('GB') && vatNumber.length >= 9) {
          vatRate = 0.20; // UK VAT
        } else if (vatNumber.startsWith('IE') || vatNumber.startsWith('FR')) {
          vatRate = 0; // Reverse charge for EU business
          vatAmount = 0;
        }
      }

      const totalPrice = basePrice + vatAmount;

      setPriceBreakdown({
        basePrice,
        vatRate,
        vatAmount,
        totalPrice,
        currency: paymentFlow.currency,
        description: `${paymentFlow.description} - Corporate Billing`
      });
    };

    calculateCorporatePricing();
  }, [paymentFlow, vatValidated, vatNumber]);

  // VAT number validation
  const validateVatNumber = async (vat: string) => {
    if (!vat.trim()) {
      setVatValidated(false);
      setVatValidationError(null);
      return;
    }

    setIsValidatingVat(true);
    setVatValidationError(null);

    try {
      // Mock VAT validation - in production use VIES or similar service
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple validation rules
      const vatRegex = /^[A-Z]{2}[0-9A-Z]{2,12}$/;
      const isValidFormat = vatRegex.test(vat.toUpperCase().replace(/\s/g, ''));

      if (!isValidFormat) {
        throw new Error('Invalid VAT number format');
      }

      // Mock specific validations
      const validatedNumber = vat.toUpperCase().replace(/\s/g, '');
      if (validatedNumber === 'INVALID123') {
        throw new Error('VAT number not found in EU database');
      }

      setVatValidated(true);
      setVatValidationError(null);

    } catch (error: any) {
      setVatValidated(false);
      setVatValidationError(error.message || 'VAT validation failed');
    }

    setIsValidatingVat(false);
  };

  // Handle VAT input change with debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      validateVatNumber(vatNumber);
    }, 800);

    return () => clearTimeout(timer);
  }, [vatNumber]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!billingAddress.line1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }

    if (!billingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!billingAddress.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    }

    if (vatNumber && vatValidationError) {
      newErrors.vatNumber = vatValidationError;
    }

    if (requiresApproval && !approverEmail.trim()) {
      newErrors.approverEmail = 'Approver email is required for approval workflow';
    }

    if (requiresApproval && !approverEmail.includes('@')) {
      newErrors.approverEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !priceBreakdown) return;

    setIsLoading(true);

    try {
      const billingData: CorporateBillingData = {
        companyName: companyName.trim(),
        vatNumber: vatNumber.trim() || undefined,
        billingAddress,
        paymentTerms,
        purchaseOrderNumber: purchaseOrderNumber.trim() || undefined,
        costCenter: costCenter.trim() || undefined,
        approverEmail: approverEmail.trim() || undefined,
        requiresApproval,
        priceBreakdown
      };

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));

      onBillingConfirmed(billingData);

    } catch (error) {
      console.error('Corporate billing submission failed:', error);
    }

    setIsLoading(false);
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!priceBreakdown) {
    return <LoadingSpinner size="large" text="Calculating pricing..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Corporate Billing Information</h2>
        <p className={styles.subtitle}>Configure billing for business payment</p>
      </div>

      {/* Company Information */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Company Details</h3>

        <div className={styles.inputGroup}>
          <label htmlFor="companyName" className={styles.label}>
            Company Name *
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name"
            className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
          />
          {errors.companyName && (
            <div className={styles.errorMessage}>{errors.companyName}</div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="vatNumber" className={styles.label}>
            VAT Number (optional)
            {isValidatingVat && <LoadingSpinner size="small" inline />}
            {vatValidated && <span className={styles.validIcon}>✓</span>}
          </label>
          <input
            id="vatNumber"
            type="text"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            placeholder="e.g. GB123456789"
            className={`${styles.input} ${errors.vatNumber ? styles.inputError : ''} ${vatValidated ? styles.inputValid : ''}`}
          />
          {errors.vatNumber && (
            <div className={styles.errorMessage}>{errors.vatNumber}</div>
          )}
          <div className={styles.helpText}>
            Enter VAT number for EU reverse charge or tax exemptions
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Billing Address</h3>

        <div className={styles.addressGrid}>
          <div className={styles.inputGroup}>
            <label htmlFor="addressLine1" className={styles.label}>
              Address Line 1 *
            </label>
            <input
              id="addressLine1"
              type="text"
              value={billingAddress.line1}
              onChange={(e) => handleAddressChange('line1', e.target.value)}
              placeholder="Street address"
              className={`${styles.input} ${errors.addressLine1 ? styles.inputError : ''}`}
            />
            {errors.addressLine1 && (
              <div className={styles.errorMessage}>{errors.addressLine1}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="addressLine2" className={styles.label}>
              Address Line 2
            </label>
            <input
              id="addressLine2"
              type="text"
              value={billingAddress.line2 || ''}
              onChange={(e) => handleAddressChange('line2', e.target.value)}
              placeholder="Apartment, suite, etc."
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="city" className={styles.label}>
              City *
            </label>
            <input
              id="city"
              type="text"
              value={billingAddress.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="City"
              className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
            />
            {errors.city && (
              <div className={styles.errorMessage}>{errors.city}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="county" className={styles.label}>
              County/State
            </label>
            <input
              id="county"
              type="text"
              value={billingAddress.county || ''}
              onChange={(e) => handleAddressChange('county', e.target.value)}
              placeholder="County or State"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="postcode" className={styles.label}>
              Postcode *
            </label>
            <input
              id="postcode"
              type="text"
              value={billingAddress.postcode}
              onChange={(e) => handleAddressChange('postcode', e.target.value)}
              placeholder="Postcode"
              className={`${styles.input} ${errors.postcode ? styles.inputError : ''}`}
            />
            {errors.postcode && (
              <div className={styles.errorMessage}>{errors.postcode}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="country" className={styles.label}>
              Country
            </label>
            <select
              id="country"
              value={billingAddress.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              className={styles.select}
            >
              <option value="GB">United Kingdom</option>
              <option value="IE">Ireland</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="NL">Netherlands</option>
              <option value="BE">Belgium</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Terms & Purchase Order */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Payment Terms</h3>

        <div className={styles.paymentTermsGrid}>
          {(['immediate', 'net_7', 'net_15', 'net_30'] as const).map((term) => (
            <label key={term} className={styles.radioLabel}>
              <input
                type="radio"
                name="paymentTerms"
                value={term}
                checked={paymentTerms === term}
                onChange={(e) => setPaymentTerms(e.target.value as any)}
                className={styles.radio}
              />
              <span className={styles.radioText}>
                {term === 'immediate' ? 'Immediate Payment' : term.replace('_', ' ').replace('net', 'Net')}
              </span>
            </label>
          ))}
        </div>

        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="purchaseOrder" className={styles.label}>
              Purchase Order Number
            </label>
            <input
              id="purchaseOrder"
              type="text"
              value={purchaseOrderNumber}
              onChange={(e) => setPurchaseOrderNumber(e.target.value)}
              placeholder="PO-2024-001"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="costCenter" className={styles.label}>
              Cost Center
            </label>
            <input
              id="costCenter"
              type="text"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              placeholder="CC-TRANSPORT"
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Approval Workflow */}
      <div className={styles.section}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={requiresApproval}
            onChange={(e) => setRequiresApproval(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>Requires manager approval</span>
        </label>

        {requiresApproval && (
          <div className={styles.inputGroup}>
            <label htmlFor="approverEmail" className={styles.label}>
              Approver Email *
            </label>
            <input
              id="approverEmail"
              type="email"
              value={approverEmail}
              onChange={(e) => setApproverEmail(e.target.value)}
              placeholder="manager@company.com"
              className={`${styles.input} ${errors.approverEmail ? styles.inputError : ''}`}
            />
            {errors.approverEmail && (
              <div className={styles.errorMessage}>{errors.approverEmail}</div>
            )}
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className={styles.priceSection}>
        <h3 className={styles.sectionTitle}>Billing Summary</h3>
        <div className={styles.priceBreakdown}>
          <div className={styles.priceItem}>
            <span>Service Cost</span>
            <span>£{(priceBreakdown.basePrice / 100).toFixed(2)}</span>
          </div>
          <div className={styles.priceItem}>
            <span>VAT ({(priceBreakdown.vatRate * 100).toFixed(0)}%)</span>
            <span>£{(priceBreakdown.vatAmount / 100).toFixed(2)}</span>
          </div>
          {vatValidated && vatNumber && priceBreakdown.vatAmount === 0 && (
            <div className={styles.vatNotice}>
              EU Reverse Charge - VAT to be accounted for by customer
            </div>
          )}
          <div className={styles.priceTotal}>
            <span>Total Amount</span>
            <span>£{(priceBreakdown.totalPrice / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          variant="secondary"
          size="lg"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading || isValidatingVat}
          isFullWidth
        >
          {isLoading ? (
            <LoadingSpinner size="small" variant="light" text="Processing..." inline />
          ) : (
            `Confirm Corporate Billing`
          )}
        </Button>
      </div>
    </div>
  );
}