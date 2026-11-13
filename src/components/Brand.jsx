import traceVaultLogo from '../assets/icon_tracevault.png'
import { Link } from 'react-router-dom'
import './SiteChrome.css'

function Brand({ footer = false }) {
  return (
    <Link className={`brand${footer ? ' brand-footer' : ''}`} to="/" aria-label="TraceVault home">
      <span className="brand-mark" aria-hidden="true">
        <img src={traceVaultLogo} alt="" />
      </span>
      <span className="brand-name">TraceVault</span>
    </Link>
  )
}

export default Brand
