/**
 * WhatsApp Direct Automation Service
 * The Visa Syndicate - Sovereign Advisory
 * Sends visitor inquiries directly to Ghulam Mujtaba's WhatsApp: +92 340 0131732
 */

export const ADMIN_WHATSAPP_NUMBER = '923400131732'; // +92 340 0131732

export interface InquiryWhatsAppPayload {
  name: string;
  email: string;
  phone: string;
  visaCategory?: string;
  destination?: string;
  message?: string;
  refId?: string;
}

export function formatInquiryForWhatsApp(payload: InquiryWhatsAppPayload): string {
  const ref = payload.refId || `TVS-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `🏛️ *THE VISA SYNDICATE — CASE INQUIRY*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${payload.name.trim()}
📱 *Client Phone / WhatsApp:* ${payload.phone.trim()}
📧 *Email Address:* ${payload.email.trim()}
🌍 *Destination Country:* ${payload.destination || 'Unspecified'}
📑 *Visa Pathway:* ${payload.visaCategory || 'General Consultation'}

💬 *Case Overview / Query:*
"${(payload.message || 'No additional notes provided. Requesting callback.').trim()}"

━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Case Ref:* ${ref}
🕒 *Submitted At:* ${dateStr}
🌐 *Source:* The Visa Syndicate Official Portal`;
}

export function generateWhatsAppLink(payload: InquiryWhatsAppPayload, targetNumber = ADMIN_WHATSAPP_NUMBER): string {
  const formattedText = formatInquiryForWhatsApp(payload);
  const cleanNumber = targetNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(formattedText)}`;
}

export function openWhatsAppInquiry(payload: InquiryWhatsAppPayload, targetNumber = ADMIN_WHATSAPP_NUMBER) {
  const url = generateWhatsAppLink(payload, targetNumber);
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function formatCounselorApplicationForWhatsApp(app: Record<string, any>): string {
  const dateStr = new Date().toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const destinations = Array.isArray(app.destinations) ? app.destinations.join(', ') : app.destinations || 'UK, Canada';
  const categories = Array.isArray(app.visaCategories) ? app.visaCategories.join(', ') : app.visaCategories || 'Study Visa';

  return `⚖️ *THE VISA SYNDICATE — COUNSELOR APPLICATION DOSSIER*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Candidate Name:* ${app.fullName || app.displayName}
📱 *Phone / WhatsApp:* ${app.whatsappNumber || app.phone}
📧 *Email Address:* ${app.email}
📍 *City / Country:* ${app.city || 'Islamabad'}, ${app.country || 'Pakistan'}
🏛️ *National ID / CNIC:* ${app.nationalIdNumber || 'On File'}
📜 *License / Bar Auth:* ${app.licenseNumber || 'Verified'} (${app.issuingAuthority || 'Regulatory Board'})
🏢 *Agency Name:* ${app.agencyName || 'Independent Practice'}
⏳ *Experience:* ${app.experienceYears || 3} Years
🌍 *Destinations:* ${destinations}
📑 *Practice Focus:* ${categories}
🏦 *Bank IBAN:* ${app.iban || 'Submitted for Escrow'}

🛡️ *Anti-Fraud Affidavit:* Accepted & Electronically Signed
━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Security Dossier Track ID:* ${app.trackingId || `TVS-SEC-${Date.now().toString().slice(-6)}`}
🕒 *Submitted At:* ${dateStr}
🌐 *Source:* The Visa Syndicate Accreditation Registry`;
}

export function generateCounselorWhatsAppLink(app: Record<string, any>, targetNumber = ADMIN_WHATSAPP_NUMBER): string {
  const text = formatCounselorApplicationForWhatsApp(app);
  const cleanNumber = targetNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function openCounselorWhatsApp(app: Record<string, any>, targetNumber = ADMIN_WHATSAPP_NUMBER) {
  const url = generateCounselorWhatsAppLink(app, targetNumber);
  window.open(url, '_blank', 'noopener,noreferrer');
}

