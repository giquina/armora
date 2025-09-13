import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../UI/Button';
import styles from './Support.module.css';

export function Support() {
  const { state } = useApp();
  const { user } = state;
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supportTopics = [
    { id: 'emergency', label: '🚨 Emergency Assistance', description: 'Urgent safety or security concerns' },
    { id: 'booking', label: '📅 Booking Support', description: 'Help with rides and reservations' },
    { id: 'payment', label: '💳 Payment & Billing', description: 'Issues with charges or payments' },
    { id: 'driver', label: '👤 Driver Feedback', description: 'Report driver issues or compliments' },
    { id: 'technical', label: '🔧 Technical Issues', description: 'App problems or bugs' },
    { id: 'safety', label: '🛡️ Safety Resources', description: 'Safety tips and guidelines' }
  ];

  const handleEmergency = () => {
    // In a real app, this would trigger emergency protocols
    window.open('tel:999', '_self');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopic && message.trim()) {
      // In a real app, this would send the message to support
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedTopic('');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className={styles.support}>
      {/* Emergency Section */}
      <div className={styles.emergencySection}>
        <div className={styles.emergencyCard}>
          <h2 className={styles.emergencyTitle}>
            🚨 Emergency Assistance
          </h2>
          <p className={styles.emergencyText}>
            If you're in immediate danger or need urgent help, contact emergency services immediately.
          </p>
          <div className={styles.emergencyButtons}>
            <Button 
              variant="danger" 
              size="lg" 
              onClick={handleEmergency}
              className={styles.emergencyButton}
            >
              📞 Call 999
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('sms:999', '_self')}
              className={styles.emergencyButton}
            >
              💬 Text 999
            </Button>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className={styles.userInfo}>
        <h1 className={styles.title}>Support Center</h1>
        {user && (
          <p className={styles.welcomeText}>
            Hello {user.name || user.email}, how can we help you today?
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <button className={styles.actionCard} onClick={() => setSelectedTopic('booking')}>
            <div className={styles.actionIcon}>📞</div>
            <div className={styles.actionContent}>
              <h3>Live Chat</h3>
              <p>Chat with support team</p>
            </div>
          </button>
          
          <button className={styles.actionCard} onClick={() => window.open('tel:+442087654321', '_self')}>
            <div className={styles.actionIcon}>☎️</div>
            <div className={styles.actionContent}>
              <h3>Call Support</h3>
              <p>+44 208 765 4321</p>
            </div>
          </button>

          <button className={styles.actionCard} onClick={() => setSelectedTopic('safety')}>
            <div className={styles.actionIcon}>🛡️</div>
            <div className={styles.actionContent}>
              <h3>Safety Resources</h3>
              <p>Tips and guidelines</p>
            </div>
          </button>

          <button className={styles.actionCard} onClick={() => setSelectedTopic('technical')}>
            <div className={styles.actionIcon}>❓</div>
            <div className={styles.actionContent}>
              <h3>FAQ</h3>
              <p>Common questions</p>
            </div>
          </button>
        </div>
      </div>

      {/* Support Form */}
      <div className={styles.supportForm}>
        <h2 className={styles.sectionTitle}>Contact Support</h2>
        
        {isSubmitted ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <h3>Message Sent Successfully</h3>
            <p>We'll get back to you within 2 hours during business hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>What can we help you with?</label>
              <div className={styles.topicGrid}>
                {supportTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className={`${styles.topicCard} ${selectedTopic === topic.id ? styles.topicCardSelected : ''}`}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <div className={styles.topicLabel}>{topic.label}</div>
                    <div className={styles.topicDescription}>{topic.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question..."
                className={styles.textarea}
                rows={4}
                required
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={!selectedTopic || !message.trim()}
              isFullWidth
            >
              Send Message
            </Button>
          </form>
        )}
      </div>

      {/* Additional Resources */}
      <div className={styles.resources}>
        <h2 className={styles.sectionTitle}>Additional Resources</h2>
        <div className={styles.resourceList}>
          <div className={styles.resourceItem}>
            <h3>📋 Service Standards</h3>
            <p>Learn about our security protocols and service levels</p>
          </div>
          <div className={styles.resourceItem}>
            <h3>💰 Pricing & Fees</h3>
            <p>Transparent pricing for all our security transport services</p>
          </div>
          <div className={styles.resourceItem}>
            <h3>🔒 Privacy Policy</h3>
            <p>How we protect your personal and travel information</p>
          </div>
        </div>
      </div>
    </div>
  );
}