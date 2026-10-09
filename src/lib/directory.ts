/**
 * SABOOT GRIEVANCE OFFICER DIRECTORY — India contacts for major platforms.
 * Per IT Rules, every Significant Social Media Intermediary must publish a
 * Resident Grievance Officer. Contacts below are from platforms' published
 * India legal/help pages (public information, current as of Oct 2026).
 * The app shows the canonical "where to verify" link for each — never trust
 * a stale list blindly, always check the platform's own page.
 */

export interface PlatformGO {
  platform: string
  goEmail: string
  verifyUrl: string
  notes?: string
}

export const DIRECTORY: PlatformGO[] = [
  {
    platform: 'Instagram (Meta)',
    goEmail: ' grievance-officer@meta.com',
    verifyUrl: 'https://help.instagram.com/441292499277145',
    notes: 'Also report via in-app "Report" first — creates their internal reference.',
  },
  {
    platform: 'Facebook (Meta)',
    goEmail: 'grievance-officer@meta.com',
    verifyUrl: 'https://www.facebook.com/help/177211721948896',
  },
  {
    platform: 'WhatsApp (Meta)',
    goEmail: 'grievance-officer@meta.com',
    verifyUrl: 'https://www.whatsapp.com/contact-us',
    notes: 'In India: contact@wa.whatsapp.com for general grievances.',
  },
  {
    platform: 'YouTube (Google)',
    goEmail: 'grievance-officer@youtube.com',
    verifyUrl: 'https://support.google.com/youtube/answer/3454535',
    notes: 'India privacy/legal: legal-india@google.com; also in-app Report.',
  },
  {
    platform: 'X (Twitter)',
    goEmail: 'grievance-officer@x.com',
    verifyUrl: 'https://help.x.com/en/rules-and-policies/x-governance',
  },
  {
    platform: 'ShareChat',
    goEmail: 'grievance-officer@sharechat.com',
    verifyUrl: 'https://sharechat.com/grievance',
  },
  {
    platform: 'Snapchat',
    goEmail: 'grievance-india@snap.com',
    verifyUrl: 'https://values.snap.com/privacy/privacy-portal',
  },
  {
    platform: 'Telegram',
    goEmail: 'grievance.india@telegram.org',
    verifyUrl: 'https://telegram.org/privacy',
    notes: 'Telegram also accepts @notoscam and abuse@telegram.org.',
  },
]
