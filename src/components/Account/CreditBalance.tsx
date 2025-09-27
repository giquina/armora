import styles from './CreditBalance.module.css';

interface CreditBalanceProps {
  available: number;
  earned: number;
  used: number;
}

export function CreditBalance({ available, earned, used }: CreditBalanceProps) {
  return (
    <div className={styles.creditBalance}>
      <div className={styles.mainBalance}>
        <div className={styles.balanceIcon}>🪙</div>
        <div className={styles.balanceContent}>
          <div className={styles.balanceAmount}>£{available}</div>
          <div className={styles.balanceLabel}>Available Credits</div>
        </div>
      </div>

      <div className={styles.creditStats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>£{earned}</div>
          <div className={styles.statLabel}>Total Earned</div>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>£{used}</div>
          <div className={styles.statLabel}>Used</div>
        </div>
      </div>

      {available > 0 && (
        <div className={styles.availableNotice}>
          💡 Use your credits on your next service!
        </div>
      )}
    </div>
  );
}