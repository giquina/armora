import { FC } from 'react';
import { IFinancialTracker } from '../../../types';
import styles from './FinancialTracker.module.css';

interface FinancialTrackerProps {
  financialData: IFinancialTracker;
  onViewDetails: () => void;
  onAdjustBudget: () => void;
  onClaimPoints: () => void;
}

export const FinancialTracker: FC<FinancialTrackerProps> = ({
  financialData,
  onViewDetails,
  onAdjustBudget,
  onClaimPoints
}) => {
  const {
    monthlyBudget,
    monthlySpent,
    remainingBudget,
    savingsVsStandard,
    loyaltyPoints,
    pointsValue,
    nextTierProgress,
    currentMonth
  } = financialData;

  const budgetPercentage = (monthlySpent / monthlyBudget) * 100;
  const tierProgress = ((nextTierProgress.pointsNeeded - loyaltyPoints) / nextTierProgress.pointsNeeded) * 100;

  const getBudgetStatus = () => {
    if (budgetPercentage >= 90) return { color: '#FF6B6B', status: 'Over Budget' };
    if (budgetPercentage >= 75) return { color: '#FFA500', status: 'Near Limit' };
    return { color: '#00FF88', status: 'On Track' };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className={styles.financialTracker}>
      <div className={styles.trackerHeader}>
        <h3 className={styles.trackerTitle}>Financial Overview</h3>
        <button
          className={styles.detailsButton}
          onClick={onViewDetails}
          aria-label="View detailed financial breakdown"
        >
          <span className={styles.detailsIcon}>📊</span>
          <span className={styles.detailsText}>Details</span>
        </button>
      </div>

      {/* Monthly Budget Section */}
      <div className={styles.budgetSection}>
        <div className={styles.budgetHeader}>
          <div className={styles.budgetInfo}>
            <h4 className={styles.budgetTitle}>Monthly Budget</h4>
            <div className={styles.budgetValues}>
              <span className={styles.spentAmount}>£{monthlySpent.toLocaleString()}</span>
              <span className={styles.budgetSeparator}>/</span>
              <span className={styles.totalBudget}>£{monthlyBudget.toLocaleString()}</span>
            </div>
          </div>
          <div className={styles.budgetStatus} style={{ color: budgetStatus.color }}>
            {budgetStatus.status}
          </div>
        </div>

        <div className={styles.budgetProgress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${Math.min(budgetPercentage, 100)}%`,
                backgroundColor: budgetStatus.color
              }}
            />
          </div>
          <div className={styles.progressLabel}>
            {budgetPercentage.toFixed(1)}% used
          </div>
        </div>

        <div className={styles.remainingBudget}>
          <span className={styles.remainingLabel}>Remaining:</span>
          <span className={styles.remainingAmount}>£{remainingBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Savings Section */}
      <div className={styles.savingsSection}>
        <div className={styles.savingsHeader}>
          <div className={styles.savingsIcon}>💰</div>
          <div className={styles.savingsInfo}>
            <h4 className={styles.savingsTitle}>Member Savings</h4>
            <div className={styles.savingsAmount}>£{savingsVsStandard.toLocaleString()}</div>
            <div className={styles.savingsDescription}>vs. standard rates this month</div>
          </div>
        </div>
      </div>

      {/* Loyalty Points Section */}
      <div className={styles.loyaltySection}>
        <div className={styles.loyaltyHeader}>
          <div className={styles.loyaltyInfo}>
            <h4 className={styles.loyaltyTitle}>Loyalty Points</h4>
            <div className={styles.pointsDisplay}>
              <span className={styles.pointsAmount}>{loyaltyPoints.toLocaleString()}</span>
              <span className={styles.pointsValue}>(£{pointsValue} value)</span>
            </div>
          </div>
          {loyaltyPoints >= 100 && (
            <button
              className={styles.claimButton}
              onClick={onClaimPoints}
              aria-label="Claim loyalty points"
            >
              <span className={styles.claimIcon}>🎁</span>
              <span className={styles.claimText}>Claim</span>
            </button>
          )}
        </div>

        {/* Tier Progress */}
        <div className={styles.tierProgress}>
          <div className={styles.tierHeader}>
            <span className={styles.currentTier}>{nextTierProgress.current} Member</span>
            <span className={styles.nextTier}>→ {nextTierProgress.next}</span>
          </div>
          <div className={styles.tierProgressBar}>
            <div
              className={styles.tierProgressFill}
              style={{ width: `${100 - tierProgress}%` }}
            />
          </div>
          <div className={styles.tierLabel}>
            {nextTierProgress.pointsNeeded - loyaltyPoints} points to {nextTierProgress.next}
          </div>
        </div>

        {nextTierProgress.benefits.length > 0 && (
          <div className={styles.tierBenefits}>
            <div className={styles.benefitsTitle}>Next Tier Benefits:</div>
            <div className={styles.benefitsList}>
              {nextTierProgress.benefits.slice(0, 2).map((benefit, index) => (
                <div key={index} className={styles.benefitItem}>
                  <span className={styles.benefitIcon}>✨</span>
                  <span className={styles.benefitText}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Monthly Insights */}
      <div className={styles.insightsSection}>
        <h4 className={styles.insightsTitle}>This Month's Activity</h4>
        <div className={styles.insightsGrid}>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>🛡️</div>
            <div className={styles.insightValue}>{currentMonth.assignmentCount}</div>
            <div className={styles.insightLabel}>Assignments</div>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>💷</div>
            <div className={styles.insightValue}>£{currentMonth.averageValue}</div>
            <div className={styles.insightLabel}>Avg. Value</div>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>📍</div>
            <div className={styles.insightValue}>{currentMonth.topRoute}</div>
            <div className={styles.insightLabel}>Top Route</div>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>⏰</div>
            <div className={styles.insightValue}>{currentMonth.peakHours}</div>
            <div className={styles.insightLabel}>Peak Hours</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button
          className={styles.adjustBudgetButton}
          onClick={onAdjustBudget}
          aria-label="Adjust monthly budget"
        >
          <span className={styles.actionIcon}>⚙️</span>
          <span className={styles.actionText}>Adjust Budget</span>
        </button>
      </div>
    </div>
  );
};