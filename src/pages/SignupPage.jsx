import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthField from '../components/AuthField.jsx'
import AuthPageFrame from '../components/AuthPageFrame.jsx'
import './SignupPage.css'

function SignupPage() {
  const [showPasswords, setShowPasswords] = useState(false)
  const [feedback, setFeedback] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')
    const confirmPassword = formData.get('confirmPassword')

    if (password !== confirmPassword) {
      setFeedback('Your passwords do not match. Please check them and try again.')
      return
    }

    setFeedback('Demo only: your details passed validation. Account creation is not connected yet.')
  }

  return (
    <AuthPageFrame>
      <div className="auth-form-heading signup-form-heading">
        <span className="auth-form-emblem"><ShieldCheck size={21} strokeWidth={1.7} /></span>
        <p className="auth-eyebrow"><span className="auth-eyebrow-mark" />Create your secure workspace</p>
        <h1>Create your account</h1>
        <p>Start building a clearer record for every piece of evidence.</p>
      </div>

      <form className="auth-form signup-form" onSubmit={handleSubmit}>
        <AuthField id="signup-name" label="Full name" icon={UserRound}>
          <input
            className="auth-input"
            id="signup-name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            minLength={2}
            required
          />
        </AuthField>

        <AuthField id="signup-email" label="Email address" icon={Mail}>
          <input
            className="auth-input"
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@organization.com"
            required
          />
        </AuthField>

        <AuthField id="signup-password" label="Password" icon={LockKeyhole} hint="Use at least 8 characters.">
          <input
            className="auth-input auth-input-password"
            id="signup-password"
            name="password"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a password"
            minLength={8}
            required
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

        <AuthField id="signup-confirm-password" label="Confirm password" icon={LockKeyhole}>
          <input
            className="auth-input auth-input-password"
            id="signup-confirm-password"
            name="confirmPassword"
            type={showPasswords ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Enter your password again"
            minLength={8}
            required
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

        <label className="auth-checkbox-label signup-terms" htmlFor="accept-terms">
          <input className="auth-checkbox" id="accept-terms" name="acceptTerms" type="checkbox" required />
          <span>I agree to the Terms and Conditions.</span>
        </label>

        <button className="auth-submit" type="submit">Create Account <ArrowRight size={17} /></button>
        {feedback && <p className="auth-status" role="status">{feedback}</p>}
      </form>

      <p className="auth-form-switch">Already have an account? <Link to="/login">Login</Link></p>
    </AuthPageFrame>
  )
}

export default SignupPage
