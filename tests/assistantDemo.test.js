import assert from 'node:assert/strict'
import test from 'node:test'
import { ASSISTANT_CATEGORIES, getDemoResponse, SUGGESTED_QUESTIONS } from '../src/lib/assistantDemo.js'

test('assistant offers all three categories and the five requested prompts', () => {
  assert.deepEqual(ASSISTANT_CATEGORIES.map(({ id }) => id), ['about', 'digital-safety', 'emotional-support'])
  assert.deepEqual(SUGGESTED_QUESTIONS.map(({ text }) => text), [
    'Tell me about TraceVault.',
    'What should I do if someone shares a deepfake of me?',
    'How can I preserve digital evidence?',
    'What does a hash mismatch mean?',
    "I'm feeling unsafe online. Can you help?",
  ])
})

test('about responses explain SHA-256 without overclaiming file authenticity', () => {
  const response = getDemoResponse('What is SHA-256?')

  assert.match(response, /256-bit digest/)
  assert.match(response, /does not prove who created it/i)
})

test('hash mismatch responses recommend preservation and avoid assigning a cause', () => {
  const response = getDemoResponse('What does a hash mismatch mean?')

  assert.match(response, /Keep the original and both recorded values/)
  assert.match(response, /does not explain what happened/)
})

test('about responses explain TraceVault and chain of custody', () => {
  assert.match(getDemoResponse('Tell me about TraceVault.'), /digital evidence workspace concept/)
  assert.match(getDemoResponse('What is chain of custody?'), /history of how evidence was collected, accessed, transferred, and stored/)
})

test('digital safety responses give practical steps for a shared deepfake', () => {
  const response = getDemoResponse('What should I do if someone shares a deepfake of me?', 'digital-safety')

  assert.match(response, /preserve the original message or file/)
  assert.match(response, /Report it through the platform/)
  assert.match(response, /can't verify the content/)
})

test('suspicious video guidance treats detector results as clues, not proof', () => {
  const response = getDemoResponse('This video seems suspicious. Is it real?', 'digital-safety')

  assert.match(response, /isn't automatically fake/)
  assert.match(response, /clues rather than proof/)
  assert.match(response, /can't watch or verify a specific video/)
})

test('evidence preservation guidance keeps originals and context intact', () => {
  const response = getDemoResponse('How can I preserve digital evidence?', 'digital-safety')

  assert.match(response, /keep the original file or message unchanged/)
  assert.match(response, /date, time, and time zone/)
  assert.match(response, /can't inspect or verify evidence/)
})

test('emotional support is empathetic and gives a safe next step', () => {
  const response = getDemoResponse("I'm feeling unsafe online. Can you help?", 'emotional-support')

  assert.match(response, /I'm sorry you're feeling this way/)
  assert.match(response, /Are you physically safe right now/)
  assert.match(response, /not a therapist, lawyer, or emergency service/)
})

test('immediate physical danger prompts local emergency or trusted-person help', () => {
  const response = getDemoResponse("I'm in immediate physical danger")

  assert.match(response, /local emergency services or a trusted person nearby/)
  assert.match(response, /not an emergency service/)
})

test('unsupported questions disclose the demo limitation', () => {
  const response = getDemoResponse('Can you plan a vacation for me?')

  assert.match(response, /don't have a prepared response/i)
  assert.match(response, /Demo Mode/)
  assert.match(response, /can't analyze files or verify incidents/)
})
