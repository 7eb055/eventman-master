import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AttendeeDashboard.css';
import UpcomingEventCard from '../components/event/UpcomingEventCard';

const API_URL = 'http://localhost:8000/api';

const AttendeeDashboard = () => {
  // User data (static for now)
  const user = {
    name: "Kwame Mensah",
    email: "kwame.mensah@example.com",
    joinDate: "January 2023",
    ticketsPurchased: 12,
    eventsAttended: 8
  };

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

  // Format date to "Month Day, Year" format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="page bg-light">
      <div className="container py-5">
        {/* Dashboard Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="display-5 fw-bold text-primary mb-1">Dashboard</h1>
            <p className="text-muted">Welcome back, {user.name}</p>
          </div>
          <div className="d-flex align-items-center">
            <div className="position-relative">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                <span className="text-white fw-bold fs-5">{user.name.charAt(0)}</span>
              </div>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-2 border-white rounded-circle">
                <span className="visually-hidden">Online</span>
              </span>
            </div>
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
                    <h5 className="text-muted mb-1">Tickets Purchased</h5>
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
                    <h5 className="text-muted mb-1">Events Attended</h5>
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
                    <h5 className="text-muted mb-1">Upcoming Events</h5>
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
              Upcoming Events
            </h2>
          </div>
          <div className="card-body p-4">
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="col">
                  <UpcomingEventCard event={event} attendee={user} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Past Events Section */}
        <div className="card border-0 shadow-sm rounded-4 mb-5">
          <div className="card-header bg-white border-0 py-3">
            <h2 className="mb-0 fw-bold d-flex align-items-center">
              <i className="bi bi-clock-history me-2 text-secondary"></i> 
              Past Events
            </h2>
          </div>
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table table-borderless table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Date</th>
                    <th scope="col">Location</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Review</th>
                  </tr>
                </thead>
                <tbody>
                  {pastEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center">No attended events (0)</td>
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
                          <div className="d-flex text-warning">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`bi ${i < event.rating ? 'bi-star-fill' : 'bi-star'} me-1`}
                              ></i>
                            ))}
                          </div>
                        </td>
                        <td className="text-truncate" style={{maxWidth: '200px'}}>{event.review}</td>
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
              Recommended For You
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
                        <span className="badge bg-warning text-dark">New</span>
                      </div>
                      
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-geo-alt me-2 text-muted"></i>
                        <span className="text-muted small">{event.location}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <h4 className="mb-0 text-success fw-bold">GHS {event.price}</h4>
                        <button className="btn btn-sm btn-primary">
                          Get Tickets
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