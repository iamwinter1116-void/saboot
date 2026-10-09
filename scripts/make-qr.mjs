/**
 * UPI QR generator — battle-tested `qrcode` lib (MIT), scannable by UPI apps.
 * Usage: node scripts/make-qr.mjs [upiId] [name]
 */
import QRCode from 'qrcode'
import { resolve } from 'node:path'

const UPI_ID = process.argv[2] || 'saboot-app@upi'
const NAME = process.argv[3] || 'Saboot'
const AMOUNT = process.argv[4] || ''

const params = [
  `pa=${encodeURIComponent(UPI_ID)}`,
  `pn=${encodeURIComponent(NAME)}`,
  'cu=INR',
]
if (AMOUNT) params.push(`am=${Number(AMOUNT).toFixed(2)}`) // NPCI spec: fixed amount
const payload = `upi://pay?${params.join('&')}`
console.log('UPI deep link:', payload)

await QRCode.toFile(resolve('public/qr.png'), payload, {
  errorCorrectionLevel: 'M',
  margin: 4,
  scale: 8,
  color: { dark: '#052e1c', light: '#ffffff' },
})
console.log('wrote public/qr.png')
