import React from 'react';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { AccountCard } from '../components/AccountCard/AccountCard';
import { SettingsSection } from '../components/SettingsSection/SettingsSection';
import { Stepper } from '../components/Stepper/Stepper';
import { SelectField } from '../components/SelectField/SelectField';
import { UnitField } from '../components/UnitField/UnitField';
import { BmrCalculatorCard } from '../components/BmrCalculatorCard/BmrCalculatorCard';
import { NavigationBarConnected } from '../components/NavigationBar/NavigationBarConnected';
import './AccountPage.css';

const EATING_OPTIONS = [
  { value: 'no-preference', label: 'No preference' },
  { value: 'plant-forward', label: 'Plant-forward' },
  { value: 'high-protein', label: 'High protein' },
  { value: 'intermittent-fasting', label: 'Intermittent fasting' },
  { value: 'mediterranean', label: 'Mediterranean' },
];

const GOAL_OPTIONS = [
  { value: 'lose-weight', label: 'Lose weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain-muscle', label: 'Gain muscle' },
  { value: 'eat-healthier', label: 'Eat healthier' },
];

export function AccountPage() {
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences, isLoading } = usePreferences();

  return (
    <main className="account-page">
      <div className="account-page-content">
        <h1 className="text-h1-bold account-page-header">Account</h1>

        <AccountCard
          name={user?.name || user?.email}
          email={user?.email}
          onLogOut={signOut}
          onChangeUserDetails={() => {}}
          onChangePassword={() => {}}
          onDeleteAccount={() => {}}
        />

        <h2 className="text-h4-regular account-page-settings-title">Settings</h2>

        <SettingsSection title="Eating preferences">
          <Stepper
            label="How many people are you usually cooking for?"
            value={preferences.servings}
            min={1}
            max={20}
            onChange={(servings) => updatePreferences({ servings })}
            disabled={isLoading}
          />
          <SelectField
            label="How do you like to eat?"
            options={EATING_OPTIONS}
            value={preferences.eatingStyle}
            onChange={(eatingStyle) => updatePreferences({ eatingStyle })}
            disabled={isLoading}
          />
          <SelectField
            label="What's your goal?"
            options={GOAL_OPTIONS}
            value={preferences.goal}
            onChange={(goal) => updatePreferences({ goal })}
            disabled={isLoading}
          />
        </SettingsSection>

        <SettingsSection title="Advanced - Health" spacing="section">
          <UnitField
            label="Metabolic basal rate"
            unit="kcal"
            value={preferences.bmr}
            onChange={(bmr) => updatePreferences({ bmr })}
            min={0}
            step={10}
            disabled={isLoading}
          />
          <BmrCalculatorCard
            onSave={({ bmr: calculated }) =>
              updatePreferences({ bmr: String(calculated ?? '') })
            }
          />
        </SettingsSection>
      </div>

      <div className="account-page-navigation">
        <NavigationBarConnected activeItem="account" />
      </div>
    </main>
  );
}
