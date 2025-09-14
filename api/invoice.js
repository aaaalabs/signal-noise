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

    // Return enhanced invoice data in LibraLab format
    return res.status(200).json({
      // Basic fields (backwards compatibility)
      invoiceNumber: invoiceData.invoiceNumber,
      customerEmail: invoiceData.customerEmail || invoiceData.customer?.email,
      customerName: invoiceData.customerName || invoiceData.customer?.name || invoiceData.customerEmail,
      tier: invoiceData.tier,
      amount: invoiceData.amount || invoiceData.totalAmount,
      invoiceDate: invoiceData.invoiceDate,
      paymentDate: invoiceData.paymentDate,
      paymentMethod: invoiceData.paymentMethod || 'Stripe Payment',

      // Enhanced LibraLab-compatible fields
      paymentIntentId: invoiceData.paymentIntentId,
      type: invoiceData.type,
      domain: invoiceData.domain,
      customer: invoiceData.customer,
      dueDate: invoiceData.dueDate,
      items: invoiceData.items,
      subtotal: invoiceData.subtotal,
      totalAmount: invoiceData.totalAmount,
      totalVat: invoiceData.totalVat,
      sessionId: invoiceData.sessionId
    });

  } catch (error) {
    console.error('Invoice API error:', error);
    return res.status(500).json({
      error: 'Failed to retrieve invoice'
    });
  }
}