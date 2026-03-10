import React from 'react';
import './SettingsSection.css';

export function SettingsSection({ title, children }) {
  return (
    <section className="settings-section">
      <div className="settings-section-header">
        <span className="text-body-bold">{title}</span>
      </div>
      <div className="settings-section-content">
        {children}
      </div>
    </section>
  );
}

SettingsSection.displayName = 'SettingsSection';
