import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Check, Circle } from 'react-feather';
import { Button } from '../../components/Button/Button';
import { TextField } from '../../components/TextField/TextField';
import './AuthModulesView.css';

export default {
  title: 'Patterns/Auth Modules',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Auth screen modules — the centered card layouts that make up the \`/auth\` route. Each story represents one step of the authentication flow.

## When to use
Use these modules for the \`/auth\` route. They are rendered inside the full-screen auth page and centred on screen. Do not embed them inside other views.

## When NOT to use
Do not use these modules for in-app settings flows (e.g. changing password from the Account view). These modules are entry-point screens for unauthenticated users only.

## Composed of
- **TextField** — email, password, and new-password inputs
- **Button** — primary CTA (Log in, Create Account, Continue, Send reset mail, Update Password)
- **OTP code inputs** — six individual character inputs for the verify-email step (pattern-scoped, not a shared component)
- **ProgressDots / password requirement list** — inline status feedback (pattern-scoped)

## Key props
Each module is a self-contained render story with no external props. In the live app they are wired to Neon Auth via the \`AuthContext\` and react to async states (loading, error, success) by updating button icon/label using \`motion/react\` animations.
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
  parameters: {
    docs: {
      description: {
        story: 'Default login state — email and password fields filled, ready to submit. Represents a returning user landing on /auth.',
      },
    },
  },
  render: () => (
    <Card moduleClassName="auth-modules-sign-in">
      <h1 className="auth-modules-title text-h2-bold">Log in to Miri</h1>

      <form className="auth-modules-form">
        <TextField
          label="Email"
          type="email"
          value="laura@anicelydone.club"
          onChange={() => {}}
        />
        <TextField
          label="Password"
          type="password"
          value="correcthorsebatterystaple"
          onChange={() => {}}
        />
        <div className="auth-modules-button-row">
          <Button variant="primary" showIcon={false}>Log in</Button>
        </div>
        <p className="auth-modules-footer-copy text-body-small-regular">
          Don&apos;t have an account? <span className="auth-modules-footer-link text-body-small-bold-underlined">Sign up</span>
        </p>
      </form>
    </Card>
  ),
};

export const SignUpModule = {
  parameters: {
    docs: {
      description: {
        story: 'New account creation form — first name, email, password fields with inline password-strength requirements. Represents a first-time user signing up.',
      },
    },
  },
  render: () => (
    <Card moduleClassName="auth-modules-sign-up">
      <h1 className="auth-modules-title text-h2-bold">Create your account</h1>
      <p className="auth-modules-subtitle text-body-regular">Start planning meals with Miri.</p>

      <form className="auth-modules-form">
        <TextField
          label="First name"
          value="Laura"
          onChange={() => {}}
        />
        <TextField
          label="Email"
          type="email"
          value="laura@nicelydone.club"
          onChange={() => {}}
        />
        <TextField
          label="Password"
          type="password"
          value="correcthorsebatterystaple"
          onChange={() => {}}
        />
        <ul className="auth-modules-password-requirements" aria-live="polite">
          <li className="auth-modules-password-requirement">
            <Circle size={14} aria-hidden="true" />
            <span className="text-body-small-regular">at least 8 characters</span>
          </li>
          <li className="auth-modules-password-requirement">
            <Circle size={14} aria-hidden="true" />
            <span className="text-body-small-regular">at least 1 number</span>
          </li>
          <li className="auth-modules-password-requirement">
            <Circle size={14} aria-hidden="true" />
            <span className="text-body-small-regular">at least 1 uppercase letter</span>
          </li>
          <li className="auth-modules-password-requirement">
            <Circle size={14} aria-hidden="true" />
            <span className="text-body-small-regular">at least 1 special sign</span>
          </li>
        </ul>
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
  parameters: {
    docs: {
      description: {
        story: 'OTP entry state — six empty code input boxes, awaiting the verification code sent to the user\'s email. Shown immediately after sign-up or when email verification is required.',
      },
    },
  },
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
        <div className="auth-modules-verify-actions">
          <Button variant="primary" showIcon={false}>Continue</Button>
          <p className="auth-modules-footer-copy text-body-small-regular">
            Code not received? <span className="auth-modules-footer-link text-body-small-bold-underlined">Resend code</span>
          </p>
        </div>
        <span className="auth-modules-back-link text-body-small-bold-underlined">Back to login</span>
      </form>
    </Card>
  ),
};

export const VerifyEmailSuccess = {
  parameters: {
    docs: {
      description: {
        story: 'OTP verified — all six boxes filled, Continue button shows a checkmark animation and "Verified" label. Represents a successful code entry before redirect.',
      },
    },
  },
  render: () => (
    <Card moduleClassName="auth-modules-verify">
      <h1 className="auth-modules-title text-h2-bold">Check your email</h1>
      <p className="auth-modules-verify-subtitle text-body-small-regular">
        Enter the login code sent to:<br />
        laura@nicelydone.club
      </p>
      <p className="auth-modules-verify-subtitle text-body-small-regular">
        Account already exists. Please verify your email.
      </p>
      <form className="auth-modules-form auth-modules-verify-form">
        <div className="auth-modules-code-group" role="group" aria-label="Verification code">
          {Array.from({ length: 6 }).map((_, index) => (
            <input key={index} className="auth-modules-code-input text-body-regular" value="4" readOnly />
          ))}
        </div>
        <div className="auth-modules-verify-actions">
          <Button
            variant="primary"
            showIcon
            icon={<motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}><Check size={18} /></motion.span>}
          >
            Verified
          </Button>
          <p className="auth-modules-success-message text-body-small-bold">
            <Check size={16} />
            <span>Code resent</span>
          </p>
        </div>
        <span className="auth-modules-back-link text-body-small-bold-underlined">Back to login</span>
      </form>
    </Card>
  ),
};

export const VerifyEmailError = {
  parameters: {
    docs: {
      description: {
        story: 'Invalid OTP — six boxes filled with a wrong code, Continue button shows a warning icon and "Wrong code" label. Represents the error state after a failed verification attempt.',
      },
    },
  },
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
        <div className="auth-modules-verify-actions">
          <Button
            variant="primary"
            showIcon
            icon={<motion.span initial={{ rotate: -12, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}><AlertTriangle size={18} /></motion.span>}
          >
            Wrong code
          </Button>
          <p className="auth-modules-footer-copy text-body-small-regular">
            Code not received? <span className="auth-modules-footer-link text-body-small-bold-underlined">Resend code</span>
          </p>
        </div>
        <span className="auth-modules-back-link text-body-small-bold-underlined">Back to login</span>
      </form>
    </Card>
  ),
};

export const ForgotPasswordModule = {
  parameters: {
    docs: {
      description: {
        story: 'Forgot password default state — email pre-filled, "Send reset mail" CTA ready. Reached via the "Forgot password" link on the login module.',
      },
    },
  },
  render: () => (
    <Card moduleClassName="auth-modules-forgot">
      <h1 className="auth-modules-title text-h2-bold">Forgot password</h1>
      <p className="auth-modules-subtitle text-body-regular">We&apos;ll send a reset link to your email.</p>
      <form className="auth-modules-form">
        <TextField
          label="Email"
          type="email"
          value="laura@anicelydone.club"
          onChange={() => {}}
        />
        <div className="auth-modules-button-row">
          <Button variant="primary" showIcon={false}>Send reset mail</Button>
        </div>
      </form>
    </Card>
  ),
};

export const ForgotPasswordSuccess = {
  parameters: {
    docs: {
      description: {
        story: 'Reset email sent — button transitions to "Sent" with a checkmark animation. Represents the state after the user successfully requests a password reset link.',
      },
    },
  },
  render: () => (
    <Card moduleClassName="auth-modules-forgot">
      <h1 className="auth-modules-title text-h2-bold">Forgot password</h1>
      <p className="auth-modules-subtitle text-body-regular">We&apos;ll send a reset link to your email.</p>
      <form className="auth-modules-form">
        <TextField
          label="Email"
          type="email"
          value="laura@anicelydone.club"
          onChange={() => {}}
        />
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
  parameters: {
    docs: {
      description: {
        story: 'New password entry — two password fields (new + retype) for completing a password reset. Reached via the reset link emailed to the user.',
      },
    },
  },
  render: () => (
    <Card moduleClassName="auth-modules-reset">
      <h1 className="auth-modules-title text-h2-bold">Reset password</h1>
      <p className="auth-modules-subtitle text-body-regular">Create a new password to continue.</p>

      <form className="auth-modules-form">
        <TextField
          label="New password"
          type="password"
          value="correcthorsebatterystaple"
          onChange={() => {}}
        />
        <TextField
          label="Retype password"
          type="password"
          value="correcthorsebatterystaple"
          onChange={() => {}}
        />
        <div className="auth-modules-button-row">
          <Button variant="primary" showIcon={false}>Update Password</Button>
        </div>
      </form>
    </Card>
  ),
};
