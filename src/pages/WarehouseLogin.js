import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import './Auth.css';

const WarehouseLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAutofill = () => {
    setFormData({
      email: 'staff@shopzone.local',
      password: 'Staff@12345'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await authService.login(formData);
      login(data.accessToken, data.user);
      toast.success('Signed in.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Warehouse Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</button>
          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </form>

        <div className="demo-credentials" style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          border: '1px dashed #3b82f6',
          borderRadius: '8px',
          fontSize: '0.875rem',
          textAlign: 'left'
        }}>
          <div style={{ fontWeight: '600', color: '#1e3a8a', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🔑 Demo Warehouse Credentials</span>
            <button 
              type="button" 
              onClick={handleAutofill}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#2563eb'}
              onMouseOut={(e) => e.target.style.background = '#3b82f6'}
            >
              Autofill
            </button>
          </div>
          <div style={{ color: '#1e40af', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            Email: staff@shopzone.local<br/>
            Password: Staff@12345
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseLogin;
