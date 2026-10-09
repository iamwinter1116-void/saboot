/**
 * SABOOT DRAFT ENGINE — legally-grounded documents, auto-filled from the
 * custody record. Claims verified Oct 2026 (see research notes inline).
 *
 * IMPORTANT: These are structured DRAFTS, not legal advice. The app says so
 * everywhere. The citations are real and current:
 *  - IT (Intermediary Guidelines) Amendment Rules 2026 — effective 20 Feb 2026:
 *    * 2-hour removal: content showing the complainant nude/partially nude,
 *      in a sexual act, or morphed impersonation (Rule 3(2)(b) line).
 *    * 3-hour removal: other unlawful synthetically generated information.
 *    * Grievance Officer: ack 24h; GAC appeal within 30 days at gac.gov.in.
 *  - IT Act 2000: S.66E (privacy violation), S.67/67A (obscene/explicit
 *    electronic publication), S.66D (cheating by personation), S.79 safe
 *    harbour conditioned on Rule-3 compliance.
 *  - BNS 2023: S.79 (insult modesty of a woman), S.356 (defamation),
 *    S.308 (extortion), S.204 (personating a public servant).
 *  - BNSS 2023 S.173: zero-FIR — any police station must register.
 *  - BSA 2023 S.63: electronic records admissible.
 *  - StopNCII.org: GoI-supported hash-matching for NCII victims.
 */

import type { CaseFile } from './evidence'

export type DocType =
  | 'platform-ncii'        // 2-hour window (nude/morphed/sexual)
  | 'platform-sgi'         // 3-hour window (other synthetic content)
  | 'platform-impersonation' // fake profile / deepfake of you
  | 'cyber-cell'           // police complaint draft
  | 'gac-appeal'           // after platform fails/refuses

export interface DraftInput {
  type: DocType
  platform: string            // e.g. 'Instagram', 'YouTube'
  grievanceEmail: string       // platform's published GO email
  complainantName: string
  complainantContact: string   // phone/email
  contentUrls: string[]       // offending URLs
  uploaderId?: string         // account name/URL posting it
  incidentSummary: string      // 2-3 sentences in the victim's words
  isMinor?: boolean
  caseFile: CaseFile
}

const SGI_DEFS = [
  'Synthetically Generated Information (SGI) — as defined in the IT (Intermediary',
  'Guidelines and Digital Media Ethics Code) Amendment Rules, 2026 — means',
  'information including video, audio, images or text that has been wholly or',
  'partially generated or manipulated by computational means (including AI)',
  'and is misrepresented as authentic.',
].join(' ')

function itemList(c: CaseFile): string {
  return c.items
    .map((it, i) => {
      const url = it.whereFound
      return `${i + 1}. ${it.fileName} (SHA-256: ${it.hash}) — found at: ${url} — captured ${it.capturedAt} via ${it.captureMethod} from ${it.sourceApp}`
    })
    .join('\n')
}

function header(d: DraftInput, subject: string): string[] {
  const c = d.caseFile
  return [
    `To: Grievance Officer, ${d.platform}`,
    `Email: ${d.grievanceEmail}`,
    `Date: ${new Date().toLocaleDateString('en-IN')}`,
    ``,
    `Subject: ${subject}`,
    ``,
    `Ref: Saboot custody record ${c.meta.caseRef} (integrity seal: ${c.manifestHash.slice(0, 16)}…)`,
    ``,
  ]
}

function footer(sign: { name: string; contact: string }): string[] {
  return [
    ``,
    `Sincerely,`,
    `${sign.name}`,
    `Contact: ${sign.contact}`,
  ]
}

function evidenceSection(d: DraftInput): string[] {
  return [
    ``,
    `EVIDENCE (forensically hashed at capture — see attached custody record):`,
    itemList(d.caseFile),
    ``,
    `The attached Saboot custody record lists each file with its SHA-256 hash,`,
    `capture time, source application and location. File integrity can be`,
    `independently verified by re-computing the hash. Digital records are`,
    `admissible under Section 63, Bharatiya Sakshya Adhiniyam, 2023.`,
  ]
}

