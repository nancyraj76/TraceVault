import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthField from '../components/AuthField.jsx'
import AuthPageFrame from '../components/AuthPageFrame.jsx'
import './LoginPage.css'

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setFeedback('Demo only: your details passed validation. Account sign-in is not connected yet.')
  }

  return (
    <AuthPageFrame>
      <div className="auth-form-heading">
        <span className="auth-form-emblem"><ShieldCheck size={21} strokeWidth={1.7} /></span>
        <p className="auth-eyebrow"><span className="auth-eyebrow-mark" />Secure account access</p>
        <h1>Welcome back</h1>
        <p>Sign in to continue to your TraceVault workspace.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField id="login-email" label="Email address" icon={Mail}>
          <input
            className="auth-input"
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@organization.com"
            required
          />
        </AuthField>

        <AuthField id="login-password" label="Password" icon={LockKeyhole}>
          <input
            className="auth-input auth-input-password"
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            minLength={8}
            required
          />
          <button
            className="auth-password-toggle"
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </AuthField>

        <div className="login-form-options">
          <label className="auth-checkbox-label" htmlFor="remember-me">
            <input className="auth-checkbox" id="remember-me" name="rememberMe" type="checkbox" />
            Remember me
          </label>
          <button
            className="auth-text-link"
            type="button"
            onClick={() => setFeedback('Password reset is a demo interaction. No email has been sent.')}
          >
            Forgot password?
          </button>
        </div>

        <button className="auth-submit" type="submit">Login <ArrowRight size={17} /></button>
        {feedback && <p className="auth-status" role="status">{feedback}</p>}
      </form>

      <p className="auth-form-switch">New to TraceVault? <Link to="/signup">Create Account</Link></p>
    </AuthPageFrame>
  )
}

export default LoginPage
