import { useMemo, useRef, useState } from 'react'
import {
  captureItem, buildCase, verifyCase, custodySheet, caseRef, SABOOT_VERSION,
  SOURCE_APPS, type CaseFile, type CaseMeta, type CustodyItem,
} from './lib/evidence'
import { triage, helplines, type TriageAnswers, type Urgency } from './lib/triage'
import { draftDocument, type DocType, type DraftInput } from './lib/draft'
import { DIRECTORY } from './lib/directory'

type Tab = 'panic' | 'evidence' | 'takedown' | 'kit'

const WHEN_LABEL: Record<Urgency, string> = { now: 'NOW', today: 'TODAY', 'this-week': 'THIS WEEK' }

function download(name: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export default function App() {
  const [tab, setTab] = useState<Tab>('panic')

  // ── shared case state (in-memory only; nothing persists by design) ────────
  const [meta, setMeta] = useState<CaseMeta>({
    caseRef: caseRef(),
    victimName: '',
    incidentDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    deviceModel: navigator.userAgent.includes('Mobile') ? 'Mobile device' : 'Desktop browser',
  })
  const [items, setItems] = useState<CustodyItem[]>([])
  // NOTE: the working case is sealed on demand (Evidence tab export); the
  // sealed CaseFile is constructed there, not stored in component state.

  // panic state
  const [answers, setAnswers] = useState<TriageAnswers>({
    intimate: false, extortion: false, minor: false, publicPost: false,
  })
  const [showPlan, setShowPlan] = useState(false)

  const plan = useMemo(() => triage(answers), [answers])
  const lines = useMemo(() => helplines(answers), [answers])

  return (
    <div className="app">
      <header>
        <div className="logo" aria-hidden="true">स</div>
        <div>
          <h1>Saboot</h1>
          <p className="tagline">Deepfake victim kit · सबूत banayein, saamna karein</p>
        </div>
      </header>

      <div className="tabs" role="tablist">
        <button className="tab" role="tab" aria-selected={tab === 'panic'} onClick={() => setTab('panic')}>Panic</button>
        <button className="tab" role="tab" aria-selected={tab === 'evidence'} onClick={() => setTab('evidence')}>Evidence</button>
        <button className="tab" role="tab" aria-selected={tab === 'takedown'} onClick={() => setTab('takedown')}>Takedown</button>
        <button className="tab" role="tab" aria-selected={tab === 'kit'} onClick={() => setTab('kit')}>Kit</button>
      </div>

      {tab === 'panic' && (
        <PanicTab
          answers={answers} setAnswers={setAnswers}
          showPlan={showPlan} setShowPlan={setShowPlan}
          plan={plan} helplines={lines}
        />
      )}
      {tab === 'evidence' && (
        <EvidenceTab meta={meta} setMeta={setMeta} items={items} setItems={setItems} />
      )}
      {tab === 'takedown' && <TakedownTab meta={meta} items={items} />}
      {tab === 'kit' && <KitTab />}

      <footer>
        Free forever for the core kit · Evidence never leaves this device · v{SABOOT_VERSION}
      </footer>
      <p className="disclaimer">
        Saboot is a documentation aid, not legal advice. It helps you preserve evidence and
        draft complaints under the IT Amendment Rules 2026, BNS 2023 and BNSS 2023. For legal
        strategy, consult an advocate. Report offences: cybercrime.gov.in · 1930.
      </p>
    </div>
  )
}

// ─── PANIC ───────────────────────────────────────────────────────────────────

function PanicTab({ answers, setAnswers, showPlan, setShowPlan, plan, helplines: hl }: {
  answers: TriageAnswers
  setAnswers: (a: TriageAnswers) => void
  showPlan: boolean
  setShowPlan: (b: boolean) => void
  plan: ReturnType<typeof triage>
  helplines: ReturnType<typeof helplines>
}) {
  const Q = ({ id, text, hint }: { id: keyof TriageAnswers; text: string; hint?: string }) => (
    <div className="q">
      <p>{text}</p>
      {hint && <p className="muted small" style={{ marginBottom: 8 }}>{hint}</p>}
      <div className="opts">
        <button className="opt" aria-pressed={answers[id]} onClick={() => { setAnswers({ ...answers, [id]: true }); setShowPlan(true) }}>Haan / Yes</button>
        <button className="opt" aria-pressed={!answers[id]} onClick={() => { setAnswers({ ...answers, [id]: false }); setShowPlan(true) }}>Nahi / No</button>
      </div>
    </div>
  )

  return (
    <>
      <div className="panic-hero">
        <h2>Ek minute mein saboot banaiye</h2>
        <p className="muted">Ek fake video ya photo se pehle evidence secure karein — post delete ho sakta hai, aapka hash-record nahi.</p>
      </div>

      <Q id="intimate" text="Kya content aapka nanga/sexual ya morphed roop dikhata hai?" hint="Deepfake nude, morphed face on someone else's body, sexual act" />
      <Q id="extortion" text="Kya paise maange ja rahe hain — 'delete karne ke liye paisa do'?" hint="Sextortion, 'video viral ho jayega' threats" />
      <Q id="minor" text="Kya victim 18 saal se kam umar ka hai?" />
      <Q id="publicPost" text="Kya content public platform pe posted hai?" hint="Instagram/YouTube public post vs only WhatsApp chat" />

      {showPlan && (
        <>
          <div className="clock"><strong>Legal clock:</strong> {plan.legalClock}</div>
          <div className="card">
            <h2>{plan.headline}</h2>
            {plan.steps.map((s, i) => (
              <div className="step" key={i}>
                <span className={`when ${s.when === 'this-week' ? 'week' : s.when === 'now' ? 'now' : 'today'}`}>{WHEN_LABEL[s.when]}</span>
                <span className="text">{s.text}</span>
              </div>
            ))}
          </div>
          <div className="card">
            <h2>Helplines (verified)</h2>
            {hl.map((h) => (
              <div className="helpline" key={h.name}>
                <div>
                  <div className="n">{h.name}</div>
                </div>
                <div className="d">{h.detail}</div>
              </div>
            ))}
          </div>
          <p className="muted small" style={{ textAlign: 'center', marginTop: 10 }}>
            Evidence capture → <strong>Evidence</strong> tab · Platform notice → <strong>Takedown</strong> tab
          </p>
        </>
      )}
    </>
  )
}

// ─── EVIDENCE ────────────────────────────────────────────────────────────────

function EvidenceTab({ meta, setMeta, items, setItems }: {
  meta: CaseMeta
  setMeta: (m: CaseMeta) => void
  items: CustodyItem[]
  setItems: (i: CustodyItem[]) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [seal, setSeal] = useState<string>('')
  const [verified, setVerified] = useState<boolean | null>(null)
  const [sourceApp, setSourceApp] = useState<string>('WhatsApp')
  const [whereFound, setWhereFound] = useState('')
  const [captureMethod, setCaptureMethod] = useState<CustodyItem['captureMethod']>('screenshot')

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    try {
      const newItems: CustodyItem[] = []
      for (const f of Array.from(files)) {
        newItems.push(await captureItem(f, {
          sourceApp: sourceApp as CustodyItem['sourceApp'],
          whereFound: whereFound || '(location not entered)',
          captureMethod,
        }))
      }
      setItems([...items, ...newItems])
      setWhereFound('')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function exportSheet() {
    const c = await buildCase(meta, items)
    setSeal(c.manifestHash)
    const sheet = custodySheet(c)
    download(`saboot-custody-${meta.caseRef}.txt`, sheet)
  }

  async function verify() {
    const c = await buildCase(meta, items)
    setSeal(c.manifestHash)
    setVerified(await verifyCase(c))
  }

  return (
    <>
      <div className="card">
        <h2>Evidence capture — SHA-256 hashed on-device</h2>
        <p className="muted">
          Select screenshots / screen-recordings / files. Each gets a cryptographic hash:
          proof the file existed in this exact form at this time. Files never upload.
        </p>
        <label>Source app (where content appeared)</label>
        <select value={sourceApp} onChange={(e) => setSourceApp(e.target.value)}>
          {SOURCE_APPS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <label>Where found (URL / group name / account)</label>
        <input value={whereFound} onChange={(e) => setWhereFound(e.target.value)} placeholder="instagram.com/p/… / 'Class group' / @handle" />
        <label>Capture method</label>
        <select value={captureMethod} onChange={(e) => setCaptureMethod(e.target.value as CustodyItem['captureMethod'])}>
          <option value="screenshot">Screenshot</option>
          <option value="screen-recording">Screen recording</option>
          <option value="downloaded-file">Downloaded file</option>
          <option value="chat-export">Chat export</option>
          <option value="photo-of-screen">Photo of screen</option>
        </select>

        <div
          className="dropzone"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag') }}
          onDragLeave={(e) => e.currentTarget.classList.remove('drag')}
          onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag'); onFiles(e.dataTransfer.files) }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
        >
          {busy ? 'Hashing…' : 'Tap to select files (multiple allowed)'}
        </div>
        <input ref={fileRef} type="file" multiple hidden accept="image/*,video/*,audio/*,.pdf" onChange={(e) => onFiles(e.target.files)} />
      </div>

      {items.length > 0 && (
        <div className="card">
          <h2>{items.length} item{items.length > 1 ? 's' : ''} — custody chain</h2>
          {items.map((it) => (
            <div className="item" key={it.id}>
              <div>
                <strong className="small">{it.fileName}</strong>
                <div className="hash">{it.hash}</div>
                <div className="meta">{it.sourceApp} · {it.whereFound} · {new Date(it.capturedAt).toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
          <label>Victim name (optional — anonymity is permitted)</label>
          <input
            value={meta.victimName}
            onChange={(e) => setMeta({ ...meta, victimName: e.target.value })}
            placeholder="Leave blank if you prefer"
          />
          <label>Incident date (when you discovered the content)</label>
          <input
            type="date"
            value={meta.incidentDate}
            onChange={(e) => setMeta({ ...meta, incidentDate: e.target.value })}
          />
          <button className="btn" onClick={exportSheet}>Download custody record (.txt)</button>
          <button className="btn ghost small-btn" onClick={verify}>Verify integrity seal</button>
          {seal && (
            <div className="seal">
              MANIFEST SEAL (SHA-256): {seal}
              {verified !== null && (
                <div style={{ marginTop: 6, fontWeight: 700, color: verified ? 'var(--ok)' : 'var(--danger)' }}>
                  {verified ? '✓ SEAL VALID — record untampered' : '✗ SEAL BROKEN — record was modified'}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}

// ─── TAKEDOWN ────────────────────────────────────────────────────────────────

function TakedownTab({ meta, items }: { meta: CaseMeta; items: CustodyItem[] }) {
  const [docType, setDocType] = useState<DocType>('platform-ncii')
  const [platform, setPlatform] = useState(DIRECTORY[0].platform)
  const [grievanceEmail, setGrievanceEmail] = useState(DIRECTORY[0].goEmail.trim())
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [urls, setUrls] = useState('')
  const [uploader, setUploader] = useState('')
  const [summary, setSummary] = useState('')
  const [doc, setDoc] = useState<string>('')
  const [isMinor, setIsMinor] = useState(false)

  const docTypeOptions: { v: DocType; label: string }[] = [
    { v: 'platform-ncii', label: 'Platform notice — intimate/morphed content (2-hour window)' },
    { v: 'platform-sgi', label: 'Platform notice — other synthetic content (3-hour window)' },
    { v: 'platform-impersonation', label: 'Platform notice — impersonation/fake profile' },
    { v: 'cyber-cell', label: 'Police complaint draft (cyber cell)' },
    { v: 'gac-appeal', label: 'GAC appeal (platform refused/failed)' },
  ]

  function generate() {
    if (items.length === 0) {
      setDoc('⚠ Add at least one evidence item in the Evidence tab first — a notice without hashed evidence has half the weight.')
      return
    }
    const input: DraftInput = {
      type: docType,
      platform,
      grievanceEmail,
      complainantName: name || '(Name withheld)',
      complainantContact: contact,
      contentUrls: urls.split('\n').map((u) => u.trim()).filter(Boolean),
      uploaderId: uploader || undefined,
      incidentSummary: summary || '(Summary not provided.)',
      isMinor,
      caseFile: { sabootVersion: SABOOT_VERSION, meta, items, manifestHash: '(sealed in Evidence tab export)' } as CaseFile,
    }
    setDoc(draftDocument(input))
  }

  return (
    <>
      <div className="card">
        <h2>Generate legal drafts — auto-filled from your custody record</h2>
        <label>Document type</label>
        <select value={docType} onChange={(e) => setDocType(e.target.value as DocType)}>
          {docTypeOptions.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
        </select>
        <label>Platform</label>
        <select
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value)
            const go = DIRECTORY.find((d) => d.platform === e.target.value)
            if (go) setGrievanceEmail(go.goEmail.trim())
          }}
        >
          {DIRECTORY.map((d) => <option key={d.platform}>{d.platform}</option>)}
        </select>
        <label>Grievance Officer email</label>
        <input value={grievanceEmail} onChange={(e) => setGrievanceEmail(e.target.value)} />
        <p className="muted small">Verify on the platform's own page:
          <a href={DIRECTORY.find((d) => d.platform === platform)?.verifyUrl} target="_blank" rel="noreferrer"> {platform} grievance page ↗</a>
        </p>
        <label>Your name (optional — can stay anonymous)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Contact (phone / email for replies)</label>
        <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+91-…" />
        <label>Content URLs (one per line)</label>
        <textarea value={urls} onChange={(e) => setUrls(e.target.value)} placeholder={'https://…\nhttps://…'} />
        <label>Uploader account (if known)</label>
        <input value={uploader} onChange={(e) => setUploader(e.target.value)} placeholder="@handle / profile URL" />
        <label>What happened (2-3 lines, your words)</label>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
        <div className="check" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
          <input id="minor" type="checkbox" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} style={{ width: 18, height: 18 }} />
          <label htmlFor="minor" style={{ margin: 0 }}>Victim is under 18</label>
        </div>
        <button className="btn" onClick={generate}>Generate document</button>
      </div>

      {doc && (
        <div className="card">
          <h2>Generated draft</h2>
          <pre className="doc-pre">{doc}</pre>
          <button className="btn small-btn" onClick={() => download(`saboot-notice-${Date.now()}.txt`, doc)}>Download (.txt)</button>
          <button className="btn ghost small-btn" onClick={() => navigator.clipboard.writeText(doc)}>Copy to clipboard</button>
          <p className="muted small" style={{ marginTop: 10 }}>
            Email this to the Grievance Officer, attach your custody record + the evidence files.
            The statutory clock starts on delivery — send NOW, refine later.
          </p>
        </div>
      )}
    </>
  )
}

// ─── KIT (monetization) ─────────────────────────────────────────────────────

function KitTab() {
  return (
    <>
      <div className="card">
        <h2>Free forever — the core kit</h2>
        <p className="muted">
          Panic triage, evidence hashing, custody record, takedown notices, police draft.
          No account. No ads. No tracking. Evidence never leaves your device.
        </p>
      </div>
      <div className="kit-grid">
        <div className="kit-card">
          <h3>Pro Victim Kit</h3>
          <div className="price">₹499</div>
          <ul>
            <li>PDF export of custody record (court-formatted)</li>
            <li>All 5 document types unlocked</li>
            <li>Priority walk-through guide</li>
            <li>Forensic tips for your specific platform</li>
            <li>Pay via UPI — instant, no account</li>
          </ul>
          <p className="muted small" style={{ marginTop: 8 }}>One payment. For the worst week of your life, done right.</p>
        </div>
        <div className="kit-card">
          <h3>Campus Kit</h3>
          <div className="price">₹2,999</div>
          <ul>
            <li>Workshop slides + script for student cells</li>
            <li>Co-branded custody sheets for your college</li>
            <li>Anti-sextortion session plan (45 min)</li>
            <li>Helpline posters (printable)</li>
            <li>WhatsApp support line for 6 months</li>
          </ul>
          <p className="muted small" style={{ marginTop: 8 }}>For anti-ragging cells, student deans, placement cells.</p>
        </div>
      </div>
      <div className="pro-note">
        <strong>Pro unlock:</strong> UPI payment → activation code emailed instantly.
        Refund within 7 days, no questions. (Payment link activates at launch.)
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h2>For police cyber cells & colleges</h2>
        <p className="muted">
          Saboot custody records are designed for Investigating Officers: every item is
          hash-verifiable, chain of custody documented. Bulk licensing for cyber cells
          and NGO partners: <strong>reach out via the repo</strong>.
        </p>
      </div>
    </>
  )
}
