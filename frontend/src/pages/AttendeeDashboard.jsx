import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getUser } from '../services/auth';
import axios from 'axios';
import './css/AttendeeDashboard.css';
import UpcomingEventCard from '../components/event/UpcomingEventCard';
import TicketModal from '../components/event/TicketModal';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

const AttendeeDashboard = () => {
  const { t } = useTranslation();

  // User data from API
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // Store purchased event IDs
  const [purchasedEventIds, setPurchasedEventIds] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser();
        setUser(response.data);
        // If dashboard API returns events the user has tickets for:
        if (response.data && response.data.events) {
          setPurchasedEventIds(response.data.events.map(e => e.id));
        }
      } catch (err) {
        setUserError('Failed to load user details.');
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        setUpcomingEvents(response.data);
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Past events (static for now, remove auth-dependent API call)
  const [pastEvents] = useState([
    // Example static data, or leave as empty array
    // { id: 1, name: 'Sample Event', date: '2025-06-01', location: 'Accra', rating: 4, review: 'Great event!' }
  ]);

  // Recommended events (optional, remove API call if backend not ready)
  const [recommendedEvents] = useState([
    // Example static data, or leave as empty array
    // { id: 1, name: 'Recommended Event', date: '2025-08-01', location: 'Kumasi', price: 50 }
  ]);

  const navigate = useNavigate();

  // Format date to "Month Day, Year" format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handler for Get Tickets button
  const handleGetTickets = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Ticket download/modal logic
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketModalData, setTicketModalData] = useState({ ticketUrl: '', qrCodeUrl: '' });

  // Handler for Download Ticket button
  const handleDownloadTicket = async (event) => {
    // Simulate API call to get ticket PDF and QR code
    // Replace with your real API call
    const ticketUrl = `/api/tickets/${event.id}/download`;
    const qrCodeUrl = `/api/tickets/${event.id}/qr`;
    setTicketModalData({ ticketUrl, qrCodeUrl });
    setShowTicketModal(true);
    // Also trigger direct download
    const link = document.createElement('a');
    link.href = ticketUrl;
    link.download = `ticket-${event.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Feedback state for past events
  const [feedbacks, setFeedbacks] = useState({}); // { [eventId]: { rating, comment, submitting, error, success } }
  const commentRefs = useRef({});

  // Handler to submit feedback
  const handleFeedbackSubmit = async (eventId) => {
    const feedback = feedbacks[eventId] || {};
    setFeedbacks(prev => ({ ...prev, [eventId]: { ...feedback, submitting: true, error: null, success: null } }));
    try {
      await axios.post(`${API_URL}/events/${eventId}/feedback`, {
        rating: feedback.rating,
        comment: feedback.comment,
      });
      setFeedbacks(prev => ({ ...prev, [eventId]: { ...feedback, submitting: false, error: null, success: 'Feedback submitted!' } }));
    } catch (err) {
      setFeedbacks(prev => ({ ...prev, [eventId]: { ...feedback, submitting: false, error: 'Failed to submit feedback', success: null } }));
    }
  };

  // Handler to update feedback state
  const handleFeedbackChange = (eventId, field, value) => {
    setFeedbacks(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value,
        error: null,
        success: null,
      },
    }));
  };

  if (userLoading) return <div>{t('attendee_dashboard.loading_user')}</div>;
  if (userError) return <div className="text-danger">{t('attendee_dashboard.user_error')}</div>;
  if (loading) return <div>{t('attendee_dashboard.loading_events')}</div>;
  if (error) return <div className="text-danger">{t('attendee_dashboard.events_error')}</div>;

  return (
    <div className="page bg-light">
      <div className="container py-5">
        {/* Dashboard Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="display-5 fw-bold text-primary mb-1">{t('attendee_dashboard.dashboard')}</h1>
            <p className="text-muted">{t('attendee_dashboard.welcome', { name: user && user.user && user.user.name })}</p>
            <div className="user-details">
              <div><strong>{t('attendee_dashboard.email')}:</strong> {user && user.user && user.user.email}</div>
              <div><strong>{t('attendee_dashboard.joined')}:</strong> {user && user.user && user.user.created_at ? formatDate(user.user.created_at) : t('attendee_dashboard.na')}</div>
              <div><strong>{t('attendee_dashboard.tickets_purchased')}:</strong> {user && user.user && user.user.ticketsPurchased}</div>
              <div><strong>{t('attendee_dashboard.events_attended')}:</strong> {user && user.user && user.user.eventsAttended}</div>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Link to="/profile" aria-label="Go to profile">
              <div className="position-relative" style={{ cursor: 'pointer' }}>
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                  <span className="text-white fw-bold fs-5">{user && user.user && user.user.name.charAt(0)}</span>
                </div>
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-2 border-white rounded-circle">
                  <span className="visually-hidden">Online</span>
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="bi bi-ticket-perforated fs-3 text-primary"></i>
                  </div>
                  <div>
                    <h5 className="text-muted mb-1">{t('attendee_dashboard.tickets_purchased')}</h5>
                    <h2 className="mb-0 fw-bold">{user.ticketsPurchased}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="bi bi-calendar-check fs-3 text-success"></i>
                  </div>
                  <div>
                    <h5 className="text-muted mb-1">{t('attendee_dashboard.events_attended')}</h5>
                    <h2 className="mb-0 fw-bold">{user.eventsAttended}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="bi bi-calendar-event fs-3 text-warning"></i>
                  </div>
                  <div>
                    <h5 className="text-muted mb-1">{t('attendee_dashboard.upcoming_events')}</h5>
                    <h2 className="mb-0 fw-bold">{upcomingEvents.length}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="card border-0 shadow-sm rounded-4 mb-5">
          <div className="card-header bg-white border-0 py-3">
            <h2 className="mb-0 fw-bold d-flex align-items-center">
              <i className="bi bi-calendar2-check me-2 text-primary"></i> 
              {t('attendee_dashboard.upcoming_events')}
            </h2>
          </div>
          <div className="card-body p-4">
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="col">
                  <UpcomingEventCard 
                    event={event} 
                    attendee={user} 
                    onDownloadTicket={handleDownloadTicket}
                    ticketStatus={purchasedEventIds.includes(event.id) ? 'purchased' : 'not purchased'}
                    showTicketStatus={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <TicketModal show={showTicketModal} onClose={() => setShowTicketModal(false)} ticketUrl={ticketModalData.ticketUrl} qrCodeUrl={ticketModalData.qrCodeUrl} />

        {/* Past Events Section */}
        <div className="card border-0 shadow-sm rounded-4 mb-5">
          <div className="card-header bg-white border-0 py-3">
            <h2 className="mb-0 fw-bold d-flex align-items-center">
              <i className="bi bi-clock-history me-2 text-secondary"></i> 
              {t('attendee_dashboard.past_events')}
            </h2>
          </div>
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-borderless table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">{t('attendee_dashboard.event')}</th>
                    <th scope="col">{t('attendee_dashboard.date')}</th>
                    <th scope="col">{t('attendee_dashboard.location')}</th>
                    <th scope="col">{t('attendee_dashboard.rating')}</th>
                    <th scope="col">{t('attendee_dashboard.review')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pastEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center">{t('attendee_dashboard.no_attended_events')}</td>
                    </tr>
                  ) : (
                    pastEvents.map(event => (
                      <tr key={event.id} className="border-bottom">
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-3">
                              <i className="bi bi-calendar-event text-primary"></i>
                            </div>
                            <span className="fw-medium">{event.name}</span>
                          </div>
                        </td>
                        <td>{formatDate(event.date)}</td>
                        <td>{event.location}</td>
                        <td>
                          <div className="d-flex text-warning align-items-center">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`bi ${feedbacks[event.id]?.rating > i ? 'bi-star-fill' : 'bi-star'} me-1`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleFeedbackChange(event.id, 'rating', i + 1)}
                              ></i>
                            ))}
                          </div>
                        </td>
                        <td style={{maxWidth: '300px'}}>
                          <div className="d-flex flex-column gap-2">
                            <textarea
                              ref={el => (commentRefs.current[event.id] = el)}
                              className="form-control form-control-sm"
                              rows={2}
                              placeholder={t('attendee_dashboard.leave_review')}
                              value={feedbacks[event.id]?.comment || ''}
                              onChange={e => handleFeedbackChange(event.id, 'comment', e.target.value)}
                              maxLength={300}
                            />
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                disabled={feedbacks[event.id]?.submitting || !feedbacks[event.id]?.rating}
                                onClick={() => handleFeedbackSubmit(event.id)}
                              >
                                {feedbacks[event.id]?.submitting ? t('attendee_dashboard.submitting') : t('attendee_dashboard.submit')}
                              </button>
                              {feedbacks[event.id]?.error && <span className="text-danger small">{feedbacks[event.id].error}</span>}
                              {feedbacks[event.id]?.success && <span className="text-success small">{feedbacks[event.id].success}</span>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recommended Events */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-white border-0 py-3">
            <h2 className="mb-0 fw-bold d-flex align-items-center">
              <i className="bi bi-lightning me-2 text-warning"></i> 
              {t('attendee_dashboard.recommended')}
            </h2>
          </div>
          <div className="card-body p-4">
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {recommendedEvents.map(event => (
                <div key={event.id} className="col">
                  <div className="card border-0 shadow-sm rounded-4 h-100 event-card">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="card-title fw-bold">{event.name}</h5>
                          <div className="d-flex align-items-center text-muted small">
                            <i className="bi bi-calendar-event me-2"></i>
                            <span>{formatDate(event.date)}</span>
                          </div>
                        </div>
                        <span className="badge bg-warning text-dark">{t('attendee_dashboard.new')}</span>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-geo-alt me-2 text-muted"></i>
                        <span className="text-muted small">{event.location}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <h4 className="mb-0 text-success fw-bold">GHS {event.price}</h4>
                        <button className="btn btn-sm btn-primary" onClick={() => handleGetTickets(event.id)}>
                          {t('attendee_dashboard.get_tickets')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeDashboard;