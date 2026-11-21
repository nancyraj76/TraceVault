import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AudioLines,
  CheckCircle2,
  Clock3,
  FileAudio2,
  FileImage,
  FileText,
  FileVideo2,
  FolderClosed,
  HardDriveUpload,
  Image as ImageIcon,
  LoaderCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

const SAMPLE_RECORDS = [
  { id: 'sample-audio', name: 'interview-recording.wav', type: 'Audio', sizeBytes: 4820000, uploadedAt: '2026-11-14T09:25:00', status: 'Verified', source: 'sample' },
  { id: 'sample-image', name: 'incident-scene-04.jpg', type: 'Image', sizeBytes: 2640000, uploadedAt: '2026-11-12T14:10:00', status: 'Verified', source: 'sample' },
  { id: 'sample-document', name: 'incident-notes.pdf', type: 'Document', sizeBytes: 892000, uploadedAt: '2026-11-10T11:40:00', status: 'Needs Review', source: 'sample' },
]

const FILE_ACCEPT = 'image/*,video/*,audio/*,.pdf,.txt,.text,.csv,.md,.markdown,.rtf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp'
const IMAGE_EXTENSIONS = new Set(['apng', 'avif', 'bmp', 'gif', 'heic', 'heif', 'jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff', 'webp'])
const VIDEO_EXTENSIONS = new Set(['avi', 'm4v', 'mkv', 'mov', 'mp4', 'mpeg', 'mpg', 'webm', 'wmv'])
const AUDIO_EXTENSIONS = new Set(['aac', 'aif', 'aiff', 'flac', 'm4a', 'mp3', 'oga', 'ogg', 'opus', 'wav', 'weba', 'wma'])
const DOCUMENT_EXTENSIONS = new Set(['pdf', 'txt', 'text', 'csv', 'md', 'markdown', 'rtf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'])
const PREVIEWABLE_TEXT_EXTENSIONS = new Set(['txt', 'text', 'csv', 'md', 'markdown'])
const TYPE_FILTERS = ['All file types', 'Images', 'Videos', 'Audio', 'Documents']
const STATUS_FILTERS = ['All statuses', 'Verified', 'Pending Review', 'Needs Review']

function getExtension(name) {
  return name.includes('.') ? name.split('.').pop().toLowerCase() : ''
}

function getFileCategory(file) {
  const extension = getExtension(file.name)
  if (file.type?.startsWith('image/') || IMAGE_EXTENSIONS.has(extension)) return 'Images'
  if (file.type?.startsWith('video/') || VIDEO_EXTENSIONS.has(extension)) return 'Videos'
  if (file.type?.startsWith('audio/') || AUDIO_EXTENSIONS.has(extension)) return 'Audio'
  if (DOCUMENT_EXTENSIONS.has(extension)) return 'Documents'

  const documentMimeTypes = [
    'application/pdf', 'text/plain', 'text/csv', 'text/markdown', 'application/rtf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
  ]
  return documentMimeTypes.includes(file.type) ? 'Documents' : null
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

function formatDate(value, withTime = false) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return new Intl.DateTimeFormat(undefined, withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' }).format(date)
}

function categoryLabel(category) {
  return category === 'Images' ? 'Image'
    : category === 'Videos' ? 'Video'
      : category === 'Audio' ? 'Audio'
        : 'Document'
}

function FileTypeIcon({ type, className = 'h-4 w-4' }) {
  const Icon = type === 'Image' ? FileImage
    : type === 'Video' ? FileVideo2
      : type === 'Audio' ? FileAudio2
        : FileText
  return <Icon className={className} aria-hidden="true" />
}

function StatusBadge({ record }) {
  const isVerifiedSample = record.source === 'sample' && record.status === 'Verified'
  const isNeedsReview = record.status === 'Needs Review'
  const Icon = isVerifiedSample ? CheckCircle2 : isNeedsReview ? ShieldAlert : Clock3
  const style = isVerifiedSample
    ? 'bg-[var(--tv-verified-bg)] text-[var(--tv-success)]'
    : isNeedsReview
      ? 'bg-[var(--tv-verified-bg)] text-[var(--tv-error)]'
      : 'bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]'
  const label = isVerifiedSample ? 'Sample · Verified' : record.status

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${style}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}

function OverviewCard({ label, value, detail, icon: Icon, tone }) {
  return (
    <article className="rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-offwhite)] p-4 shadow-[0_8px_24px_var(--tv-shadow-panel-soft)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-medium text-[var(--tv-ink-68)]">{label}</p>
          <p className="mb-0 mt-3 text-[1.8rem] font-semibold leading-none tracking-[-0.055em] text-[var(--tv-navy)]">{value}</p>
        </div>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}>
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
      </div>
      <p className="mb-0 mt-3 text-[11px] leading-relaxed text-[var(--tv-ink-53)]">{detail}</p>
    </article>
  )
}

