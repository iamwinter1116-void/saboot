/**
 * SABOOT EVIDENCE ENGINE — forensic-grade capture for victims of
 * deepfake / synthetic-media abuse. Runs 100% on-device.
 *
 * Design (forensically meaningful, victim-simple):
 *  - SHA-256 hash of each evidence file (WebCrypto). The hash proves the
 *    file existed in this exact form at the recorded time — the platform
 *    can delete the post, but your Saboot record survives.
 *  - Chain-of-custody record per item: who captured, when, device, source
 *    app, hash, size, type — the fields an Investigating Officer asks for.
 *  - Case manifest: all records + a self-referencing integrity hash, so any
 *    later tampering with the manifest is detectable.
 *
 * SECURITY: nothing uploads. No server, no analytics, no storage beyond the
 * user's own downloads. For NCII victims this is the trust story itself.
 */

import { z } from 'zod'

export const SABOOT_VERSION = '1.0.0'

/** SHA-256 of a File/Buffer using WebCrypto (available in all modern
 *  browsers + Node 18+ test env). Returns lowercase hex. */
export async function sha256Hex(data: ArrayBuffer | Uint8Array<ArrayBuffer>): Promise<string> {
  const buf: ArrayBuffer =
    data instanceof Uint8Array ? (data.buffer as ArrayBuffer) : data
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ─── Chain-of-custody record ────────────────────────────────────────────────

export const SOURCE_APPS = [
  'WhatsApp', 'Instagram', 'Facebook', 'YouTube', 'X (Twitter)',
  'Telegram', 'Snapchat', 'ShareChat', 'Moj', 'Email', 'SMS', 'Other',
] as const

export const custodyItemSchema = z.object({
  id: z.string(),
  fileName: z.string().min(1),
  fileSize: z.number().int().nonnegative(),
  fileType: z.string(),
  hash: z.string().regex(/^[a-f0-9]{64}$/, 'SHA-256 hex'),
  capturedAt: z.string(), // ISO
  sourceApp: z.enum(SOURCE_APPS),
  /** free-text: where the content appeared, URL, account, group name */
  whereFound: z.string().min(3),
  /** how it was captured: screen-recording / screenshot / downloaded file / chat export */
  captureMethod: z.enum(['screenshot', 'screen-recording', 'downloaded-file', 'chat-export', 'photo-of-screen']),
  notes: z.string().optional(),
})
export type CustodyItem = z.infer<typeof custodyItemSchema>

export const caseMetaSchema = z.object({
  caseRef: z.string(), // SABOOT-<random>
  victimName: z.string().optional(), // optional — anonymity is allowed
  incidentDate: z.string(),
  createdAt: z.string(),
  deviceModel: z.string(),
})
export type CaseMeta = z.infer<typeof caseMetaSchema>

export interface CaseFile {
  sabootVersion: string
  meta: CaseMeta
  items: CustodyItem[]
  /** sha256 of the canonical JSON of {meta, items} — integrity seal */
  manifestHash: string
}

/** Deterministic JSON so the seal is reproducible. */
export function canonicalJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return `[${obj.map(canonicalJson).join(',')}]`
  const entries = Object.entries(obj as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`
}

export async function sealManifest(meta: CaseMeta, items: CustodyItem[]): Promise<string> {
  return sha256Hex(new TextEncoder().encode(canonicalJson({ meta, items })))
}

export async function buildCase(
  meta: CaseMeta,
  items: CustodyItem[],
): Promise<CaseFile> {
  for (const it of items) custodyItemSchema.parse(it)
  caseMetaSchema.parse(meta)
  const manifestHash = await sealManifest(meta, items)
  return { sabootVersion: SABOOT_VERSION, meta, items, manifestHash }
}

/** Verify a CaseFile's integrity seal (detects post-hoc tampering). */
export async function verifyCase(c: CaseFile): Promise<boolean> {
  return (await sealManifest(c.meta, c.items)) === c.manifestHash
}

/** Create one custody item from a picked file. */
export async function captureItem(
  file: File,
  opts: Pick<CustodyItem, 'sourceApp' | 'whereFound' | 'captureMethod' | 'notes'>,
): Promise<CustodyItem> {
  const hash = await sha256Hex(await file.arrayBuffer())
  return {
    id: `S-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'application/octet-stream',
    hash,
    capturedAt: new Date().toISOString(),
    sourceApp: opts.sourceApp,
    whereFound: opts.whereFound,
    captureMethod: opts.captureMethod,
    notes: opts.notes,
  }
}

/** Human-readable custody sheet — printable, openable anywhere. */
export function custodySheet(c: CaseFile): string {
  const L: string[] = []
  L.push('SABOOT — EVIDENCE CUSTODY RECORD')
  L.push('==================================')
  L.push(`Case Ref        : ${c.meta.caseRef}`)
  L.push(`Victim          : ${c.meta.victimName || '(name withheld — permitted)'}`)
  L.push(`Incident date   : ${c.meta.incidentDate}`)
  L.push(`Record created  : ${c.meta.createdAt}`)
  L.push(`Captured on     : ${c.meta.deviceModel}`)
  L.push(`Saboot version  : ${c.sabootVersion}`)
  L.push('')
  L.push(`MANIFEST INTEGRITY SEAL (SHA-256): ${c.manifestHash}`)
  L.push('Any change to this record breaks the seal — tampering is detectable.')
  L.push('')
  c.items.forEach((it, i) => {
    L.push(`ITEM ${i + 1} of ${c.items.length}`)
    L.push(`  File          : ${it.fileName} (${(it.fileSize / 1024).toFixed(1)} KB, ${it.fileType})`)
    L.push(`  SHA-256       : ${it.hash}`)
    L.push(`  Captured at   : ${it.capturedAt}`)
    L.push(`  Source app    : ${it.sourceApp}`)
    L.push(`  Found at      : ${it.whereFound}`)
    L.push(`  Capture method: ${it.captureMethod}`)
    if (it.notes) L.push(`  Notes         : ${it.notes}`)
    L.push('')
  })
  L.push('HOW TO VERIFY A HASH:')
  L.push('  certutil -hashfile "<file>" SHA256      (Windows)')
  L.push('  shasum -a 256 "<file>"                   (Mac/Linux)')
  L.push('  The output must exactly match the SHA-256 above.')
  L.push('')
  L.push('LEGAL NOTE: Digital records are admissible evidence under Section 63,')
  L.push('Bharatiya Sakshya Adhiniyam, 2023. This record documents existence and')
  L.push('integrity of the listed files at capture time. It does not itself prove')
  L.push('authorship of the content. Report offences: cybercrime.gov.in / 1930.')
  return L.join('\n')
}

export function caseRef(): string {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `SABOOT-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}
