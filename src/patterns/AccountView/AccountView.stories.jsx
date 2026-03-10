import React, { useState } from 'react';
import { AccountCard } from '../../components/AccountCard/AccountCard';
import { SettingsSection } from '../../components/SettingsSection/SettingsSection';
import { Stepper } from '../../components/Stepper/Stepper';
import { SelectField } from '../../components/SelectField/SelectField';
import { UnitField } from '../../components/UnitField/UnitField';
import { BmrCalculatorCard } from '../../components/BmrCalculatorCard/BmrCalculatorCard';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import './AccountView.css';

export default {
  title: 'Patterns/AccountView',
  parameters: {
    docs: {
      description: {
        component:
          'Full account page pattern. Composed of AccountCard, SettingsSection, Stepper, SelectField, and UnitField components. Shows user info and editable settings.',
      },
    },
    layout: 'fullscreen',
  },
};

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

function AccountViewTemplate() {
  const [servings, setServings] = useState(2);
  const [eatingStyle, setEatingStyle] = useState('');
  const [goal, setGoal] = useState('');
  const [bmr, setBmr] = useState('');

  return (
    <main className="account-view">
      <div className="account-view-content">
        <h1 className="text-h1-bold account-view-header">Account</h1>

        <AccountCard
          name="Mani"
          email="mani.rohri@hotmail.com"
          onLogOut={() => {}}
          onChangeUserDetails={() => {}}
          onChangePassword={() => {}}
          onDeleteAccount={() => {}}
        />

        <h2 className="text-h4-regular account-view-settings-title">Settings</h2>

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

      <div className="account-view-navigation">
        <NavigationBar activeItem="account" />
      </div>
    </main>
  );
}

export const Default = {
  render: () => <AccountViewTemplate />,
};

export const WithValues = {
  render: () => {
    const [servings, setServings] = useState(4);
    const [eatingStyle, setEatingStyle] = useState('plant-forward');
    const [goal, setGoal] = useState('lose-weight');
    const [bmr, setBmr] = useState('1600');

    return (
      <main className="account-view">
        <div className="account-view-content">
          <h1 className="text-h1-bold account-view-header">Account</h1>

          <AccountCard
            name="Mani"
            email="mani.rohri@hotmail.com"
            onLogOut={() => {}}
            onChangeUserDetails={() => {}}
            onChangePassword={() => {}}
            onDeleteAccount={() => {}}
          />

          <h2 className="text-h4-regular account-view-settings-title">Settings</h2>

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

        <div className="account-view-navigation">
          <NavigationBar activeItem="account" />
        </div>
      </main>
    );
  },
};
