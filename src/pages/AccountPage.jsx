import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
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
  const [servings, setServings] = useState(2);
  const [eatingStyle, setEatingStyle] = useState('');
  const [goal, setGoal] = useState('');
  const [bmr, setBmr] = useState('');

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
            value={servings}
            min={1}
            max={20}
            onChange={setServings}
          />
          <SelectField
            label="How do you like to eat?"
            options={EATING_OPTIONS}
            value={eatingStyle}
            onChange={setEatingStyle}
          />
          <SelectField
            label="What's your goal?"
            options={GOAL_OPTIONS}
            value={goal}
            onChange={setGoal}
          />
        </SettingsSection>

        <SettingsSection title="Advanced - Health" spacing="section">
          <UnitField
            label="Metabolic basal rate"
            unit="kcal"
            value={bmr}
            onChange={setBmr}
            min={0}
            step={10}
          />
          <BmrCalculatorCard
            onSave={({ bmr: calculated }) => setBmr(String(calculated ?? ''))}
          />
        </SettingsSection>
      </div>

      <div className="account-page-navigation">
        <NavigationBarConnected activeItem="account" />
      </div>
    </main>
  );
}
