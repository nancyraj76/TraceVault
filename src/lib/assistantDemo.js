export const ASSISTANT_CATEGORIES = [
  {
    id: 'about',
    label: 'About TraceVault',
    description: 'Evidence integrity, verification, and how TraceVault works.',
    accent: 'sky',
  },
  {
    id: 'digital-safety',
    label: 'Digital Safety Help',
    description: 'Practical steps for suspicious content, scams, and harassment.',
    accent: 'amber',
  },
  {
    id: 'emotional-support',
    label: 'Emotional Support',
    description: 'A calm place to sort out a difficult online situation.',
    accent: 'violet',
  },
]

export const SUGGESTED_QUESTIONS = [
  { text: 'Tell me about TraceVault.', category: 'about' },
  { text: 'What should I do if someone shares a deepfake of me?', category: 'digital-safety' },
  { text: 'How can I preserve digital evidence?', category: 'digital-safety' },
  { text: 'What does a hash mismatch mean?', category: 'about' },
  { text: "I'm feeling unsafe online. Can you help?", category: 'emotional-support' },
]

const matchesAny = (text, phrases) => phrases.some((phrase) => text.includes(phrase))

function isImmediatePhysicalDanger(question) {
  const clearDangerPhrases = [
    'immediate physical danger',
    'physical danger',
    'in immediate danger',
    'someone is outside',
    'someone is at my door',
    'being followed',
    'someone is following me',
    'threatening to hurt me',
    'might hurt me',
    'at risk of being hurt',
  ]

  return matchesAny(question, clearDangerPhrases)
    || (question.includes('right now') && matchesAny(question, ['unsafe', 'danger', 'hurt', 'threat']))
}

