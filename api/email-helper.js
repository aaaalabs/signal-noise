// Signal/Noise Email Service with Resend Integration
// SLC: Simple email sending for magic links and notifications

import { Resend } from 'resend';

// Signal/Noise sender configuration
const SENDER_EMAIL = 'noreply@signal-noise.app';
const SENDER_NAME = 'Signal/Noise';
const FROM_ADDRESS = `${SENDER_NAME} <${SENDER_EMAIL}>`;

// EmailResult interface:
// {
//   success: boolean;
//   messageId?: string;
//   error?: string;
// }

/**
 * Send magic link for premium access recovery
 */
export const sendMagicLink = async (
  userEmail,
  verifyUrl,
  tierName = 'Premium Member'
) => {
  try {
    console.log(`Sending magic link to ${userEmail}`);

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

          body {
            background-color: #000000 !important;
            color: #ffffff !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1.7;
            margin: 0;
            padding: 0;
            width: 100% !important;
            min-width: 100%;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .email-container {
            max-width: 560px;
            margin: 40px auto;
            background-color: #000000;
            color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }

          .header {
            text-align: center;
            padding: 50px 30px 40px;
            background: radial-gradient(circle at center, rgba(0, 255, 136, 0.02) 0%, transparent 70%);
          }

          .brand-icon {
            font-size: 24px;
            margin-bottom: 16px;
            filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.5));
          }

          .brand-title {
            font-size: 28px;
            font-weight: 200;
            letter-spacing: -0.5px;
            margin: 0;
            color: #ffffff;
          }

          .brand-subtitle {
            font-size: 13px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #666666;
            margin: 6px 0 0 0;
          }

          .content {
            padding: 0 30px 20px;
            background-color: #000000;
          }

          .content-card {
            background: linear-gradient(145deg, #0a0a0a 0%, #050505 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 40px;
            position: relative;
            overflow: hidden;
          }

          .content-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.5), transparent);
          }

          .greeting {
            font-size: 18px;
            font-weight: 400;
            color: #ffffff;
            margin: 0 0 24px 0;
            letter-spacing: -0.2px;
          }

          .message {
            font-size: 15px;
            line-height: 1.7;
            color: #cccccc;
            margin: 0 0 36px 0;
          }

          .button-container {
            text-align: center;
            margin: 36px 0;
          }

          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #00ff88 0%, #00dd77 100%);
            color: #000000 !important;
            padding: 18px 36px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
            font-size: 15px;
            letter-spacing: 0.3px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            box-shadow: 0 8px 24px rgba(0, 255, 136, 0.25), 0 0 0 1px rgba(0, 255, 136, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
          }

          .info-section {
            background: rgba(0, 255, 136, 0.03);
            border: 1px solid rgba(0, 255, 136, 0.15);
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
            position: relative;
          }

          .info-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(180deg, #00ff88, transparent);
            border-radius: 2px;
          }

          .info-label {
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #00ff88;
            margin: 0 0 8px 0;
          }

          .info-content {
            font-size: 14px;
            color: #cccccc;
            margin: 0;
            line-height: 1.6;
          }

          .info-tier {
            font-weight: 600;
            color: #ffffff;
          }

          .footer {
            padding: 40px 30px 30px;
            text-align: center;
            background-color: #000000;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            margin-top: 20px;
          }

          .footer-text {
            font-size: 12px;
            color: #666666;
            margin: 0 0 16px 0;
            line-height: 1.6;
          }

          .footer-brand {
            font-size: 11px;
            color: #999999;
            margin: 0;
            letter-spacing: 0.5px;
          }

          .footer-link {
            color: #00ff88;
            text-decoration: none;
            font-weight: 400;
          }

          @media only screen and (max-width: 600px) {
            .email-container { margin: 20px auto; border-radius: 12px; }
            .header { padding: 40px 20px 30px; }
            .brand-title { font-size: 24px; }
            .content { padding: 0 20px 20px; }
            .content-card { padding: 30px 24px; }
            .greeting { font-size: 17px; }
            .message { font-size: 14px; }
            .cta-button { padding: 16px 28px; font-size: 14px; }
            .footer { padding: 30px 20px 24px; }
          }

          @media (prefers-color-scheme: dark) {
            .email-container { background-color: #000000 !important; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08) !important; }
            body { background-color: #000000 !important; color: #ffffff !important; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 554 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
              </svg>
            </div>
            <h1 class="brand-title">Signal/Noise</h1>
            <p class="brand-subtitle">Premium Access Recovery</p>
          </div>

          <div class="content">
            <div class="content-card">
              <h2 class="greeting">Hi there!</h2>
              <p class="message">
                We received a request to restore your premium access. Use the secure link below to log back into your account and continue your focus journey.
              </p>

              <div class="button-container">
                <a href="${verifyUrl}" class="cta-button">
                  Restore Premium Access
                </a>
              </div>

              <div class="info-section">
                <div class="info-label">Access Details</div>
                <div class="info-content">
                  <span class="info-tier">${tierName}</span> • Secure link expires in 15 minutes
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p class="footer-text">
              If you didn't request this, simply ignore this email.<br>
              No changes will be made to your account.
            </p>
            <p class="footer-brand">
              Signal/Noise<br>
              <a href="https://signal-noise.app" class="footer-link">signal-noise.app</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Signal/Noise - Premium Access Recovery

Hi there!

We received a request to restore your premium access.

Click this link to securely log back into your account:
${verifyUrl}

Your tier: ${tierName}

This link expires in 15 minutes and can only be used once.

If you didn't request this email, you can safely ignore it.

Signal/Noise - Focus on what matters
https://signal-noise.app
    `.trim();

    // Send email with Resend
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: userEmail,
      subject: 'Signal/Noise Premium Access Recovery',
      html,
      text,
      tags: [
        { name: 'category', value: 'magic_link' },
        { name: 'tier', value: tierName.toLowerCase().replace(/\s+/g, '_') }
      ]
    });

    if (response.error) {
      console.error('Resend magic link error:', response.error);
      return {
        success: false,
        error: response.error.message
      };
    }

    console.log(`Magic link sent: ${response.data?.id}`);
    return {
      success: true,
      messageId: response.data?.id
    };

  } catch (error) {
    console.error('Failed to send magic link:', error);
    return {
      success: false,
      error: error.message || 'Unknown email sending error'
    };
  }
};

/**
 * Send welcome email after successful payment
 */
export const sendWelcomeEmail = async (
  userEmail,
  firstName,
  tierName = 'Premium Member',
  invoiceNumber = null
) => {
  try {
    console.log(`Sending welcome email to ${userEmail}`);

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }

          body {
            background-color: #000000 !important;
            color: #ffffff !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif !important;
            line-height: 1.7;
            margin: 0;
            padding: 0;
            width: 100% !important;
            min-width: 100%;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .email-container {
            max-width: 560px;
            margin: 40px auto;
            background-color: #000000;
            color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }

          .header {
            text-align: center;
            padding: 50px 30px 40px;
            background: radial-gradient(ellipse at center, rgba(0, 255, 136, 0.08) 0%, rgba(0, 255, 136, 0.02) 40%, transparent 70%);
          }

          .brand-icon {
            font-size: 32px;
            margin-bottom: 16px;
            filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.6));
          }

          .brand-title {
            font-size: 28px;
            font-weight: 200;
            letter-spacing: -0.5px;
            margin: 0;
            color: #ffffff;
          }

          .brand-subtitle {
            font-size: 13px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #00ff88;
            margin: 6px 0 0 0;
          }

          .content {
            padding: 0 30px 20px;
            background-color: #000000;
          }

          .content-card {
            background: linear-gradient(145deg, #0a0a0a 0%, #050505 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 40px;
            position: relative;
            overflow: hidden;
          }

          .content-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.5), transparent);
          }

          .greeting {
            font-size: 18px;
            font-weight: 400;
            color: #ffffff;
            margin: 0 0 24px 0;
            letter-spacing: -0.2px;
          }

          .message {
            font-size: 15px;
            line-height: 1.7;
            color: #cccccc;
            margin: 0 0 32px 0;
          }

          .activation-card {
            background: linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 255, 136, 0.05) 100%);
            border: 1px solid rgba(0, 255, 136, 0.2);
            border-radius: 16px;
            padding: 32px;
            margin: 32px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
          }

          .activation-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ff88, transparent);
          }

          .activation-icon {
            font-size: 24px;
            margin-bottom: 12px;
            filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.5));
          }

          .activation-title {
            font-size: 18px;
            font-weight: 500;
            color: #00ff88;
            margin: 0 0 8px 0;
            letter-spacing: -0.2px;
          }

          .activation-text {
            font-size: 14px;
            color: #cccccc;
            margin: 0;
            line-height: 1.6;
          }

          .features-section {
            margin: 36px 0;
          }

          .features-title {
            font-size: 15px;
            font-weight: 500;
            color: #ffffff;
            margin: 0 0 24px 0;
            letter-spacing: -0.1px;
          }

          .features-grid {
            display: grid;
            gap: 16px;
          }

          .feature-item {
            display: flex;
            align-items: flex-start;
            padding: 16px 20px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .feature-icon {
            color: #00ff88;
            margin-right: 16px;
            font-size: 16px;
            line-height: 1.5;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .feature-content {
            flex: 1;
          }

          .feature-title {
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
            margin: 0 0 4px 0;
            line-height: 1.4;
          }

          .feature-description {
            font-size: 13px;
            color: #999999;
            margin: 0;
            line-height: 1.5;
          }

          .invoice-section {
            margin: 32px 0;
            padding: 0;
          }

          .invoice-card {
            background: rgba(255, 255, 255, 0.01);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .invoice-header {
            padding: 20px 24px;
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .invoice-label {
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666666;
            margin: 0;
          }

          .invoice-number {
            font-size: 13px;
            font-weight: 400;
            color: #00ff88;
            margin: 0;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Courier, monospace;
          }

          .invoice-body {
            padding: 24px;
          }

          .invoice-description {
            font-size: 14px;
            color: #cccccc;
            margin: 0 0 20px 0;
            line-height: 1.6;
          }

          .invoice-link {
            display: inline-flex;
            align-items: center;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            color: #ffffff !important;
            text-decoration: none;
            font-size: 13px;
            font-weight: 400;
            letter-spacing: 0.2px;
            transition: all 0.3s ease;
          }

          .invoice-link:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.12);
            transform: translateY(-1px);
          }

          .invoice-icon {
            margin-right: 10px;
            opacity: 0.8;
          }

          .button-container {
            text-align: center;
            margin: 40px 0 0;
          }

          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #00ff88 0%, #00dd77 100%);
            color: #000000 !important;
            padding: 18px 36px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
            font-size: 15px;
            letter-spacing: 0.3px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
            box-shadow: 0 8px 24px rgba(0, 255, 136, 0.25), 0 0 0 1px rgba(0, 255, 136, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
          }

          .footer {
            padding: 40px 30px 30px;
            text-align: center;
            background-color: #000000;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            margin-top: 20px;
          }

          .footer-brand {
            font-size: 11px;
            color: #999999;
            margin: 0;
            letter-spacing: 0.5px;
          }

          .footer-link {
            color: #00ff88;
            text-decoration: none;
            font-weight: 400;
          }

          @media only screen and (max-width: 600px) {
            .email-container { margin: 20px auto; border-radius: 12px; }
            .header { padding: 40px 20px 30px; }
            .brand-title { font-size: 24px; }
            .content { padding: 0 20px 20px; }
            .content-card { padding: 30px 24px; }
            .activation-card { padding: 24px; }
            .invoice-header { padding: 16px 20px; }
            .invoice-body { padding: 20px; }
            .invoice-link { padding: 10px 16px; font-size: 12px; }
            .greeting { font-size: 17px; }
            .message { font-size: 14px; }
            .feature-item { padding: 14px 16px; }
            .cta-button { padding: 16px 28px; font-size: 14px; }
            .footer { padding: 30px 20px 24px; }
          }

          @media (prefers-color-scheme: dark) {
            .email-container { background-color: #000000 !important; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08) !important; }
            body { background-color: #000000 !important; color: #ffffff !important; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 554 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
              </svg>
            </div>
            <h1 class="brand-title">Signal/Noise</h1>
            <p class="brand-subtitle">Welcome to Premium!</p>
          </div>

          <div class="content">
            <div class="content-card">
              <h2 class="greeting">Hi ${firstName || 'there'}!</h2>
              <p class="message">
                Welcome to Signal/Noise Premium! Your AI Coach is now ready to help you achieve peak productivity and focus on what truly matters.
              </p>

              <div class="activation-card">
                <div class="activation-icon">
                  <svg width="20" height="20" viewBox="0 0 554 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
                  </svg>
                </div>
                <div class="activation-title">${tierName} Activated</div>
                <p class="activation-text">
                  Unlimited access to all premium features, forever. No recurring charges, no expiration.
                </p>
              </div>

              ${invoiceNumber ? `
              <div class="invoice-section">
                <div class="invoice-card">
                  <div class="invoice-header">
                    <div class="invoice-label">Invoice</div>
                    <div class="invoice-number">${invoiceNumber}</div>
                  </div>
                  <div class="invoice-body">
                    <p class="invoice-description">
                      Your payment confirmation and receipt are available for download and printing.
                    </p>
                    <a href="https://signal-noise.app/invoice/${invoiceNumber}" class="invoice-link">
                      <span class="invoice-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                          <path d="M14 2v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                          <path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </span>
                      View Invoice
                    </a>
                  </div>
                </div>
              </div>
              ` : ''}

              <div class="features-section">
                <h3 class="features-title">Your Premium Features</h3>
                <div class="features-grid">
                  <div class="feature-item">
                    <span class="feature-icon">
                      <svg width="16" height="16" viewBox="0 0 554 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
                      </svg>
                    </span>
                    <div class="feature-content">
                      <div class="feature-title">Personal AI Coach</div>
                      <div class="feature-description">Powered by Groq for instant insights</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">
                      <svg width="16" height="16" viewBox="0 0 554 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
                      </svg>
                    </span>
                    <div class="feature-content">
                      <div class="feature-title">Pattern Recognition</div>
                      <div class="feature-description">Advanced behavioral analysis</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">
                      <svg width="16" height="16" viewBox="0 0 554 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
                      </svg>
                    </span>
                    <div class="feature-content">
                      <div class="feature-title">Smart Check-ins</div>
                      <div class="feature-description">Daily insights and weekly reports</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">
                      <svg width="16" height="16" viewBox="0 0 554 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
                      </svg>
                    </span>
                    <div class="feature-content">
                      <div class="feature-title">Real-time Interventions</div>
                      <div class="feature-description">Instant productivity guidance</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">
                      <svg width="16" height="16" viewBox="0 0 554 558" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
                      </svg>
                    </span>
                    <div class="feature-content">
                      <div class="feature-title">Future Features</div>
                      <div class="feature-description">All upcoming premium capabilities</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="button-container">
                <a href="https://signal-noise.app" class="cta-button">
                  Start Using AI Coach
                </a>
              </div>
            </div>
          </div>

          <div class="footer">
            <p class="footer-brand">
              Signal/Noise<br>
              <a href="https://signal-noise.app" class="footer-link">signal-noise.app</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Signal/Noise - Welcome to Premium!

Hi ${firstName || 'there'}!

Welcome to Signal/Noise Premium! Your AI Coach is now ready to help you achieve peak productivity.

${tierName} Activated!
You now have unlimited access to all premium features, forever.

${invoiceNumber ? `Invoice ${invoiceNumber}
Your payment receipt is available at: https://signal-noise.app/invoice/${invoiceNumber}

` : ''}Your Premium Features:
Personal AI Coach powered by Groq
Advanced pattern recognition
Daily check-ins and weekly reports
Real-time productivity interventions
All future premium features

Start using: https://signal-noise.app

Signal/Noise - Focus on what matters
https://signal-noise.app
    `.trim();

    // Send email with Resend
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: userEmail,
      subject: 'Welcome to Signal/Noise Premium!',
      html,
      text,
      tags: [
        { name: 'category', value: 'welcome' },
        { name: 'tier', value: tierName.toLowerCase().replace(/\s+/g, '_') }
      ]
    });

    if (response.error) {
      console.error('Resend welcome email error:', response.error);
      return {
        success: false,
        error: response.error.message
      };
    }

    console.log(`Welcome email sent: ${response.data?.id}`);
    return {
      success: true,
      messageId: response.data?.id
    };

  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return {
      success: false,
      error: error.message || 'Unknown email sending error'
    };
  }
};