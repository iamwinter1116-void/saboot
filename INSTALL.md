# Install Saboot

## Android (two ways, both free)

**1. As an app (PWA — recommended):**
- Open **https://iamwinter1116-void.github.io/saboot/** in Chrome
- Menu (⋮) → **Add to Home screen** → Install
- Works fully offline afterwards — evidence hashing happens on-device

**2. As an APK (sideload):**
- Download `saboot-debug-apk` from the latest successful [Actions run](https://github.com/iamwinter1116-void/saboot/actions)
- Transfer to phone, tap to install (allow "unknown sources" for your browser)
- Identical app; bundles the entire site, no internet needed at all

## iOS (free, no App Store)

- Open **https://iamwinter1116-void.github.io/saboot/** in **Safari**
- Share button → **Add to Home Screen**
- Apple charges $99/yr for the store; the Add-to-Home-Screen app is identical and costs nothing. Honest trade at ₹0 budget.

## Why offline matters

Saboot hashes evidence **in your browser** (WebCrypto SHA-256). No upload, no server, no account. The custody sheet you export is verifiable by anyone with `certutil -hashfile <file> SHA256` (Windows) or `shasum -a 256` (Mac/Linux).
