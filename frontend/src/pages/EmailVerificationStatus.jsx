import React, { useState } from 'react';
import { resendVerificationEmail } from '../services/api';

const EmailVerificationStatus = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    setSuccess(false);
    try {
      await resendVerificationEmail();
      setSuccess(true);
      setMessage('Verification email resent! Please check your inbox.');
    } catch (err) {
      setMessage('Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2>Email Verification Required</h2>
      <p>Please check your email and click the verification link to activate your account.</p>
      <button className="btn btn-primary" onClick={handleResend} disabled={loading}>
        {loading ? 'Resending...' : 'Resend Verification Email'}
      </button>
      {message && <div className={`alert mt-3 ${success ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
    </div>
  );
};

export default EmailVerificationStatus;