async function calculateSha256(file) {
  if (!globalThis.crypto?.subtle) throw new Error('Web Crypto is unavailable in this browser.')
  const bytes = await file.arrayBuffer()
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function EvidencePreview({ record, textPreview, textLoading }) {
  if (record.source === 'sample') {
    return <PreviewMessage icon={FolderClosed} text="This is an illustrative sample record. No file is stored for preview." />
  }

  if (!record.previewUrl) {
    return <PreviewMessage icon={FileText} text="A local preview is unavailable for this file." />
  }

  if (record.type === 'Image') {
    return <img className="mx-auto max-h-[460px] w-full rounded-xl object-contain" src={record.previewUrl} alt={`Preview of ${record.name}`} />
  }
  if (record.type === 'Video') {
    return <video className="max-h-[460px] w-full rounded-xl bg-black" src={record.previewUrl} controls preload="metadata">Your browser cannot play this video.</video>
  }
  if (record.type === 'Audio') {
    return (
      <div className="rounded-2xl bg-[var(--tv-lavender)] p-6 text-center sm:p-10">
        <AudioLines className="mx-auto mb-5 h-10 w-10 text-[var(--tv-accent)]" strokeWidth={1.5} aria-hidden="true" />
        <audio className="mx-auto w-full max-w-lg" src={record.previewUrl} controls preload="metadata">Your browser cannot play this audio.</audio>
      </div>
    )
  }
  if (getExtension(record.name) === 'pdf' || record.file?.type === 'application/pdf') {
    return <iframe className="h-[460px] w-full rounded-xl border border-[var(--tv-border)] bg-white" src={record.previewUrl} title={`PDF preview of ${record.name}`} />
  }
  if (PREVIEWABLE_TEXT_EXTENSIONS.has(getExtension(record.name)) || record.file?.type?.startsWith('text/')) {
    return textLoading
      ? <PreviewMessage icon={LoaderCircle} text="Preparing a local text preview…" spin />
      : <pre className="max-h-[460px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[var(--tv-lavender)] p-4 text-xs leading-relaxed text-[var(--tv-ink-68)]">{textPreview || 'This text file is empty.'}</pre>
  }
  return <PreviewMessage icon={FileText} text="This document format cannot be previewed in this browser. Its file details and locally computed SHA-256 remain available." />
}

function PreviewMessage({ icon: Icon, text, spin = false }) {
  return (
    <div className="grid min-h-48 place-items-center rounded-2xl bg-[var(--tv-lavender)] p-6 text-center">
      <div className="max-w-sm">
        <Icon className={`mx-auto mb-3 h-8 w-8 text-[var(--tv-accent)] ${spin ? 'animate-spin' : ''}`} strokeWidth={1.7} aria-hidden="true" />
        <p className="m-0 text-xs leading-relaxed text-[var(--tv-ink-68)]">{text}</p>
      </div>
    </div>
  )
}

function EvidenceDetails({ record, onClose, onRemove, textPreview, textLoading }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const history = record.source === 'upload'
    ? [
      { label: 'Added to this browser session', date: record.uploadedAt },
      ...(record.hash ? [{ label: 'SHA-256 calculated locally', date: record.hashCalculatedAt }] : []),
    ]
    : []

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-[2px] sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="my-auto max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[var(--tv-border)] bg-[var(--tv-offwhite)] p-4 shadow-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="evidence-details-title">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]"><FileTypeIcon type={record.type} className="h-[18px] w-[18px]" /></span>
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--tv-ink-53)]">Evidence details</p>
              <h2 className="m-0 break-all text-lg font-semibold tracking-[-0.035em] text-[var(--tv-navy)]" id="evidence-details-title">{record.name}</h2>
            </div>
          </div>
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[var(--tv-ink-62)] transition hover:bg-[var(--tv-ink-07)] hover:text-[var(--tv-navy)] focus-visible:outline-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={onClose} aria-label="Close evidence details"><X className="h-4 w-4" /></button>
        </div>

        <div className="mb-5">
          <EvidencePreview record={record} textPreview={textPreview} textLoading={textLoading} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-white)] p-4" aria-labelledby="metadata-title">
            <h3 className="m-0 text-xs font-semibold text-[var(--tv-navy)]" id="metadata-title">File metadata</h3>
            <dl className="mb-0 mt-3 grid grid-cols-1 gap-x-5 gap-y-3 text-[11px] sm:grid-cols-2">
              <Metadata label="File type" value={record.type} />
              <Metadata label="File size" value={formatBytes(record.sizeBytes)} />
              <Metadata label="Added" value={formatDate(record.uploadedAt, true)} />
              <Metadata label="Record source" value={record.source === 'sample' ? 'Illustrative sample' : 'This browser session'} />
              <div className="sm:col-span-2"><Metadata label="Integrity status" value={record.source === 'sample' ? `Illustrative sample status: ${record.status}` : 'Pending review · not forensically verified'} /></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-white)] p-4" aria-labelledby="hash-title">
            <h3 className="m-0 text-xs font-semibold text-[var(--tv-navy)]" id="hash-title">SHA-256</h3>
            {record.source === 'sample' ? (
              <p className="mb-0 mt-3 text-[11px] leading-relaxed text-[var(--tv-ink-62)]">Unavailable for sample records. No hash was generated for this example.</p>
            ) : record.hash ? (
              <>
                <p className="mb-0 mt-2 break-all rounded-lg bg-[var(--tv-lavender)] p-2.5 font-mono text-[10px] leading-relaxed text-[var(--tv-ink-68)]">{record.hash}</p>
                <p className="mb-0 mt-2 text-[10px] leading-relaxed text-[var(--tv-ink-53)]">Calculated from this uploaded file in the browser on {formatDate(record.hashCalculatedAt, true)}. A hash alone does not verify authenticity.</p>
              </>
            ) : (
              <p className="mb-0 mt-3 inline-flex items-center gap-2 text-[11px] text-[var(--tv-ink-62)]"><LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />{record.hashState || 'SHA-256 is not available.'}</p>
            )}
          </section>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-white)] p-4" aria-labelledby="history-title">
            <div className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[var(--tv-accent)]" aria-hidden="true" /><h3 className="m-0 text-xs font-semibold text-[var(--tv-navy)]" id="history-title">Evidence history</h3></div>
            {history.length ? (
              <ol className="mb-0 mt-3 grid gap-3 pl-5">
                {history.map((event) => <li className="text-[11px] text-[var(--tv-ink-68)]" key={event.label}><span className="font-medium text-[var(--tv-navy)]">{event.label}</span><span className="mt-0.5 block text-[10px] text-[var(--tv-ink-53)]">{formatDate(event.date, true)}</span></li>)}
              </ol>
            ) : <p className="mb-0 mt-3 text-[11px] leading-relaxed text-[var(--tv-ink-62)]">No browser-session activity is available for this sample record.</p>}
            <p className="mb-0 mt-3 text-[10px] text-[var(--tv-ink-48)]">Session activity only; this is not a custody log.</p>
          </section>
          <section className="rounded-2xl border border-dashed border-[var(--tv-border)] bg-[var(--tv-lavender)] p-4" aria-labelledby="custody-title">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--tv-accent)]" aria-hidden="true" /><h3 className="m-0 text-xs font-semibold text-[var(--tv-navy)]" id="custody-title">Chain of custody</h3></div>
            <p className="mb-0 mt-2 text-[11px] leading-relaxed text-[var(--tv-ink-62)]">Placeholder. No chain-of-custody events have been recorded in this browser-only prototype.</p>
          </section>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[var(--tv-border)] pt-4 sm:flex-row sm:justify-end">
          {record.source === 'upload' && <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--tv-border)] px-4 text-xs font-semibold text-[var(--tv-error)] transition hover:bg-[var(--tv-verified-bg)] focus-visible:outline-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={() => onRemove(record.id)}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Remove from session</button>}
          <button className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--tv-action-bg)] px-4 text-xs font-semibold text-[var(--tv-action-fg)] transition hover:bg-[var(--tv-action-hover)] focus-visible:outline-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={onClose}>Done</button>
        </div>
      </section>
    </div>
  )
}

