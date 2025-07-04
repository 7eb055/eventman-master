// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import ServerStatus from '../components/ServerStatus';
import './css/signUp.css';
import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '', // changed from full_name
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee', // Default role
    location: '',
    companyName: '', // new
    phone: '' // new
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateField = (name, value) => {
    let error = '';
    if (name === 'fullName' && !value.trim()) error = t('signup.errors.full_name_required');
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = t('signup.errors.email_invalid');
    if (name === 'password' && value.length < 8) error = t('signup.errors.password_length');
    if (name === 'confirmPassword' && value !== formData.password) error = t('signup.errors.passwords_no_match');
    if (name === 'companyName' && formData.role === 'organizer' && !value.trim()) error = t('signup.errors.company_required');
    if (name === 'phone' && value && !/^\+?\d{7,15}$/.test(value)) error = t('signup.errors.phone_invalid');
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const errors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const err = validateField(name, value);
      if (err) errors[name] = err;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    console.log('Form submitted with values:', formData);
    
    setIsLoading(true);
    setError('');
    
    try {
      // Prepare the data to match Laravel's expected format
      const userData = {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: formData.role,
        company_name: formData.role === 'organizer' ? formData.companyName : '',
        phone: formData.phone,
        location: formData.role === 'organizer' ? formData.location : null
      };

      console.log('Submitting user data to API:', userData);
      
      // Call the registerUser function from our API service
      const response = await registerUser(userData);
      console.log('Registration successful response:', response);

      // Redirect based on user role
      if (response.role === 'organizer') {
        setSuccess('Registration successful! Please check your email to verify your account before creating events.');
        setTimeout(() => {
          navigate('/verify-email');
        }, 2000);
      } else {
        setSuccess('Registration successful! Please check your email to verify your account.');
        setTimeout(() => {
          navigate('/verify-email');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Check for known error messages
      if (err.message.includes('Cannot connect to')) {
        setError('Server connection error: The backend server appears to be down. Please try again later or contact support.');
      } else if (err.message.includes('already been taken')) {
        setError('This email is already registered. Please try logging in instead.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced password strength check
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2"/>
              <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>EventMan</span>
          </div>
          <h1 className="signup-title">{t('signup.title')}</h1>
          <p className="signup-subtitle">{t('signup.subtitle')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="form-control"
                placeholder={t('signup.placeholders.full_name')}
              />
            </div>
            {fieldErrors.fullName && <div className="text-danger small">{fieldErrors.fullName}</div>}
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
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder={t('signup.placeholders.email')}
              />
            </div>
            {fieldErrors.email && <div className="text-danger small">{fieldErrors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="role">{t('signup.labels.role')}</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="attendee">{t('signup.options.attendee')}</option>
              <option value="organizer">{t('signup.options.organizer')}</option>
            </select>
          </div>

          {formData.role === 'organizer' && (
            <>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                  </span>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={t('signup.placeholders.company')}
                    required={formData.role === 'organizer'}
                  />
                </div>
                {fieldErrors.companyName && <div className="text-danger small">{fieldErrors.companyName}</div>}
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"></path></svg>
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={t('signup.placeholders.phone')}
                  />
                </div>
                {fieldErrors.phone && <div className="text-danger small">{fieldErrors.phone}</div>}
              </div>
            </>
          )}

          <div className="form-group">
            <div className="input-group">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder={t('signup.placeholders.password')}
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </>
                  )}
                </svg>
              </button>
            </div>
            <div className="password-strength">
              <div className="strength-meter">
                <div 
                  className={`strength-bar ${formData.password.length > 0 ? 'active' : ''}`}
                  style={{ width: `${getPasswordStrength(formData.password) * 20}%` }}
                ></div>
              </div>
              <div className="strength-text">
                {formData.password.length === 0 ? t('signup.password.strength') :
                  getPasswordStrength(formData.password) <= 2 ? t('signup.password.weak') :
                  getPasswordStrength(formData.password) === 3 ? t('signup.password.medium') :
                  getPasswordStrength(formData.password) === 4 ? t('signup.password.strong') : t('signup.password.very_strong')}
              </div>
              <div className="strength-hints small text-muted">
                {t('signup.password.hint')}
              </div>
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
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder={t('signup.placeholders.confirm_password')}
              />
            </div>
            {fieldErrors.confirmPassword && <div className="text-danger small">{fieldErrors.confirmPassword}</div>}
          </div>

          <div className="form-options">
            <div className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="termsCheck"
                required
              />
              <label className="form-check-label" htmlFor="termsCheck">
                {t('signup.terms_html', { terms: '<a href="#terms" class="text-primary">' + t('signup.terms') + '</a>', privacy: '<a href="#privacy" class="text-primary">' + t('signup.privacy') + '</a>' })}
              </label>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
              
              {/* Show link to diagnostics when there's a connection error */}
              {error.includes('connect') && (
                <div style={{ marginTop: '10px' }}>
                  <Link to="/api-diagnostics" className="text-primary">
                    Run API Diagnostics →
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="signup-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="spinner" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                {t('signup.loading')}
              </>
            ) : (
              t('signup.button')
            )}
          </button>
          
          <div className="divider">
            <span>{t('signup.or_social')}</span>
          </div>
          
          {/* Social Signup Buttons */}
          <div className="social-login mb-3">
            <button type="button" className="social-btn google" onClick={() => window.location.href = 'http://localhost:8000/api/auth/google/redirect'}>
              {/* ...svg... */}
              {t('signup.social.google')}
            </button>
            <button type="button" className="social-btn facebook" onClick={() => window.location.href = 'http://localhost:8000/api/auth/facebook/redirect'}>
              {/* ...svg... */}
              {t('signup.social.facebook')}
            </button>
            <button type="button" className="social-btn linkedin" onClick={() => window.location.href = 'http://localhost:8000/api/auth/linkedin/redirect'}>
              {/* ...svg... */}
              {t('signup.social.linkedin')}
            </button>
          </div>
          
          <div className="signin-link">
            {t('signup.already_account')} <Link to="/sign-in" className="text-primary">{t('signup.signin_link')}</Link>
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

      {/* Server status component for debugging */}
      <div className="server-status">
        <ServerStatus />
      </div>
    </div>
  );
};

export default SignUpPage;