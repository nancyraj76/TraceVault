import { ArrowUpRight } from 'lucide-react'
import Brand from './Brand.jsx'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-block">
          <Brand footer />
          <p>AI-powered digital forensics<br />and evidence integrity.</p>
        </div>
        <nav className="footer-navigation" aria-label="Footer navigation">
          <a href="#platform">Platform</a>
          <a href="#workflow">How it works</a>
          <a href="#integrity">Integrity</a>
        </nav>
        <a className="footer-top-link" href="#top">Back to top <ArrowUpRight size={15} /></a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 TraceVault</span>
        <span>Digital evidence, clearly accounted for.</span>
      </div>
    </footer>
  )
}

export default SiteFooter