function Metadata({ label, value }) {
  return <div><dt className="text-[10px] text-[var(--tv-ink-53)]">{label}</dt><dd className="mb-0 mt-0.5 break-words text-[11px] font-medium text-[var(--tv-navy)]">{value}</dd></div>
}

function EvidenceVaultPage() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const previewUrlsRef = useRef(new Map())
  const mountedRef = useRef(false)
  const idSequence = useRef(0)
  const [uploads, setUploads] = useState([])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All file types')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [selectedId, setSelectedId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  useEffect(() => {
    mountedRef.current = true
    const previewUrls = previewUrlsRef.current
    return () => {
      mountedRef.current = false
      for (const url of previewUrls.values()) URL.revokeObjectURL(url)
      previewUrls.clear()
    }
  }, [])

  const records = useMemo(() => [...uploads, ...SAMPLE_RECORDS], [uploads])
  const visibleRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return records.filter((record) => {
      const matchesName = !normalizedQuery || record.name.toLocaleLowerCase().includes(normalizedQuery)
      const recordTypeFilter = record.type === 'Audio' ? 'Audio' : `${record.type}s`
      const matchesType = typeFilter === 'All file types' || recordTypeFilter === typeFilter
      const matchesStatus = statusFilter === 'All statuses' || record.status === statusFilter
      return matchesName && matchesType && matchesStatus
    })
  }, [query, records, statusFilter, typeFilter])
  const selectedRecord = records.find((record) => record.id === selectedId)
  const selectedPreviewFile = selectedRecord?.file
  const selectedNeedsTextPreview = Boolean(selectedRecord && selectedPreviewFile && (
    PREVIEWABLE_TEXT_EXTENSIONS.has(getExtension(selectedRecord.name)) || selectedPreviewFile.type?.startsWith('text/')
  ))
  const hasFilters = query.trim() || typeFilter !== 'All file types' || statusFilter !== 'All statuses'
  const pendingCount = uploads.filter((record) => record.status === 'Pending Review').length
  const verifiedSampleCount = SAMPLE_RECORDS.filter((record) => record.status === 'Verified').length
  const [textPreviewState, setTextPreviewState] = useState({ recordId: null, text: '' })
  const textPreview = textPreviewState.recordId === selectedId ? textPreviewState.text : ''
  const textLoading = selectedNeedsTextPreview && textPreviewState.recordId !== selectedId

  useEffect(() => {
    if (!selectedPreviewFile || !selectedNeedsTextPreview) return undefined

    let cancelled = false
    selectedPreviewFile.text().then((value) => {
      if (!cancelled) setTextPreviewState({ recordId: selectedId, text: value })
    }).catch(() => {
      if (!cancelled) setTextPreviewState({ recordId: selectedId, text: 'Unable to read this text file in the browser.' })
    })
    return () => { cancelled = true }
  }, [selectedId, selectedNeedsTextPreview, selectedPreviewFile])

  function removeUpload(id) {
    const objectUrl = previewUrlsRef.current.get(id)
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      previewUrlsRef.current.delete(id)
    }
    setUploads((current) => current.filter((record) => record.id !== id))
    setSelectedId((current) => current === id ? null : current)
  }

  async function addFiles(fileList) {
    const selectedFiles = Array.from(fileList || [])
    const validFiles = []
    let skippedCount = 0
    for (const file of selectedFiles) {
      const category = getFileCategory(file)
      if (!category) {
        skippedCount += 1
        continue
      }
      validFiles.push({ file, category })
    }

    if (skippedCount > 0) setUploadMessage(`${skippedCount} unsupported file${skippedCount === 1 ? ' was' : 's were'} skipped. Choose images, videos, audio, or documents.`)
    else if (validFiles.length) setUploadMessage('Files are being prepared locally. They remain in this browser session only.')
    else if (!selectedFiles.length) setUploadMessage('')

    const createdRecords = validFiles.map(({ file, category }) => {
      idSequence.current += 1
      const id = `upload-${Date.now()}-${idSequence.current}`
      const uploadedAt = new Date().toISOString()
      const previewUrl = URL.createObjectURL(file)
      previewUrlsRef.current.set(id, previewUrl)
      return {
        id,
        name: file.name,
        type: categoryLabel(category),
        sizeBytes: file.size,
        uploadedAt,
        status: 'Pending Review',
        source: 'upload',
        file,
        previewUrl,
        hash: null,
        hashState: 'Calculating SHA-256 locally…',
        processing: true,
      }
    })

    if (!createdRecords.length) return
    setUploads((current) => [...createdRecords, ...current])
    for (const record of createdRecords) {
      try {
        const hash = await calculateSha256(record.file)
        const hashCalculatedAt = new Date().toISOString()
        if (mountedRef.current) {
          setUploads((current) => current.map((item) => item.id === record.id
            ? { ...item, hash, hashState: '', hashCalculatedAt, processing: false }
            : item))
        }
      } catch {
        if (mountedRef.current) {
          setUploads((current) => current.map((item) => item.id === record.id
            ? { ...item, hashState: 'SHA-256 could not be calculated in this browser.', processing: false }
            : item))
        }
      }
    }
    if (mountedRef.current) {
      setUploadMessage(`${createdRecords.length} file${createdRecords.length === 1 ? '' : 's'} added to this browser session. All remain pending review.`)
    }
  }

  function resetFilters() {
    setQuery('')
    setTypeFilter('All file types')
    setStatusFilter('All statuses')
  }

  return (
    <div className="min-h-screen bg-[var(--tv-lavender)] text-[var(--tv-navy)]">
      <DashboardSidebar
        activeSection="Evidence Vault"
        onSelect={() => {}}
        onSectionNavigate={(section) => navigate('/dashboard', { state: { activeSection: section } })}
      />
      <main className="min-w-0 lg:ml-64">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <header className="mb-8 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tv-ink-53)]">Workspace / Evidence</p>
              <h1 className="m-0 text-3xl font-semibold tracking-[-0.055em] text-[var(--tv-navy)] sm:text-[2.15rem]">Evidence Vault</h1>
              <p className="mb-0 mt-2 text-sm text-[var(--tv-ink-68)]">Organize local files and review illustrative sample records.</p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <ThemeToggle />
              <span className="flex items-center gap-2 border-l border-[var(--tv-border)] pl-4 text-[11px] font-medium text-[var(--tv-ink-62)]"><span className="h-2 w-2 rounded-full bg-[var(--tv-success)]" aria-hidden="true" />Browser session only</span>
            </div>
          </header>

          <section className="mb-8 overflow-hidden rounded-3xl border border-[var(--tv-border)] bg-[var(--tv-offwhite)] shadow-[0_12px_34px_var(--tv-shadow-panel-soft)]" aria-labelledby="upload-title">
            <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(270px,0.8fr)]">
              <div className="p-5 sm:p-7">
                <div className="mb-5 flex items-start gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]"><HardDriveUpload className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" /></span>
                  <div>
                    <h2 className="m-0 text-base font-semibold tracking-[-0.025em] text-[var(--tv-navy)]" id="upload-title">Upload new evidence</h2>
                    <p className="mb-0 mt-1 text-xs leading-relaxed text-[var(--tv-ink-53)]">Select or drop image, video, audio, or document files.</p>
                  </div>
                </div>
                <div
                  className={`rounded-2xl border border-dashed px-4 py-7 text-center transition-colors sm:px-6 ${isDragging ? 'border-[var(--tv-accent)] bg-[var(--tv-accent-muted)]' : 'border-[var(--tv-ink-27)] bg-[var(--tv-lavender)]'}`}
                  onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
                  onDragOver={(event) => event.preventDefault()}
                  onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false) }}
                  onDrop={(event) => { event.preventDefault(); setIsDragging(false); void addFiles(event.dataTransfer.files) }}
                >
                  <span className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-[var(--tv-offwhite)] text-[var(--tv-accent)] shadow-[0_5px_16px_var(--tv-shadow-panel-soft)]"><Upload className="h-[19px] w-[19px]" strokeWidth={1.8} aria-hidden="true" /></span>
                  <p className="mb-0 text-sm font-semibold text-[var(--tv-navy)]">Drop files here</p>
                  <p className="mb-4 mt-1 text-[11px] text-[var(--tv-ink-53)]">or browse from this device</p>
                  <input ref={inputRef} className="sr-only" type="file" accept={FILE_ACCEPT} multiple onChange={(event) => { void addFiles(event.target.files); event.target.value = '' }} aria-label="Choose evidence files" />
                  <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--tv-action-bg)] px-4 text-xs font-semibold text-[var(--tv-action-fg)] transition hover:bg-[var(--tv-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={() => inputRef.current?.click()}><FolderClosed className="h-3.5 w-3.5" aria-hidden="true" />Choose files</button>
                  <p className="mb-0 mt-3 text-[10px] text-[var(--tv-ink-48)]">Files are processed in this tab and cleared when you leave.</p>
                </div>
                <p className="mb-0 mt-3 min-h-4 text-[10px] text-[var(--tv-ink-62)]" role="status" aria-live="polite">{uploadMessage}</p>
              </div>
              <aside className="flex flex-col justify-center border-t border-[var(--tv-border)] bg-[var(--tv-lavender)] p-5 sm:p-7 lg:border-l lg:border-t-0" aria-label="Local file handling">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--tv-offwhite)] text-[var(--tv-success)]"><ShieldCheck className="h-[17px] w-[17px]" aria-hidden="true" /></span>
                  <div>
                    <p className="m-0 text-xs font-semibold text-[var(--tv-navy)]">Local session handling</p>
                    <p className="mb-0 mt-1.5 text-[11px] leading-relaxed text-[var(--tv-ink-62)]">Files stay in React memory in this browser tab. A SHA-256 digest is calculated from each file you select; no forensic verification or custody log is created.</p>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <section className="mb-8" aria-labelledby="overview-title">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 className="m-0 text-base font-semibold tracking-[-0.025em] text-[var(--tv-navy)]" id="overview-title">Evidence overview</h2><p className="mb-0 mt-1 text-xs text-[var(--tv-ink-53)]">Sample and current-session counts are shown separately.</p></div>
              <span className="w-fit rounded-full border border-[var(--tv-border)] bg-[var(--tv-offwhite)] px-2.5 py-1 text-[10px] font-medium text-[var(--tv-ink-62)]">Includes illustrative sample data</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              <OverviewCard label="Total files" value={records.length} detail={`${SAMPLE_RECORDS.length} sample records · ${uploads.length} uploaded this session`} icon={FolderClosed} tone="bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]" />
              <OverviewCard label="Verified sample files" value={verifiedSampleCount} detail="Illustrative statuses only · no forensic verification" icon={CheckCircle2} tone="bg-[var(--tv-verified-bg)] text-[var(--tv-success)]" />
              <OverviewCard label="Pending review" value={pendingCount} detail="Uploaded this session · none are marked verified" icon={Clock3} tone="bg-[var(--tv-verified-bg)] text-[var(--tv-navy)]" />
            </div>
          </section>

          <section aria-labelledby="collection-title">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><h2 className="m-0 text-base font-semibold tracking-[-0.025em] text-[var(--tv-navy)]" id="collection-title">Evidence collection</h2><p className="mb-0 mt-1 text-xs text-[var(--tv-ink-53)]">Sample records are labeled; uploaded files remain in this session.</p></div>
              <span className="inline-flex w-fit items-center gap-1.5 text-[10px] font-medium text-[var(--tv-ink-62)]"><ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />No files are forensically verified here</span>
            </div>

            <div className="mb-4 grid gap-2 rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-offwhite)] p-3 sm:grid-cols-[minmax(0,1fr)_180px_180px_auto] sm:items-center sm:p-3.5">
              <label className="relative block min-w-0">
                <span className="sr-only">Search by filename</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tv-ink-48)]" aria-hidden="true" />
                <input className="min-h-10 w-full rounded-xl border border-[var(--tv-border)] bg-[var(--tv-white)] pl-9 pr-3 text-xs text-[var(--tv-navy)] outline-none transition placeholder:text-[var(--tv-ink-38)] focus:border-[var(--tv-accent)] focus:ring-4 focus:ring-[var(--tv-shadow-focus)]" type="search" placeholder="Search filenames…" value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
              <label className="sr-only" htmlFor="type-filter">Filter by file type</label>
              <select id="type-filter" className="min-h-10 rounded-xl border border-[var(--tv-border)] bg-[var(--tv-white)] px-3 text-xs text-[var(--tv-navy)] outline-none focus:border-[var(--tv-accent)] focus:ring-4 focus:ring-[var(--tv-shadow-focus)]" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>{TYPE_FILTERS.map((filter) => <option key={filter}>{filter}</option>)}</select>
              <label className="sr-only" htmlFor="status-filter">Filter by integrity status</label>
              <select id="status-filter" className="min-h-10 rounded-xl border border-[var(--tv-border)] bg-[var(--tv-white)] px-3 text-xs text-[var(--tv-navy)] outline-none focus:border-[var(--tv-accent)] focus:ring-4 focus:ring-[var(--tv-shadow-focus)]" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{STATUS_FILTERS.map((filter) => <option key={filter}>{filter}</option>)}</select>
              <button className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-medium text-[var(--tv-ink-62)] transition hover:bg-[var(--tv-ink-07)] hover:text-[var(--tv-navy)] focus-visible:outline-2 focus-visible:outline-[var(--tv-focus-ring)] disabled:cursor-default disabled:opacity-45" type="button" onClick={resetFilters} disabled={!hasFilters}>Clear filters <X className="h-3.5 w-3.5" aria-hidden="true" /></button>
            </div>

            <p className="mb-3 text-[10px] text-[var(--tv-ink-53)]" aria-live="polite">Showing {visibleRecords.length} of {records.length} records</p>
            <div className="overflow-hidden rounded-2xl border border-[var(--tv-border)] bg-[var(--tv-offwhite)] shadow-[0_8px_24px_var(--tv-shadow-panel-soft)]">
              <div className="hidden grid-cols-[minmax(0,2fr)_minmax(88px,0.7fr)_minmax(84px,0.7fr)_minmax(118px,0.9fr)_minmax(148px,1fr)_minmax(105px,0.7fr)] gap-3 border-b border-[var(--tv-border)] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.09em] text-[var(--tv-ink-48)] xl:grid">
                <span>File name</span><span>Type</span><span>File size</span><span>Upload date</span><span>Integrity status</span><span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-[var(--tv-border)]">
                {visibleRecords.length ? visibleRecords.map((record) => (
                  <article className="grid gap-3 px-4 py-4 sm:px-5 xl:grid-cols-[minmax(0,2fr)_minmax(88px,0.7fr)_minmax(84px,0.7fr)_minmax(118px,0.9fr)_minmax(148px,1fr)_minmax(105px,0.7fr)] xl:items-center xl:gap-3" key={record.id}>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--tv-accent-muted)] text-[var(--tv-accent)]"><FileTypeIcon type={record.type} /></span>
                      <div className="min-w-0"><p className="m-0 truncate text-xs font-semibold text-[var(--tv-navy)]" title={record.name}>{record.name}</p><span className="mt-1 inline-flex rounded-full border border-[var(--tv-border)] px-2 py-0.5 text-[9px] font-medium text-[var(--tv-ink-53)]">{record.source === 'sample' ? 'Sample record' : 'This session'}</span></div>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs text-[var(--tv-ink-68)] xl:block"><span className="text-[10px] text-[var(--tv-ink-48)] xl:hidden">File type</span><span>{record.type}</span></div>
                    <div className="flex items-center justify-between gap-3 text-xs text-[var(--tv-ink-68)] xl:block"><span className="text-[10px] text-[var(--tv-ink-48)] xl:hidden">File size</span><span>{formatBytes(record.sizeBytes)}</span></div>
                    <div className="flex items-center justify-between gap-3 text-xs text-[var(--tv-ink-68)] xl:block"><span className="text-[10px] text-[var(--tv-ink-48)] xl:hidden">Upload date</span><span>{formatDate(record.uploadedAt)}</span></div>
                    <div className="flex items-center justify-between gap-3 xl:block"><span className="text-[10px] text-[var(--tv-ink-48)] xl:hidden">Integrity status</span><span><StatusBadge record={record} /></span></div>
                    <div className="flex items-center justify-end gap-2 border-t border-[var(--tv-border)] pt-3 xl:border-0 xl:pt-0">
                      {record.processing && <span className="mr-auto inline-flex items-center gap-1.5 text-[10px] text-[var(--tv-ink-53)] xl:hidden"><LoaderCircle className="h-3 w-3 animate-spin" />Preparing</span>}
                      <button className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--tv-border)] px-3 text-[10px] font-semibold text-[var(--tv-navy)] transition hover:border-[var(--tv-accent)] hover:bg-[var(--tv-accent-muted)] focus-visible:outline-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={() => setSelectedId(record.id)}>View details</button>
                      {record.source === 'upload' && <button className="grid h-9 w-9 place-items-center rounded-lg text-[var(--tv-ink-53)] transition hover:bg-[var(--tv-verified-bg)] hover:text-[var(--tv-error)] focus-visible:outline-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" aria-label={`Remove ${record.name} from this session`} title="Remove from session" onClick={() => removeUpload(record.id)}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /></button>}
                    </div>
                    {record.processing && <p className="mb-0 hidden text-[10px] text-[var(--tv-ink-53)] xl:col-span-full xl:block">Preparing local file and calculating SHA-256…</p>}
                  </article>
                )) : (
                  <div className="px-5 py-12 text-center">
                    <span className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[var(--tv-accent-muted)] text-[var(--tv-ink-53)]"><ImageIcon className="h-4 w-4" aria-hidden="true" /></span>
                    <h3 className="m-0 text-sm font-semibold text-[var(--tv-navy)]">No matching evidence</h3>
                    <p className="mb-0 mt-1 text-xs text-[var(--tv-ink-53)]">Adjust your search or filters to see more records.</p>
                    {hasFilters && <button className="mt-4 min-h-9 rounded-full border border-[var(--tv-border)] px-3 text-[11px] font-semibold text-[var(--tv-navy)] transition hover:bg-[var(--tv-accent-muted)] focus-visible:outline-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={resetFilters}>Clear filters</button>}
                  </div>
                )}
              </div>
            </div>
            <p className="mb-0 mt-2 text-[10px] leading-relaxed text-[var(--tv-ink-48)]">Sample statuses are illustrative. Files added here are not uploaded to a server and remain pending review.</p>
          </section>

          <footer className="mt-10 flex flex-col gap-2 border-t border-[var(--tv-border)] pt-5 text-[10px] text-[var(--tv-ink-48)] sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 TraceVault · Demo workspace</span>
            <span>Session files and preview URLs are cleared when this page is left.</span>
          </footer>
        </div>
      </main>
      {selectedRecord && <EvidenceDetails record={selectedRecord} onClose={() => setSelectedId(null)} onRemove={removeUpload} textPreview={textPreview} textLoading={textLoading} />}
    </div>
  )
}

export default EvidenceVaultPage
