import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  Fingerprint,
  Layers3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import './WelcomePage.css'

const capabilities = [
  {
    icon: Layers3,
    number: '01',
    title: 'Capture with context',
    description:
      'Keep the source, handling history, and supporting details connected from the first moment evidence enters a case.',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'Review with assistance',
    description:
      'Use AI-assisted discovery to organize complex material and bring relevant patterns into focus for expert review.',
  },
  {
    icon: Fingerprint,
    number: '03',
    title: 'Verify at every handoff',
    description:
      'Keep integrity checks and a clear chain of custody visible as evidence moves through an investigation.',
  },
]

const workflow = [
  {
    number: '01',
    title: 'Collect',
    description: 'Record the source and preserve the original context.',
  },
  {
    number: '02',
    title: 'Examine',
    description: 'Review evidence with clear, human-led AI assistance.',
  },
  {
    number: '03',
    title: 'Validate',
    description: 'Carry a traceable record through to your findings.',
  },
]

function EvidencePreview() {
  return (
    <aside className="evidence-preview" aria-label="Illustrative TraceVault evidence record">
      <div className="preview-window-bar">
        <div className="window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="preview-window-title">TRACEVAULT / EVIDENCE ROOM</span>
        <span className="preview-window-tag">SAMPLE RECORD</span>
      </div>

      <div className="preview-content">
        <div className="record-topline">
          <span className="record-kicker">INVESTIGATION FILE</span>
          <span className="record-id">TV / 0248</span>
        </div>

        <div className="record-title-row">
          <div>
            <p className="record-overline">EVIDENCE SUMMARY</p>
            <h2>Device image 07</h2>
          </div>
          <span className="verified-pill"><ShieldCheck size={15} strokeWidth={2} /> Verified</span>
        </div>

        <div className="record-meta">
          <span>Acquired 12 Nov 2026</span>
          <span>Mobile device image</span>
        </div>

        <div className="fingerprint-panel">
          <div className="fingerprint-heading">
            <span className="fingerprint-icon"><Fingerprint size={18} strokeWidth={1.8} /></span>
            <span>File fingerprint</span>
            <span className="hash-type">SHA-256</span>
          </div>
          <code>9f4c 08e2 73bd 3a91 ... c21d</code>
        </div>

        <div className="custody-heading">
          <span>Chain of custody</span>
          <span>03 events recorded</span>
        </div>

        <ol className="custody-timeline">
          <li className="timeline-item">
            <span className="timeline-marker"><Check size={12} strokeWidth={2.4} /></span>
            <span className="timeline-copy"><strong>Collected</strong><small>Source recorded</small></span>
            <time>09:42</time>
          </li>
          <li className="timeline-item">
            <span className="timeline-marker"><Check size={12} strokeWidth={2.4} /></span>
            <span className="timeline-copy"><strong>Reviewed</strong><small>Analyst activity logged</small></span>
            <time>10:18</time>
          </li>
          <li className="timeline-item">
            <span className="timeline-marker"><Check size={12} strokeWidth={2.4} /></span>
            <span className="timeline-copy"><strong>Integrity checked</strong><small>Fingerprint confirmed</small></span>
            <time>11:06</time>
          </li>
        </ol>
      </div>

      <div className="preview-note">
        <span className="preview-note-icon"><Activity size={17} strokeWidth={1.8} /></span>
        <span><strong>Every action accounted for</strong><small>Provenance stays with the evidence</small></span>
        <ArrowUpRight size={17} strokeWidth={1.8} />
      </div>
    </aside>
  )
}

function WelcomePage() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main">
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-mark" />AI-Powered Digital Forensics &amp; Evidence Integrity</p>
              <h1 id="hero-heading">Follow every trace.<br /><span>Preserve every truth.</span></h1>
              <p className="hero-description">
                Bring clarity to complex investigations with AI-assisted analysis and a careful, traceable record of every piece of digital evidence.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#platform">
                  Explore the platform <ArrowRight size={17} strokeWidth={2} />
                </a>
                <a className="text-link" href="#workflow">
                  See how it works <ArrowUpRight size={16} strokeWidth={1.9} />
                </a>
              </div>

              <div className="hero-assurance">
                <span className="assurance-icon"><ShieldCheck size={16} strokeWidth={1.9} /></span>
                <span>Built for clarity, accountability, and confidence.</span>
              </div>
            </div>

            <div className="hero-artwork">
              <span className="artwork-orbit artwork-orbit-one" aria-hidden="true" />
              <span className="artwork-orbit artwork-orbit-two" aria-hidden="true" />
              <EvidencePreview />
            </div>
          </div>

          <div className="hero-footnote" aria-hidden="true">
            <span>01 — A clearer view of digital evidence</span>
            <span>TRACEVAULT / 2026</span>
          </div>
        </section>

        <section className="platform-section" id="platform" aria-labelledby="platform-heading">
          <div className="section-container">
            <div className="section-heading">
              <div>
                <p className="eyebrow"><span className="eyebrow-mark" />An integrity-first workflow</p>
                <h2 id="platform-heading">Evidence you can trace.<br />Insight you can explain.</h2>
              </div>
              <p className="section-intro-copy">
                From initial collection to final review, TraceVault keeps the evidence and its story connected in one considered workspace.
              </p>
            </div>

            <div className="capability-grid">
              {capabilities.map((capability) => {
                const Icon = capability.icon
                return (
                  <article className="capability-card" key={capability.number}>
                    <div className="capability-card-top">
                      <span className="capability-icon"><Icon size={20} strokeWidth={1.7} /></span>
                      <span className="card-number">{capability.number}</span>
                    </div>
                    <h3>{capability.title}</h3>
                    <p>{capability.description}</p>
                    <span className="card-rule" aria-hidden="true" />
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="workflow-section" id="workflow" aria-labelledby="workflow-heading">
          <div className="workflow-container">
            <div className="workflow-heading">
              <p className="eyebrow"><span className="eyebrow-mark" />A transparent process</p>
              <h2 id="workflow-heading">One clear path from evidence to understanding.</h2>
              <p>Keep each step visible, deliberate, and connected to the record that came before it.</p>
              <a className="text-link workflow-link" href="#integrity">
                Explore evidence integrity <ArrowRight size={16} strokeWidth={1.9} />
              </a>
            </div>

            <ol className="workflow-list">
              {workflow.map((step) => (
                <li className="workflow-step" key={step.number}>
                  <span className="workflow-number">{step.number}</span>
                  <div className="workflow-step-copy">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  <ArrowUpRight className="workflow-arrow" size={18} strokeWidth={1.8} />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="integrity-section" id="integrity" aria-labelledby="integrity-heading">
          <div className="integrity-panel">
            <div className="integrity-emblem"><ShieldCheck size={29} strokeWidth={1.5} /></div>
            <div className="integrity-copy">
              <p className="eyebrow"><span className="eyebrow-mark" />Integrity, kept in view</p>
              <h2 id="integrity-heading">Trust travels with the evidence.</h2>
              <p>Clear provenance and visible integrity checks help every reviewer understand where evidence came from and how it was handled.</p>
            </div>
            <div className="integrity-checklist" aria-label="TraceVault principles">
              <span><Check size={15} strokeWidth={2} /> Source recorded</span>
              <span><Check size={15} strokeWidth={2} /> Handling traceable</span>
              <span><Check size={15} strokeWidth={2} /> Review accountable</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default WelcomePage
