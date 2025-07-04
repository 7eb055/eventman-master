import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const BrowseEvents = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/events');
        if (!response.ok) throw new Error(t('browse_events.fetch_error'));
        const data = await response.json();
        setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [t]);

  // Format date to "Month Day, Year" format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price to GHS currency
  const formatPrice = (price) => {
    if (!price || isNaN(price) || Number(price) === 0) return t('event_card.free');
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0
    }).format(Number(price));
  };

  if (loading) return <div className="text-center mt-5">{t('browse_events.loading')}</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div className="page container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">{t('browse_events.upcoming')}</h1>
        <p className="lead text-muted">{t('browse_events.discover')}</p>
      </div>
      <div className="row row-cols-1 row-cols-lg-2 g-4">
        {events.map(event => (
          <div key={event.id} className="col">
            <div className="card h-100 overflow-hidden shadow-lg event-card">
              <div className="row g-0">
                <div className="col-md-5">
                  <div className="position-relative h-100">
                    <img 
                      src={event.banner_url || event.image || `https://via.placeholder.com/600x300?text=${encodeURIComponent(event.title || t('event_card.default_title'))}`} 
                      alt={event.title} 
                      className="img-fluid h-100 object-fit-cover"
                    />
                    <span className="badge bg-primary position-absolute top-0 end-0 m-3">
                      {event.event_type || event.eventType}
                    </span>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="card-body d-flex flex-column h-100 p-4">
                    <div className="mb-3">
                      <h3 className="card-title fw-bold mb-2">{event.title}</h3>
                      <p className="card-text text-truncate-2 mb-3">{event.description}</p>
                    </div>
                    <div className="mt-auto">
                      <div className="d-flex flex-wrap gap-3 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar-event text-primary fs-5 me-2"></i>
                          <span className="fw-medium">{formatDate(event.start_date || event.date)}</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-geo-alt text-primary fs-5 me-2"></i>
                          <span className="fw-medium">{event.venue || event.location}</span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center border-top pt-3">
                        <h4 className="text-success fw-bold mb-0">{formatPrice(event.ticket_price ?? event.price)}</h4>
                        <button className="btn btn-outline-primary d-flex align-items-center" onClick={() => navigate(`/events/${event.id}`)}>
                          {t('event_card.view_details')} <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseEvents;