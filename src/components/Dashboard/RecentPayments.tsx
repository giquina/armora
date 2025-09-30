// Recent Payments Widget for Dashboard
// Shows last 5 payments with "View All" link

import { PaymentHistory } from './PaymentHistory';
import styles from './RecentPayments.module.css';

interface RecentPaymentsProps {
  userId: string;
  onViewAll: () => void;
}

export function RecentPayments({ userId, onViewAll }: RecentPaymentsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Payments</h3>
        <button onClick={onViewAll} className={styles.viewAllButton}>
          View All →
        </button>
      </div>

      <div className={styles.content}>
        <PaymentHistory
          userId={userId}
          limit={5}
          showFilters={false}
          showExport={false}
        />
      </div>
    </div>
  );
}
