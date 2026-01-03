import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import complianceService from '../../services/complianceService'

const InvoiceGenerator = () => {
  const { orders, skuMaster } = useData()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [ewayBillData, setEwayBillData] = useState(null)

  // Mock invoice data
  const mockInvoices = [
    {
      id: 'INV-2024-001',
      orderId: 'BW-9901',
      customer: 'Rajesh Kumar',
      date: '2024-12-28',
      items: [{ sku: 'BL-DESK-01', name: 'Executive Desk', qty: 1, price: 12500, gst: 18 }],
      subtotal: 12500,
      gstAmount: 2250,
      total: 14750,
      status: 'Paid',
    },
    {
      id: 'INV-2024-002',
      orderId: 'BW-9906',
      customer: 'Meera Iyer',
      date: '2024-12-29',
      items: [{ sku: 'BL-DESK-02', name: 'Modern Workstation', qty: 1, price: 18000, gst: 18 }],
      subtotal: 18000,
      gstAmount: 3240,
      total: 21240,
      status: 'Paid',
    },
    {
      id: 'INV-2024-003',
      orderId: 'BW-9904',
      customer: 'Sneha Reddy',
      date: '2024-12-30',
      items: [{ sku: 'BL-TABLE-03', name: 'Dining Table Set', qty: 1, price: 25000, gst: 18 }],
      subtotal: 25000,
      gstAmount: 4500,
      total: 29500,
      status: 'Pending',
    },
  ]

  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalGST = mockInvoices.reduce((sum, inv) => sum + inv.gstAmount, 0)

  const generateInvoicePDF = (invoice) => {
    console.log('Generating invoice PDF for:', invoice.id)
    alert(`Invoice ${invoice.id} would be downloaded as PDF`)
  }

  const generateEwayBill = (invoice) => {
    const ewayBill = complianceService.generateEwayBill({
      id: invoice.orderId,
      total: invoice.total,
      sku: invoice.items[0]?.sku || 'DEFAULT',
      state: 'Karnataka',
      carrier: 'Delhivery',
    })
    setEwayBillData(ewayBill)
    alert(
      `E-way Bill Generated: ${ewayBill.ewayNumber}\nValid Until: ${new Date(ewayBill.validUntil).toLocaleDateString()}`
    )
  }

  return (
    <div className="invoice-generator animate-fade">
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <h2>Invoice Management</h2>
          <p className="text-muted">GST-compliant invoice generation</p>
        </div>
        <button className="btn-primary glass-hover" style={{ padding: '12px 24px' }}>
          + Create Invoice
        </button>
      </div>

      {/* Summary Stats */}
      <div
        className="invoice-stats"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
            {mockInvoices.length}
          </p>
          <span className="text-muted">Total Invoices</span>
        </div>
        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)' }}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-muted">Total Revenue</span>
        </div>
        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent)' }}>
            ₹{totalGST.toLocaleString('en-IN')}
          </p>
          <span className="text-muted">GST Collected</span>
        </div>
        <div className="glass" style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>
            {mockInvoices.filter((i) => i.status === 'Pending').length}
          </p>
          <span className="text-muted">Pending Payment</span>
        </div>
      </div>

      {/* Invoices Table */}
      <div
        className="invoices-table glass"
        style={{ marginTop: '32px', overflow: 'hidden', borderRadius: '12px' }}
      >
        <div
          className="table-header"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1fr 1fr 1fr',
            padding: '16px 20px',
            background: 'var(--bg-accent)',
            fontWeight: '700',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}
        >
          <span>Invoice #</span>
          <span>Order</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {mockInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="table-row glass-hover"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1fr 1fr 1fr',
              padding: '16px 20px',
              alignItems: 'center',
              borderBottom: '1px solid var(--glass-border)',
            }}
          >
            <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{invoice.id}</span>
            <span>{invoice.orderId}</span>
            <span>{invoice.customer}</span>
            <span className="text-muted">{invoice.date}</span>
            <span style={{ fontWeight: '700' }}>₹{invoice.total.toLocaleString('en-IN')}</span>
            <span
              className="badge"
              style={{
                background: invoice.status === 'Paid' ? 'var(--success)' : 'var(--warning)',
                fontSize: '0.65rem',
                justifySelf: 'start',
              }}
            >
              {invoice.status}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-secondary glass-hover"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                onClick={() => setSelectedOrder(invoice)}
              >
                View
              </button>
              <button
                className="btn-primary glass-hover"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                onClick={() => generateInvoicePDF(invoice)}
              >
                PDF
              </button>
              {invoice.total > 50000 && (
                <button
                  className="btn-secondary glass-hover"
                  style={{ padding: '6px 12px', fontSize: '0.65rem', background: 'var(--accent)' }}
                  onClick={() => generateEwayBill(invoice)}
                >
                  📦 E-way
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Detail Modal */}
      {selectedOrder && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="invoice-preview glass animate-fade"
            style={{
              width: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              borderRadius: '16px',
              background: '#fff',
              color: '#333',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid #6366F1',
                paddingBottom: '16px',
              }}
            >
              <div>
                <h2 style={{ color: '#6366F1' }}>INVOICE</h2>
                <p style={{ fontWeight: '700' }}>{selectedOrder.id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3>Bluewud Industries</h3>
                <p style={{ fontSize: '0.85rem', color: '#666' }}>GSTIN: 29XXXXX1234X1Z5</p>
              </div>
            </div>

            <div
              style={{
                marginTop: '24px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
              }}
            >
              <div>
                <p style={{ color: '#666', fontSize: '0.75rem' }}>BILL TO</p>
                <p style={{ fontWeight: '700' }}>{selectedOrder.customer}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#666', fontSize: '0.75rem' }}>DATE</p>
                <p>{selectedOrder.date}</p>
              </div>
            </div>

            <table style={{ width: '100%', marginTop: '24px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '12px 0', color: '#666' }}>Item</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: '#666' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: '#666' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: '#666' }}>GST</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', color: '#666' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 0' }}>
                      {item.name}
                      <br />
                      <span style={{ color: '#666', fontSize: '0.8rem' }}>{item.sku}</span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px 0' }}>{item.qty}</td>
                    <td style={{ textAlign: 'right', padding: '12px 0' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px 0' }}>{item.gst}%</td>
                    <td style={{ textAlign: 'right', padding: '12px 0', fontWeight: '700' }}>
                      ₹{(item.price * (1 + item.gst / 100)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: '24px',
                textAlign: 'right',
                borderTop: '2px solid #6366F1',
                paddingTop: '16px',
              }}
            >
              <p>Subtotal: ₹{selectedOrder.subtotal.toLocaleString('en-IN')}</p>
              <p>GST (18%): ₹{selectedOrder.gstAmount.toLocaleString('en-IN')}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#6366F1' }}>
                Total: ₹{selectedOrder.total.toLocaleString('en-IN')}
              </p>
            </div>

            <button
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '14px',
                background: '#6366F1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => {
                generateInvoicePDF(selectedOrder)
                setSelectedOrder(null)
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceGenerator
