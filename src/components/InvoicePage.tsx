import { useState, useEffect } from 'react';

interface InvoiceData {
  invoiceNumber: string;
  customerEmail: string;
  customerName: string;
  customerCompany?: string;
  customerAddress?: string;
  tier: string;
  amount: string;
  invoiceDate: string;
  paymentDate: string;
  paymentMethod: string;
}

interface InvoicePageProps {
  invoiceId?: string;
  token?: string;
}

export default function InvoicePage({ invoiceId, token }: InvoicePageProps) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{
    customerName: string;
    customerCompany: string;
    customerAddress: string;
  }>({
    customerName: '',
    customerCompany: '',
    customerAddress: ''
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // Use secure token API if token is provided, otherwise use direct invoice API
        const apiUrl = token
          ? `/api/invoice-secure?token=${token}`
          : `/api/invoice?id=${invoiceId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Invoice not found');
        }
        const data = await response.json();

        // Check for localStorage overrides (use invoice number from response)
        const storageKey = `invoice_${data.invoiceNumber}`;
        const localData = localStorage.getItem(storageKey);
        if (localData) {
          const overrides = JSON.parse(localData);
          Object.assign(data, overrides);
        }

        setInvoice(data);
        setEditData({
          customerName: data.customerName || '',
          customerCompany: data.customerCompany || '',
          customerAddress: data.customerAddress || ''
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, token]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 300, color: '#666' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 100, marginBottom: '16px', color: '#333' }}>
            404
          </div>
          <div style={{ fontSize: '14px', fontWeight: 300, color: '#666' }}>
            Invoice not found
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!invoice) return;

    const storageKey = `invoice_${invoice.invoiceNumber}`;
    const overrides = {
      customerName: editData.customerName,
      customerCompany: editData.customerCompany,
      customerAddress: editData.customerAddress
    };

    localStorage.setItem(storageKey, JSON.stringify(overrides));

    setInvoice({
      ...invoice,
      ...overrides
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!invoice) return;

    setEditData({
      customerName: invoice.customerName || '',
      customerCompany: invoice.customerCompany || '',
      customerAddress: invoice.customerAddress || ''
    });

    setIsEditing(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      padding: '60px 40px'
    }}>
      <div className="invoice-container" style={{
        maxWidth: '720px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Action Buttons - Hidden in print */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '0',
          display: 'flex',
          gap: '8px'
        }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  background: 'transparent',
                  border: '1px solid #00ff88',
                  color: '#00ff88',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 400,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#666',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 400,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#666',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 400,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#666';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.color = '#666';
                }}
              >
                Edit
              </button>
              <button
                onClick={handlePrint}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#666',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 400,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#666';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.color = '#666';
                }}
              >
                Print
              </button>
            </>
          )}
        </div>

        {/* Header with Brand */}
        <div className="invoice-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '60px',
          paddingBottom: '30px',
          borderBottom: '1px solid #111'
        }}>
          <div>
            {/* Signal/Noise Logo */}
            <div style={{
              marginBottom: '24px',
              filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.3))'
            }}>
              <svg width="40" height="40" viewBox="0 0 554 558" fill="none">
                <path d="M1 557V1H553V317.562L312.41 557H1Z" fill="#00ff88" stroke="#00ff88"/>
              </svg>
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 200,
              letterSpacing: '-1px',
              marginBottom: '8px'
            }}>
              Signal/Noise
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 300,
              color: '#666',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Focus on what matters
            </div>
          </div>

          <div style={{
            textAlign: 'right'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: 100,
              letterSpacing: '-2px',
              marginBottom: '8px'
            }}>
              Invoice
            </div>
            <div className="invoice-number" style={{
              fontSize: '18px',
              fontWeight: 300,
              color: '#00ff88',
              fontFamily: 'SF Mono, Monaco, Courier New, monospace'
            }}>
              {invoice.invoiceNumber}
            </div>
          </div>
        </div>

        {/* Invoice Details Grid */}
        <div className="invoice-details" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '50px',
          marginBottom: '50px'
        }}>
          {/* Billing Details */}
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Billed to
            </div>

            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editData.customerName}
                  onChange={(e) => setEditData({...editData, customerName: e.target.value})}
                  placeholder="Customer Name"
                  style={{
                    background: 'transparent',
                    border: '1px solid #333',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 400,
                    padding: '8px 12px',
                    marginBottom: '8px',
                    width: '100%',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  value={editData.customerCompany}
                  onChange={(e) => setEditData({...editData, customerCompany: e.target.value})}
                  placeholder="Company Name (optional)"
                  style={{
                    background: 'transparent',
                    border: '1px solid #333',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 300,
                    padding: '8px 12px',
                    marginBottom: '8px',
                    width: '100%',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
                <textarea
                  value={editData.customerAddress}
                  onChange={(e) => setEditData({...editData, customerAddress: e.target.value})}
                  placeholder="Address (optional)"
                  rows={3}
                  style={{
                    background: 'transparent',
                    border: '1px solid #333',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 300,
                    padding: '8px 12px',
                    marginBottom: '8px',
                    width: '100%',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
                <div style={{ fontSize: '14px', color: '#999', fontWeight: 300 }}>
                  {invoice.customerEmail}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 400 }}>
                  {invoice.customerName}
                </div>
                {invoice.customerCompany && (
                  <div style={{ marginBottom: '8px', fontSize: '14px', color: '#ccc', fontWeight: 300 }}>
                    {invoice.customerCompany}
                  </div>
                )}
                {invoice.customerAddress && (
                  <div style={{ marginBottom: '8px', fontSize: '14px', color: '#ccc', fontWeight: 300, whiteSpace: 'pre-line' }}>
                    {invoice.customerAddress}
                  </div>
                )}
                <div style={{ fontSize: '14px', color: '#999', fontWeight: 300 }}>
                  {invoice.customerEmail}
                </div>
              </div>
            )}
          </div>

          {/* Invoice Info */}
          <div>
            <div style={{
              fontSize: '12px',
              fontWeight: 500,
              color: '#666',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Details
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Issue Date</div>
              <div style={{ fontSize: '14px', fontWeight: 400 }}>{invoice.invoiceDate}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Payment Date</div>
              <div style={{ fontSize: '14px', fontWeight: 400 }}>{invoice.paymentDate}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Payment Method</div>
              <div style={{ fontSize: '14px', fontWeight: 400 }}>{invoice.paymentMethod}</div>
            </div>
          </div>
        </div>

        {/* Service Description */}
        <div className="service-description" style={{
          marginBottom: '40px',
          padding: '30px 0',
          borderTop: '1px solid #111',
          borderBottom: '1px solid #111'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 400, marginBottom: '8px' }}>
                Signal/Noise {invoice.tier === 'foundation' ? 'Foundation' : 'Early Adopter'} Access
              </div>
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 300 }}>
                Lifetime access to AI Coach and all premium features
              </div>
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: 300,
              fontFamily: 'SF Mono, Monaco, Courier New, monospace'
            }}>
              €{invoice.amount}
            </div>
          </div>
        </div>

        {/* Total */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '40px'
        }}>
          <div style={{
            textAlign: 'right'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Total
            </div>
            <div style={{
              fontSize: '36px',
              fontWeight: 200,
              fontFamily: 'SF Mono, Monaco, Courier New, monospace'
            }}>
              €{invoice.amount}
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="payment-status" style={{
          padding: '20px',
          border: '1px solid #00ff88',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '40px',
          background: 'rgba(0, 255, 136, 0.05)'
        }}>
          <div className="paid-status" style={{
            color: '#00ff88',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '4px'
          }}>
            PAID
          </div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            fontWeight: 300
          }}>
            Payment received on {invoice.paymentDate}
          </div>
        </div>

        {/* Footer */}
        <div className="invoice-footer" style={{
          fontSize: '11px',
          color: '#444',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          <div style={{ marginBottom: '12px', fontWeight: 400 }}>
            Signal/Noise
          </div>
          <div style={{ marginBottom: '8px' }}>
            Digital productivity service • Privacy-first design
          </div>
          <div>
            Invoice generated on {new Date().toLocaleDateString('en-US')} • signal-noise.app
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 0.75in 1in;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              background: white !important;
              color: #000 !important;
              font-size: 11pt;
              line-height: 1.3;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif !important;
            }

            /* Reset all backgrounds and colors for print */
            * {
              background: white !important;
              color: #000 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            /* Keep Signal/Noise branding elements - make them bold black for print */
            div[style*="color: #00ff88"],
            .invoice-number,
            .paid-status {
              color: #000 !important;
              font-weight: 700 !important;
            }

            /* Convert all green borders to black for print */
            div[style*="border: '1px solid #00ff88'"],
            div[style*="border: 1px solid #00ff88"],
            .payment-status {
              border-color: #000 !important;
              background: #f9f9f9 !important;
            }

            /* Convert green button borders to black */
            button[style*="border: '1px solid #00ff88'"],
            button[style*="border: 1px solid #00ff88"] {
              border-color: #000 !important;
              color: #000 !important;
            }

            /* Ensure SVG logo prints as black */
            svg path[fill="#00ff88"],
            svg path[stroke="#00ff88"] {
              fill: #000 !important;
              stroke: #000 !important;
            }

            /* Logo - make it print-friendly */
            svg {
              width: 28pt !important;
              height: 28pt !important;
              margin-bottom: 8pt !important;
            }

            svg path {
              fill: #000 !important;
              stroke: #000 !important;
              stroke-width: 2 !important;
            }

            /* Container adjustments */
            .invoice-container {
              padding: 0 !important;
              max-width: 100% !important;
              margin: 0 !important;
            }

            /* Header optimizations */
            .invoice-header {
              margin-bottom: 20pt !important;
              padding-bottom: 16pt !important;
              border-bottom: 1pt solid #ccc !important;
            }

            /* Brand section */
            .invoice-header > div:first-child {
              margin-bottom: 0 !important;
            }

            .invoice-header div[style*="fontSize: '28px'"] {
              font-size: 18pt !important;
              font-weight: 500 !important;
              margin-bottom: 4pt !important;
              letter-spacing: -0.5pt !important;
            }

            .invoice-header div[style*="fontSize: '13px'"] {
              font-size: 8pt !important;
              color: #666 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5pt !important;
            }

            /* Invoice title and number */
            .invoice-header div[style*="fontSize: '48px'"] {
              font-size: 24pt !important;
              font-weight: 300 !important;
              margin-bottom: 4pt !important;
            }

            .invoice-number {
              font-size: 12pt !important;
              font-family: "SF Mono", Monaco, "Consolas", monospace !important;
              font-weight: 500 !important;
            }

            /* Grid layout adjustments */
            .invoice-details {
              grid-template-columns: 1fr 1fr !important;
              gap: 30pt !important;
              margin-bottom: 20pt !important;
            }

            /* Section headers */
            div[style*="textTransform: 'uppercase'"][style*="fontSize: '12px'"] {
              font-size: 9pt !important;
              font-weight: 600 !important;
              color: #333 !important;
              margin-bottom: 12pt !important;
              letter-spacing: 0.5pt !important;
            }

            /* Customer details */
            div[style*="fontSize: '16px'"][style*="fontWeight: 400"] {
              font-size: 11pt !important;
              font-weight: 500 !important;
              margin-bottom: 6pt !important;
            }

            div[style*="fontSize: '14px'"][style*="color: '#ccc'"],
            div[style*="fontSize: '14px'"][style*="color: '#999'"] {
              font-size: 10pt !important;
              color: #666 !important;
              margin-bottom: 4pt !important;
            }

            /* Service description */
            .service-description {
              margin-bottom: 16pt !important;
              padding: 12pt 0 !important;
              border-top: 1pt solid #ccc !important;
              border-bottom: 1pt solid #ccc !important;
            }

            .service-description div[style*="fontSize: '16px'"] {
              font-size: 11pt !important;
              font-weight: 500 !important;
            }

            .service-description div[style*="fontSize: '14px'"] {
              font-size: 9pt !important;
              color: #666 !important;
            }

            .service-description div[style*="fontSize: '24px'"] {
              font-size: 14pt !important;
              font-weight: 500 !important;
              font-family: "SF Mono", Monaco, "Consolas", monospace !important;
            }

            /* Total section */
            div[style*="fontSize: '36px'"] {
              font-size: 20pt !important;
              font-weight: 400 !important;
              font-family: "SF Mono", Monaco, "Consolas", monospace !important;
            }

            /* Payment status box */
            .payment-status {
              background: #f9f9f9 !important;
              border: 1.5pt solid #000 !important;
              border-radius: 6pt !important;
              padding: 10pt !important;
              margin-bottom: 16pt !important;
              page-break-inside: avoid;
            }

            .paid-status {
              font-size: 11pt !important;
              font-weight: 700 !important;
              margin-bottom: 4pt !important;
              letter-spacing: 1pt !important;
            }

            .payment-status div[style*="fontSize: '12px'"] {
              font-size: 9pt !important;
              color: #666 !important;
            }

            /* Footer */
            .invoice-footer {
              font-size: 8pt !important;
              color: #666 !important;
              text-align: center !important;
              line-height: 1.4 !important;
              margin-top: 16pt !important;
              padding-top: 12pt !important;
              border-top: 0.5pt solid #ddd !important;
            }

            .invoice-footer div:first-child {
              font-weight: 500 !important;
              margin-bottom: 8pt !important;
            }

            /* Hide all interactive elements */
            button,
            div[style*="position: absolute"],
            input,
            textarea {
              display: none !important;
            }

            /* Show static content for inputs when editing */
            .print-static {
              display: block !important;
            }

            /* Page break controls */
            .invoice-header,
            .invoice-details,
            .service-description {
              page-break-inside: avoid;
            }

            .payment-status {
              page-break-before: avoid;
              page-break-inside: avoid;
            }

            .invoice-footer {
              page-break-before: avoid;
            }

            /* Ensure proper spacing */
            * {
              filter: none !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }

            /* Improve text rendering */
            * {
              -webkit-font-smoothing: auto !important;
              -moz-osx-font-smoothing: auto !important;
            }
          }

          /* Screen-only styles */
          @media screen {
            .print-static {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}