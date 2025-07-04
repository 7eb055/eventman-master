// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from './../services/api';
import { useTranslation } from 'react-i18next';
import './css/signUp.css';

const Register = () => {
  const { t } = useTranslation();
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [role, setRole] = useState('attendee');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await registerUser({
      full_name: fullname,
      email,
      password,
      confirmPassword,
      agreeTerms,
      role,
      company_name: role === 'organizer' ? companyName : '',
      phone
    });
  };

  return (
    <React.Fragment>
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-header">
            <div className="logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{t('register.app_name')}</span>
            </div>
            <h1 className="signup-title">{t('register.title')}</h1>
            <p className="signup-subtitle">{t('register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {/* Account Type Selector */}
            <div className="form-group">
              <label className="form-label">{t('register.account_type')}</label>
              <select className="form-control" value={role} onChange={e => setRole(e.target.value)} required>
                <option value="attendee">{t('register.options.attendee')}</option>
                <option value="organizer">{t('register.options.organizer')}</option>
              </select>
            </div>
            {/* Company Name (only for organizer) */}
            {role === 'organizer' && (
              <div className="form-group">
                <div className="input-group">
                  <span className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('register.placeholders.company')}
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    required={role === 'organizer'}
                  />
                </div>
              </div>
            )}
            {/* Phone Number (optional) */}
            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"></path></svg>
                </span>
                <input
                  type="tel"
                  className="form-control"
                  placeholder={t('register.placeholders.phone')}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path>
                  </svg>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={t('register.placeholders.full_name')} 
                  required
                  value={fullname}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder={t('register.placeholders.email')} 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder={t('register.placeholders.password')} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-group">
                <span className="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder={t('register.placeholders.confirm_password')} 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-options">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <label className="form-check-label" htmlFor="agreeTerms">
                  {t('register.terms_html', { terms: '<a href="/terms">' + t('register.terms') + '</a>' })}
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="signup-btn"
            >
              {t('register.button')}
            </button>

            <div className="divider">
              <span>{t('register.or_social')}</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn google">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h-1.26A8 8 0 1 0 20 15h1m-3-7v5m0 0l2.5 2.5M17 15l-2.5 2.5"/>
                </svg>
                {t('register.social.google')}
              </button>
              <button type="button" className="social-btn github">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                {t('register.social.github')}
              </button>
            </div>

            <div className="signin-link">
              {t('register.already_account')} <Link to="/sign-in">{t('register.signin_link')}</Link>
            </div>
          </form>
        </div>

        <div className="signup-graphics">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Register;