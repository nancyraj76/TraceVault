import { useState } from 'react'
import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock3,
  FileAudio2,
  FileImage,
  FileVideo2,
  FolderClosed,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { filterEvidence } from '../lib/evidenceFilters.js'

const SAMPLE_EVIDENCE = [
  { id: 1, name: 'interview-recording.wav', type: 'Audio', date: 'Nov 14, 2026', status: 'Verified' },
  { id: 2, name: 'incident-scene-04.jpg', type: 'Image', date: 'Nov 12, 2026', status: 'Verified' },
  { id: 3, name: 'device-export.zip', type: 'Archive', date: 'Nov 10, 2026', status: 'Needs review' },
]

function IconForFileType({ type }) {
  const Icon = type === 'Audio'
    ? FileAudio2
    : type === 'Image'
      ? FileImage
      : type === 'Video'
        ? FileVideo2
        : Archive

  return <Icon className="h-4 w-4 shrink-0 text-[var(--tv-accent)]" aria-hidden="true" />
}

function DashboardHeader() {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tv-ink-53)]">Workspace overview</p>
        <h1 className="m-0 text-3xl font-semibold tracking-[-0.055em] text-[var(--tv-navy)] sm:text-[2.15rem]">Welcome back!</h1>
        <p className="mb-0 mt-2 text-sm text-[var(--tv-ink-68)]">Your digital evidence workspace.</p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <ThemeToggle />
        <div className="flex items-center gap-3 border-l border-[var(--tv-border)] pl-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]">
            <UserRound className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="grid gap-0.5">
            <span className="text-xs font-semibold text-[var(--tv-navy)]">Demo user</span>
            <span className="text-[11px] text-[var(--tv-ink-53)]">Sample workspace</span>
          </span>
        </div>
      </div>
    </header>
  )
}

function StatCard({ label, value, detail, icon: Icon, tone, isActive, onClick, ariaLabel }) {
  return (
    <button
      className={`group w-full cursor-pointer rounded-2xl border p-4 text-left transition-[transform,border-color,background-color,box-shadow] hover:-translate-y-0.5 hover:border-[var(--tv-accent)] hover:shadow-[0_10px_24px_var(--tv-shadow-card-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)] active:translate-y-0 sm:p-5 ${isActive ? 'border-[var(--tv-accent)] bg-[var(--tv-accent-muted)] shadow-[0_8px_22px_var(--tv-shadow-card-soft)] ring-2 ring-[var(--tv-selection-bg)]' : 'border-[var(--tv-border)] bg-[var(--tv-offwhite)]'}`}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isActive}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-medium text-[var(--tv-ink-68)]">{label}</p>
          <p className="mb-0 mt-3 text-[1.8rem] font-semibold leading-none tracking-[-0.055em] text-[var(--tv-navy)]">{value}</p>
        </div>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}>
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
      <p className="mb-0 mt-3 text-[11px] text-[var(--tv-ink-53)]">{detail}</p>
    </button>
  )
}

function EvidenceStats({ evidenceFilter, onFilterChange }) {
  return (
    <section className="mb-9" aria-labelledby="evidence-overview-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="m-0 text-base font-semibold tracking-[-0.025em] text-[var(--tv-navy)]" id="evidence-overview-title">Evidence overview</h2>
          <p className="mb-0 mt-1 text-xs text-[var(--tv-ink-53)]">A quick view of your workspace.</p>
        </div>
        <span className="rounded-full border border-[var(--tv-border)] px-2.5 py-1 text-[10px] font-medium text-[var(--tv-ink-62)]">Sample data</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Total Evidence"
          value="128"
          detail="Illustrative demo count"
          icon={FolderClosed}
          tone="bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]"
          isActive={evidenceFilter === 'all'}
          onClick={() => onFilterChange('all')}
          ariaLabel="Show all evidence records"
        />
        <StatCard
          label="Verified Evidence"
          value="113"
          detail="Sample verified count"
          icon={ShieldCheck}
          tone="bg-[var(--tv-verified-bg)] text-[var(--tv-success)]"
          isActive={evidenceFilter === 'verified'}
          onClick={() => onFilterChange('verified')}
          ariaLabel="Show verified evidence records"
        />
        <StatCard
          label="Needs Review"
          value="15"
          detail="Illustrative review queue"
          icon={Clock3}
          tone="bg-[var(--tv-verified-bg)] text-[var(--tv-error)]"
          isActive={evidenceFilter === 'review'}
          onClick={() => onFilterChange('review')}
          ariaLabel="Show evidence records needing review"
        />
      </div>
      <p className="mb-0 mt-2 text-[10px] text-[var(--tv-ink-48)]">Demo values only. No real evidence has been processed.</p>
    </section>
  )
}

