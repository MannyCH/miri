import React from 'react';
import { Button } from '../../components/Button/Button';
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
        <label className="auth-modules-field">
          <span className="text-body-small-regular">Email</span>
          <input className="text-body-regular" type="email" value="laura@anicelydone.club" readOnly />
        </label>
        <label className="auth-modules-field">
          <span className="text-body-small-regular">Password</span>
          <input className="text-body-regular" type="password" value="••••••••••••••••" readOnly />
          <span className="auth-modules-inline-link text-tiny-regular">Forgot password?</span>
        </label>
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
        <label className="auth-modules-field">
          <span className="text-body-small-regular">Name</span>
          <input className="text-body-regular" type="text" value="Laura" readOnly />
        </label>
        <label className="auth-modules-field">
          <span className="text-body-small-regular">Email</span>
          <input className="text-body-regular" type="email" value="laura@nicelydone.club" readOnly />
        </label>
        <label className="auth-modules-field">
          <span className="text-body-small-regular">Password</span>
          <input className="text-body-regular" type="password" value="••••••••••••••••" readOnly />
        </label>
        <Button variant="primary" showIcon={false}>Create account</Button>
      </form>
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
          <Button variant="primary" showIcon={false}>Continue</Button>
        <span className="auth-modules-back-link text-body-small-bold-underlined">Back to login</span>
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
        <label className="auth-modules-field">
          <span className="text-body-small-regular">New password</span>
          <input className="text-body-regular" type="password" value="••••••••••••••••" readOnly />
        </label>
        <label className="auth-modules-field">
          <span className="text-body-small-regular">Retype password</span>
          <input className="text-body-regular" type="password" value="••••••••••••••••" readOnly />
        </label>
        <Button variant="primary" showIcon={false}>Update password</Button>
      </form>
    </Card>
  ),
};
