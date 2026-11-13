import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import traceVaultLogo from '../assets/icon_tracevault.png'
import './AuthPageFrame.css'

function AuthPageFrame({ children, variant = 'form' }) {
  return (
    <div className="auth-page">
      <div className="auth-page-decoration auth-page-decoration-one" aria-hidden="true" />
      <div className="auth-page-decoration auth-page-decoration-two" aria-hidden="true" />

      <header className="auth-header">
        <Link className="auth-brand" to="/" aria-label="TraceVault home">
          <span className="auth-brand-mark">
            <img src={traceVaultLogo} alt="" />
          </span>
          <span className="auth-brand-copy">
            <strong>TraceVault</strong>
            <small>Digital evidence integrity</small>
          </span>
        </Link>
        <Link className="auth-back-link" to="/">
          <ArrowLeft size={15} strokeWidth={1.9} />
          <span>Back to website</span>
        </Link>
      </header>

      <main className="auth-main">
        <section className={`auth-panel auth-panel-${variant}`}>
          {children}
        </section>
      </main>

      <footer className="auth-footer">
        <span>© 2026 TraceVault</span>
        <span><LockKeyhole size={13} strokeWidth={1.8} /> Your evidence, handled with care.</span>
      </footer>
    </div>
  )
}

export default AuthPageFrame
