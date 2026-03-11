import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle, ChevronLeft, Circle, X } from 'react-feather';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { usePreferences } from '../context/PreferencesContext';
import { AccountCard } from '../components/AccountCard/AccountCard';
import { SettingsSection } from '../components/SettingsSection/SettingsSection';
import { Stepper } from '../components/Stepper/Stepper';
import { SelectField } from '../components/SelectField/SelectField';
import { UnitField } from '../components/UnitField/UnitField';
import { BmrCalculatorCard } from '../components/BmrCalculatorCard/BmrCalculatorCard';
import { TextField } from '../components/TextField/TextField';
import { Button } from '../components/Button/Button';
import { NavigationBarConnected } from '../components/NavigationBar/NavigationBarConnected';
import './AccountPage.css';

const PASSWORD_HAS_NUMBER_REGEX = /\d/;
const PASSWORD_HAS_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_HAS_SPECIAL_REGEX = /[^A-Za-z0-9]/;

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

const VIEWS = { MAIN: 'main', DETAILS: 'details', PASSWORD: 'password', DELETE: 'delete' };

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%' }),
};

const slideTransition = { type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] };

function SubViewBack({ onBack }) {
  return (
    <div className="account-subview-header">
      <button
        type="button"
        className="account-subview-back-btn"
        onClick={onBack}
        aria-label="Go back"
      >
        <span className="account-subview-back-circle">
          <ChevronLeft size={20} aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}

function UserDetailsView({ user, onBack, onSaveName }) {
  const [name, setName] = useState(user?.name ?? '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      await onSaveName({ name });
      onBack();
    } catch (err) {
      setError(err.message || 'Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="account-subview">
      <SubViewBack onBack={onBack} />
      <div className="account-subview-body">
        <TextField
          label="Name"
          value={name}
          placeholder="Your name"
          onChange={setName}
        />
        <TextField
          label="Email address"
          type="email"
          value={user?.email ?? ''}
          readOnly
          disabled
        />
        <p className="account-subview-note text-body-small-regular">
          Email address cannot be changed at this time.
        </p>
        {error ? <p className="account-subview-error text-body-small-regular">{error}</p> : null}
        <div className="account-subview-actions">
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={onBack} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordView({ onBack, onSave }) {
  const { showToast } = useApp();
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requirementsTouched, setRequirementsTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const checks = {
    minLength: newPassword.length >= 8,
    hasNumber: PASSWORD_HAS_NUMBER_REGEX.test(newPassword),
    hasUppercase: PASSWORD_HAS_UPPERCASE_REGEX.test(newPassword),
    hasSpecial: PASSWORD_HAS_SPECIAL_REGEX.test(newPassword),
  };
  const allChecksMet = Object.values(checks).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword;

  const handleCurrentPasswordBlur = () => {
    if (!currentPassword) {
      setCurrentPasswordError('Enter your current password.');
    } else {
      setCurrentPasswordError('');
    }
  };

  const handleSave = async () => {
    setRequirementsTouched(true);
    setConfirmTouched(true);
    if (!currentPassword) {
      setCurrentPasswordError('Enter your current password.');
      return;
    }
    if (!allChecksMet || !confirmPassword || !passwordsMatch) return;
    setIsSaving(true);
    setError('');
    setCurrentPasswordError('');
    try {
      await onSave({ currentPassword, newPassword });
      showToast('Success', 'Password updated successfully.');
      onBack();
    } catch (err) {
      const msg = err.message || 'Could not change password.';
      const isCurrentPasswordError = /incorrect|invalid|wrong|current password/i.test(msg);
      if (isCurrentPasswordError) {
        setCurrentPasswordError('Incorrect password. Please try again.');
      } else {
        setError(msg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const confirmError = () => {
    if (!confirmTouched) return '';
    if (!confirmPassword) return 'Please confirm your password.';
    if (!passwordsMatch) return 'Passwords do not match.';
    return '';
  };

  return (
    <div className="account-subview">
      <SubViewBack onBack={onBack} />
      <div className="account-subview-body">
        <TextField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(v) => { setCurrentPassword(v); if (currentPasswordError) setCurrentPasswordError(''); }}
          onBlur={handleCurrentPasswordBlur}
          error={currentPasswordError}
          autoComplete="current-password"
        />

        <TextField
          label="New password"
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />

        <TextField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={confirmError()}
          autoComplete="new-password"
        />

        <ul className="account-password-requirements" aria-live="polite">
          {[
            { key: 'minLength', label: 'at least 8 characters' },
            { key: 'hasNumber', label: 'at least 1 number' },
            { key: 'hasUppercase', label: 'at least 1 uppercase letter' },
            { key: 'hasSpecial', label: 'at least 1 special sign' },
          ].map(({ key, label }) => {
            const met = checks[key];
            const hasError = !met && requirementsTouched;
            return (
              <li
                key={key}
                className={`account-password-requirement${met ? ' is-met' : ''}${hasError ? ' is-error' : ''}`}
              >
                {met
                  ? <CheckCircle size={14} aria-hidden="true" />
                  : hasError
                    ? <X size={14} aria-hidden="true" />
                    : <Circle size={14} aria-hidden="true" />}
                <span className={met || hasError ? 'text-body-small-bold' : 'text-body-small-regular'}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        {error ? <p className="account-subview-error text-body-small-regular">{error}</p> : null}
        <div className="account-subview-actions">
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={onBack} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountView({ onBack, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await onDelete();
    } catch (err) {
      setError(err.message || 'Could not delete account.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="account-subview">
      <SubViewBack onBack={onBack} />
      <div className="account-subview-body">
        <p className="text-body-small-regular account-subview-warning">
          This will permanently erase your account and all associated data, including meal plans
          and saved recipes. This action cannot be undone.
        </p>
        {error ? <p className="account-subview-error text-body-small-regular">{error}</p> : null}
        <div className="account-subview-actions">
          <Button variant="tertiary-delete" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting…' : 'Delete account'}
          </Button>
          <Button variant="secondary" onClick={onBack} disabled={isDeleting}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AccountPage() {
  const { user, signOut, updateUser, changePassword, deleteUser } = useAuth();
  const { preferences, updatePreferences, isLoading } = usePreferences();
  const [activeView, setActiveView] = useState(VIEWS.MAIN);
  const [direction, setDirection] = useState(1);

  const navigateTo = (view) => {
    setDirection(1);
    setActiveView(view);
  };

  const navigateBack = () => {
    setDirection(-1);
    setActiveView(VIEWS.MAIN);
  };

  return (
    <main className="account-page">
      <div className="account-page-views">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeView}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="account-page-view"
          >
            {activeView === VIEWS.MAIN && (
              <div className="account-page-content">
                <h1 className="text-h1-bold account-page-header">Account</h1>

                <AccountCard
                  name={user?.name || user?.email}
                  email={user?.email}
                  onLogOut={signOut}
                  onChangeUserDetails={() => navigateTo(VIEWS.DETAILS)}
                  onChangePassword={() => navigateTo(VIEWS.PASSWORD)}
                  onDeleteAccount={() => navigateTo(VIEWS.DELETE)}
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
            )}

            {activeView === VIEWS.DETAILS && (
              <UserDetailsView
                user={user}
                onBack={navigateBack}
                onSaveName={updateUser}
              />
            )}

            {activeView === VIEWS.PASSWORD && (
              <ChangePasswordView onBack={navigateBack} onSave={changePassword} />
            )}

            {activeView === VIEWS.DELETE && (
              <DeleteAccountView onBack={navigateBack} onDelete={deleteUser} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="account-page-navigation">
        <NavigationBarConnected activeItem="account" />
      </div>
    </main>
  );
}