function AskTraceVaultCard() {
  return (
    <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-offwhite)] px-5 py-4 shadow-[0_8px_24px_var(--tv-shadow-panel-soft)] sm:flex-row sm:items-center sm:justify-between sm:px-6" aria-labelledby="ask-tracevault-title">
      <div className="flex min-w-0 items-start gap-3.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]">
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div>
          <h2 className="m-0 text-sm font-semibold tracking-[-0.02em] text-[var(--tv-navy)]" id="ask-tracevault-title">Ask TraceVault</h2>
          <p className="mb-0 mt-1.5 max-w-2xl text-xs leading-relaxed text-[var(--tv-ink-68)]">Need help understanding digital evidence, online safety or something that happened to you?</p>
        </div>
      </div>
      <Link className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[var(--tv-action-bg)] px-4 text-xs font-semibold text-[var(--tv-action-fg)] no-underline transition hover:bg-[var(--tv-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)] sm:self-auto" to="/assistant">
        Open AI Assistant <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </section>
  )
}

function RecentEvidence({ records, activeFilter, onClearFilter, totalCount }) {
  const filterLabel = activeFilter === 'verified' ? 'Verified only' : activeFilter === 'review' ? 'Needs review only' : 'All evidence'

  return (
    <section aria-labelledby="recent-evidence-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="m-0 text-base font-semibold tracking-[-0.025em] text-[var(--tv-navy)]" id="recent-evidence-title">Recent evidence</h2>
          <p className="mb-0 mt-1 text-xs text-[var(--tv-ink-53)]">Illustrative demo records.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeFilter !== 'all' && (
            <button
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--tv-border)] bg-[var(--tv-white)] px-3 text-[11px] font-medium text-[var(--tv-navy)] transition hover:border-[var(--tv-accent)] hover:bg-[var(--tv-accent-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)]"
              type="button"
              onClick={onClearFilter}
            >
              All evidence <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          <span className="hidden items-center gap-1.5 text-[11px] font-medium text-[var(--tv-ink-62)] sm:inline-flex"><LockKeyhole className="h-3.5 w-3.5" />Sample records</span>
        </div>
      </div>
      <p className="mb-3 text-[11px] text-[var(--tv-ink-53)]" aria-live="polite">
        Showing {records.length} of {totalCount} sample records · {filterLabel}
      </p>
      <div className="overflow-hidden rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-offwhite)]">
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(90px,0.8fr)_minmax(130px,1fr)_minmax(125px,0.9fr)] gap-4 border-b border-[var(--tv-border)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-[var(--tv-ink-48)] md:grid">
          <span>File name</span><span>File type</span><span>Upload date</span><span>Integrity status</span>
        </div>
        <div className="divide-y divide-[var(--tv-border)]">
          {records.length > 0 ? records.map((record) => (
              <div className="grid gap-3 px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,2fr)_minmax(90px,0.8fr)_minmax(130px,1fr)_minmax(125px,0.9fr)] md:items-center md:gap-4" key={record.id}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--tv-lavender)]"><IconForFileType type={record.type} /></span>
                  <span className="truncate text-xs font-medium text-[var(--tv-navy)]">{record.name}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs text-[var(--tv-ink-68)] md:block"><span className="md:hidden">File type</span><span>{record.type}</span></div>
                <div className="flex items-center justify-between gap-3 text-xs text-[var(--tv-ink-68)] md:block"><span className="md:hidden">Upload date</span><span>{record.date}</span></div>
                <div className="flex items-center justify-between gap-3 md:block">
                  <span className="text-xs text-[var(--tv-ink-68)] md:hidden">Integrity status</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${record.status === 'Verified' ? 'bg-[var(--tv-verified-bg)] text-[var(--tv-success)]' : 'bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]'}`}>
                    {record.status === 'Verified' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                    {record.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="px-5 py-10 text-center">
                <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[var(--tv-lavender)] text-[var(--tv-ink-53)]"><FolderClosed className="h-4 w-4" aria-hidden="true" /></span>
                <h3 className="m-0 text-sm font-semibold text-[var(--tv-navy)]">No matching evidence yet</h3>
                <p className="mb-0 mt-1 text-xs text-[var(--tv-ink-53)]">Try viewing all evidence records.</p>
                {activeFilter !== 'all' && (
                  <button className="mt-4 min-h-9 rounded-full border border-[var(--tv-border)] px-3 text-[11px] font-medium text-[var(--tv-navy)] transition hover:bg-[var(--tv-accent-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={onClearFilter}>View all evidence</button>
                )}
              </div>
            )}
        </div>
      </div>
      <p className="mb-0 mt-2 text-[10px] text-[var(--tv-ink-48)]">Demo data only; these records do not represent uploaded or verified evidence.</p>
    </section>
  )
}

function ComingSoon({ section, onReturn }) {
  return (
    <section className="grid min-h-[55vh] place-items-center rounded-3xl border border-[var(--tv-border)] bg-[var(--tv-offwhite)] px-6 py-14 text-center">
      <div className="max-w-md">
        <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]"><MessageCircle className="h-5 w-5" aria-hidden="true" /></span>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--tv-ink-53)]">{section}</p>
        <h1 className="m-0 text-2xl font-semibold tracking-[-0.045em] text-[var(--tv-navy)]">Coming soon</h1>
        <p className="mb-0 mt-3 text-sm leading-relaxed text-[var(--tv-ink-68)]">This area is not available yet. Your dashboard overview remains ready to explore.</p>
        <button className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--tv-action-bg)] px-4 text-xs font-semibold text-[var(--tv-action-fg)] transition hover:bg-[var(--tv-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={onReturn}>Return to Overview <ArrowUpRight className="h-3.5 w-3.5" /></button>
      </div>
    </section>
  )
}

function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(() => location.state?.activeSection ?? 'Overview')
  const [evidenceFilter, setEvidenceFilter] = useState('all')
  const filteredEvidence = filterEvidence(SAMPLE_EVIDENCE, evidenceFilter)

  return (
    <div className="min-h-screen bg-[var(--tv-lavender)] text-[var(--tv-navy)]">
      <DashboardSidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        onSectionNavigate={(section) => navigate('/dashboard', { state: { activeSection: section } })}
      />
      <main className="min-w-0 lg:ml-64">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          {activeSection === 'Overview' ? (
            <>
              <DashboardHeader />
              <EvidenceStats evidenceFilter={evidenceFilter} onFilterChange={setEvidenceFilter} />
              <AskTraceVaultCard />
              <RecentEvidence
                records={filteredEvidence}
                activeFilter={evidenceFilter}
                onClearFilter={() => setEvidenceFilter('all')}
                totalCount={SAMPLE_EVIDENCE.length}
              />
            </>
          ) : (
            <ComingSoon section={activeSection} onReturn={() => setActiveSection('Overview')} />
          )}
          <footer className="mt-10 flex flex-col gap-2 border-t border-[var(--tv-border)] pt-5 text-[10px] text-[var(--tv-ink-48)] sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 TraceVault · Demo workspace</span>
            <span className="inline-flex items-center gap-1.5"><Check className="h-3 w-3" />Workspace data shown is illustrative</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
