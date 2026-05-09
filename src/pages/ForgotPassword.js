import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Reset link sent (if the email exists).');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send reset link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <p className="muted">We’ll email you a reset link.</p>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

