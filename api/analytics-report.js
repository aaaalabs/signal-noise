// Signal/Noise Weekly Analytics Report - Redis SLC Version

import { Resend } from 'resend';
import { getWeeklyData } from './analytics-helper.js';

const ADMIN_EMAIL = 'admin@libralab.ai';
const SENDER_EMAIL = 'noreply@signal-noise.app';
const FROM_ADDRESS = `Signal/Noise Intel <${SENDER_EMAIL}>`;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for report secret
  const { REPORT_SECRET } = req.query;
  if (REPORT_SECRET !== 'justME2027!') {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing REPORT_SECRET' });
  }

  try {
    console.log('📊 Starting weekly analytics report...');

    // Get week number
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);

    // Get real analytics data from Redis
    const data = await getWeeklyData();
    console.log('📊 Redis data:', data);

    const analyticsData = {
      weekNumber,
      period: getWeekPeriod(now),
      metrics: {
        pageViews: data.pageViews
      },
      topPages: data.topPages.length > 0 ? data.topPages : [{ path: '/', views: data.pageViews }]
    };

    // Send email
    const emailResult = await sendAnalyticsEmail(analyticsData);

    if (emailResult.success) {
      console.log('✅ Weekly analytics report sent');
      return res.status(200).json({
        success: true,
        message: 'Analytics report sent',
        messageId: emailResult.messageId,
        data: analyticsData
      });
    } else {
      console.error('❌ Failed to send report:', emailResult.error);
      return res.status(500).json({
        success: false,
        error: emailResult.error
      });
    }

  } catch (error) {
    console.error('❌ Analytics report error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
}

function getWeekPeriod(date) {
  const endDate = new Date(date);
  const startDate = new Date(date);
  startDate.setDate(endDate.getDate() - 6);

  const formatDate = (d) => d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function getTrendIcon(change) {
  if (change > 0) return '📈';
  if (change < 0) return '📉';
  return '➡️';
}

function getTrendColor(change) {
  if (change > 0) return '#00ff88';
  if (change < 0) return '#ff6b6b';
  return '#cccccc';
}

async function sendAnalyticsEmail(data) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
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
            max-width: 600px;
            margin: 40px auto;
            background-color: #000000;
            color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }

          .header {
            text-align: center;
            padding: 40px 30px 30px;
            background: radial-gradient(circle at center, rgba(0, 255, 136, 0.02) 0%, transparent 70%);
          }

          .brand-title {
            font-size: 24px;
            font-weight: 200;
            letter-spacing: -0.5px;
            margin: 0;
            color: #ffffff;
          }

          .brand-subtitle {
            font-size: 12px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #00ff88;
            margin: 4px 0 0 0;
          }

          .week-info {
            font-size: 11px;
            color: #666666;
            margin: 8px 0 0 0;
          }

          .content {
            padding: 20px 40px 40px;
            background-color: #000000;
          }

          .metrics-grid {
            display: flex;
            justify-content: center;
            margin-bottom: 40px;
          }

          .metric-card {
            background: linear-gradient(145deg, #0a0a0a 0%, #050505 100%);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            padding: 32px 24px;
            text-align: center;
            position: relative;
            overflow: hidden;
            width: 240px;
            min-height: 120px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }


          .metric-value {
            font-size: 36px;
            font-weight: 100;
            color: #ffffff;
            margin: 0 0 12px 0;
            line-height: 1.1;
          }

          .metric-label {
            font-size: 11px;
            color: #666666;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin: 0 0 12px 0;
            line-height: 1.2;
          }

          .metric-trend {
            font-size: 11px;
            font-weight: 400;
            margin: 0;
            opacity: 0.9;
          }

          .section {
            margin-bottom: 20px;
          }

          .section-title {
            font-size: 15px;
            font-weight: 500;
            color: #ffffff;
            margin: 0 0 24px 0;
            letter-spacing: 0.4px;
            text-align: center;
          }

          .data-list {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            overflow: hidden;
          }

          .data-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            min-height: 52px;
          }

          .data-item:last-child {
            border-bottom: none;
          }

          .data-item-label {
            font-size: 14px;
            color: #cccccc;
            font-weight: 400;
            line-height: 1.3;
          }

          .data-item-value {
            font-size: 14px;
            color: #ffffff;
            font-weight: 500;
            line-height: 1.3;
            margin-left: 16px;
            text-align: right;
          }

          .footer {
            padding: 40px 40px 30px;
            text-align: center;
            background-color: #000000;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }

          .footer-text {
            font-size: 11px;
            color: #666666;
            margin: 0;
            letter-spacing: 0.3px;
          }

          @media only screen and (max-width: 600px) {
            .email-container { margin: 20px auto; border-radius: 12px; }
            .header { padding: 30px 20px 24px; }
            .content { padding: 16px 20px 32px; }
            .metric-card {
              width: 220px;
              padding: 28px 20px;
              min-height: 110px;
            }
            .metric-value { font-size: 32px; }
            .data-item {
              padding: 14px 20px;
              min-height: 48px;
            }
            .data-item-label, .data-item-value { font-size: 13px; }
            .section { margin-bottom: 16px; }
            .section-title { margin-bottom: 20px; }
            .footer { padding: 32px 20px 24px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1 class="brand-title">Signal/Noise</h1>
            <p class="brand-subtitle">Weekly Intel</p>
            <p class="week-info">Week ${data.weekNumber} • ${data.period}</p>
          </div>

          <div style="padding: 20px 40px 40px; background-color: #000000;">
            <div style="display: flex; justify-content: center; margin-bottom: 40px;">
              <div style="background: linear-gradient(145deg, #0a0a0a 0%, #050505 100%); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 32px 24px; text-align: center; width: 240px; min-height: 120px; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 36px; font-weight: 100; color: #ffffff; margin: 0 0 12px 0; line-height: 1.1;">${data.metrics.pageViews.toLocaleString()}</div>
                <div style="font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 12px 0; line-height: 1.2;">Page Views</div>
                <div style="font-size: 11px; font-weight: 400; margin: 0; opacity: 0.9; color: #666666;">
                  Real-time data
                </div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="font-size: 15px; font-weight: 500; color: #ffffff; margin: 0 0 24px 0; letter-spacing: 0.4px; text-align: center;">Top Pages</h3>
              <table style="width: 100%; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; border-collapse: separate; border-spacing: 0;">
                ${data.topPages.map((page, index) => `
                  <tr>
                    <td style="padding: 16px 24px; font-size: 14px; color: #cccccc; font-weight: 400; line-height: 1.3; text-align: left; vertical-align: middle; width: 70%; ${index < data.topPages.length - 1 ? 'border-bottom: 1px solid rgba(255, 255, 255, 0.03);' : ''} ${index === 0 ? 'border-top-left-radius: 12px;' : ''} ${index === data.topPages.length - 1 ? 'border-bottom-left-radius: 12px;' : ''}">${page.path}</td>
                    <td style="padding: 16px 24px; font-size: 14px; color: #ffffff; font-weight: 500; line-height: 1.3; text-align: right; vertical-align: middle; width: 30%; ${index < data.topPages.length - 1 ? 'border-bottom: 1px solid rgba(255, 255, 255, 0.03);' : ''} ${index === 0 ? 'border-top-right-radius: 12px;' : ''} ${index === data.topPages.length - 1 ? 'border-bottom-right-radius: 12px;' : ''}">${page.views.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          </div>

          <div class="footer">
            <p class="footer-text">
              Signal/Noise Analytics • Automated Weekly Report<br>
              <span style="color: #444444; font-size: 10px; margin-top: 4px; display: inline-block;">Generated by Claude Code AI Assistant</span>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Signal/Noise Weekly Intel - Week ${data.weekNumber}
${data.period}

KEY METRICS:
• Page Views: ${data.metrics.pageViews.toLocaleString()}

TOP PAGES:
${data.topPages.map(page => `• ${page.path}: ${page.views.toLocaleString()}`).join('\n')}

---
Signal/Noise Analytics - Automated Weekly Report
Generated by Claude Code AI Assistant
    `.trim();

    const response = await resend.emails.send({
      from: FROM_ADDRESS,
      to: ADMIN_EMAIL,
      subject: `Signal/Noise Weekly Intel • Week ${data.weekNumber}`,
      text,
      tags: [
        { name: 'category', value: 'analytics' },
        { name: 'week', value: data.weekNumber.toString() }
      ]
    });

    if (response.error) {
      console.error('Resend error:', response.error);
      return { success: false, error: response.error.message };
    }

    console.log(`Analytics email sent: ${response.data?.id}`);
    return { success: true, messageId: response.data?.id };

  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}