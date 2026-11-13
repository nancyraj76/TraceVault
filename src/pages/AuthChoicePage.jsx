import { ArrowRight, BriefcaseBusiness, UserRoundPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthPageFrame from '../components/AuthPageFrame.jsx'
import './AuthChoicePage.css'

function AuthChoicePage() {
  return (
    <AuthPageFrame variant="choice">
      <div className="auth-choice-heading">
        <p className="auth-eyebrow"><span className="auth-eyebrow-mark" />Secure account access</p>
        <h1>Welcome to TraceVault</h1>
        <p className="auth-choice-subtitle">Secure your digital evidence journey.</p>
      </div>

      <div className="auth-choice-grid">
        <article className="auth-choice-card">
          <div className="auth-choice-card-top">
            <span className="auth-choice-icon"><BriefcaseBusiness size={21} strokeWidth={1.7} /></span>
            <span className="auth-choice-step">01 / RETURNING</span>
          </div>
          <p className="auth-choice-kicker">Already have an account?</p>
          <h2><Link to="/login">Login</Link></h2>
          <p className="auth-choice-description">Return to your secure workspace and continue managing your evidence and investigations.</p>
          <Link className="auth-choice-cta" to="/login">Continue <ArrowRight size={17} strokeWidth={1.9} /></Link>
        </article>

        <article className="auth-choice-card auth-choice-card-featured">
          <div className="auth-choice-card-top">
            <span className="auth-choice-icon"><UserRoundPlus size={21} strokeWidth={1.7} /></span>
            <span className="auth-choice-step">02 / NEW HERE</span>
          </div>
          <p className="auth-choice-kicker">New to TraceVault?</p>
          <h2><Link to="/signup">Create Account</Link></h2>
          <p className="auth-choice-description">Start with a clearer, more accountable way to secure and review digital evidence.</p>
          <Link className="auth-choice-cta" to="/signup">Get Started <ArrowRight size={17} strokeWidth={1.9} /></Link>
        </article>
      </div>

      <p className="auth-choice-footnote">A considered workspace for evidence that matters.</p>
    </AuthPageFrame>
  )
}

export default AuthChoicePage
