/**
 * SABOOT TRIAGE — the golden-hour flow. A panicking victim opens the app
 * and answers 3 questions; this returns ONE clear action list, ordered by
 * urgency. Everything here reflects verified law + platform practice (2026).
 */

export type Urgency = 'now' | 'today' | 'this-week'

export interface TriageAnswers {
  /** is it nude/sexual/morphed content of the victim? */
  intimate: boolean
  /** is money demanded to "delete"/stop? */
  extortion: boolean
  /** is the victim under 18? */
  minor: boolean
  /** is it posted publicly or in chats only? */
  publicPost: boolean
}

export interface TriagePlan {
  headline: string
  steps: { when: Urgency; text: string }[]
  legalClock: string
}

export function triage(a: TriageAnswers): TriagePlan {
  const steps: { when: Urgency; text: string }[] = []
  let legalClock = 'Standard platform timelines: acknowledge 24h, resolve 15 days.'

  if (a.intimate || a.extortion) {
    legalClock = 'IT Amendment Rules 2026: platforms must remove intimate/morphed content within 2 HOURS of complaint; other synthetic content within 3 hours.'
    steps.push({
      when: 'now',
      text: 'DO NOT PAY. Paying an extortionist marks you as a payer — demands escalate, deletion never comes. The threat is the product; payment feeds it.',
    })
    steps.push({
      when: 'now',
      text: 'CAPTURE BEFORE IT DISAPPEARS: screen-record the post, the uploader profile, the URL and the timestamps. Use Saboot Evidence tab — it hashes each file so the record survives even if the post is deleted.',
    })
    steps.push({
      when: 'now',
      text: 'FILE THE 2-HOUR COMPLAINT: use the Takedown tab → generate the NCII notice → email it to the platform\'s Grievance Officer (directory is in the app). The statutory clock starts on delivery.',
    })
    steps.push({
      when: 'now',
      text: 'REPORT TO POLICE: cybercrime.gov.in (Report Women/Child Related Crime) or your local cyber cell with the Saboot custody sheet attached. Zero FIR: any police station must register (BNSS S.173).',
    })
  } else if (a.publicPost) {
    legalClock = 'IT Amendment Rules 2026: unlawful synthetic content — 3-hour removal window on complaint.'
    steps.push({
      when: 'today',
      text: 'Capture evidence first (Evidence tab), then send the SGI takedown notice to the platform\'s Grievance Officer.',
    })
    steps.push({
      when: 'today',
      text: 'Report at cybercrime.gov.in under "Report Other Cybercrimes". Attach the custody sheet.',
    })
  } else {
    steps.push({
      when: 'today',
      text: 'Capture and hash the evidence now, while it still exists.',
    })
    steps.push({
      when: 'this-week',
      text: 'Send the platform takedown notice; report at cybercrime.gov.in if the content is unlawful.',
    })
  }

  if (a.extortion) {
    steps.push({
      when: 'now',
      text: 'S.308 BNS 2023 (extortion) applies — say this to the police. Also: the "video" usually doesn\'t exist. Sextortion scripts target shame, not evidence.',
    })
  }
  if (a.minor) {
    steps.push({
      when: 'now',
      text: 'You are a minor: this is treated as child sexual abuse material (CSAM/POCSO) — the strictest category. Call 1098 (Childline) as well. Do NOT forward the content to anyone, including trusted adults — only report.',
    })
  }
  steps.push({
    when: 'today',
    text: 'Tell one human you trust. Isolation is the scam\'s main weapon — documented victims were kept alone on calls for days.',
  })
  steps.push({
    when: 'this-week',
    text: 'If money was sent: call 1930 NOW (golden hour — banks can freeze mule accounts), then cybercrime.gov.in "Financial Fraud".',
  })

  const headline = a.intimate
    ? a.minor
      ? 'CSAM pathway — fastest response in law. You are not in trouble. Start with capture.'
      : 'Intimate/morphed content — the 2-hour clock applies. Capture first, then file.'
    : a.extortion
      ? 'Extortion — do not pay, capture everything, file both barrels (platform + police).'
      : 'Deepfake/impersonation — capture, takedown notice, police report.'

  const order: Record<Urgency, number> = { now: 0, today: 1, 'this-week': 2 }
  steps.sort((x, y) => order[x.when] - order[y.when])

  return { headline, steps, legalClock }
}

/** Suggested helplines by situation — verified numbers. */
export function helplines(a: TriageAnswers): { name: string; detail: string }[] {
  const h = [{ name: 'cybercrime.gov.in', detail: 'National Cyber Crime Reporting Portal — register complaint, get acknowledgement number' }]
  if (a.intimate || a.extortion || a.minor) h.push({ name: '1930', detail: 'National Cyber Helpline — financial fraud golden hour' })
  if (a.minor) {
    h.push({ name: '1098', detail: 'Childline — for minors, 24/7' })
    h.push({ name: 'POCSO e-box', detail: 'pocsoebox.gov.in — child sexual abuse reporting' })
  }
  h.push({ name: 'StopNCII.org', detail: 'Free hash-matching service (GoI-supported): platforms auto-block matching images — you never upload the file itself' })
  h.push({ name: 'gac.gov.in', detail: 'Grievance Appellate Committee — appeal within 30 days if the platform refuses or stalls' })
  return h
}
