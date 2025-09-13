import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    // Check if user exists and has premium access
    const userKey = `user:${email}`;
    const userData = await redis.hgetall(userKey);

    if (!userData || userData.status !== 'active') {
      return res.status(404).json({
        error: 'No active premium subscription found for this email'
      });
    }

    // Generate magic link token
    const token = 'ml_' + randomBytes(32).toString('hex');
    const magicLinkKey = `magic_link:${token}`;

    // Store magic link with 15-minute expiry
    await redis.setex(magicLinkKey, 900, email); // 15 minutes

    // Create magic link URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const magicLinkUrl = `${baseUrl}/login?token=${token}`;

    // Send email (using a simple email service)
    await sendMagicLinkEmail(email, magicLinkUrl, userData.first_name);

    return res.status(200).json({
      message: 'Magic link sent to your email',
      expires_in: 900 // 15 minutes
    });

  } catch (error) {
    console.error('Magic link error:', error);
    return res.status(500).json({ error: 'Failed to send magic link' });
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sendMagicLinkEmail(email, magicLinkUrl, firstName = '') {
  // Using Vercel's built-in email or external service like Resend
  const emailData = {
    to: email,
    subject: 'Your Signal/Noise Premium Access Link',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00ff88;">🎯 Signal/Noise Premium Access</h2>

        <p>Hi ${firstName ? firstName : 'there'}!</p>

        <p>Click the link below to access your AI Coach:</p>

        <a href="${magicLinkUrl}"
           style="display: inline-block; background: #00ff88; color: #000;
                  padding: 12px 24px; text-decoration: none; border-radius: 6px;
                  font-weight: bold; margin: 20px 0;">
          Access AI Coach →
        </a>

        <p style="color: #666; font-size: 14px;">
          This link expires in 15 minutes for security.<br>
          If you didn't request this, please ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="color: #666; font-size: 12px;">
          Signal/Noise - Focus on what matters<br>
          <a href="https://signal-noise.app">signal-noise.app</a>
        </p>
      </div>
    `
  };

  // TODO: Integrate with actual email service
  // For now, just log (replace with actual email service)
  console.log('Magic link email:', emailData);

  // Example with Resend (add to package.json if used)
  /*
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Signal/Noise <noreply@signal-noise.app>',
    ...emailData
  });
  */
}