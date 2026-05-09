import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { warehouseService } from '../services/warehouseService';
import './Overview.css';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const d = await warehouseService.getDashboardSummary();
      setData(d);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="panel">Loading dashboard…</div>;

  return (
    <div className="overview">
      <div className="page-head">
        <div>
          <h1>Overview</h1>
          <p className="muted">Shipment queue and delivery operations snapshot.</p>
        </div>
        <button className="btn btn-small" type="button" onClick={load}>Refresh</button>
      </div>

      <div className="grid-cards">
        <div className="card">
          <div className="k">Total</div>
          <div className="v">{data?.cards?.totalShipments || 0}</div>
        </div>
        <div className="card">
          <div className="k">Assigned</div>
          <div className="v">{data?.cards?.assigned || 0}</div>
        </div>
        <div className="card">
          <div className="k">Packing</div>
          <div className="v">{data?.cards?.packing || 0}</div>
        </div>
        <div className="card">
          <div className="k">In Transit</div>
          <div className="v">{data?.cards?.inTransit || 0}</div>
        </div>
        <div className="card">
          <div className="k">Delivered</div>
          <div className="v">{data?.cards?.delivered || 0}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Recent Shipments</h2>
        </div>
        <div className="table">
          <div className="row head">
            <div>Tracking</div>
            <div>Order</div>
            <div>Customer</div>
            <div>Status</div>
          </div>
          {(data?.recentShipments || []).map((s) => (
            <div className="row" key={s._id}>
              <div className="mono">{s.trackingId}</div>
              <div className="mono">{s.order?.orderNumber || '—'}</div>
              <div>{s.customer?.name || '—'}</div>
              <div><span className={`badge ${s.status}`}>{s.status}</span></div>
            </div>
          ))}
          {!data?.recentShipments?.length && <div className="empty">No shipments.</div>}
        </div>
      </div>
    </div>
  );
};

export default Overview;

