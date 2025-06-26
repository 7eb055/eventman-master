import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import formatDate from '../utils/formatDate';
import './css/EventDetail.css';

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ticketType: 'Standard Ticket - $299',
    numTickets: 1,
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Use Laravel backend endpoint (adjust port if needed)
        const response = await fetch(`http://localhost:8000/api/events/${id}`);
        if (!response.ok) throw new Error('Event not found');
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTicketChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      numTickets: Math.max(1, prev.numTickets + delta)
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          ticketType: formData.ticketType,
          numTickets: formData.numTickets,
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          amount: 299 * formData.numTickets + 9.99
        })
      });
      if (!response.ok) throw new Error('Registration failed');
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        ticketType: 'Standard Ticket - $299',
        numTickets: 1,
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!event) return <div className="text-center mt-10">Loading...</div>;

  const daysLeft = Math.ceil((new Date(event.start_date) - new Date()) / (1000 * 60 * 60 * 24));
  const ticketPrice = event && Number(event.ticket_price) ? Number(event.ticket_price) : 0;
  const processingFee = 9.99;
  const subtotal = ticketPrice * formData.numTickets;
  const total = (subtotal + processingFee).toFixed(2);

  return (
    <div className="event-detail-container">
      <div className="event-detail-banner">
        <img src={event.banner_url || event.image || `https://via.placeholder.com/900x320?text=${encodeURIComponent(event.title || 'Event')}`} alt={event.title || 'Event Banner'} />
      </div>
      <div className="event-detail-header">
        <h1 className="event-detail-title">{event.title}</h1>
        <div className="event-detail-meta">{formatDate(event.start_date)} | {event.venue}</div>
      </div>
      <div className="event-detail-content">
        <div>
          <div className="event-detail-section">
            <h2>About the Event</h2>
            <p>{event.description}</p>
            <p className="mt-2"><strong>Organized by:</strong> TechEvents Inc.</p>
          </div>
          <div className="event-detail-section">
            <h2>Event Schedule</h2>
            <p>Day 1: {formatDate(event.start_date)}</p>
            <p>9:00 AM Registration & Welcome Coffee</p>
            <p>10:00 AM Opening Keynote: The Future of Tech</p>
            <p>12:00 PM Networking Lunch</p>
            <p>Day 2-3: {formatDate(new Date(event.start_date).setDate(new Date(event.start_date).getDate() + 1))} - {formatDate(new Date(event.start_date).setDate(new Date(event.start_date).getDate() + 2))}</p>
            <p>Workshops, panel discussions, and more keynotes. Detailed schedule to be announced.</p>
          </div>
          <div className="event-detail-section">
            <h2>Frequently Asked Questions</h2>
            <p><strong>What’s included in the ticket price?</strong> Your ticket includes access to all keynote, workshops, networking events, and meals during the conference. Accommodation is not included.</p>
            <p><strong>Is there a dress code?</strong> Business casual is recommended.</p>
            <p><strong>Can I get a refund if I can’t attend?</strong> Yes, refunds are available up to 14 days before the event.</p>
          </div>
          <div className="event-detail-section">
            <h2>Venue</h2>
            <div className="bg-gray-200 h-32 flex items-center justify-center mb-2">
              <p className="text-gray-500">Interactive Map of Tech Convention Center</p>
            </div>
            <p><strong>{event.venue}</strong></p>
            <p>{event.address || '123 Innovation Street, San Francisco, CA 94103'}</p>
          </div>
        </div>
        <div>
          {/* Ticketing UI (copied from GetTicket) */}
          <div className="get-ticket-card">
            <h2 className="get-ticket-title">Get Your Ticket</h2>
            <div className="get-ticket-info">
              <div className="get-ticket-row">
                <span className="get-ticket-label">Ticket Type:</span>
                <select name="ticketType" value={formData.ticketType} onChange={handleChange} className="get-ticket-select">
                  <option value={`Standard Ticket - $${ticketPrice}`}>Standard Ticket - ${ticketPrice}</option>
                  <option value={`VIP Ticket - $${ticketPrice + 100}`}>VIP Ticket - ${ticketPrice + 100}</option>
                </select>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">Number of Tickets:</span>
                <div className="get-ticket-qty">
                  <button type="button" className="get-ticket-qty-btn" onClick={() => handleTicketChange(-1)} disabled={formData.numTickets <= 1}>-</button>
                  <span className="get-ticket-qty-num">{formData.numTickets}</span>
                  <button type="button" className="get-ticket-qty-btn" onClick={() => handleTicketChange(1)}>+</button>
                </div>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">Price per Ticket:</span>
                <span>${formData.ticketType.includes('VIP') ? ticketPrice + 100 : ticketPrice}</span>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">Subtotal:</span>
                <span>${(formData.numTickets * (formData.ticketType.includes('VIP') ? ticketPrice + 100 : ticketPrice)).toFixed(2)}</span>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">Processing Fee:</span>
                <span>${processingFee}</span>
              </div>
              <div className="get-ticket-row get-ticket-total">
                <span className="get-ticket-label">Total:</span>
                <span>${((formData.numTickets * (formData.ticketType.includes('VIP') ? ticketPrice + 100 : ticketPrice)) + processingFee).toFixed(2)}</span>
              </div>
            </div>
            <form className="get-ticket-form" onSubmit={handleRegister}>
              <div className="get-ticket-form-row">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required className="get-ticket-input" />
              </div>
              <div className="get-ticket-form-row">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="get-ticket-input" />
              </div>
              <div className="get-ticket-form-row">
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="get-ticket-input" />
              </div>
              <div className="get-ticket-form-row">
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="Card Number" required className="get-ticket-input" maxLength={19} />
              </div>
              <div className="get-ticket-form-row get-ticket-form-row-half">
                <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" required className="get-ticket-input" maxLength={5} />
                <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="CVV" required className="get-ticket-input" maxLength={4} />
              </div>
              {error && <div className="get-ticket-error">{error}</div>}
              {success && <div className="get-ticket-success">Registration successful! Check your email for confirmation.</div>}
              <button type="submit" className="get-ticket-btn">Purchase Ticket</button>
            </form>
            <div className="get-ticket-note">* All sales are final. Please review your order before purchasing.</div>
          </div>
        </div>
      </div>
      <div className="event-detail-share">
        <h3>Share This Event</h3>
        <div className="share-icons">
          <span><i className="fab fa-facebook"></i></span>
          <span><i className="fab fa-twitter"></i></span>
          <span><i className="fab fa-linkedin"></i></span>
          <span><i className="fas fa-envelope"></i></span>
        </div>
      </div>
      
    </div>
  );
}

export default EventDetailPage;
