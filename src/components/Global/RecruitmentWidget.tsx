import React, { useState } from 'react';
import styles from './RecruitmentWidget.module.css';

export function RecruitmentWidget() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <aside className={styles.widget} role="complementary" aria-label="Recruitment widget">
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Join Our Protection Team</span>
          <span className={styles.badge}>HIRING</span>
        </div>
        <button className={styles.closeBtn} aria-label="Dismiss" onClick={() => setVisible(false)}>×</button>
      </div>
      <div className={styles.content}>
        <div className={styles.perk}>💰 £28–45/hr + fuel</div>
        <div className={styles.perk}>🛡️ SIA license required</div>
        <div className={styles.perk}>🕒 Flexible hours, quick start</div>
        <button
          className={styles.applyBtn}
          onClick={() => window.open('https://armora.security/careers', '_blank')}
          aria-label="Apply to join protection team"
        >
          Apply Now
        </button>
      </div>
    </aside>
  );
}

export default RecruitmentWidget;
