import React from 'react';
import './index.css';

/**
 * Miri - Meal Planning App
 * 
 * This app uses components from Storybook as the single source of truth.
 * All components are built with Base UI for accessibility and flexibility.
 */
function App() {
  return (
    <div className="root">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h1 className="text-h1-bold" style={{ color: 'var(--color-text-strong)', marginBottom: '1rem' }}>
          Miri
        </h1>
        <p className="text-body-regular" style={{ color: 'var(--color-text-weak)', maxWidth: '400px' }}>
          Your meal planning companion. Coming soon.
        </p>
      </div>
    </div>
  );
}

export default App;
