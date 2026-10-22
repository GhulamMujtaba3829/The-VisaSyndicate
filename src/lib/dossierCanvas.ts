/**
 * The Visa Syndicate — Professional Dossier Pass Generator (PNG)
 * Clean, executive certificate layout with terms & conditions and contact guarantee.
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
  const height = 720;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Background Gradient (Clean Professional Dark Obsidian-Crimson)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0C0204');
  bgGrad.addColorStop(0.5, '#180306');
  bgGrad.addColorStop(1, '#080102');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Geometric Decorative Background Lines
  ctx.strokeStyle = 'rgba(200, 16, 30, 0.08)';
  ctx.lineWidth = 1;
  for (let i = -width; i < width * 2; i += 70) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }

  // 3. Professional Luxury Outer Border
  ctx.strokeStyle = '#C8101E';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)'; // Gold inner accent
  ctx.lineWidth = 1;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // 4. Corner Ornaments (Golden Brackets)
  const cornerSize = 20;
  ctx.strokeStyle = '#E5A93C';
  ctx.lineWidth = 2.5;
  // Top Left
  ctx.beginPath();
  ctx.moveTo(38, 38 + cornerSize);
  ctx.lineTo(38, 38);
  ctx.lineTo(38 + cornerSize, 38);
  ctx.stroke();
  // Top Right
  ctx.beginPath();
  ctx.moveTo(width - 38 - cornerSize, 38);
  ctx.lineTo(width - 38, 38);
  ctx.lineTo(width - 38, 38 + cornerSize);
  ctx.stroke();
  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(38, height - 38 - cornerSize);
  ctx.lineTo(38, height - 38);
  ctx.lineTo(38 + cornerSize, height - 38);
  ctx.stroke();
  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(width - 38 - cornerSize, height - 38);
  ctx.lineTo(width - 38, height - 38);
  ctx.lineTo(width - 38, height - 38 - cornerSize);
  ctx.stroke();

  // 5. Header Branding (Cleaned: removed top subtitle line as requested)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 30px "Cinzel", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('THE VISA SYNDICATE', width / 2, 75);

  ctx.fillStyle = '#E5A93C';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(params.title.toUpperCase(), width / 2, 102);

  // Dividing Line
  ctx.strokeStyle = 'rgba(200, 16, 30, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 122);
  ctx.lineTo(width - 80, 122);
  ctx.stroke();

  // 6. Central Highlight: Reference ID Badge
  const badgeY = 145;
  const badgeWidth = 440;
  const badgeHeight = 65;
  const badgeX = (width - badgeWidth) / 2;

  ctx.fillStyle = 'rgba(200, 16, 30, 0.18)';
  ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
  ctx.strokeStyle = '#C8101E';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(badgeX, badgeY, badgeWidth, badgeHeight);

  ctx.fillStyle = '#FFB4BC';
  ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('OFFICIAL DOSSIER REFERENCE NUMBER', width / 2, badgeY + 20);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 26px "Courier New", Courier, monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(params.referenceId, width / 2, badgeY + 48);

  // 7. Data Grid: Client & Application Details
  const gridStartY = 245;
  const col1X = 100;
  const col2X = 640;

  ctx.textAlign = 'left';

  const renderField = (label: string, value: string, x: number, y: number) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(label.toUpperCase(), x, y);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText(value, x, y + 22);
  };

  renderField('Full Name / Candidate', params.fullName, col1X, gridStartY);
  renderField('Contact / WhatsApp Number', params.phone, col2X, gridStartY);

  renderField('Email Address', params.email, col1X, gridStartY + 62);
  renderField('Visa Pathway / Category', params.category, col2X, gridStartY + 62);

  if (params.destination) {
    renderField('Destination Territory', params.destination, col1X, gridStartY + 124);
  } else {
    renderField('Jurisdiction', 'Global Visa Directorate', col1X, gridStartY + 124);
  }

  const timestamp = params.timestamp || new Date().toLocaleString('en-PK', {
    timeZone: 'Asia/Karachi',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  renderField('Registration Timestamp', timestamp + ' (PKT)', col2X, gridStartY + 124);

  // 8. Contact Guarantee Text ("Our team will contact as soon as possible")
  const bannerY = 410;
  ctx.fillStyle = 'rgba(37, 211, 102, 0.12)';
  ctx.fillRect(80, bannerY, width - 160, 42);
  ctx.strokeStyle = 'rgba(37, 211, 102, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, bannerY, width - 160, 42);

  ctx.fillStyle = '#25D366';
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('✓ Our team will contact as soon as possible.', width / 2, bannerY + 26);

  // 9. Professional Terms & Conditions Section
  const termsY = 475;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E5A93C';
  ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('PROFESSIONAL TERMS & CONDITIONS:', 80, termsY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
  const termsText = [
    '1. All information and documents submitted are handled with absolute confidentiality under sovereign advisory protocols.',
    '2. Final visa granting authority rests entirely with respective sovereign High Commissions, Embassies, and Immigration authorities.',
    '3. Consultation fees paid are non-refundable and secure professional evaluation, document seasoning, and legal vetting.'
  ];
  let currentY = termsY + 20;
  for (const line of termsText) {
    ctx.fillText(line, 80, currentY);
    currentY += 18;
  }

  // 10. Footer Disclaimer
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, height - 60);
  ctx.lineTo(width - 80, height - 60);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('The Visa Syndicate Official Digital Certificate • thevisasyndicate.com', width / 2, height - 35);

  return canvas;
}

export function downloadDossierImage(params: DossierImageParams, filename = 'Visa_Syndicate_Pass.png') {
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
