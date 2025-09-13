import { Redis } from '@upstash/redis';
import { getInvoice } from './redis-helper.js';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Invoice ID required' });
    }

    // Get invoice data from Redis
    const invoiceData = await getInvoice(redis, id);

    if (!invoiceData || Object.keys(invoiceData).length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Return structured invoice data
    return res.status(200).json({
      invoiceNumber: invoiceData.invoiceNumber,
      customerEmail: invoiceData.customerEmail,
      customerName: invoiceData.customerName || invoiceData.customerEmail,
      tier: invoiceData.tier,
      amount: invoiceData.amount,
      invoiceDate: invoiceData.invoiceDate,
      paymentDate: invoiceData.paymentDate,
      paymentMethod: invoiceData.paymentMethod || 'Stripe Payment'
    });

  } catch (error) {
    console.error('Invoice API error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve invoice'
    });
  }
}