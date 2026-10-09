import { describe, it, expect } from 'vitest'
import {
  sha256Hex, captureItem, buildCase, verifyCase, custodySheet, caseRef, canonicalJson,
  type CaseMeta,
} from '../evidence'

// known-answer test: SHA-256 of empty input
const EMPTY_SHA = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

function fakeFile(name: string, size: number, type: string): File {
  return new File([new Uint8Array(size)], name, { type })
}

function fakeMeta(): CaseMeta {
  return {
    caseRef: caseRef(),
    victimName: 'Test Victim',
    incidentDate: '2026-10-09',
    createdAt: new Date().toISOString(),
    deviceModel: 'Pixel 8',
  }
}

describe('sha256Hex (known-answer)', () => {
  it('empty buffer hash matches NIST value', async () => {
    expect(await sha256Hex(new Uint8Array(0))).toBe(EMPTY_SHA)
  })
  it('produces 64-char lowercase hex', async () => {
    const h = await sha256Hex(new TextEncoder().encode('saboot'))
    expect(h).toMatch(/^[a-f0-9]{64}$/)
  })
  it('is deterministic for same input', async () => {
    const a = await sha256Hex(new TextEncoder().encode('saboot'))
    const b = await sha256Hex(new TextEncoder().encode('saboot'))
    expect(a).toBe(b)
  })
  it('changes if one byte changes', async () => {
    const x = new Uint8Array([1, 2, 3, 4])
    const y = new Uint8Array([1, 2, 3, 5])
    expect(await sha256Hex(x)).not.toBe(await sha256Hex(y))
  })
})

describe('canonicalJson (deterministic serialization)', () => {
  it('key order is irrelevant', () => {
    expect(canonicalJson({ a: 1, b: 2 })).toBe(canonicalJson({ b: 2, a: 1 }))
  })
  it('nested objects sorted too', () => {
    expect(canonicalJson({ x: { y: 1, z: 2 } })).toBe(canonicalJson({ x: { z: 2, y: 1 } }))
  })
  it('undefined fields dropped', () => {
    expect(canonicalJson({ a: 1, b: undefined })).toBe(canonicalJson({ a: 1 }))
  })
})

describe('chain of custody', () => {
  it('captureItem hashes the file and records metadata', async () => {
    const f = fakeFile('evidence.png', 2048, 'image/png')
    const it = await captureItem(f, {
      sourceApp: 'Instagram',
      whereFound: 'instagram.com/p/EXAMPLE',
      captureMethod: 'screenshot',
    })
    expect(it.hash).toMatch(/^[a-f0-9]{64}$/)
    expect(it.fileSize).toBe(2048)
    expect(it.fileName).toBe('evidence.png')
    expect(it.sourceApp).toBe('Instagram')
    expect(it.captureMethod).toBe('screenshot')
  })

  it('buildCase seals the manifest and verifyCase passes', async () => {
    const f = fakeFile('a.jpg', 100, 'image/jpeg')
    const it = await captureItem(f, {
      sourceApp: 'WhatsApp',
      whereFound: 'WhatsApp group "XYZ"',
      captureMethod: 'screenshot',
    })
    const c = await buildCase(fakeMeta(), [it])
    expect(c.manifestHash).toMatch(/^[a-f0-9]{64}$/)
    expect(await verifyCase(c)).toBe(true)
  })

  it('TAMPERING IS DETECTED: altered item breaks the seal', async () => {
    const f = fakeFile('a.jpg', 100, 'image/jpeg')
    const it = await captureItem(f, {
      sourceApp: 'WhatsApp',
      whereFound: 'somewhere',
      captureMethod: 'screenshot',
    })
    const c = await buildCase(fakeMeta(), [it])
    // attacker changes whereFound post-hoc
    const tampered: typeof c = structuredClone(c)
    tampered.items[0].whereFound = 'innocent-place'
    expect(await verifyCase(tampered)).toBe(false)
    // attacker adds an item post-hoc
    const extra = structuredClone(c)
    extra.items.push({ ...it, id: 'fake-item' })
    expect(await verifyCase(extra)).toBe(false)
    // attacker edits the timestamp
    const time = structuredClone(c)
    time.items[0].capturedAt = '1999-01-01T00:00:00Z'
    expect(await verifyCase(time)).toBe(false)
  })

  it('custodySheet renders all items with hashes and verify instructions', async () => {
    const f = fakeFile('proof.png', 5000, 'image/png')
    const it = await captureItem(f, {
      sourceApp: 'Instagram',
      whereFound: 'instagram.com/p/ABC',
      captureMethod: 'screenshot',
    })
    const c = await buildCase(fakeMeta(), [it])
    const sheet = custodySheet(c)
    expect(sheet).toContain('SABOOT — EVIDENCE CUSTODY RECORD')
    expect(sheet).toContain(c.meta.caseRef)
    expect(sheet).toContain(it.hash)
    expect(sheet).toContain('certutil -hashfile')
    expect(sheet).toContain('Section 63')
  })
})
