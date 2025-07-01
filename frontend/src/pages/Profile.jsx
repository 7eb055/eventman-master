import React, { useEffect, useState } from 'react';
import { getUser } from '../services/auth';
import api from '../services/api';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Inline validation state
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [notificationSuccess, setNotificationSuccess] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data); // Updated to match backend response
      } catch (err) {
        setError('Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Inline styles for gradients and other custom effects
  const styles = {
    container: {
      background: 'linear-gradient(135deg, #f9fafb 0%, #f0f9ff 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    },
    profileCardHeader: {
      background: 'linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)',
      height: '6rem'
    },
    profileCardButton: {
      background: 'linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)'
    },
    eventsButton: {
      background: 'linear-gradient(90deg, #6f42c1 0%, #d63384 100%)'
    },
    tabHeader: {
      background: 'linear-gradient(90deg, #0d6efd 0%, #6610f2 100%)',
      padding: '1rem 1.5rem'
    },
    activeTab: {
      color: '#0d6efd',
      borderBottom: '3px solid #0d6efd'
    },
    inactiveTab: {
      color: '#6c757d',
      borderBottom: '3px solid transparent'
    },
    statIcon: {
      backgroundColor: '#e7f1ff',
      padding: '0.5rem',
      borderRadius: '0.5rem'
    },
    recentActivityIcon: {
      backgroundColor: '#e7f1ff',
      padding: '0.5rem',
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  // Profile update handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProfileErrors({});
    setProfileSuccess('');
    try {
      const form = e.target;
      const payload = {
        name: form.firstName.value + ' ' + form.lastName.value,
        email: form.email.value,
        phone: form.phone.value,
        company_name: form.companyName ? form.companyName.value : undefined,
      };
      const response = await api.put('/user', payload);
      setUser(response.data.user);
      setProfileSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setProfileErrors(err.response.data.errors);
      } else {
        setError('Failed to update profile.');
        toast.error('Failed to update profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password change handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPasswordErrors({});
    setPasswordSuccess('');
    try {
      const form = e.target;
      const payload = {
        current_password: form.currentPassword.value,
        new_password: form.newPassword.value,
        new_password_confirmation: form.confirmPassword.value,
      };
      await api.post('/user/password', payload);
      setPasswordSuccess('Password changed successfully!');
      toast.success('Password changed successfully!');
      form.reset();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setPasswordErrors(err.response.data.errors);
      } else if (err.response && err.response.data && err.response.data.message) {
        setPasswordErrors({ current_password: [err.response.data.message] });
      } else {
        setError('Failed to change password.');
        toast.error('Failed to change password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Notification preferences handler
  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotificationSuccess('');
    try {
      const form = e.target;
      const notifications = [
        form.eventUpdates.checked && 'eventUpdates',
        form.ticketReminders.checked && 'ticketReminders',
        form.promotional.checked && 'promotional',
        form.partnerOffers.checked && 'partnerOffers',
      ].filter(Boolean);
      await api.post('/user/notifications', { notifications });
      setNotificationSuccess('Notification preferences updated!');
      toast.success('Notification preferences updated!');
    } catch (err) {
      setError('Failed to update notification preferences.');
      toast.error('Failed to update notification preferences.');
    } finally {
      setLoading(false);
    }
  };

  // Add a spinner component for loading state
  const renderSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 100 }}>
      <Spinner animation="border" role="status" size="sm">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  if (loading) return renderSpinner();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div className="container px-4" style={{ maxWidth: '1200px' }}>
        <div className="row g-4">
          {/* Left Sidebar */}
          <div className="col-md-4">
            {/* Profile Card */}
            <div className="card mb-4 border-0 shadow-sm position-relative overflow-hidden">
              <div style={styles.profileCardHeader}></div>
              
              <div className="position-absolute top-100 start-50 translate-middle" style={{ marginTop: '-3rem' }}>
                <div className="position-relative">
                  <div className="bg-white rounded-circle p-1">
                    <img 
                      src="https://ui-avatars.com/api/?name=John+Doe&background=0D6EFD&color=fff&size=128" 
                      className="rounded-circle border border-4 border-white"
                      alt="Profile"
                      style={{ width: '6rem', height: '6rem' }}
                    />
                  </div>
                  <button className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1 border border-2 border-white">
                    <i className="bi bi-camera fs-6"></i>
                  </button>
                </div>
              </div>
              
              <div className="card-body text-center pt-5 pb-3 px-4">
                <h3 className="card-title fw-bold mb-1">{user ? user.name : '...'}</h3>
                <p className="text-muted mb-3">{user ? user.email : '...'}</p>
                
                <div className="d-flex justify-content-center gap-2 mb-4">
                  {/* <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill d-flex align-items-center">
                    <i className="bi bi-star-fill text-warning me-1"></i> Premium
                  </span>  */}
                  {/* <span className="badge bg-success bg-opacity-10 text-success px-2 py-1 rounded-pill d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-1"></i> Verified
                  </span> */}
                </div>
                
                <div className="row g-2">
                  <div className="col-6">
                    <button 
                      className="btn btn-primary w-100 text-white d-flex align-items-center justify-content-center"
                      style={styles.profileCardButton}
                    >
                      <i className="bi bi-ticket-perforated me-2"></i> Tickets
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn w-100 text-white d-flex align-items-center justify-content-center"
                      style={styles.eventsButton}
                    >
                      <i className="bi bi-calendar-event me-2"></i> Events
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3 d-flex align-items-center">
                  <i className="bi bi-graph-up-arrow text-primary me-2"></i> Account Statistics
                </h5>
                
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div style={styles.statIcon}>
                        <i className="bi bi-calendar-check text-primary"></i>
                      </div>
                      <span className="ms-2 text-muted">Events Attended</span>
                    </div>
                    <span className="fw-bold fs-5">{user ? user.eventsAttended : '...'}</span>
                  </div>
                  
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div style={styles.statIcon}>
                        <i className="bi bi-ticket-perforated text-success"></i>
                      </div>
                      <span className="ms-2 text-muted">Tickets Purchased</span>
                    </div>
                    <span className="fw-bold fs-5">{user ? user.ticketsPurchased : '...'}</span>
                  </div>
                  
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div style={styles.statIcon}>
                        <i className="bi bi-clock-history text-warning"></i>
                      </div>
                      <span className="ms-2 text-muted">Member Since</span>
                    </div>
                    <span className="fw-bold">{user && user.created_at ? new Date(user.created_at).toLocaleDateString() : '...'}</span>
                  </div>
                  
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 pt-3">
                    <div className="d-flex align-items-center">
                      <div style={styles.statIcon}>
                        <i className="bi bi-shield-check text-success"></i>
                      </div>
                      <span className="ms-2 text-muted">Account Status</span>
                    </div>
                    <span className="badge bg-success bg-opacity-10 text-success px-2 py-1">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-md-8">
            {/* Profile Header */}
            <div className="card border-0 shadow-sm mb-4">
              <div style={styles.tabHeader}>
                <h2 className="text-white fw-bold mb-0">My Profile</h2>
                <p className="text-white-50 mb-0">Manage your personal information and settings</p>
              </div>
              
              {/* Tabs */}
              <div className="border-bottom">
                <ul className="nav nav-tabs border-0">
                  <li className="nav-item">
                    <button 
                      className="nav-link border-0 py-3 px-4"
                      style={activeTab === 'profile' ? styles.activeTab : styles.inactiveTab}
                      onClick={() => setActiveTab('profile')}
                    >
                      <i className="bi bi-person me-2"></i>Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link border-0 py-3 px-4"
                      style={activeTab === 'security' ? styles.activeTab : styles.inactiveTab}
                      onClick={() => setActiveTab('security')}
                    >
                      <i className="bi bi-shield-lock me-2"></i>Security
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link border-0 py-3 px-4"
                      style={activeTab === 'notifications' ? styles.activeTab : styles.inactiveTab}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <i className="bi bi-bell me-2"></i>Notifications
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Tab Content */}
              <div className="card-body p-4">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3 d-flex align-items-center">
                        <i className="bi bi-person-badge text-primary me-2"></i>Personal Information
                      </h5>
                      {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}
                      {error && <div className="alert alert-danger">{error}</div>}
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label">First Name</label>
                          <input 
                            type="text" 
                            className={`form-control${profileErrors.name ? ' is-invalid' : ''}`}
                            name="firstName"
                            defaultValue={user ? user.name.split(' ')[0] : ''}
                            required 
                          />
                          {profileErrors.name && <div className="invalid-feedback">{profileErrors.name[0]}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Last Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="lastName"
                            defaultValue={user ? user.name.split(' ').slice(1).join(' ') : ''}
                            required 
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address</label>
                          <input 
                            type="email" 
                            className={`form-control${profileErrors.email ? ' is-invalid' : ''}`}
                            name="email"
                            defaultValue={user ? user.email : ''}
                            required 
                          />
                          {profileErrors.email && <div className="invalid-feedback">{profileErrors.email[0]}</div>}
                          <div className="form-text">We'll never share your email with anyone else</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input 
                            type="tel" 
                            className="form-control"
                            name="phone"
                            defaultValue={user ? user.phone : ''}
                            placeholder="(555) 123-4567" 
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Company Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="companyName"
                          defaultValue={user ? user.company_name : ''}
                          placeholder="Company Name" 
                        />
                      </div>
                      {/* ...existing address fields... */}
                    </div>
                    <div className="d-flex justify-content-end gap-2 pt-2">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary px-4 py-2"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary px-4 py-2 d-flex align-items-center"
                        style={styles.profileCardButton}
                        disabled={loading}
                      >
                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-save me-2"></i>}
                        Update Profile
                      </button>
                    </div>
                    {profileSuccess && (
                      <div className="alert alert-success mt-3" role="alert">
                        {profileSuccess}
                      </div>
                    )}
                    {Object.keys(profileErrors).length > 0 && (
                      <div className="alert alert-danger mt-3" role="alert">
                        <ul className="mb-0">
                          {Object.values(profileErrors).flat().map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </form>
                )}
                
                {/* Security Tab */}
                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3 d-flex align-items-center">
                        <i className="bi bi-shield-lock text-primary me-2"></i>Change Password
                      </h5>
                      {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
                      {error && <div className="alert alert-danger">{error}</div>}
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Current Password</label>
                          <input 
                            type="password" 
                            className={`form-control${passwordErrors.current_password ? ' is-invalid' : ''}`}
                            name="currentPassword"
                            placeholder="Enter current password" 
                            required
                          />
                          {passwordErrors.current_password && <div className="invalid-feedback">{passwordErrors.current_password[0]}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">New Password</label>
                          <input 
                            type="password" 
                            className={`form-control${passwordErrors.new_password ? ' is-invalid' : ''}`}
                            name="newPassword"
                            placeholder="Create new password" 
                            required
                          />
                          {passwordErrors.new_password && <div className="invalid-feedback">{passwordErrors.new_password[0]}</div>}
                          <div className="form-text">Minimum 8 characters with numbers</div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Confirm Password</label>
                          <input 
                            type="password" 
                            className={`form-control${passwordErrors.new_password_confirmation ? ' is-invalid' : ''}`}
                            name="confirmPassword"
                            placeholder="Confirm new password" 
                            required
                          />
                          {passwordErrors.new_password_confirmation && <div className="invalid-feedback">{passwordErrors.new_password_confirmation[0]}</div>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-top pt-4">
                      <h5 className="fw-bold mb-3 d-flex align-items-center">
                        <i className="bi bi-shield-check text-primary me-2"></i>Security Settings
                      </h5>
                      
                      <div className="bg-light p-4 rounded">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h6 className="fw-medium mb-0">Two-Factor Authentication</h6>
                            <p className="text-muted mb-0 small">Add an extra layer of security to your account</p>
                          </div>
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              role="switch" 
                              id="twoFactorSwitch" 
                            />
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="fw-medium mb-0">Recent Devices</h6>
                            <p className="text-muted mb-0 small">Manage devices that have accessed your account</p>
                          </div>
                          <button className="btn btn-sm btn-outline-secondary px-3">
                            View Devices
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-end gap-2 pt-4">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary px-4 py-2"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary px-4 py-2"
                        style={styles.profileCardButton}
                        disabled={loading}
                      >
                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                        Update Security Settings
                      </button>
                    </div>
                    {passwordSuccess && (
                      <div className="alert alert-success mt-3" role="alert">
                        {passwordSuccess}
                      </div>
                    )}
                    {Object.keys(passwordErrors).length > 0 && (
                      <div className="alert alert-danger mt-3" role="alert">
                        <ul className="mb-0">
                          {Object.values(passwordErrors).flat().map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </form>
                )}
                
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <form onSubmit={handleNotificationUpdate}>
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3 d-flex align-items-center">
                        <i className="bi bi-bell text-primary me-2"></i>Notification Preferences
                      </h5>
                      <div className="bg-light p-4 rounded">
                        <div className="form-check mb-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="eventUpdates" 
                            name="eventUpdates"
                            defaultChecked={user && user.notification_preferences && user.notification_preferences.includes('eventUpdates')}
                          />
                          <label className="form-check-label fw-medium" htmlFor="eventUpdates">
                            Event updates and announcements
                          </label>
                          <p className="text-muted mt-1 small">
                            Receive notifications about events you're attending
                          </p>
                        </div>
                        
                        <div className="form-check mb-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="ticketReminders" 
                            name="ticketReminders"
                            defaultChecked={user && user.notification_preferences && user.notification_preferences.includes('ticketReminders')}
                          />
                          <label className="form-check-label fw-medium" htmlFor="ticketReminders">
                            Ticket purchase reminders
                          </label>
                          <p className="text-muted mt-1 small">
                            Reminders for upcoming events and ticket deadlines
                          </p>
                        </div>
                        
                        <div className="form-check mb-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="promotional" 
                            name="promotional"
                            defaultChecked={user && user.notification_preferences && user.notification_preferences.includes('promotional')}
                          />
                          <label className="form-check-label fw-medium" htmlFor="promotional">
                            Promotional offers and discounts
                          </label>
                          <p className="text-muted mt-1 small">
                            Special deals and discounts for events
                          </p>
                        </div>
                        
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="partnerOffers" 
                            name="partnerOffers"
                            defaultChecked={user && user.notification_preferences && user.notification_preferences.includes('partnerOffers')}
                          />
                          <label className="form-check-label fw-medium" htmlFor="partnerOffers">
                            Partner offers and recommendations
                          </label>
                          <p className="text-muted mt-1 small">
                            Recommendations from our event partners
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-end gap-2">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary px-4 py-2"
                        style={styles.profileCardButton}
                        disabled={loading}
                      >
                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                        Save Preferences
                      </button>
                    </div>
                    {notificationSuccess && <div className="alert alert-success">{notificationSuccess}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                  </form>
                )}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3 d-flex align-items-center">
                  <i className="bi bi-clock-history text-primary me-2"></i>Recent Activity
                </h5>
                
                <div className="list-group list-group-flush">
                  <div className="list-group-item px-0 py-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <div style={{ ...styles.recentActivityIcon, backgroundColor: '#e0f7e9' }}>
                          <i className="bi bi-ticket-perforated text-success"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="fw-medium mb-0">Purchased ticket for Tech Conference 2023</p>
                        <p className="text-muted small mb-0">2 days ago</p>
                      </div>
                      <div>
                        <span className="text-success fw-medium">+$129.00</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="list-group-item px-0 py-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <div style={{ ...styles.recentActivityIcon, backgroundColor: '#e0f0ff' }}>
                          <i className="bi bi-calendar-event text-primary"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="fw-medium mb-0">Registered for Summer Music Festival</p>
                        <p className="text-muted small mb-0">5 days ago</p>
                      </div>
                      <div>
                        <span className="text-primary fw-medium">Registered</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="list-group-item px-0 py-3">
                    <div className="d-flex">
                      <div className="me-3">
                        <div style={{ ...styles.recentActivityIcon, backgroundColor: '#f0e7ff' }}>
                          <i className="bi bi-star text-purple"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="fw-medium mb-0">Left a review for Food Expo 2023</p>
                        <p className="text-muted small mb-0">1 week ago</p>
                      </div>
                      <div>
                        <span className="text-purple fw-medium">Review</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="btn btn-link text-decoration-none text-primary p-0 mt-3 d-flex align-items-center">
                  View all activity <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;