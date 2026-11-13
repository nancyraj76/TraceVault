const EMAIL_LOCAL_PART = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/
const EMAIL_DOMAIN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/

export const PASSWORD_REQUIREMENTS = [
  { key: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { key: 'lowercase', label: 'At least one lowercase letter', test: (value) => /[a-z]/.test(value) },
  { key: 'uppercase', label: 'At least one uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { key: 'number', label: 'At least one number', test: (value) => /[0-9]/.test(value) },
  { key: 'special', label: 'At least one special character', test: (value) => /[^A-Za-z0-9\s]/.test(value) },
]

export function normalizeEmail(value) {
  return String(value ?? '').trim()
}

export function getEmailError(value) {
  const email = normalizeEmail(value)
  if (!email) return 'Enter your email address.'

  const [localPart, domain, ...extraParts] = email.split('@')
  if (
    extraParts.length > 0 ||
    localPart.length > 64 ||
    email.length > 254 ||
    !EMAIL_LOCAL_PART.test(localPart) ||
    !EMAIL_DOMAIN.test(domain ?? '')
  ) {
    return 'Enter a valid email address, such as name@example.com.'
  }

  return ''
}

export function getPasswordRequirements(value) {
  const password = String(value ?? '')
  return PASSWORD_REQUIREMENTS.map(({ key, label, test }) => ({
    key,
    label,
    met: test(password),
  }))
}

export function getSignupPasswordError(value) {
  const password = String(value ?? '')
  if (!password) return 'Enter a password.'
  if (getPasswordRequirements(password).some((requirement) => !requirement.met)) {
    return 'Your password must meet all the requirements below.'
  }
  return ''
}

export function getLoginPasswordError(value) {
  return String(value ?? '').length > 0 ? '' : 'Enter your password.'
}

export function getConfirmPasswordError(password, confirmation) {
  if (!confirmation) return 'Confirm your password.'
  return password === confirmation ? '' : 'Passwords do not match.'
}

export function getFullNameError(value) {
  const name = String(value ?? '').trim()
  if (!name) return 'Enter your full name.'
  if (name.length < 2) return 'Enter at least 2 characters.'
  return ''
}
