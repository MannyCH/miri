import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Check } from 'react-feather';
import { Button } from '../../components/Button/Button';
import { FormField } from '../../components/FormField/FormField';
import './AuthModulesView.css';

export default {
  title: 'Patterns/Auth Modules',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Auth module structures documented from the finalized Figma auth components.

Includes:
- Sign in module
- Sign up module
- Verify email module
- Reset password module
        `,
      },
    },
  },
  tags: ['autodocs'],
};

const Card = ({ children, centered = false, moduleClassName = '' }) => (
  <section className={`auth-modules-card${centered ? ' auth-modules-card-centered' : ''} ${moduleClassName}`.trim()}>
    {children}
  </section>
);

export const SignInModule = {
  render: () => (
    <Card moduleClassName="auth-modules-sign-in">
      <h1 className="auth-modules-title text-h2-bold">Log in to Miri</h1>

      <form className="auth-modules-form">
        <FormField label="Email" variant="filled">
          <input className="text-body-regular" type="email" value="laura@anicelydone.club" readOnly />
        </FormField>
        <FormField label="Password" variant="filled">
          <input className="text-body-regular" type="password" value="••••••••••••••••" readOnly />
          <span className="auth-modules-inline-link text-tiny-regular">Forgot password?</span>
        </FormField>
        <div className="auth-modules-button-row">
          <Button variant="primary" showIcon={false}>Continue</Button>
        </div>
        <p className="auth-modules-footer-copy text-body-small-regular">
          Don&apos;t have an account? <span className="auth-modules-footer-link text-body-small-bold-underlined">Sign up</span>
        </p>
      </form>
    </Card>
  ),
};

export const SignUpModule = {
  render: () => (
    <Card moduleClassName="auth-modules-sign-up">
      <h1 className="auth-modules-title text-h2-bold">Create your account</h1>
      <p className="auth-modules-subtitle text-body-regular">Start planning meals with Miri.</p>

      <form className="auth-modules-form">
        <FormField label="First name" variant="filled">
          <input className="text-body-regular" type="text" value="Laura" readOnly />
        </FormField>
        <FormField label="Email" variant="filled">
          <input className="text-body-regular" type="email" value="laura@nicelydone.club" readOnly />
        </FormField>
        <FormField label="Password" variant="filled">
          <input className="text-body-regular" type="password" value="••••••••••••••••" readOnly />
        </FormField>
        <div className="auth-modules-button-row">
          <Button variant="primary" showIcon={false}>Create Account</Button>
        </div>
      </form>
      <p className="auth-modules-footer-copy text-body-small-regular">
        Already have an account? <span className="auth-modules-footer-link text-body-small-bold-underlined">Log in</span>
      </p>
    </Card>
  ),
};

export const VerifyEmailModule = {
  render: () => (
    <Card moduleClassName="auth-modules-verify">
      <h1 className="auth-modules-title text-h2-bold">Check your email</h1>
      <p className="auth-modules-verify-subtitle text-body-small-regular">
        Enter the login code sent to:<br />
        laura@nicelydone.club
      </p>

      <form className="auth-modules-form auth-modules-verify-form">
          <div className="auth-modules-code-group" role="group" aria-label="Verification code">
            {Array.from({ length: 6 }).map((_, index) => (
              <input key={index} className="auth-modules-code-input text-body-regular" value="" readOnly />
            ))}
          </div>
          <div className="auth-modules-button-row">
            <Button variant="primary" showIcon={false}>Continue</Button>
          </div>
        <span className="auth-modules-back-link text-body-small-bold-underlined">Back to login</span>
      </form>
    </Card>
  ),
};

export const VerifyEmailSuccess = {
  render: () => (
    <Card moduleClassName="auth-modules-verify">
      <h1 className="auth-modules-title text-h2-bold">Check your email</h1>
      <p className="auth-modules-verify-subtitle text-body-small-regular">
        Enter the login code sent to:<br />
        laura@nicelydone.club
      </p>
      <form className="auth-modules-form auth-modules-verify-form">
        <div className="auth-modules-code-group" role="group" aria-label="Verification code">
          {Array.from({ length: 6 }).map((_, index) => (
            <input key={index} className="auth-modules-code-input text-body-regular" value="4" readOnly />
          ))}
        </div>
        <div className="auth-modules-button-row">
          <Button
            variant="primary"
            showIcon
            icon={<motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}><Check size={18} /></motion.span>}
          >
            Verified
          </Button>
        </div>
        <span className="auth-modules-back-link text-body-small-bold-underlined">Back to login</span>
      </form>
    </Card>
  ),
};

export const VerifyEmailError = {
  render: () => (
    <Card moduleClassName="auth-modules-verify">
      <h1 className="auth-modules-title text-h2-bold">Check your email</h1>
      <p className="auth-modules-verify-subtitle text-body-small-regular">
        Enter the login code sent to:<br />
        laura@nicelydone.club
      </p>
      <form className="auth-modules-form auth-modules-verify-form">
        <div className="auth-modules-code-group" role="group" aria-label="Verification code">
          {Array.from({ length: 6 }).map((_, index) => (
            <input key={index} className="auth-modules-code-input text-body-regular" value="4" readOnly />
          ))}
        </div>
        <div className="auth-modules-button-row">
          <Button
            variant="primary"
            showIcon
            icon={<motion.span initial={{ rotate: -12, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}><AlertTriangle size={18} /></motion.span>}
          >
            Wrong code
          </Button>
        </div>
        <span className="auth-modules-back-link text-body-small-bold-underlined">Back to login</span>
      </form>
    </Card>
  ),
};

export const ForgotPasswordModule = {
  render: () => (
    <Card moduleClassName="auth-modules-forgot">
      <h1 className="auth-modules-title text-h2-bold">Forgot password</h1>
      <p className="auth-modules-subtitle text-body-regular">We&apos;ll send a reset link to your email.</p>
      <form className="auth-modules-form">
        <FormField label="Email" variant="filled">
          <input className="text-body-regular" type="email" value="laura@anicelydone.club" readOnly />
        </FormField>
        <div className="auth-modules-button-row">
          <Button variant="primary" showIcon={false}>Send reset mail</Button>
        </div>
      </form>
    </Card>
  ),
};

export const ForgotPasswordSuccess = {
  render: () => (
    <Card moduleClassName="auth-modules-forgot">
      <h1 className="auth-modules-title text-h2-bold">Forgot password</h1>
      <p className="auth-modules-subtitle text-body-regular">We&apos;ll send a reset link to your email.</p>
      <form className="auth-modules-form">
        <FormField label="Email" variant="filled">
          <input className="text-body-regular" type="email" value="laura@anicelydone.club" readOnly />
        </FormField>
        <div className="auth-modules-button-row">
          <Button
            variant="primary"
            showIcon
            icon={<motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}><Check size={18} /></motion.span>}
          >
            Sent
          </Button>
        </div>
      </form>
    </Card>
  ),
};

export const ResetPasswordModule = {
  render: () => (
    <Card moduleClassName="auth-modules-reset">
      <h1 className="auth-modules-title text-h2-bold">Reset password</h1>
      <p className="auth-modules-subtitle text-body-regular">Create a new password to continue.</p>

      <form className="auth-modules-form">
        <FormField label="New password" variant="filled">
          <input className="text-body-regular" type="password" value="••••••••••••••••" readOnly />
        </FormField>
        <FormField label="Retype password" variant="filled">
          <input className="text-body-regular" type="password" value="••••••••••••••••" readOnly />
        </FormField>
        <div className="auth-modules-button-row">
          <Button variant="primary" showIcon={false}>Update Password</Button>
        </div>
      </form>
    </Card>
  ),
};
