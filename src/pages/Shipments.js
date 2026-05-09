import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { warehouseService } from '../services/warehouseService';
import './Shipments.css';

const STATUS_OPTIONS = [
  'awaiting_vendor_dispatch',
  'received_at_warehouse',
  'assigned',
  'packing',
  'packed',
  'picked_up',
  'in_transit',
  'out_for_delivery',
  'delivered',
];

const Shipments = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ status: 'received_at_warehouse', description: '', location: '' });
  const [courier, setCourier] = useState({ courierPartner: '', courierTrackingId: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await warehouseService.listShipments({ limit: 50, search: search || undefined, status: status || undefined });
      setItems(data.items || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load shipments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search && !status) return items;
    const s = search.toLowerCase();
    return items.filter((sh) => {
      const matchText = !search || `${sh.trackingId} ${sh.order?.orderNumber || ''} ${sh.customer?.name || ''} ${sh.vendorOrder?.vendor?.storeName || ''}`.toLowerCase().includes(s);
      const matchStatus = !status || sh.status === status;
      return matchText && matchStatus;
    });
  }, [items, search, status]);

  const openModal = (sh) => {
    setActive(sh);
    setForm({ status: sh.status || 'received_at_warehouse', description: '', location: '' });
    setCourier({ courierPartner: sh.courierPartner || '', courierTrackingId: sh.courierTrackingId || '' });
    setOpen(true);
  };

  const saveStatus = async () => {
    if (!active?._id) return;
    setSaving(true);
    try {
      await warehouseService.updateShipmentStatus(active._id, form);
      toast.success('Status updated.');
      setOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status.');
    } finally {
      setSaving(false);
    }
  };

  const saveCourier = async () => {
    if (!active?._id) return;
    if (!courier.courierPartner || !courier.courierTrackingId) {
      toast.error('Courier partner + tracking ID required.');
      return;
    }
    setSaving(true);
    try {
      await warehouseService.updateCourier(active._id, courier.courierPartner, courier.courierTrackingId);
      toast.success('Courier updated.');
      setOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update courier.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="shipments">
      <div className="page-head">
        <div>
          <h1>Shipments Queue</h1>
          <p className="muted">Realistic Flow: Pending Arrival (from Vendor) → Received → Processed.</p>
        </div>
        <div className="actions">
          <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order / vendor / AWB…" />
          <button className="btn btn-small" type="button" onClick={load}>Refresh</button>
        </div>
      </div>

      <div className="panel">
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="table ship-table">
            <div className="row head">
              <div>Vendor Name</div>
              <div>Products</div>
              <div>Qty</div>
              <div>Shipping Address</div>
              <div>Shipment Status</div>
              <div>Action</div>
            </div>
            {filtered.map((sh) => (
              <div className="row" key={sh._id}>
                <div className="bold">{sh.vendorOrder?.vendor?.storeName || '—'}</div>
                <div className="product-info" style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 220 }}>
                  {sh.items?.map((it, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6, 
                      fontSize: '0.75rem', 
                      background: '#f8fafc', 
                      padding: '4px 8px', 
                      borderRadius: 6, 
                      border: '1px solid #e2e8f0',
                      lineHeight: '1.2'
                    }}>
                      {it.image && (
                        <img 
                          src={it.image} 
                          alt={it.name} 
                          style={{ width: 18, height: 18, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} 
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: '#334155', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={it.name}>
                          {it.name}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.7rem' }}>
                          Qty: <span style={{ fontWeight: 700, color: '#0f172a' }}>{it.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mono">
                  {sh.items?.reduce((sum, it) => sum + it.quantity, 0)}
                </div>
                <div className="address-cell small">
                  <div>{sh.deliveryAddress?.fullName}</div>
                  <div className="muted">{sh.deliveryAddress?.city}</div>
                </div>
                <div>
                  <span className={`badge ${sh.status}`}>
                    {sh.status === 'awaiting_vendor_dispatch' ? 'PENDING ARRIVAL' : sh.status?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <div className="btn-row">
                  <button className="btn btn-small" type="button" onClick={() => openModal(sh)}>Update Status</button>
                </div>
              </div>
            ))}
            {!filtered.length && <div className="empty">No shipments in queue.</div>}
          </div>
        )}
      </div>

      {open && (
        <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">Shipment Log: {active?.trackingId}</div>
                <div className="muted small">Vendor: {active?.vendorOrder?.vendor?.storeName}</div>
              </div>
              <button className="btn btn-small danger" type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="modal-body">
              <div className="section">
                <div className="section-title">Logistics Status</div>
                <p className="muted small" style={{ marginBottom: '1rem' }}>
                  Current: {active?.status?.replace(/_/g, ' ').toUpperCase()}
                </p>
                <select className="select full" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  {STATUS_OPTIONS.map((s) => (
                    <option value={s} key={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
                <button className="btn full" type="button" disabled={saving} onClick={saveStatus}>
                  {saving ? 'Updating...' : 'Update Warehouse Status'}
                </button>
              </div>

              <div className="divider" />

              <div className="section">
                <div className="section-title">Courier Outbound (Final Leg)</div>
                <input className="input full" value={courier.courierPartner} onChange={(e) => setCourier((p) => ({ ...p, courierPartner: e.target.value }))} placeholder="Partner Name (e.g. Delhivery)" />
                <input className="input full" value={courier.courierTrackingId} onChange={(e) => setCourier((p) => ({ ...p, courierTrackingId: e.target.value }))} placeholder="AWB Number" />
                <button className="btn full" type="button" disabled={saving} onClick={saveCourier}>
                  Save Logistics Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipments;
