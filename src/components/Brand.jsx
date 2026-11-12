import traceVaultLogo from '../assets/icon_tracevault.png'
import './SiteChrome.css'

function Brand({ footer = false }) {
  return (
    <a className={`brand${footer ? ' brand-footer' : ''}`} href="#top" aria-label="TraceVault home">
      <span className="brand-mark" aria-hidden="true">
        <img src={traceVaultLogo} alt="" />
      </span>
      <span className="brand-name">TraceVault</span>
    </a>
  )
}

export default Brand
