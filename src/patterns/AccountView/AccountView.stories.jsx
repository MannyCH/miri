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
        component: `
Full-screen account page where users view their profile and adjust meal planning preferences. Represents the \`/account\` route.

## When to use
Use for the \`/account\` route only. This is the destination when the user taps the account tab in the NavigationBar.

## Composed of
- **AccountCard** — displays user name, email, and account actions (logout, change password, delete account)
- **SettingsSection** — groups related preference controls with a section title
- **Stepper** — numeric control for serving size (how many people to cook for)
- **SelectField** — dropdown selectors for eating style, goal, and cooking frequency
- **UnitField** — numeric input with unit label for metabolic basal rate (kcal)
- **BmrCalculatorCard** — optional inline calculator to derive BMR from biometrics
- **NavigationBar** — bottom tab bar with "account" tab active

## Key props
This pattern has no external props — it is a self-contained template that manages its own local state. All preference changes are local to the story; in the app they are persisted via PreferencesContext to Neon Postgres.
        `,
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

const COOKING_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Cook fresh daily' },
  { value: 'few-times', label: 'A few times a week' },
  { value: 'minimal', label: 'Minimal cooking' },
];

function AccountViewTemplate() {
  const [servings, setServings] = useState(2);
  const [eatingStyle, setEatingStyle] = useState('');
  const [goal, setGoal] = useState('');
  const [cookingFrequency, setCookingFrequency] = useState('daily');
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
          <SelectField
            label="How often do you cook?"
            options={COOKING_FREQUENCY_OPTIONS}
            value={cookingFrequency}
            onChange={setCookingFrequency}
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
  parameters: {
    docs: {
      description: {
        story: 'Blank state — all preference dropdowns unset, serving size at the default of 2. Represents a newly registered user who has not yet configured their settings.',
      },
    },
  },
  render: () => <AccountViewTemplate />,
};

export const WithValues = {
  parameters: {
    docs: {
      description: {
        story: 'Populated state — all preferences filled in (4 servings, plant-forward diet, lose-weight goal, cooks a few times a week, BMR set to 1600 kcal). Represents a returning user who completed onboarding.',
      },
    },
  },
  render: () => {
    const [servings, setServings] = useState(4);
    const [eatingStyle, setEatingStyle] = useState('plant-forward');
    const [goal, setGoal] = useState('lose-weight');
    const [cookingFrequency, setCookingFrequency] = useState('few-times');
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
            <SelectField
              label="How often do you cook?"
              options={COOKING_FREQUENCY_OPTIONS}
              value={cookingFrequency}
              onChange={setCookingFrequency}
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