export function getDemoResponse(question, selectedCategory = 'about') {
  const normalized = question.trim().toLowerCase()

  if (isImmediatePhysicalDanger(normalized)) {
    return "I'm sorry this is happening. Your safety comes first. If you may be in immediate physical danger, contact your local emergency services or a trusted person nearby now, and move to a safer place if you can. This demo assistant is not an emergency service."
  }

  if (matchesAny(normalized, ['hash mismatch', 'hash does not match', "hash doesn't match", 'different hash', 'mismatch'])) {
    return 'A hash mismatch means the calculated digest differs from the reference digest. It can indicate that a file changed, or that the two values were produced from different files or processes. Keep the original and both recorded values, check how each hash was made, and review the custody record before drawing conclusions. A mismatch alone does not explain what happened.'
  }

  if (matchesAny(normalized, ['sha-256', 'sha256', 'sha 256'])) {
    return 'SHA-256 is a cryptographic hash function that produces a 256-bit digest from file data. If the data changes, its digest will usually change too, so a recorded hash can help compare a file with an earlier reference. A matching hash supports that the compared file is unchanged since that reference point; it does not prove who created it or whether its contents are authentic.'
  }

  if (matchesAny(normalized, ['chain of custody', 'custody record', 'custody log'])) {
    return 'Chain of custody is the documented history of how evidence was collected, accessed, transferred, and stored. A useful record notes dates and times, who handled the item, what action they took, and where it was kept. This helps reviewers understand how evidence was managed, but it does not by itself prove that the evidence is genuine.'
  }

  if (matchesAny(normalized, ['tell me about tracevault', 'what is tracevault', 'what does tracevault do', 'about tracevault'])) {
    return 'TraceVault is a digital evidence workspace concept for organizing evidence and reviewing integrity information. It is designed to help document evidence, compare file hashes, and keep a record of handling. This project is currently a demo: the sample dashboard data is illustrative, and no real evidence is being processed here.'
  }

  const mentionsDeepfake = matchesAny(normalized, ['deepfake', 'synthetic media', 'fake video', 'fake audio', 'manipulated video'])
  const describesSharing = matchesAny(normalized, ['share', 'post', 'publish', 'upload', 'circulat', 'send', 'blackmail', 'extort', 'of me', 'my face', 'my voice'])

  if (mentionsDeepfake && describesSharing) {
    return "I'm sorry you're dealing with this. It can feel exposing and upsetting. If it's safe, preserve the original message or file, the page or profile URL, account details, and dates and times; take screenshots that include context, and avoid editing or reposting the content. Report it through the platform and consider telling someone you trust. If anyone is threatening immediate physical harm, contact local emergency services or a trusted person nearby. I can't verify the content or provide legal advice in this demo."
  }

  if (matchesAny(normalized, ['scam', 'phishing', 'suspicious link', 'fraud', 'someone asking for a code', 'payment request'])) {
    return "That sounds stressful. Don't click links, send money, or share passwords or verification codes while you check it. Save the message, sender details, URL, and time it arrived. Contact the organization through a phone number or website you already know is genuine. If you shared a password, change it using the official site and turn on multi-factor authentication; contact your bank through its official channel if payment information may be involved."
  }

  if (matchesAny(normalized, ['harass', 'harassment', 'threat', 'blackmail', 'doxx', 'impersonat', 'being bullied'])) {
    return "I'm sorry this is happening. If it's safe, keep the original messages, profile names, URLs, and timestamps, and take screenshots with enough context to show where they came from. Avoid replying if that could escalate things; use the platform's block and report tools, review your privacy settings, and tell someone you trust. If there is an immediate physical threat, contact local emergency services or a trusted person nearby."
  }

  if (matchesAny(normalized, ['preserve digital evidence', 'preserve evidence', 'save digital evidence', 'keep evidence', 'collect evidence'])) {
    return "A few careful steps can help preserve context: keep the original file or message unchanged; record where it came from, the URL or account, and the date, time, and time zone; and capture screenshots or a screen recording that show surrounding context. Export a conversation when the service allows it, keep a secure backup, and avoid cropping, annotating, or reposting the original. A SHA-256 hash can help compare a file later if you have a trusted tool. I can't inspect or verify evidence in this demo."
  }

  const questionsVideoAuthenticity = normalized.includes('video')
    && matchesAny(normalized, ['suspicious', 'fake', 'real', 'authentic', 'edited', 'manipulated'])

  if (questionsVideoAuthenticity || matchesAny(normalized, ['suspicious clip', 'is this clip real'])) {
    return "A video that looks unusual isn't automatically fake; compression, filters, edits, and recording conditions can all affect how it appears. Check the original source and surrounding context, compare independent copies if available, and treat detector results as clues rather than proof. Preserve the original file and its source details. This demo can't watch or verify a specific video."
  }

  if (mentionsDeepfake) {
    return 'Reviewing a suspected deepfake can involve checking provenance and metadata, looking for visual or audio inconsistencies, and comparing independent detector results. Compression and editing can create misleading artifacts, and automated scores are only signals for further review. Use multiple sources of context and corroboration. This demo cannot analyze a video or verify whether a specific clip is authentic.'
  }

  if (matchesAny(normalized, ['verify evidence', 'evidence verification', 'verify a file', 'file integrity', 'integrity check'])) {
    return 'A common integrity check calculates a cryptographic hash for a file and compares it with a value recorded earlier. Matching values support that the file is unchanged since that reference point. They do not show who created the file, whether it is truthful, or what happened before the reference hash was recorded.'
  }

  if (matchesAny(normalized, ['unsafe online', 'feeling unsafe', 'feel unsafe', 'scared', 'afraid', 'frightened', 'upset', 'overwhelmed', 'anxious', 'panicking', 'confused', 'feel alone'])) {
    return "I'm sorry you're feeling this way. You deserve to be treated with care, and you don't have to work through it alone. Are you physically safe right now? If you may be in immediate physical danger, contact local emergency services or someone you trust nearby. If the concern is online, you can stop engaging if safe, preserve messages and links, use block or report tools, and reach out to a trusted person. I'm a demo guide, not a therapist, lawyer, or emergency service."
  }

  if (selectedCategory === 'digital-safety') {
    return "I don't have a prepared response for that specific question yet. I can help with suspicious content, online scams, harassment, or preserving digital evidence. This is a predefined demo with no AI backend, and it can't inspect an incident or verify evidence."
  }

  if (selectedCategory === 'emotional-support') {
    return "I'm sorry this feels difficult. I don't have a prepared response for that specific question, and this demo isn't a therapist, lawyer, or emergency service. You don't have to sort everything out at once; consider reaching out to someone you trust. If you're in immediate physical danger, contact local emergency services or a trusted person nearby now."
  }

  return "I don't have a prepared response for that question yet. This assistant is in Demo Mode, with no AI backend connected, and it can't analyze files or verify incidents. Try a suggested question about TraceVault, deepfakes, online safety, preserving evidence, or hash mismatches."
}
