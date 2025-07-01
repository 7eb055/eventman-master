import React from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import '../../components/css/EventCard.css';

function AttendeeEventCard({ event, showTicketStatus = false, ticketStatus = null }) {
  // Use correct backend field names with fallback
  const eventType = event.event_type || event.eventType || 'Conference';
  const bannerUrl = event.banner_url || event.image || `https://via.placeholder.com/600x300?text=${encodeURIComponent(event.title || 'Event')}`;
  const eventDate = event.start_date || event.date || '';
  const eventVenue = event.venue || event.location || 'TBA';
  let ticketPrice = event.ticket_price ?? event.price ?? 0;
  ticketPrice = Number(ticketPrice);
  if (isNaN(ticketPrice) || ticketPrice === null || ticketPrice === undefined) ticketPrice = 0;

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price) || price === 0) return 'Free';
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getCategoryClass = () => {
    return eventType
      .split('/')[0]
      .replace(/\s+/g, '-')
      .toLowerCase();
  };

  return (
    <div className="event-card">
      <div className="card-banner">
        <img src={bannerUrl} alt={event.title || 'Event'} className="banner-image" />
        <div className={`category-tag ${getCategoryClass()}`}>
          {eventType.split('/')[0]}
        </div>
      </div>
      <div className="card-content">
        <div className="event-meta">
          <div className="meta-item">
            <i className="fas fa-calendar-alt"></i>
            <span>{formatDate(eventDate)}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{eventVenue}</span>
          </div>
        </div>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        <div className="card-footer">
          <div className="price-tag">
            {formatPrice(ticketPrice)}
          </div>
          {showTicketStatus && ticketStatus && (
            <span className={`badge ${ticketStatus === 'purchased' ? 'bg-success' : 'bg-secondary'}`}>{ticketStatus}</span>
          )}
          <Link to={`/events/${event.id}`} className="view-details-btn">
            View Details
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AttendeeEventCard;
