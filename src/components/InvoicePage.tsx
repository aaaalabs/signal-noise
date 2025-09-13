import React, { useState, useEffect } from 'react';

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
  invoiceId: string;
}

export default function InvoicePage({ invoiceId }: InvoicePageProps) {
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
        const response = await fetch(`/api/invoice?id=${invoiceId}`);
        if (!response.ok) {
          throw new Error('Invoice not found');
        }
        const data = await response.json();

        // Check for localStorage overrides
        const storageKey = `invoice_${invoiceId}`;
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
  }, [invoiceId]);

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

    const storageKey = `invoice_${invoiceId}`;
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
      <div style={{
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
          gap: '8px',
          '@media print': { display: 'none' }
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '80px',
          paddingBottom: '40px',
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
            <div style={{
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          marginBottom: '80px'
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
        <div style={{
          marginBottom: '60px',
          padding: '40px 0',
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
          marginBottom: '60px'
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
        <div style={{
          padding: '24px',
          border: '1px solid #00ff88',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '80px',
          background: 'rgba(0, 255, 136, 0.05)'
        }}>
          <div style={{
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
        <div style={{
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
            body { margin: 0; padding: 0; background: white !important; color: black !important; }
            * { background: white !important; color: black !important; }
            svg path { fill: #00ff88 !important; stroke: #00ff88 !important; }
            div[style*="background: rgba(0, 255, 136, 0.05)"] {
              background: #f5f5f5 !important;
              border-color: #00ff88 !important;
            }
            div[style*="color: #00ff88"] { color: #00ff88 !important; }
            div[style*="filter: drop-shadow"] { filter: none !important; }
            button { display: none !important; }
            input, textarea { border: none !important; background: white !important; padding: 0 !important; }
          }
        `}
      </style>
    </div>
  );
}