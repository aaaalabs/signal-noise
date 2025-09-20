// Signal/Noise Weekly Analytics Cron Job
// Runs every Sunday at 6am CET (5am UTC)

export default async function handler(req, res) {
  try {
    console.log('🕐 Weekly analytics cron job triggered');

    // Get the base URL for the API call
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : req.headers.host
      ? `https://${req.headers.host}`
      : 'http://localhost:3000';

    // Call the analytics report endpoint
    const reportUrl = `${baseUrl}/api/analytics-report`;
    console.log(`📊 Calling analytics report: ${reportUrl}`);

    const response = await fetch(reportUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Signal/Noise Weekly Cron'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analytics report failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    console.log('✅ Weekly analytics report completed:', {
      success: result.success,
      messageId: result.messageId,
      weekNumber: result.data?.weekNumber,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Weekly analytics report sent successfully',
      result
    });

  } catch (error) {
    console.error('❌ Weekly analytics cron job failed:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown cron job error',
      timestamp: new Date().toISOString()
    });
  }
}