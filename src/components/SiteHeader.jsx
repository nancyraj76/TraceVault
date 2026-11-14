import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Brand from './Brand.jsx'
import ThemeToggle from './ThemeToggle.jsx'

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav
          className={`primary-navigation${menuOpen ? ' is-open' : ''}`}
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          <a href="#platform" onClick={closeMenu}>Platform</a>
          <a href="#workflow" onClick={closeMenu}>How it works</a>
          <a href="#integrity" onClick={closeMenu}>Integrity</a>
          <Link className="mobile-auth-link mobile-auth-login" to="/auth" onClick={closeMenu}>Log in</Link>
          <Link className="button button-primary mobile-auth-link mobile-auth-create" to="/auth" onClick={closeMenu}>Create Account</Link>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <Link className="header-login" to="/auth">Log in</Link>
          <Link className="button button-primary header-action" to="/auth">Create Account</Link>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
