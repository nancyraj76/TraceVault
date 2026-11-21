import {
  FileText,
  FlaskConical,
  FolderClosed,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import traceVaultLogo from '../assets/icon_tracevault.png'

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Evidence Vault', icon: FolderClosed, to: '/evidence-vault' },
  { label: 'Analysis', icon: FlaskConical },
  { label: 'AI Assistant', icon: Sparkles, to: '/assistant' },
  { label: 'Reports', icon: FileText },
  { label: 'Settings', icon: Settings },
]

function DashboardSidebar({ activeSection, onSelect, onSectionNavigate }) {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <aside className="flex flex-col border-b border-[var(--tv-border)] bg-[var(--tv-offwhite)] lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-64 lg:border-b-0 lg:border-r">
      <Link className="flex items-center gap-3 px-5 py-4 text-[var(--tv-navy)] no-underline sm:px-7 lg:px-6 lg:py-7" to="/" aria-label="TraceVault home">
        <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--tv-border)] bg-[var(--tv-white)]">
          <img className="h-10 w-10 object-contain" src={traceVaultLogo} alt="" />
        </span>
        <span className="text-lg font-semibold tracking-[-0.04em]">TraceVault</span>
      </Link>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 sm:px-5 lg:flex-1 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-4 lg:pb-0 lg:pt-9" aria-label="Dashboard navigation">
        {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
          const isActive = activeSection === label
          const className = `flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm font-medium no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)] lg:w-full ${isActive ? 'bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]' : 'text-[var(--tv-ink-68)] hover:bg-[var(--tv-ink-07)] hover:text-[var(--tv-navy)]'}`
          const children = <><Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} aria-hidden="true" /><span>{label}</span></>

          if (to) {
            return (
              <Link className={className} to={to} key={label} aria-current={isActive ? 'page' : undefined}>
                {children}
              </Link>
            )
          }

          if (label === 'Overview' && !isDashboard) {
            return (
              <Link className={className} to="/dashboard" key={label} aria-current={isActive ? 'page' : undefined}>
                {children}
              </Link>
            )
          }

          return (
            <button className={className} type="button" key={label} aria-current={isActive ? 'page' : undefined} onClick={() => (isDashboard ? onSelect(label) : onSectionNavigate(label))}>
              {children}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-[var(--tv-border)] p-3 sm:px-5 lg:mt-auto lg:p-4">
        <Link
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[var(--tv-ink-68)] no-underline transition-colors hover:bg-[var(--tv-ink-07)] hover:text-[var(--tv-navy)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)]"
          to="/"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          Logout
        </Link>
      </div>
    </aside>
  )
}

export default DashboardSidebar
