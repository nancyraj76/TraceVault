import assert from 'node:assert/strict'
import test from 'node:test'
import { filterEvidence } from '../src/lib/evidenceFilters.js'

const evidence = [
  { id: 1, status: 'Verified' },
  { id: 2, status: 'Verified' },
  { id: 3, status: 'Needs review' },
]

test('all evidence filter returns every record', () => {
  assert.deepEqual(filterEvidence(evidence, 'all'), evidence)
})

test('verified filter returns only verified records', () => {
  assert.deepEqual(filterEvidence(evidence, 'verified'), [
    { id: 1, status: 'Verified' },
    { id: 2, status: 'Verified' },
  ])
})

test('needs review filter returns only records requiring review', () => {
  assert.deepEqual(filterEvidence(evidence, 'review'), [
    { id: 3, status: 'Needs review' },
  ])
})

test('filter returns an empty list when nothing matches', () => {
  assert.deepEqual(filterEvidence([{ status: 'Verified' }], 'review'), [])
})
