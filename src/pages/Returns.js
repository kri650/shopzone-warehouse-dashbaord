import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiCheck } from 'react-icons/fi';
import { warehouseService } from '../services/warehouseService';

const money = (n) =>
  Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const Returns = () => {
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReturns = async () => {
    setLoading(true);
    try {
      const data = await warehouseService.listReturns();
      setReturnsList(data.items || []);
    } catch (err) {
      console.error(err);
      toast.error('Could not load returns list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  const handleMarkAsReceived = async (orderId, vendorOrderId, itemId, orderNumber) => {
    try {
      await warehouseService.receiveReturn(orderId, vendorOrderId, itemId);

      // Trigger notification
      try {
        window.dispatchEvent(new CustomEvent('add_notification', {
          detail: {
            text: `Return package for Order #${orderNumber} received at Warehouse WH-DEL-01. Stock refactored successfully.`
          }
        }));
      } catch (e) {
        // safe ignore
      }

      toast.success(`Package received! Stock quantities automatically updated for Order #${orderNumber}`);
      loadReturns();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Could not process package reception.');
    }
  };

  return (
    <div style={{ padding: '4px' }}>
      <div className="page-head" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Returns Processing Queue</h1>
          <p className="muted" style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0 0' }}>Log customer returns, scan defective parcels, and mark shipments as successfully processed.</p>
        </div>
        <button className="btn btn-small" type="button" onClick={loadReturns} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} disabled={loading}>
          <FiRefreshCw /> Refresh List
        </button>
      </div>

      {/* METRIC CARD OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }} className="cards">
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Awaiting Warehouse Pickup</span>
          <strong style={{ display: 'block', fontSize: '1.8rem', color: '#b45309', marginTop: 8 }}>
            {returnsList.filter(r => r.status === 'approved' || r.status === 'requested').length} returns
          </strong>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Processed & Completed</span>
          <strong style={{ display: 'block', fontSize: '1.8rem', color: '#10b981', marginTop: 8 }}>
            {returnsList.filter(r => r.status === 'completed').length} returned
          </strong>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Global Dispute Cases</span>
          <strong style={{ display: 'block', fontSize: '1.8rem', color: '#4f46e5', marginTop: 8 }}>
            {returnsList.length} incidents
          </strong>
        </div>
      </div>

      {/* RETURNS QUEUE PANEL */}
      <div className="panel" style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 20 }}>Returns Action Queue</h3>
        
        {loading ? (
          <div>Loading returns...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b' }}>
                  <th style={{ padding: '12px 10px' }}>Order & Product Details</th>
                  <th style={{ padding: '12px 10px' }}>Dispute Reason</th>
                  <th style={{ padding: '12px 10px' }}>Comments / Defect Explanations</th>
                  <th style={{ padding: '12px 10px' }}>Refund Target</th>
                  <th style={{ padding: '12px 10px' }}>Amount</th>
                  <th style={{ padding: '12px 10px' }}>Status</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {returnsList.map((ret, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 10px' }}>
                      <strong style={{ display: 'block', color: '#334155' }}>#{ret.orderNumber}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        {ret.image && (
                          <img src={ret.image} alt={ret.name} style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>{ret.name} (Qty: {ret.quantity || 1})</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: 6 }}>{new Date(ret.requestedAt).toLocaleDateString()}</span>
                    </td>
                    <td style={{ padding: '16px 10px', fontWeight: 600, color: '#92400e' }}>
                      {ret.reason}
                    </td>
                    <td style={{ padding: '16px 10px', color: '#475569', fontSize: '0.85rem', maxWidth: 220 }}>
                      "{ret.comments || 'No description supplied'}"
                    </td>
                    <td style={{ padding: '16px 10px' }}>
                      <span style={{ fontSize: '0.8rem', background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', fontWeight: 600 }}>
                        {ret.refundMethod}
                      </span>
                      {ret.upiId && <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>{ret.upiId}</span>}
                    </td>
                    <td style={{ padding: '16px 10px', fontWeight: 700, color: '#0f172a' }}>
                      {money(ret.amount)}
                    </td>
                    <td style={{ padding: '16px 10px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: 12,
                        background: ret.status === 'completed' ? '#d1fae5' : ret.status === 'approved' ? '#fef3c7' : '#fee2e2',
                        color: ret.status === 'completed' ? '#065f46' : ret.status === 'approved' ? '#b45309' : '#991b1b',
                        textTransform: 'uppercase'
                      }}>
                        {ret.status === 'requested' ? 'Pending Vendor' : ret.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 10px', textAlign: 'right' }}>
                      {ret.status === 'approved' ? (
                        <button
                          onClick={() => handleMarkAsReceived(ret.orderId, ret.vendorOrderId, ret.itemId, ret.orderNumber)}
                          style={{
                            padding: '6px 12px',
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <FiCheck /> Mark Received
                        </button>
                      ) : ret.status === 'requested' ? (
                        <span style={{ fontSize: '0.8rem', color: '#b45309', fontStyle: 'italic' }}>Awaiting Vendor Approval</span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontStyle: 'italic', fontWeight: 600 }}>Stock Restocked</span>
                      )}
                    </td>
                  </tr>
                ))}
                {returnsList.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                      No returns processing queue items available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Returns;
