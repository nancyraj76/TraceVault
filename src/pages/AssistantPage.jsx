import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Heart,
  MessageCircle,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import traceVaultLogo from '../assets/icon_tracevault.png'
import ThemeToggle from '../components/ThemeToggle.jsx'
import { ASSISTANT_CATEGORIES, getDemoResponse, SUGGESTED_QUESTIONS } from '../lib/assistantDemo.js'

const CATEGORY_ICONS = {
  about: BookOpen,
  'digital-safety': ShieldAlert,
  'emotional-support': Heart,
}

const CATEGORY_STYLES = {
  about: {
    accent: 'text-sky-500',
    dot: 'bg-sky-500',
    stripe: 'bg-sky-500',
    ring: 'ring-sky-500/25',
  },
  'digital-safety': {
    accent: 'text-amber-500',
    dot: 'bg-amber-500',
    stripe: 'bg-amber-500',
    ring: 'ring-amber-500/25',
  },
  'emotional-support': {
    accent: 'text-violet-500',
    dot: 'bg-violet-500',
    stripe: 'bg-violet-500',
    ring: 'ring-violet-500/25',
  },
}

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "Welcome to the TraceVault AI Assistant. I can help explain TraceVault and evidence integrity, think through online safety concerns, or find a calm next step. This is Demo Mode: replies are predefined, and I can't inspect files or verify an incident.",
  },
]

function AssistantMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <span className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[var(--tv-action-bg)] text-[var(--tv-action-fg)] shadow-[0_5px_14px_var(--tv-shadow-button)]" aria-hidden="true">
          <Sparkles className="h-4 w-4" strokeWidth={1.8} />
        </span>
      )}
      <div className={`flex max-w-[min(88%,46rem)] flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--tv-ink-48)]">{isUser ? 'You' : 'TraceVault guide'}</span>
        <p className={`m-0 whitespace-pre-wrap rounded-[1.25rem] px-4 py-3.5 text-[13px] leading-[1.7] sm:px-5 ${isUser ? 'rounded-br-md bg-[var(--tv-action-bg)] text-[var(--tv-action-fg)]' : 'rounded-bl-md border border-[var(--tv-border)] bg-[var(--tv-offwhite)] text-[var(--tv-navy)] shadow-[0_6px_20px_var(--tv-shadow-panel-soft)]'}`}>
          {message.content}
        </p>
      </div>
      {isUser && (
        <span className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]" aria-hidden="true">
          <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
        </span>
      )}
    </div>
  )
}

function DemoTypingIndicator() {
  return (
    <div className="flex items-end gap-3" role="status" aria-label="Preparing a predefined demo response">
      <span className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[var(--tv-action-bg)] text-[var(--tv-action-fg)]" aria-hidden="true">
        <Sparkles className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <span className="flex items-center gap-3 rounded-[1.25rem] rounded-bl-md border border-[var(--tv-border)] bg-[var(--tv-offwhite)] px-4 py-3.5 text-xs text-[var(--tv-ink-53)]">
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--tv-accent)]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--tv-accent)] [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--tv-accent)] [animation-delay:300ms]" />
        </span>
        Preparing a demo response…
      </span>
    </div>
  )
}

function CategoryPicker({ selectedCategory, onSelect }) {
  return (
    <section className="rounded-[1.6rem] border border-[var(--tv-border)] bg-[var(--tv-offwhite)] p-4 shadow-[0_10px_28px_var(--tv-shadow-panel-soft)] sm:p-5" aria-labelledby="category-picker-title">
      <div className="mb-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--tv-ink-48)]">Start with a focus</p>
        <h2 className="m-0 text-base font-semibold tracking-[-0.03em] text-[var(--tv-navy)]" id="category-picker-title">What do you need today?</h2>
      </div>
      <div className="grid gap-2.5">
        {ASSISTANT_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id]
          const style = CATEGORY_STYLES[category.id]
          const isSelected = selectedCategory === category.id

          return (
            <button
              className={`relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-[var(--tv-border)] px-3.5 py-3 pl-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)] ${isSelected ? `bg-[var(--tv-accent-muted)] ring-2 ${style.ring}` : 'bg-[var(--tv-lavender)] hover:bg-[var(--tv-accent-muted)]'}`}
              type="button"
              key={category.id}
              aria-pressed={isSelected}
              onClick={() => onSelect(category.id)}
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${style.stripe}`} aria-hidden="true" />
              <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--tv-offwhite)] ${style.accent}`} aria-hidden="true">
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-[var(--tv-navy)]">{category.label}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-[var(--tv-ink-62)]">{category.description}</span>
              </span>
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[var(--tv-lavender)] px-3 py-3 text-[11px] leading-relaxed text-[var(--tv-ink-62)]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tv-success)]" aria-hidden="true" />
        <p className="m-0">Your conversation stays in this page's memory and is cleared when you reset or leave.</p>
      </div>
    </section>
  )
}

function SuggestedQuestions({ isTyping, onAsk }) {
  return (
    <section className="rounded-[1.6rem] border border-[var(--tv-border)] bg-[var(--tv-offwhite)] p-4 shadow-[0_10px_28px_var(--tv-shadow-panel-soft)] sm:p-5" aria-labelledby="suggested-questions-title">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]" aria-hidden="true"><Sparkles className="h-4 w-4" /></span>
        <div>
          <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--tv-ink-48)]">A few starting points</p>
          <h2 className="m-0 text-sm font-semibold text-[var(--tv-navy)]" id="suggested-questions-title">Try asking</h2>
        </div>
      </div>
      <div className="grid gap-2">
        {SUGGESTED_QUESTIONS.map((prompt) => {
          const style = CATEGORY_STYLES[prompt.category]
          return (
            <button
              className="group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-[var(--tv-border)] bg-[var(--tv-lavender)] px-3 py-2.5 text-left text-[11px] font-medium leading-relaxed text-[var(--tv-ink-68)] transition hover:border-[var(--tv-ink-27)] hover:text-[var(--tv-navy)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)] disabled:cursor-wait disabled:opacity-60"
              type="button"
              key={prompt.text}
              disabled={isTyping}
              onClick={() => onAsk(prompt)}
            >
              <span className="min-w-0">{prompt.text}</span>
              <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </section>
  )
}

function AssistantPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('about')
  const [isTyping, setIsTyping] = useState(false)
  const transcriptRef = useRef(null)
  const timerRef = useRef(null)
  const messageSequence = useRef(0)
  const currentCategory = ASSISTANT_CATEGORIES.find(({ id }) => id === selectedCategory)

  useEffect(() => {
    const transcript = transcriptRef.current
    if (transcript) transcript.scrollTop = transcript.scrollHeight
  }, [messages, isTyping])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  function makeMessage(role, content) {
    messageSequence.current += 1
    return { id: `${role}-${messageSequence.current}`, role, content }
  }

  function clearConversation() {
    window.clearTimeout(timerRef.current)
    timerRef.current = null
    setMessages(INITIAL_MESSAGES)
    setDraft('')
    setSelectedCategory('about')
    setIsTyping(false)
  }

  function sendMessage(value = draft, category = selectedCategory) {
    const content = value.trim()
    if (!content || isTyping) return

    const userMessage = makeMessage('user', content)
    setMessages((current) => [...current, userMessage])
    setDraft('')
    setIsTyping(true)
    timerRef.current = window.setTimeout(() => {
      const assistantMessage = makeMessage('assistant', getDemoResponse(content, category))
      setMessages((current) => [...current, assistantMessage])
      setIsTyping(false)
      timerRef.current = null
    }, 500)
  }

  function askSuggestedQuestion(prompt) {
    setSelectedCategory(prompt.category)
    sendMessage(prompt.text, prompt.category)
  }

  return (
    <div className="min-h-screen bg-[var(--tv-lavender)] text-[var(--tv-navy)]">
      <header className="border-b border-[var(--tv-border)] bg-[var(--tv-offwhite)]">
        <div className="mx-auto flex min-h-[76px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <Link className="flex min-w-0 items-center gap-3 text-[var(--tv-navy)] no-underline" to="/dashboard" aria-label="TraceVault, back to dashboard">
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-[var(--tv-border)] bg-[var(--tv-white)]">
              <img className="h-10 w-10 object-contain" src={traceVaultLogo} alt="" />
            </span>
            <span className="truncate text-base font-semibold tracking-[-0.04em] sm:text-lg">TraceVault</span>
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link className="inline-flex min-h-10 items-center gap-2 rounded-xl px-2.5 text-xs font-semibold text-[var(--tv-ink-68)] no-underline transition hover:bg-[var(--tv-ink-07)] hover:text-[var(--tv-navy)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)] sm:px-3" to="/dashboard">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--tv-ink-53)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--tv-accent)]" aria-hidden="true" />
              A steady guide for digital evidence
            </p>
            <h1 className="m-0 text-[2rem] font-semibold leading-tight tracking-[-0.055em] text-[var(--tv-navy)] sm:text-[2.65rem]">AI Assistant</h1>
            <p className="mb-0 mt-2 max-w-2xl text-sm leading-relaxed text-[var(--tv-ink-68)]">Ask about evidence integrity, online safety, or a practical next step.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--tv-border)] bg-[var(--tv-offwhite)] px-3.5 py-2 text-[10px] font-semibold text-[var(--tv-ink-68)] shadow-[0_4px_14px_var(--tv-shadow-panel-soft)]">
            <span className="h-2 w-2 rounded-full bg-[var(--tv-success)]" aria-hidden="true" />
            Demo Mode — AI backend connection coming soon
          </span>
        </div>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-6">
          <section className="min-w-0 overflow-hidden rounded-[1.8rem] border border-[var(--tv-border)] bg-[var(--tv-offwhite)] shadow-[0_18px_54px_var(--tv-shadow-panel-soft)]" aria-labelledby="conversation-title">
            <div className="flex flex-col gap-3 border-b border-[var(--tv-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--tv-accent-muted)] text-[var(--tv-navy)]" aria-hidden="true"><MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.8} /></span>
                <div>
                  <h2 className="m-0 text-sm font-semibold text-[var(--tv-navy)]" id="conversation-title">Your conversation</h2>
                  <p className="mb-0 mt-0.5 text-[11px] text-[var(--tv-ink-53)]">Messages stay in page memory</p>
                </div>
              </div>
              <button className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl px-2.5 text-[11px] font-medium text-[var(--tv-ink-53)] transition hover:bg-[var(--tv-ink-07)] hover:text-[var(--tv-navy)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)]" type="button" onClick={clearConversation}>
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear conversation
              </button>
            </div>

            <div className="p-3 sm:p-5 lg:p-6">
              <div ref={transcriptRef} className="flex min-h-[390px] max-h-[64vh] flex-col gap-5 overflow-y-auto rounded-[1.4rem] bg-[var(--tv-lavender)] p-4 sm:min-h-[460px] sm:max-h-[680px] sm:gap-6 sm:p-6" aria-live="polite" aria-label="Conversation history">
                {messages.map((message) => <AssistantMessage message={message} key={message.id} />)}
                {isTyping && <DemoTypingIndicator />}
              </div>

              <div className="mt-3 flex items-center gap-2 px-1">
                <span className="text-[10px] font-medium text-[var(--tv-ink-48)]">Current focus</span>
                <span className={`rounded-full bg-[var(--tv-accent-muted)] px-2.5 py-1 text-[10px] font-semibold ${CATEGORY_STYLES[selectedCategory].accent}`}>
                  {currentCategory.label}
                </span>
              </div>

              <form className="mt-4 rounded-[1.4rem] border border-[var(--tv-border)] bg-[var(--tv-white)] p-2.5 shadow-[0_6px_22px_var(--tv-shadow-panel-soft)] transition focus-within:border-[var(--tv-ink-34)] focus-within:ring-4 focus-within:ring-[var(--tv-shadow-focus)] sm:mt-5 sm:p-3" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
                <label className="sr-only" htmlFor="assistant-message">Message the TraceVault AI Assistant</label>
                <textarea
                  className="max-h-40 min-h-[68px] w-full resize-y border-0 bg-transparent px-2.5 py-2 text-sm leading-relaxed text-[var(--tv-navy)] outline-none placeholder:text-[var(--tv-ink-38)] focus:ring-0"
                  id="assistant-message"
                  name="message"
                  rows={2}
                  placeholder="Share a question or tell me what kind of help you need…"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      sendMessage()
                    }
                  }}
                  disabled={isTyping}
                />
                <div className="flex items-center justify-between gap-3 border-t border-[var(--tv-border)] px-1 pt-2">
                  <span className="text-[10px] text-[var(--tv-ink-48)]">Enter to send · Shift + Enter for a new line</span>
                  <button className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--tv-action-bg)] px-4 text-xs font-semibold text-[var(--tv-action-fg)] transition hover:bg-[var(--tv-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tv-focus-ring)] disabled:cursor-not-allowed disabled:opacity-45" type="submit" aria-label="Send message" disabled={!draft.trim() || isTyping}>
                    <span className="hidden sm:inline">Send</span>
                    <Send className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                  </button>
                </div>
              </form>
              <p className="mb-0 mt-3 px-1 text-center text-[10px] leading-relaxed text-[var(--tv-ink-48)]">Predefined educational responses only. This assistant does not analyze files or make forensic findings.</p>
            </div>
          </section>

          <aside className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-1" aria-label="Assistant options">
            <CategoryPicker selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
            <div className="grid content-start gap-4">
              <SuggestedQuestions isTyping={isTyping} onAsk={askSuggestedQuestion} />
              <div className="rounded-[1.4rem] border border-[var(--tv-border)] bg-[var(--tv-accent-muted)] px-4 py-4 sm:px-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--tv-offwhite)] text-[var(--tv-navy)]" aria-hidden="true"><ShieldAlert className="h-[17px] w-[17px]" /></span>
                  <div>
                    <p className="mb-1 text-xs font-semibold text-[var(--tv-navy)]">If you feel in immediate danger</p>
                    <p className="m-0 text-[11px] leading-relaxed text-[var(--tv-ink-68)]">Contact local emergency services or a trusted person nearby. This assistant is not an emergency service.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-8 flex flex-col gap-2 border-t border-[var(--tv-border)] pt-4 text-[10px] leading-relaxed text-[var(--tv-ink-48)] sm:flex-row sm:items-center sm:justify-between">
          <span>TraceVault · Demo workspace</span>
          <span>Messages remain in React memory only and are not saved to localStorage.</span>
        </footer>
      </main>
    </div>
  )
}

export default AssistantPage
