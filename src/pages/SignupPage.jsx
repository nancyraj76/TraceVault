import { useState } from 'react'
import { ArrowRight, Check, Circle, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthField from '../components/AuthField.jsx'
import AuthPageFrame from '../components/AuthPageFrame.jsx'
import {
  getConfirmPasswordError,
  getEmailError,
  getFullNameError,
  getPasswordRequirements,
  getSignupPasswordError,
  normalizeEmail,
} from '../lib/authValidation.js'
import './SignupPage.css'

function SignupPage() {
  const [showPasswords, setShowPasswords] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [feedback, setFeedback] = useState('')
  const passwordRequirements = getPasswordRequirements(password)

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = fullName.trim()
    const trimmedEmail = normalizeEmail(email)
    const nextErrors = {
      fullName: getFullNameError(trimmedName),
      email: getEmailError(trimmedEmail),
      password: getSignupPasswordError(password),
      confirmPassword: getConfirmPasswordError(password, confirmPassword),
      terms: acceptTerms ? '' : 'Accept the Terms and Conditions to continue.',
    }
    setFullName(trimmedName)
    setEmail(trimmedEmail)
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true, terms: true })
    setErrors(nextErrors)
    setFeedback('')

    if (Object.values(nextErrors).some(Boolean)) return

    setFeedback('Demo only: your details passed validation. Account creation is not connected yet.')
  }

  function updateField(name, value, validate) {
    setFeedback('')
    setErrors((current) => ({
      ...current,
      ...(touched[name] || Object.prototype.hasOwnProperty.call(current, name) ? { [name]: validate(value) } : {}),
    }))
  }

  return (
    <AuthPageFrame>
      <div className="auth-form-heading signup-form-heading">
        <span className="auth-form-emblem"><ShieldCheck size={21} strokeWidth={1.7} /></span>
        <p className="auth-eyebrow"><span className="auth-eyebrow-mark" />Create your secure workspace</p>
        <h1>Create your account</h1>
        <p>Start building a clearer record for every piece of evidence.</p>
      </div>

      <form className="auth-form signup-form" noValidate onSubmit={handleSubmit}>
        <AuthField id="signup-name" label="Full name" icon={UserRound} error={touched.fullName ? errors.fullName : ''}>
          <input
            className="auth-input"
            id="signup-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={fullName}
            aria-invalid={Boolean(touched.fullName && errors.fullName)}
            aria-describedby={touched.fullName && errors.fullName ? 'signup-name-error' : undefined}
            onChange={(event) => {
              setFullName(event.target.value)
              updateField('fullName', event.target.value, getFullNameError)
            }}
            onBlur={() => {
              const trimmedName = fullName.trim()
              setFullName(trimmedName)
              setTouched((current) => ({ ...current, fullName: true }))
              setErrors((current) => ({ ...current, fullName: getFullNameError(trimmedName) }))
            }}
          />
        </AuthField>

        <AuthField id="signup-email" label="Email address" icon={Mail} error={touched.email ? errors.email : ''}>
          <input
            className="auth-input"
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@organization.com"
            value={email}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? 'signup-email-error' : undefined}
            onChange={(event) => {
              setEmail(event.target.value)
              updateField('email', event.target.value, getEmailError)
            }}
            onBlur={() => {
              const trimmedEmail = normalizeEmail(email)
              setEmail(trimmedEmail)
              setTouched((current) => ({ ...current, email: true }))
              setErrors((current) => ({ ...current, email: getEmailError(trimmedEmail) }))
            }}
          />
        </AuthField>

        <AuthField id="signup-password" label="Password" icon={LockKeyhole} error={touched.password ? errors.password : ''}>
          <input
            className="auth-input auth-input-password"
            id="signup-password"
            name="password"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            aria-invalid={Boolean(touched.password && errors.password)}
            aria-describedby="signup-password-requirements"
            onChange={(event) => {
              const value = event.target.value
              setPassword(value)
              updateField('password', value, getSignupPasswordError)
              if (touched.confirmPassword || confirmPassword) {
                setErrors((current) => ({ ...current, confirmPassword: getConfirmPasswordError(value, confirmPassword) }))
              }
            }}
            onBlur={() => {
              setTouched((current) => ({ ...current, password: true }))
              setErrors((current) => ({ ...current, password: getSignupPasswordError(password) }))
            }}
          />
          <button
            className="auth-password-toggle"
            type="button"
            aria-label={showPasswords ? 'Hide password' : 'Show password'}
            aria-pressed={showPasswords}
            onClick={() => setShowPasswords((visible) => !visible)}
          >
            {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </AuthField>

        <ul className="password-requirements" id="signup-password-requirements" aria-label="Password requirements" aria-live="polite">
          {passwordRequirements.map((requirement) => (
            <li className={requirement.met ? 'is-met' : ''} key={requirement.key}>
              <span aria-hidden="true">{requirement.met ? <Check size={12} strokeWidth={2.5} /> : <Circle size={9} strokeWidth={2} />}</span>
              {requirement.label}
            </li>
          ))}
        </ul>

        <AuthField
          id="signup-confirm-password"
          label="Confirm password"
          icon={LockKeyhole}
          error={touched.confirmPassword ? errors.confirmPassword : ''}
        >
          <input
            className="auth-input auth-input-password"
            id="signup-confirm-password"
            name="confirmPassword"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Enter your password again"
            value={confirmPassword}
            aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
            aria-describedby={touched.confirmPassword && errors.confirmPassword ? 'signup-confirm-password-error' : undefined}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              updateField('confirmPassword', event.target.value, (value) => getConfirmPasswordError(password, value))
            }}
            onBlur={() => {
              setTouched((current) => ({ ...current, confirmPassword: true }))
              setErrors((current) => ({
                ...current,
                confirmPassword: getConfirmPasswordError(password, confirmPassword),
              }))
            }}
          />
          <button
            className="auth-password-toggle"
            type="button"
            aria-label={showPasswords ? 'Hide confirm password' : 'Show confirm password'}
            aria-pressed={showPasswords}
            onClick={() => setShowPasswords((visible) => !visible)}
          >
            {showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </AuthField>

        <div className="signup-terms-wrap">
          <label className="auth-checkbox-label signup-terms" htmlFor="accept-terms">
            <input
              className="auth-checkbox"
              id="accept-terms"
              name="acceptTerms"
              type="checkbox"
              checked={acceptTerms}
              aria-invalid={Boolean(touched.terms && errors.terms)}
              aria-describedby={touched.terms && errors.terms ? 'signup-terms-error' : undefined}
              onChange={(event) => {
                const checked = event.target.checked
                setAcceptTerms(checked)
                setTouched((current) => ({ ...current, terms: true }))
                setErrors((current) => ({ ...current, terms: checked ? '' : 'Accept the Terms and Conditions to continue.' }))
                setFeedback('')
              }}
            />
            <span>I agree to the Terms and Conditions.</span>
          </label>
          {touched.terms && errors.terms && <span className="auth-field-error" id="signup-terms-error" role="alert">{errors.terms}</span>}
        </div>

        <button className="auth-submit" type="submit">Create Account <ArrowRight size={17} /></button>
        {feedback && <p className="auth-status" role="status">{feedback}</p>}
      </form>

      <p className="auth-form-switch">Already have an account? <Link to="/login">Login</Link></p>
    </AuthPageFrame>
  )
}

export default SignupPage
