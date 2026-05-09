import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiBox, FiTrendingUp, FiSearch, FiSliders, FiAlertCircle, FiPlus, FiMinus } from 'react-icons/fi';

const Inventory = () => {
  const [search, setSearch] = useState('');
  const [inventory, setInventory] = useState([
    { id: 'inv-1', name: 'Wireless Earbuds Pro', sku: 'SZ-EAR-PRO-01', category: 'Electronics', wh: 'WH-BOM-02 (Mumbai)', stock: 245, status: 'sufficient' },
    { id: 'inv-2', name: 'Handmade Leather Wallet', sku: 'SZ-WL-LTH-02', category: 'Fashion', wh: 'WH-DEL-01 (Delhi)', stock: 85, status: 'sufficient' },
    { id: 'inv-3', name: 'Orthopedic Sports Shoes', sku: 'SZ-SH-ORTH-03', category: 'Fashion', wh: 'WH-DEL-01 (Delhi)', stock: 3, status: 'low' },
    { id: 'inv-4', name: 'Precision Chef Knife', sku: 'SZ-KIT-KNF-04', category: 'Home & Kitchen', wh: 'WH-BOM-02 (Mumbai)', stock: 124, status: 'sufficient' },
    { id: 'inv-5', name: 'Organic Herbal Green Tea', sku: 'SZ-TEA-ORG-05', category: 'Groceries', wh: 'WH-DEL-01 (Delhi)', stock: 410, status: 'sufficient' },
  ]);

  const handleAdjustStock = (id, amount) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const nextStock = Math.max(0, item.stock + amount);
        const nextStatus = nextStock < 5 ? 'low' : 'sufficient';
        toast.success(`Adjusted stock of ${item.name} to ${nextStock} units.`);
        return { ...item, stock: nextStock, status: nextStatus };
      }
      return item;
    }));
  };

  const filtered = inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.wh.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '4px' }}>
      <div className="page-head" style={{ marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Warehouse Inventory & Stocks</h1>
          <p className="muted" style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0 0' }}>Monitor multi-location stocks, examine SKU counts, and track warehouse storage quotas.</p>
        </div>
      </div>

      {/* INVENTORY STATE STATISTICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }} className="cards">
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Items Stored</span>
            <FiBox style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
          </div>
          <strong style={{ display: 'block', fontSize: '1.8rem', color: '#0f172a', marginTop: 8 }}>
            {inventory.reduce((acc, i) => acc + i.stock, 0)} units
          </strong>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Unique Active SKUs</span>
            <FiTrendingUp style={{ fontSize: '1.25rem', color: '#10b981' }} />
          </div>
          <strong style={{ display: 'block', fontSize: '1.8rem', color: '#0f172a', marginTop: 8 }}>
            {inventory.length} profiles
          </strong>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Low Inventory Alerts</span>
            <FiAlertCircle style={{ fontSize: '1.25rem', color: '#ef4444' }} />
          </div>
          <strong style={{ display: 'block', fontSize: '1.8rem', color: '#991b1b', marginTop: 8 }}>
            {inventory.filter(i => i.status === 'low').length} warnings
          </strong>
        </div>
      </div>

      {/* STOCK SHELF TABLES */}
      <div className="panel" style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 15, marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Stock Shelf Directory</h3>
          <div style={{ position: 'relative', maxWidth: 300, width: '100%' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by SKU, product, warehouse..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b' }}>
                <th style={{ padding: '12px 10px' }}>Stored Product</th>
                <th style={{ padding: '12px 10px' }}>SKU Number</th>
                <th style={{ padding: '12px 10px' }}>Category</th>
                <th style={{ padding: '12px 10px' }}>Assigned Warehouse</th>
                <th style={{ padding: '12px 10px' }}>Stock Qty</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 10px' }}>
                    <strong style={{ display: 'block', color: '#334155' }}>{item.name}</strong>
                  </td>
                  <td style={{ padding: '14px 10px', color: '#475569', fontWeight: 600 }} className="mono">
                    {item.sku}
                  </td>
                  <td style={{ padding: '14px 10px', color: '#64748b' }}>
                    {item.category}
                  </td>
                  <td style={{ padding: '14px 10px', fontWeight: 600, color: '#2563eb' }}>
                    {item.wh}
                  </td>
                  <td style={{ padding: '14px 10px' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: item.status === 'low' ? '#fee2e2' : '#f1f5f9',
                      color: item.status === 'low' ? '#991b1b' : '#334155',
                      marginRight: 8
                    }}>
                      {item.stock} units
                    </span>
                    {item.status === 'low' && (
                      <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 'bold' }}>⚠️ LOW STOCK</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => handleAdjustStock(item.id, 10)}
                        style={{
                          padding: '4px 8px',
                          background: '#e2e8f0',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                        title="Add 10 units"
                      >
                        <FiPlus size={10} /> 10
                      </button>
                      <button
                        onClick={() => handleAdjustStock(item.id, -10)}
                        style={{
                          padding: '4px 8px',
                          background: '#f1f5f9',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                        title="Deduct 10 units"
                      >
                        <FiMinus size={10} /> 10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
