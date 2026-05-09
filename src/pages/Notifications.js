import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { warehouseService } from '../services/warehouseService';
import './Notifications.css';

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await warehouseService.listNotifications({ limit: 50, unread: unreadOnly ? 'true' : undefined });
      setItems(data.items || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [unreadOnly]);

  const markRead = async (id) => {
    try {
      await warehouseService.markNotificationRead(id);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not mark as read.');
    }
  };

  const markAll = async () => {
    try {
      await warehouseService.markAllNotificationsRead();
      toast.success('All marked as read.');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not mark all as read.');
    }
  };

  return (
    <div className="notifs">
      <div className="page-head">
        <div>
          <h1>Notifications</h1>
          <p className="muted">Assignments and shipment updates.</p>
        </div>
        <div className="actions">
          <label className="toggle">
            <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
            <span>Unread only</span>
          </label>
          <button className="btn btn-small" type="button" onClick={markAll}>Mark all read</button>
        </div>
      </div>

      <div className="panel">
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="list">
            {items.map((n) => (
              <div className={`notif ${n.isRead ? 'read' : 'unread'}`} key={n._id}>
                <div className="head">
                  <div className="title">{n.title}</div>
                  <div className="meta mono">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="msg">{n.message}</div>
                <div className="foot">
                  <span className={`badge ${n.type}`}>{n.type.replace(/_/g, ' ')}</span>
                  {!n.isRead && (
                    <button className="btn btn-small" type="button" onClick={() => markRead(n._id)}>Mark read</button>
                  )}
                </div>
              </div>
            ))}
            {!items.length && <div className="empty">No notifications.</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
