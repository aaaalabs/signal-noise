import { Redis } from '@upstash/redis';
import { getInvoiceByToken } from './redis-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Invoice token required' });
    }

    // Get invoice data using secure token
    const invoiceData = await getInvoiceByToken(redis, token);

    if (!invoiceData || Object.keys(invoiceData).length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Return LibraLab-compatible invoice data (all fields)
    return res.status(200).json(invoiceData);

  } catch (error) {
    console.error('Secure Invoice API error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve invoice'
    });
  }
}