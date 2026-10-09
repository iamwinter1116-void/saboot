# SABOOT — Sales Kit

Three buyers, three scripts, one product. All ₹0 to operate. The app is the demo.

---

## Buyer 1: College anti-ragging / student-affairs cell — ₹2,999 Campus Kit

**Who to reach:** Dean of Students, Anti-Ragging Committee chair, Student Council coordinator. In your own college first (MBIT), then CVM family colleges (Anand-Vidyanagar belt has 30+ institutions within 5km).

**The pitch (say it in one breath):**
> "Aapke campus mein agar kisi student ka deepfake nikla — nanga morphed photo, fake voice, sextortion — toh student pehle aapke paas aayega, police ke paas nahi. Kya aapke paas ek system hai jo uss ghante mein uska evidence hash kare, takedown notice banaye, police complaint draft kare? Ye app free hai students ke liye. Campus Kit ₹2,999 mein: 45-minute anti-sextortion workshop (main khud facilitate karunga), co-branded custody sheets, helpline posters, 6-month WhatsApp support."

**Why they pay:** UGC anti-ragging regulations require awareness programmes; sextortion cases in Gujarat engineering colleges are documented; ₹2,999 is below any event budget; you are their own student — zero vendor risk. The app is verifiably free, so the kit is a *service*, not a licence — no procurement process.

**Objection handling:**
- "We already do cyber awareness" → "Awareness session ke baad student ke paas kya hai haath mein? Ye app wo cheez hai jo session ke baad bhi kaam karegi — 2 ghante wale deepfake law ka use karne wala tool."
- "Budget nahi hai" → "Ek session + 6-month support ₹2,999 mein sabse sasta cyber-legal infrastructure hai. Aapke ek student ka ek sextortion case college ki reputation se zyada mehenga padega."

**Close:** Live demo on THEIR phone — open the site, hash a photo from their gallery in 10 seconds, show the custody sheet. Then ask.

## Buyer 2: Police cyber cell / CISO programmes — ₹15,000-25,000 bulk licensing (later)

**Who to reach:** District cyber cell in-charge (via your TRINETRA/Gujarat Police Challenge contacts — this is your unfair advantage).

**The pitch:**
> "Har deepfake victim jo cyber cell aata hai, uske phone mein scattered screenshots hote hain — no hash, no timestamp, no chain of custody. Evidence in court challengeable hai. Saboot custody records hash-verified hote hain — IO ko verify karna 10 second ka kaam hai (certutil ek command). Hum chahte hain cyber cell ye tool victims ko recommend kare. Bulk licence + co-branding available."

**Why they pay:** Chain-of-custody is THEIR pain point too — weak evidence = failed prosecutions = their stats. A tool that standardises victim-side evidence collection makes their cases stronger. This is a relationship sale — your Sentinel/TRINETRA context is the door-opener.

## Buyer 3: The victim — ₹499 Pro Kit (self-serve, no talking)

The QR in the app's Kit tab has ₹499 baked in. A victim in panic who just watched the free core save their evidence will pay ₹499 for the court-formatted PDF + all 5 drafts + priority guide — the alternative is an advocate's ₹5,000 consultation for the same paperwork. No marketing needed: the product IS the funnel (every share of a custody sheet shows the Saboot header).

## The distribution engine (product = sharing)

Every takedown notice carries the custody record header — **"SABOOT — EVIDENCE CUSTODY RECORD"** — and every Grievance Officer, every IO, every lawyer who receives one sees the tool that made it. Every custody sheet a victim emails to police is a demo to the exact institutional buyer who licenses it. The document is the ad.

## Launch sequence (₹0)

1. **Today:** repo public, site live, APK in artifacts.
2. **This week:** 3 colleges in Anand-Vidyanagar belt — in-person, live demo, one close pays for nothing because there's nothing to pay for. First ₹2,999 is pure validation.
3. **Parallel:** Gujarat Police Challenge network → show cyber cell in-charge the custody sheet format. Ask for 15 minutes. The Sentinel/TRINETRA context is your credibility.
4. **Content (₹0):** one 90-second demo video (phone screen: panic flow → hash → notice → QR). Post where the crime is discussed: college WhatsApp groups, r/developersIndia, X.

## Pricing honesty

₹499/₹2,999 are launch prices for the first 20 sales — validation, not optimization. If 3 colleges say yes without flinching, price was too low. If everyone says "free mein do", the money story is wrong and we pivot to the police-licensing rail full-time. Every rupee is UPI-direct, no gateway, no commission, no refunds past 7 days.

**Swap before selling:** `node scripts/make-qr.mjs <your-real-upi-id> "Saboot Pro Kit" 499` → commit → push. The QR in the app updates on the next deploy. (Until then the QR shows `saboot-app@upi` — a placeholder that pays nobody.)
