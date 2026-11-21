const EVIDENCE_STATUS_BY_FILTER = {
  verified: 'Verified',
  review: 'Needs review',
}

export function filterEvidence(records, filter) {
  if (filter === 'all') return records

  const status = EVIDENCE_STATUS_BY_FILTER[filter]
  if (!status) return []

  return records.filter((record) => record.status === status)
}
