// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { login } from '../services/auth'; // Import your login function
import { useTranslation } from 'react-i18next';
import './css/signIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(''); // To display login errors
  const [loading, setLoading] = useState(false); // To handle loading state
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Actually call the backend API to log in
      const userData = await login({ email, password });
      
      // If login is successful, redirect to a protected page
      // Redirect based on the user's role
      let redirectPath = '/';
      if (userData.user.role === 'organizer') {
        redirectPath = '/organizer-dashboard';
      } else if (userData.user.role === 'attendee') {
        redirectPath = '/attendee-dashboard';
      } else if (userData.user.role === 'admin') {
        redirectPath = '/admin-panel'; // Redirect to admin page
      }
      // Refresh the page and redirect
      window.location.replace(redirectPath);
    } catch (err) {
      // If login fails, display an error message
      setError(t('signin.errors.invalid_login'));
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{t('signin.app_name')}</span>
          </div>
          <h1 className="signin-title">{t('signin.title')}</h1>
          <p className="signin-subtitle">{t('signin.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="signin-form">
          {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}
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
                placeholder={t('signin.placeholders.email')} 
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
                placeholder={t('signin.placeholders.password')} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="form-options">
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                {t('signin.remember_me')}
              </label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              {t('signin.forgot_password')}
            </Link>
          </div>
          <button 
            type="submit" 
            className="signin-btn"
            disabled={loading}
          >
            {loading ? t('signin.loading') : t('signin.button')}
          </button>
          <div className="divider">
            <span>{t('signin.or_social')}</span>
          </div>
          <div className="social-login">
            <button type="button" className="social-btn google">
              {/* ...svg... */}
              {t('signin.social.google')}
            </button>
            <button type="button" className="social-btn github">
              {/* ...svg... */}
              {t('signin.social.github')}
            </button>
          </div>
          <div className="signup-link">
            {t('signin.no_account')} <Link to="/sign-up">{t('signin.signup_link')}</Link>
          </div>
        </form>
      </div>
      <div className="signin-graphics">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
    </div>
  );
};

export default SignIn;