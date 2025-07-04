import React, { useState } from 'react';
import { resendVerificationEmail } from '../services/api';
import { useTranslation } from 'react-i18next';

const EmailVerificationStatus = () => {
  const { t } = useTranslation();
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
      setMessage(t('email_verification.resent_success'));
    } catch (err) {
      setMessage(t('email_verification.resent_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 500 }}>
      <h2>{t('email_verification.title')}</h2>
      <p>{t('email_verification.instructions')}</p>
      <button className="btn btn-primary" onClick={handleResend} disabled={loading}>
        {loading ? t('email_verification.resending') : t('email_verification.resend_button')}
      </button>
      {message && <div className={`alert mt-3 ${success ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
    </div>
  );
};

export default EmailVerificationStatus;
