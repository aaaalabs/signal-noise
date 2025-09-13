// Signal/Noise Email Service with Resend Integration
// SLC: Simple email sending for magic links and notifications

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Signal/Noise sender configuration
const SENDER_EMAIL = 'noreply@my.signal-noise.app';
const SENDER_NAME = 'Signal/Noise';
const FROM_ADDRESS = `${SENDER_NAME} <${SENDER_EMAIL}>`;

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send magic link for premium access recovery
 */
export const sendMagicLink = async (
  userEmail: string,
  verifyUrl: string,
  tierName: string = 'Premium Member'
): Promise<EmailResult> => {
  try {
    console.log(`📧 Sending magic link to ${userEmail}`);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00ff88; margin: 0; font-size: 28px;">🎯 Signal/Noise</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Premium Access Recovery</p>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Hi there!</h2>

          <p style="color: #374151; margin: 0 0 20px 0; line-height: 1.5;">
            We received a request to restore your premium access. Click the button below to securely log back into your account:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}"
               style="display: inline-block; background: #00ff88; color: #000;
                      padding: 14px 28px; text-decoration: none; border-radius: 6px;
                      font-weight: bold; font-size: 16px;">
              Restore Premium Access →
            </a>
          </div>

          <div style="background: #e0f2fe; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #0369a1; font-size: 14px;">
              <strong>Your tier:</strong> ${tierName}<br>
              <strong>Expires:</strong> This link expires in 15 minutes and can only be used once.
            </p>
          </div>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
            If you didn't request this email, you can safely ignore it.<br>
            This link will expire automatically and no changes will be made to your account.
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            Signal/Noise - Focus on what matters<br>
            <a href="https://signal-noise.app" style="color: #00ff88;">signal-noise.app</a>
          </p>
        </div>
      </div>
    `;

    const text = `
🎯 Signal/Noise - Premium Access Recovery

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
      subject: '🎯 Signal/Noise Premium Access Recovery',
      html,
      text,
      tags: [
        { name: 'category', value: 'magic_link' },
        { name: 'tier', value: tierName.toLowerCase().replace(/\s+/g, '_') }
      ]
    });

    if (response.error) {
      console.error('❌ Resend magic link error:', response.error);
      return {
        success: false,
        error: response.error.message
      };
    }

    console.log(`✅ Magic link sent: ${response.data?.id}`);
    return {
      success: true,
      messageId: response.data?.id
    };

  } catch (error) {
    console.error('❌ Failed to send magic link:', error);
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
  userEmail: string,
  firstName: string,
  tierName: string = 'Premium Member'
): Promise<EmailResult> => {
  try {
    console.log(`📧 Sending welcome email to ${userEmail}`);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00ff88; margin: 0; font-size: 28px;">🎯 Signal/Noise</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Welcome to Premium!</p>
        </div>

        <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px;">Hi ${firstName || 'there'}!</h2>

          <p style="color: #374151; margin: 0 0 20px 0; line-height: 1.5;">
            Welcome to Signal/Noise Premium! Your AI Coach is now ready to help you achieve peak productivity.
          </p>

          <div style="background: #dcfce7; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">🌟 ${tierName} Activated!</h3>
            <p style="margin: 0; color: #166534; font-size: 14px;">
              You now have unlimited access to all premium features, forever. No recurring charges, no expiration.
            </p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">Your Premium Features:</h3>
            <ul style="color: #374151; margin: 0; padding-left: 20px;">
              <li>✨ Personal AI Coach powered by Groq</li>
              <li>📊 Advanced pattern recognition</li>
              <li>🎯 Daily check-ins and weekly reports</li>
              <li>⚡ Real-time productivity interventions</li>
              <li>🚀 All future premium features</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://signal-noise.app"
               style="display: inline-block; background: #00ff88; color: #000;
                      padding: 14px 28px; text-decoration: none; border-radius: 6px;
                      font-weight: bold; font-size: 16px;">
              Start Using AI Coach →
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">
            Signal/Noise - Focus on what matters<br>
            <a href="https://signal-noise.app" style="color: #00ff88;">signal-noise.app</a>
          </p>
        </div>
      </div>
    `;

    const text = `
🎯 Signal/Noise - Welcome to Premium!

Hi ${firstName || 'there'}!

Welcome to Signal/Noise Premium! Your AI Coach is now ready to help you achieve peak productivity.

🌟 ${tierName} Activated!
You now have unlimited access to all premium features, forever.

Your Premium Features:
✨ Personal AI Coach powered by Groq
📊 Advanced pattern recognition
🎯 Daily check-ins and weekly reports
⚡ Real-time productivity interventions
🚀 All future premium features

Start using: https://signal-noise.app

Signal/Noise - Focus on what matters
https://signal-noise.app
    `.trim();

    // Send email with Resend
    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: userEmail,
      subject: '🎯 Welcome to Signal/Noise Premium!',
      html,
      text,
      tags: [
        { name: 'category', value: 'welcome' },
        { name: 'tier', value: tierName.toLowerCase().replace(/\s+/g, '_') }
      ]
    });

    if (response.error) {
      console.error('❌ Resend welcome email error:', response.error);
      return {
        success: false,
        error: response.error.message
      };
    }

    console.log(`✅ Welcome email sent: ${response.data?.id}`);
    return {
      success: true,
      messageId: response.data?.id
    };

  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return {
      success: false,
      error: error.message || 'Unknown email sending error'
    };
  }
};