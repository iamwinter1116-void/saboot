# SABOOT LAUNCH COPY — copy-paste and send

## WhatsApp (college groups, Hinglish)

> Bhai ek cheez dekh lo. Agar kisi ka deepfake ban jaye — morphed photo, fake voice note, ya "video viral hone wala hai" wala message — toh India ka naya law bolta hai platform ko 2 GHANTE mein remove karna padta hai (IT Amendment Rules 2026, Feb se effective). Lekin 2 ghante mein kaam tabhi hota hai jab evidence sahi ho.
>
> Maine ek free app banaya: **Saboot**. Kya karta hai:
> • Screenshot/video ka SHA-256 hash — matlab proof ki file us waqt us form mein exist karti thi (post delete ho jaye toh bhi)
> • Platform ko legal notice (2-hour wala, sahi sections ke saath) — 1 minute mein draft
> • Police complaint draft (zero FIR, BNSS 173)
> • Sab kuch offline. Kuch upload nahi hota. Account nahi chahiye.
>
> Install: https://iamwinter1116-void.github.io/saboot/
> Chrome mein kholo → Add to Home screen. Bas.
>
> Umeed hai kabhi zaroorat na pade. Lekin phone mein hona chahiye.

## LinkedIn (professional angle)

> India's deepfake regime is 8 months old: platforms must remove intimate/morphed content within 2 hours of complaint, other synthetic content within 3 (IT Amendment Rules 2026, effective 20 Feb).
>
> The law gives victims teeth. But in the worst hour of their life, victims still have to hash evidence before deletion, address the right Grievance Officer, cite the right sections, and draft a police complaint.
>
> So I built the victim's side of that law. Saboot — free, offline, no account:
> - SHA-256 evidence hashing with chain-of-custody (WebCrypto, on-device — evidence never uploads)
> - Manifest integrity seal: any post-hoc edit breaks verification
> - 5 auto-filled drafts: 2h NCII notice, 3h SGI notice, impersonation, police complaint, GAC appeal
> - Verified Grievance Officer directory for 8 platforms
>
> Built with my forensics work at MBIT (cybersecurity) in mind — this is the victim-side evidence kit I wished existed. Free core, forever. For colleges: anti-sextortion workshop + campus kit.
>
> https://iamwinter1116-void.github.io/saboot/

## X/Reddit (r/developersIndia, r/india — tech angle)

> Built a free, offline PWA: India's IT Amendment Rules 2026 give deepfake victims a 2-hour takedown right, but no tool helps them exercise it correctly. Saboot = on-device SHA-256 evidence hashing + chain-of-custody + auto-filled legal notices citing the Feb 2026 rules. Zero server, zero tracking. 23 unit tests, hash verified against node's crypto in a live browser. Would love feedback from anyone in legal-tech/forensics: https://github.com/iamwinter1116-void/saboot

## College pitch (in-person, one breath)

> "Sir, agar campus mein kisi student ka deepfake nikla — anti-ragging cell ke paas kya system hai uss ghante mein? Saboot free hai students ke liye: evidence hash, takedown notice, police draft — sab offline. Campus Kit ₹2,999: 45-min anti-sextortion workshop main khud facilitate karunga, co-branded custody sheets, helpline posters, 6-month WhatsApp support. 10-minute demo abhi kar dun aapke phone pe?"

## Before ANY sale: swap the UPI ID

```bash
node scripts/make-qr.mjs <your-real-upi-id> "Saboot Pro Kit" 499
git add -A && git commit -m "Real UPI ID" && git push
```
(Placeholder `saboot-app@upi` pays nobody.)
