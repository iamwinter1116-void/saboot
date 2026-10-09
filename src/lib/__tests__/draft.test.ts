import { describe, it, expect } from 'vitest'
import { triage, helplines, type TriageAnswers } from '../triage'
import { draftDocument, type DraftInput } from '../draft'
import { buildCase, caseRef, type CaseMeta } from '../evidence'

async function mkCase() {
  const meta: CaseMeta = {
    caseRef: caseRef(),
    victimName: 'Test Victim',
    incidentDate: '2026-10-09',
    createdAt: new Date().toISOString(),
    deviceModel: 'Pixel 8',
  }
  return buildCase(meta, [])
}

function mkDraftInput(caseFile: Awaited<ReturnType<typeof mkCase>>): DraftInput {
  return {
    type: 'platform-ncii',
    platform: 'Instagram',
    grievanceEmail: 'grievance-officer@meta.com',
    complainantName: 'Test Victim',
    complainantContact: '+91-98xxxxxx21',
    contentUrls: ['https://instagram.com/p/BADPOST1'],
    uploaderId: '@badactor',
    incidentSummary: 'A morphed explicit image of me was posted by this account.',
    caseFile,
  }
}

describe('triage', () => {
  it('sextortion (intimate + extortion): do-not-pay is the FIRST action, ordered now', () => {
    const a: TriageAnswers = { intimate: true, extortion: true, minor: false, publicPost: true }
    const p = triage(a)
    expect(p.steps[0].when).toBe('now')
    expect(p.steps[0].text.toLowerCase()).toContain('do not pay')
    expect(p.legalClock).toContain('2 HOURS')
  })
  it('minor + intimate → CSAM pathway + 1098', () => {
    const a: TriageAnswers = { intimate: true, extortion: false, minor: true, publicPost: false }
    const p = triage(a)
    expect(p.headline).toContain('CSAM')
    const hs = helplines(a).map((h) => h.name)
    expect(hs).toContain('1098')
    expect(hs).toContain('POCSO e-box')
    expect(p.steps.some((s) => s.text.includes('S.308'))).toBe(false) // no extortion flag
  })
  it('extortion adds S.308 BNS step', () => {
    const a: TriageAnswers = { intimate: false, extortion: true, minor: false, publicPost: true }
    const p = triage(a)
    expect(p.steps.some((s) => s.text.includes('S.308 BNS 2023'))).toBe(true)
    expect(p.steps.some((s) => s.text.toLowerCase().includes('do not pay'))).toBe(true)
  })
  it('generic deepfake (no intimate, no extortion) → 3-hour clock', () => {
    const a: TriageAnswers = { intimate: false, extortion: false, minor: false, publicPost: true }
    const p = triage(a)
    expect(p.legalClock).toContain('3-hour')
  })
  it('steps are ordered now → today → this-week', () => {
    const a: TriageAnswers = { intimate: true, extortion: true, minor: false, publicPost: true }
    const order = { now: 0, today: 1, 'this-week': 2 }
    const seq = triage(a).steps.map((s) => order[s.when])
    const sorted = [...seq].sort((x, y) => x - y)
    expect(seq).toEqual(sorted)
  })
  it('helplines always include cybercrime.gov.in + gac.gov.in', () => {
    const a: TriageAnswers = { intimate: false, extortion: false, minor: false, publicPost: false }
    const names = helplines(a).map((h) => h.name)
    expect(names).toContain('cybercrime.gov.in')
    expect(names).toContain('gac.gov.in')
  })
})

describe('drafts', () => {
  it('NCII notice: cites 2-hour window, Rule 3(2)(b), seal, hashes, gac.gov.in', async () => {
    const c = await mkCase()
    const doc = draftDocument(mkDraftInput(c))
    expect(doc).toContain('TWO (2) HOURS')
    expect(doc).toContain('Rule 3(2)(b)')
    expect(doc).toContain('gac.gov.in')
    expect(doc).toContain('SHA-256')
    expect(doc).toContain('grievance-officer@meta.com')
    expect(doc).toContain('https://instagram.com/p/BADPOST1')
  })
  it('cyber-cell complaint: cites BNSS S.173, Lalita Kumari, S.66E, BSA S.63', async () => {
    const c = await mkCase()
    const doc = draftDocument({ ...mkDraftInput(c), type: 'cyber-cell' })
    expect(doc).toContain('S.173')
    expect(doc).toContain('Lalita Kumari')
    expect(doc).toContain('S.66E')
    expect(doc).toContain('Section 63')
  })
  it('SGI notice: cites 3-hour window + SGI definition', async () => {
    const c = await mkCase()
    const doc = draftDocument({ ...mkDraftInput(c), type: 'platform-sgi' })
    expect(doc).toContain('THREE (3) HOURS')
    expect(doc.toLowerCase()).toContain('synthetically generated')
  })
  it('GAC appeal: cites 30-day window', async () => {
    const c = await mkCase()
    const doc = draftDocument({ ...mkDraftInput(c), type: 'gac-appeal' })
    expect(doc).toContain('30 days')
    expect(doc).toContain('Grievance Appellate')
  })
  it('impersonation notice: cites S.66D and account suspension demand', async () => {
    const c = await mkCase()
    const doc = draftDocument({ ...mkDraftInput(c), type: 'platform-impersonation' })
    expect(doc).toContain('S.66D')
    expect(doc).toContain('suspend the impersonating account')
  })
  it('minor flag adds heightened-obligations note to NCII notice', async () => {
    const c = await mkCase()
    const doc = draftDocument({ ...mkDraftInput(c), isMinor: true })
    expect(doc).toContain('minor')
  })
})
