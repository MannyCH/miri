import React from 'react';
import './SettingsSection.css';

/**
 * spacing="normal"  → header padding-top: 8px  (Figma: Eating preferences section, padding t:8)
 * spacing="section" → header padding-top: 32px (Figma: Advanced - Health section, padding t:32)
 */
export function SettingsSection({ title, children, spacing = 'normal' }) {
  return (
    <section className="settings-section">
      <div className={`settings-section-header settings-section-header--${spacing}`}>
        <span className="text-body-bold">{title}</span>
      </div>
      <div className="settings-section-content">
        {children}
      </div>
    </section>
  );
}

SettingsSection.displayName = 'SettingsSection';