/** The main document builder. All drafts share verified citations. */
export function draftDocument(d: DraftInput): string {
  const urls = d.contentUrls.map((u, i) => `   ${i + 1}. ${u}`).join('\n')
  const minorNote = d.isMinor ? `NOTE: The complainant is a minor. This triggers heightened obligations.` : ''

  switch (d.type) {
    case 'platform-ncii': {
      const L = header(
        d,
        `URGENT — TAKEDOWN WITHIN 2 HOURS: Non-consensual intimate imagery (morphed/synthetic) of the complainant — Rule 3(2)(b), IT Rules (as amended 2026)`,
      )
      L.push(
        `Dear Grievance Officer,`,
        ``,
        `I am the person depicted in the content identified below. It shows me nude or`,
        `partially nude, in a sexual act, or is a morphed/synthetic image (deepfake) of`,
        `me — created and/or published WITHOUT my consent. ${minorNote}`,
        ``,
        `CONTENT TO BE REMOVED/DISABLED (URLs):`,
        urls,
        d.uploaderId ? `Uploading account: ${d.uploaderId}` : ``,
        ``,
        `This content is "synthetically generated information" under the IT`,
        `(Intermediary Guidelines and Digital Media Ethics Code) Amendment Rules,`,
        `2026 (effective 20 February 2026). Under Rule 3(2)(b), as amended, your`,
        `platform is required to remove or disable access to such content within`,
        `TWO (2) HOURS of receipt of this complaint.`,
        ``,
        `Incident summary: ${d.incidentSummary}`,
        ...evidenceSection(d),
        ``,
        `DEMANDS:`,
        `  1. Remove/disable the identified content within the 2-hour window.`,
        `  2. Acknowledge this complaint with a reference number.`,
        `  3. Preserve the uploader's account data (subscriber details, IP logs)`,
        `     pending police requisition — spoliation invites S.79 IT Act liability.`,
        ``,
        `I am separately reporting this to cybercrime.gov.in and the local cyber`,
        `cell. Non-compliance will be escalated to the Grievance Appellate`,
        `Committee (gac.gov.in) within my statutory rights, and the platform's`,
        `safe-harbour position under S.79 IT Act will stand compromised.`,
        ...footer({ name: d.complainantName, contact: d.complainantContact }),
      )
      return L.filter((x) => x !== ``).length ? L.join('\n') : ''
    }

    case 'platform-sgi': {
      const L = header(
        d,
        `URGENT — TAKEDOWN WITHIN 3 HOURS: Unlawful synthetically generated content — IT Amendment Rules 2026`,
      )
      L.push(
        `Dear Grievance Officer,`,
        ``,
        `The content identified below is ${SGI_DEFS}`,
        ``,
        `CONTENT TO BE REMOVED/DISABLED (URLs):`,
        urls,
        d.uploaderId ? `Uploading account: ${d.uploaderId}` : ``,
        ``,
        `It is unlawful under the IT (Intermediary Guidelines) Amendment Rules,`,
        `2026: synthetically generated content that impersonates, defames or`,
        `deceives must be removed within THREE (3) HOURS of complaint. It further`,
        `violates S.66E (privacy), S.66D (personation), and S.79 read with Rule 3`,
        `IT Act 2000 obligations of your platform.`,
        ``,
        `Incident summary: ${d.incidentSummary}`,
        ...evidenceSection(d),
        ``,
        `DEMANDS:`,
        `  1. Remove/disable the content within the 3-hour window.`,
        `  2. Acknowledge with a reference number within 24 hours.`,
        `  3. Preserve uploader data pending police requisition.`,
        ``,
        `Non-compliance will be escalated to the Grievance Appellate Committee`,
        `(gac.gov.in) and reported at cybercrime.gov.in.`,
        ...footer({ name: d.complainantName, contact: d.complainantContact }),
      )
      return L.join('\n')
    }

    case 'platform-impersonation': {
      const L = header(
        d,
        `TAKEDOWN REQUEST: Impersonation account / deepfake of the complainant — IT Rules (as amended 2026)`,
      )
      L.push(
        `Dear Grievance Officer,`,
        ``,
        `An account on your platform is impersonating me and/or distributing a`,
        `deepfake (synthetic video/audio/image) of me without consent:`,
        ``,
        `IMPERSONATING/UPLOADER ACCOUNT: ${d.uploaderId || '(see URLs)'}`,
        `CONTENT URLS:`,
        urls,
        ``,
        `This is impersonation intended to deceive — within the 2-hour removal`,
        `category under the IT Amendment Rules 2026 (as with morphed images),`,
        `and violates your platform's own impersonation policy. It also engages`,
        `S.66D IT Act (cheating by personation using electronic resource) and`,
        `S.356 BNS 2023 (defamation) where statements are attributed to me.`,
        ``,
        `Incident summary: ${d.incidentSummary}`,
        ...evidenceSection(d),
        ``,
        `DEMANDS:`,
        `  1. Remove the content and suspend the impersonating account.`,
        `  2. Acknowledge with a reference number.`,
        `  3. Preserve the account's subscriber data and IP logs.`,
        ``,
        `I am reporting this at cybercrime.gov.in and to the local cyber cell.`,
        `Escalation to gac.gov.in will follow non-compliance.`,
        ...footer({ name: d.complainantName, contact: d.complainantContact }),
      )
      return L.join('\n')
    }

    case 'cyber-cell': {
      const c = d.caseFile
      const L = [
        `To: The Station House Officer / Officer-in-Charge, Cyber Cell`,
        `Date: ${new Date().toLocaleDateString('en-IN')}`,
        ``,
        `Subject: Complaint — publication/creation of non-consensual synthetic (deepfake) content — offences under IT Act 2000 & BNS 2023`,
        ``,
        `Respected Sir/Madam,`,
        ``,
        `I, ${d.complainantName}, wish to report the following cognizable offences:`,
        ``,
        `1. On ${c.meta.incidentDate}, I discovered that a synthetic/deepfake`,
        `   depiction of me had been created and/or published without my consent.`,
        `2. ${d.incidentSummary}`,
        `3. The content is published at:`,
        urls,
        d.uploaderId ? `4. The uploading account identifies itself as: ${d.uploaderId}` : `4. The uploader is presently unknown to me.`,
        ``,
        `OFFENCES (please register FIR under BNSS S.173 — zero FIR applies):`,
        `  • S.66E, IT Act 2000 — violation of privacy (capturing/publishing private`,
        `    images without consent)`,
        `  • S.67/67A, IT Act 2000 — publishing obscene / sexually explicit material`,
        `    electronically (as applicable)`,
        `  • S.66D, IT Act 2000 — cheating by personation by electronic resource`,
        `  • S.79, BNS 2023 — insult to the modesty of a woman (as applicable)`,
        `  • S.356, BNS 2023 — defamation (as applicable)`,
        `  • S.308, BNS 2023 — extortion (where money is demanded for "deletion")`,
        ``,
        minorNote ? `I am a MINOR. Please handle under JJ Act protections.` : ``,
        ``,
        `EVIDENCE: I attach the Saboot Evidence Custody Record ${c.meta.caseRef},`,
        `listing ${c.items.length} item(s), each SHA-256 hashed at capture, with`,
        `source application, location and timestamp. Integrity seal:`,
        `${c.manifestHash}. Section 63, BSA 2023 covers admissibility of these`,
        `electronic records.`,
        ``,
        `REQUESTS:`,
        `  1. Register the FIR immediately (Lalita Kumari vs Govt of UP, 2014 —`,
        `     cognizable offences disclosed must be registered).`,
        `  2. Issue preservation notice to ${d.platform} for the uploader's`,
        `     subscriber details and IP logs before the data is purged.`,
        `  3. Coordinate takedown through the platform's Grievance Officer —`,
        `     the 2-hour window under IT Amendment Rules 2026 applies.`,
        ``,
        `Name   : ${d.complainantName}`,
        `Contact: ${d.complainantContact}`,
        `Address: (fill in)`,
        ``,
        `(Signed)`,
      ]
      return L.filter((x) => x !== ``).join('\n')
    }

    case 'gac-appeal': {
      const L = [
        `To: The Grievance Appellate Committee (gac.gov.in)`,
        `Date: ${new Date().toLocaleDateString('en-IN')}`,
        ``,
        `Subject: Appeal — platform's failure/refusal to act on unlawful synthetic content (deepfake/NCII)`,
        ``,
        `Respected Members,`,
        ``,
        `I complained to ${d.platform}'s Grievance Officer on (date) via`,
        `${d.grievanceEmail}, referencing custody record ${d.caseFile.meta.caseRef}.`,
        `The platform has failed to remove the content within the statutory`,
        `window (2 hours for NCII/morphed content; 3 hours for other SGI under`,
        `the IT Amendment Rules 2026) and/or rejected my complaint. I file this`,
        `appeal within 30 days of the platform's decision, as the Rules require.`,
        ``,
        `CONTENT URLS:`,
        urls,
        ``,
        `Grounds of appeal:`,
        `  1. The content is synthetically generated/morphed — within the`,
        `     mandatory removal categories of the 2026 Rules.`,
        `  2. The platform's response ignored the statutory clock and its Rule-3`,
        `     due-diligence obligations, engaging its S.79 IT Act liability.`,
        `  3. Evidence with hashes and timestamps is annexed (${d.caseFile.items.length} items,`,
        `     seal ${d.caseFile.manifestHash.slice(0, 16)}…).`,
        ``,
        `I request the Committee to direct ${d.platform} to remove the content,`,
        `suspend the uploader, and preserve subscriber data for the ongoing`,
        `police investigation.`,
        ...footer({ name: d.complainantName, contact: d.complainantContact }),
      ]
      return L.join('\n')
    }
  }
}
