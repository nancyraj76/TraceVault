import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getConfirmPasswordError,
  getEmailError,
  getLoginPasswordError,
  getPasswordRequirements,
  getSignupPasswordError,
  normalizeEmail,
} from '../src/lib/authValidation.js'

test('email validation accepts standard addresses and trims whitespace', () => {
  assert.equal(normalizeEmail('  first.last+tag@sub.example.co  '), 'first.last+tag@sub.example.co')
  assert.equal(getEmailError(' user@example.com '), '')
  assert.equal(getEmailError('first.last+tag@sub.example.co'), '')
})

test('email validation rejects malformed local parts and domains', () => {
  const malformedEmails = [
    '',
    'missing-at.example.com',
    'user@@example.com',
    '@example.com',
    'user@',
    'user@example',
    '.user@example.com',
    'user..name@example.com',
    'user name@example.com',
    'user@-example.com',
    'user@example-.com',
    'user@example..com',
    'user@exam_ple.com',
  ]

  for (const email of malformedEmails) {
    assert.notEqual(getEmailError(email), '', `Expected ${JSON.stringify(email)} to be rejected`)
  }
})

test('signup password checklist reports each complexity requirement', () => {
  assert.deepEqual(
    getPasswordRequirements('Abcdefg1!').map(({ key, met }) => [key, met]),
    [['length', true], ['lowercase', true], ['uppercase', true], ['number', true], ['special', true]],
  )
  assert.equal(getSignupPasswordError('Abcdefg1!'), '')

  const invalidPasswords = ['Ab1!', 'abcdefgh1!', 'ABCDEFGH1!', 'Abcdefgh!', 'Abcdefgh1']
  for (const password of invalidPasswords) {
    assert.notEqual(getSignupPasswordError(password), '', `Expected ${JSON.stringify(password)} to be rejected`)
  }
})

test('confirm password requires a value and an exact match', () => {
  assert.notEqual(getConfirmPasswordError('Abcdefg1!', ''), '')
  assert.notEqual(getConfirmPasswordError('Abcdefg1!', 'Abcdefg2!'), '')
  assert.equal(getConfirmPasswordError('Abcdefg1!', 'Abcdefg1!'), '')
})

test('login accepts any non-empty password without signup complexity rules', () => {
  assert.notEqual(getLoginPasswordError(''), '')
  assert.equal(getLoginPasswordError('x'), '')
})
