import { FC, useState } from 'react';
import { IBookingTemplate } from '../../../types';
import styles from './SmartTemplates.module.css';

interface SmartTemplatesProps {
  templates: IBookingTemplate[];
  onUseTemplate: (template: IBookingTemplate) => void;
  onCreateTemplate: () => void;
  onEditTemplate: (template: IBookingTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
}

export const SmartTemplates: FC<SmartTemplatesProps> = ({
  templates,
  onUseTemplate,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate
}) => {
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const getServiceBadgeStyle = (serviceLevel: string) => {
    switch (serviceLevel) {
      case 'essential':
        return { background: '#00D4FF', color: 'white' };
      case 'executive':
        return { background: '#FFD700', color: '#1a1a2e' };
      case 'shadow':
        return { background: '#FF6B6B', color: 'white' };
      default:
        return { background: '#A0A0A0', color: 'white' };
    }
  };

  const formatServiceLevel = (level: string) => {
    switch (level) {
      case 'essential': return 'Essential Protection';
      case 'executive': return 'Executive Shield';
      case 'shadow': return 'Shadow Protocol';
      default: return level;
    }
  };

  const toggleExpanded = (templateId: string) => {
    setExpandedTemplate(expandedTemplate === templateId ? null : templateId);
  };

  return (
    <div className={styles.smartTemplates}>
      <div className={styles.templatesHeader}>
        <h3 className={styles.templatesTitle}>Your Frequent Routes</h3>
        <button
          className={styles.createButton}
          onClick={onCreateTemplate}
          aria-label="Create new protection template"
        >
          <span className={styles.createIcon}>➕</span>
          <span className={styles.createText}>Save New Route</span>
        </button>
      </div>

      {templates.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📍</div>
          <h4 className={styles.emptyTitle}>No Saved Routes Yet</h4>
          <p className={styles.emptyDescription}>
            Save your frequent protection journeys for quick one-tap requests
          </p>
          <button className={styles.emptyAction} onClick={onCreateTemplate}>
            Save Your First Route
          </button>
        </div>
      ) : (
        <div className={styles.templatesList}>
          {templates.map((template) => (
            <div
              key={template.id}
              className={`${styles.templateCard} ${template.isDefault ? styles.defaultTemplate : ''}`}
            >
              <div className={styles.templateHeader}>
                <div className={styles.templateInfo}>
                  <h4 className={styles.templateName}>{template.name}</h4>
                  <div className={styles.templateRoute}>
                    <span className={styles.routeLocation}>{template.route.from}</span>
                    <span className={styles.routeArrow}>→</span>
                    <span className={styles.routeLocation}>{template.route.to}</span>
                  </div>
                </div>

                <div className={styles.templateMeta}>
                  <div
                    className={styles.serviceBadge}
                    style={getServiceBadgeStyle(template.serviceLevel)}
                  >
                    {formatServiceLevel(template.serviceLevel)}
                  </div>
                  {template.isDefault && (
                    <div className={styles.defaultBadge}>Default</div>
                  )}
                </div>
              </div>

              <div className={styles.templateStats}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>🔄</span>
                  <span className={styles.statText}>Used {template.usageCount} times</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>📅</span>
                  <span className={styles.statText}>
                    Last used {new Date(template.lastUsed).toLocaleDateString()}
                  </span>
                </div>
                {template.preferredOfficer && (
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>👤</span>
                    <span className={styles.statText}>Officer: {template.preferredOfficer}</span>
                  </div>
                )}
              </div>

              {expandedTemplate === template.id && (
                <div className={styles.templateDetails}>
                  <div className={styles.detailsGrid}>
                    {template.route.estimatedDistance && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Distance</span>
                        <span className={styles.detailValue}>
                          {template.route.estimatedDistance} miles
                        </span>
                      </div>
                    )}
                    {template.route.estimatedDuration && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Duration</span>
                        <span className={styles.detailValue}>
                          {template.route.estimatedDuration} minutes
                        </span>
                      </div>
                    )}
                    {template.recurringPattern && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Pattern</span>
                        <span className={styles.detailValue}>{template.recurringPattern}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.templateActions}>
                <button
                  className={styles.primaryAction}
                  onClick={() => onUseTemplate(template)}
                  aria-label={`Request protection using ${template.name} template`}
                >
                  <span className={styles.actionIcon}>🛡️</span>
                  <span className={styles.actionText}>Request Protection</span>
                </button>

                <button
                  className={styles.secondaryAction}
                  onClick={() => toggleExpanded(template.id)}
                  aria-label={expandedTemplate === template.id ? 'Hide details' : 'Show details'}
                >
                  <span className={styles.actionIcon}>
                    {expandedTemplate === template.id ? '🔼' : '🔽'}
                  </span>
                  <span className={styles.actionText}>Details</span>
                </button>

                <button
                  className={styles.secondaryAction}
                  onClick={() => onEditTemplate(template)}
                  aria-label={`Edit ${template.name} template`}
                >
                  <span className={styles.actionIcon}>✏️</span>
                  <span className={styles.actionText}>Edit</span>
                </button>

                <button
                  className={styles.deleteAction}
                  onClick={() => onDeleteTemplate(template.id)}
                  aria-label={`Delete ${template.name} template`}
                >
                  <span className={styles.actionIcon}>🗑️</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};