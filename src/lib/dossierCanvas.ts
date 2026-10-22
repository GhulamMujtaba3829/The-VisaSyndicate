/**
 * The Visa Syndicate — High-Resolution Dossier Image Card Generator
 * Creates an executive security certificate / transmission pass in PNG format
 * for sharing directly on WhatsApp.
 */

export interface DossierImageParams {
  referenceId: string;
  type: 'INQUIRY' | 'COUNSELOR_ACCREDITATION' | 'BOOKING_ESCROW';
  title: string;
  fullName: string;
  phone: string;
  email: string;
  category: string;
  destination?: string;
  statusText?: string;
  timestamp?: string;
}

export function generateDossierCanvas(params: DossierImageParams): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 680;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Background Gradient (Dark Luxury Obsidian-Crimson)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0F0103');
  bgGrad.addColorStop(0.5, '#1E0307');
  bgGrad.addColorStop(1, '#0A0002');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Geometric Decorative Background Lines
  ctx.strokeStyle = 'rgba(200, 16, 30, 0.12)';
  ctx.lineWidth = 1;
  for (let i = -width; i < width * 2; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }

  // 3. Luxury Outer Border with Crimson Glow
  ctx.strokeStyle = '#C8101E';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)'; // Gold inner accent
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // 4. Corner Ornaments (Golden Security Brackets)
  const cornerSize = 24;
  ctx.strokeStyle = '#E5A93C';
  ctx.lineWidth = 3;
  // Top Left
  ctx.beginPath();
  ctx.moveTo(35, 35 + cornerSize);
  ctx.lineTo(35, 35);
  ctx.lineTo(35 + cornerSize, 35);
  ctx.stroke();
  // Top Right
  ctx.beginPath();
  ctx.moveTo(width - 35 - cornerSize, 35);
  ctx.lineTo(width - 35, 35);
  ctx.lineTo(width - 35, 35 + cornerSize);
  ctx.stroke();
  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(35, height - 35 - cornerSize);
  ctx.lineTo(35, height - 35);
  ctx.lineTo(35 + cornerSize, height - 35);
  ctx.stroke();
  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(width - 35 - cornerSize, height - 35);
  ctx.lineTo(width - 35, height - 35);
  ctx.lineTo(width - 35, height - 35 - cornerSize);
  ctx.stroke();

  // 5. Header Branding: The Visa Syndicate
  ctx.fillStyle = '#E5A93C';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('SOVEREIGN IMMIGRATION DIRECTORATE • ANTI-FRAUD VERIFIED', width / 2, 65);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 32px "Cinzel", Georgia, serif';
  ctx.fillText('THE VISA SYNDICATE', width / 2, 105);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(params.title.toUpperCase(), width / 2, 128);

  // Dividing Line
  ctx.strokeStyle = 'rgba(200, 16, 30, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 145);
  ctx.lineTo(width - 80, 145);
  ctx.stroke();

  // 6. Central Highlight: Security Reference ID Badge
  const badgeY = 170;
  const badgeWidth = 460;
  const badgeHeight = 70;
  const badgeX = (width - badgeWidth) / 2;

  ctx.fillStyle = 'rgba(200, 16, 30, 0.2)';
  ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
  ctx.strokeStyle = '#C8101E';
  ctx.lineWidth = 2;
  ctx.strokeRect(badgeX, badgeY, badgeWidth, badgeHeight);

  ctx.fillStyle = '#FF8B94';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('OFFICIAL TRACKING REFERENCE NUMBER', width / 2, badgeY + 24);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 28px "Courier New", Courier, monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText(params.referenceId, width / 2, badgeY + 54);

  // 7. Data Grid: Client & Application Details
  const gridStartY = 275;
  const col1X = 100;
  const col2X = 640;

  ctx.textAlign = 'left';

  // Helper for field pairs
  const renderField = (label: string, value: string, x: number, y: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(label.toUpperCase(), x, y);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText(value, x, y + 24);
  };

  renderField('Full Name / Candidate', params.fullName, col1X, gridStartY);
  renderField('Contact / WhatsApp Number', params.phone, col2X, gridStartY);

  renderField('Email Address', params.email, col1X, gridStartY + 70);
  renderField('Visa Pathway / Category', params.category, col2X, gridStartY + 70);

  if (params.destination) {
    renderField('Destination Territory', params.destination, col1X, gridStartY + 140);
  } else {
    renderField('Jurisdiction', 'Global Visa Directorate', col1X, gridStartY + 140);
  }

  const timestamp = params.timestamp || new Date().toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  renderField('Registration Timestamp', timestamp + ' (PKT)', col2X, gridStartY + 140);

  // 8. Security Seal (Right Bottom Stamp)
  const sealX = width - 180;
  const sealY = height - 145;

  ctx.save();
  ctx.beginPath();
  ctx.arc(sealX, sealY, 52, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(37, 211, 102, 0.12)';
  ctx.fill();
  ctx.strokeStyle = '#25D366';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 3]);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#25D366';
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('SECURITY', sealX, sealY - 14);
  ctx.font = '900 15px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('VERIFIED', sealX, sealY + 4);
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('THE VISA SYNDICATE', sealX, sealY + 20);

  // 9. Footer Security Disclaimer
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, height - 90);
  ctx.lineTo(width - 80, height - 90);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#E5A93C';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('DIRECT TRANSMISSION PASS • SEND DIRECTLY TO GHULAM MUJTABA ON WHATSAPP: +92 340 0131732', 80, height - 65);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('thevisasyndicate.com • Segregated Escrow Protocol • Statutory Fraud Protection', 80, height - 45);

  return canvas;
}

export function downloadDossierImage(params: DossierImageParams, filename = 'Visa_Syndicate_Dossier_Pass.png') {
  const canvas = generateDossierCanvas(params);
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function getDossierDataUrl(params: DossierImageParams): string {
  const canvas = generateDossierCanvas(params);
  return canvas.toDataURL('image/png');
}
