# Saboot (सबूत) — Deepfake Victim Kit

**India's deepfake law is 8 months old. The victim's side of it didn't exist — until now.**

Since **20 February 2026**, the IT (Intermediary Guidelines) Amendment Rules give deepfake victims statutory teeth: platforms must remove intimate/morphed content within **2 hours** of complaint, other unlawful synthetic content within **3 hours**. But a panicking victim — a student whose face got morphed, a shopkeeper's daughter, a teacher with a fake nude circulating in the family group — has to *know that*, capture evidence before it's deleted, hash it, address the right Grievance Officer, cite the right sections, escalate to GAC, and file at cybercrime.gov.in. All in the worst hour of their life.

**Saboot is that entire workflow in one calm screen.** 100% offline. Evidence never leaves the device — which for an NCII victim is the trust story itself.

## What it does

| Tab | What you get |
|---|---|
| **Panic** | 4 questions → one ordered action list (now/today/this-week) with the correct legal clock. "Do NOT pay" placed where it belongs: first. |
| **Evidence** | File capture → **SHA-256 hash per item** (WebCrypto), chain-of-custody record (who/when/where/how), printable custody sheet, **manifest integrity seal** that detects any post-hoc tampering. |
| **Takedown** | 5 auto-filled legal drafts: 2-hour NCII notice (Rule 3(2)(b)), 3-hour SGI notice, impersonation notice, police complaint (zero-FIR, BNSS S.173, Lalita Kumari), GAC appeal. Cites current law — not 2021 templates. Grievance Officer directory for 8 platforms with verify-links. |
| **Kit** | Free core forever; Pro Victim Kit ₹499 (PDF export, all drafts); Campus Kit ₹2,999 for anti-ragging/student cells. |

## Why the forensics matter

A screenshot is a claim. A **SHA-256-hashed screenshot with timestamp, source app and location, sealed inside a manifest** is evidence — the platform can delete the post, but the hash proves the file existed in that exact form at that time. Verifiable by any court or IO (`certutil -hashfile` / `shasum -a 256`). The manifest seal is self-referencing: touch any field afterwards and verification fails.

## Legal grounding (verified Oct 2026)

- IT (Intermediary Guidelines) Amendment Rules 2026 — 2h/3h windows, SGI definition, GAC appeal
- IT Act 2000: S.66E, S.66D, S.67/67A, S.79
- BNS 2023: S.79, S.308, S.356 · BNSS 2023: S.173 (zero FIR) · BSA 2023: S.63 (electronic evidence)
- Lalita Kumari vs Govt of UP (2014) — cognizable offences must be registered
- StopNCII.org — GoI-supported hash matching (no upload)

**Not legal advice** — a documentation aid that makes the victim's first hour correct.

## Run

```bash
npm install
npm test        # 23 tests: known-answer hashes, tamper detection, triage, drafts
npm run dev
```

**Live:** https://iamwinter1116-void.github.io/saboot/

Install: Android Chrome → Add to Home screen · iOS Safari → Share → Add to Home Screen · APK from Actions artifacts.

## Money model (₹0 spend)

1. **₹499 Pro Victim Kit** — desperate buyers, impulse UPI payment, real alternative is an advocate's ₹5,000 fee
2. **₹2,999 Campus Kit** — anti-ragging cells/student deans have welfare budgets; walk-in sale in the Gujarat education belt
3. **Police cyber-cell licensing** — custody records are IO-friendly; bulk licensing pitch via existing police-programme contacts

## License

MIT
