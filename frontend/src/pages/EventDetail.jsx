import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import formatDate from '../utils/formatDate';
import './css/EventDetail.css';
import EventFeedback from '../components/event/EventFeedback';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState(null); // { type, value, description }
  const [promoError, setPromoError] = useState(null);
  const [discount, setDiscount] = useState(0);
  const { t } = useTranslation();

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

  // Social share handlers
  const shareUrl = window.location.href;
  const shareText = event ? `Check out this event: ${event.title}` : '';
  const handleShare = (platform) => {
    let url = '';
    if (platform === 'facebook') url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    if (platform === 'twitter') url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    if (platform === 'linkedin') url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(event?.title || '')}`;
    if (platform === 'email') url = `mailto:?subject=${encodeURIComponent(event?.title || 'Event')}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  // Promo code validation
  const handlePromoApply = async (e) => {
    e.preventDefault();
    setPromoStatus(null);
    setPromoError(null);
    setDiscount(0);
    try {
      const res = await axios.post('http://localhost:8000/api/promo-codes/validate', { code: promoCode });
      setPromoStatus(res.data);
      // Calculate discount
      if (res.data.type === 'percentage') {
        setDiscount(ticketPrice * formData.numTickets * (res.data.value / 100));
      } else if (res.data.type === 'fixed') {
        setDiscount(res.data.value);
      }
    } catch (err) {
      setPromoError(err.response?.data?.error || 'Invalid promo code');
    }
  };

  if (error) return <div className="text-red-500 text-center mt-10">{t('common.error')}: {error}</div>;
  if (!event) return <div className="text-center mt-10">{t('common.loading')}</div>;

  const daysLeft = Math.ceil((new Date(event.start_date) - new Date()) / (1000 * 60 * 60 * 24));
  const ticketPrice = event && Number(event.ticket_price) ? Number(event.ticket_price) : 0;
  const processingFee = 9.99;
  const subtotal = ticketPrice * formData.numTickets;
  const total = Math.max(0, subtotal - discount + processingFee).toFixed(2);

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
            <h2>{t('event.about')}</h2>
            <p>{event.description}</p>
            <p className="mt-2"><strong>{t('event.organized_by')}</strong> TechEvents Inc.</p>
          </div>
          <div className="event-detail-section">
            <h2>{t('event.schedule')}</h2>
            <p>{t('event.day1')}: {formatDate(event.start_date)}</p>
            <p>9:00 AM {t('event.registration_welcome')}</p>
            <p>10:00 AM {t('event.opening_keynote')}</p>
            <p>12:00 PM {t('event.networking_lunch')}</p>
            <p>{t('event.day2_3')}: {formatDate(new Date(event.start_date).setDate(new Date(event.start_date).getDate() + 1))} - {formatDate(new Date(event.start_date).setDate(new Date(event.start_date).getDate() + 2))}</p>
            <p>{t('event.workshops_panel')}</p>
          </div>
          <div className="event-detail-section">
            <h2>{t('event.faq')}</h2>
            <p><strong>{t('event.faq_included')}</strong> {t('event.faq_included_desc')}</p>
            <p><strong>{t('event.faq_dress')}</strong> {t('event.faq_dress_desc')}</p>
            <p><strong>{t('event.faq_refund')}</strong> {t('event.faq_refund_desc')}</p>
          </div>
          <div className="event-detail-section">
            <h2>{t('event.venue')}</h2>
            <div className="bg-gray-200 h-32 flex items-center justify-center mb-2">
              <p className="text-gray-500">{t('event.venue_map')}</p>
            </div>
            <p><strong>{event.venue}</strong></p>
            <p>{event.address || t('event.venue_address')}</p>
          </div>
        </div>
        <div>
          {/* Ticketing UI (copied from GetTicket) */}
          <div className="get-ticket-card">
            <h2 className="get-ticket-title">{t('event.get_ticket')}</h2>
            <div className="get-ticket-info">
              <div className="get-ticket-row">
                <span className="get-ticket-label">{t('event.ticket_type')}</span>
                <select name="ticketType" value={formData.ticketType} onChange={handleChange} className="get-ticket-select">
                  <option value={`Standard Ticket - $${ticketPrice}`}>Standard Ticket - ${ticketPrice}</option>
                  <option value={`VIP Ticket - $${ticketPrice + 100}`}>VIP Ticket - ${ticketPrice + 100}</option>
                </select>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">{t('event.num_tickets')}</span>
                <div className="get-ticket-qty">
                  <button type="button" className="get-ticket-qty-btn" onClick={() => handleTicketChange(-1)} disabled={formData.numTickets <= 1}>-</button>
                  <span className="get-ticket-qty-num">{formData.numTickets}</span>
                  <button type="button" className="get-ticket-qty-btn" onClick={() => handleTicketChange(1)}>+</button>
                </div>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">{t('event.price_per_ticket')}</span>
                <span>${formData.ticketType.includes('VIP') ? ticketPrice + 100 : ticketPrice}</span>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">{t('event.subtotal')}</span>
                <span>${(formData.numTickets * (formData.ticketType.includes('VIP') ? ticketPrice + 100 : ticketPrice)).toFixed(2)}</span>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">{t('event.processing_fee')}</span>
                <span>${processingFee}</span>
              </div>
              <div className="get-ticket-row">
                <span className="get-ticket-label">{t('event.discount')}</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
              <div className="get-ticket-row get-ticket-total">
                <span className="get-ticket-label">{t('event.total')}</span>
                <span>${total}</span>
              </div>
            </div>
            <form className="get-ticket-form" onSubmit={handleRegister}>
              <div className="get-ticket-form-row">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('form.full_name')} required className="get-ticket-input" />
              </div>
              <div className="get-ticket-form-row">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t('form.email')} required className="get-ticket-input" />
              </div>
              <div className="get-ticket-form-row">
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t('form.phone')} required className="get-ticket-input" />
              </div>
              <div className="get-ticket-form-row">
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder={t('form.card_number')} required className="get-ticket-input" maxLength={19} />
              </div>
              <div className="get-ticket-form-row get-ticket-form-row-half">
                <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder={t('form.expiry')} required className="get-ticket-input" maxLength={5} />
                <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} placeholder={t('form.cvv')} required className="get-ticket-input" maxLength={4} />
              </div>
              {/* Promo Code Input */}
              <div className="get-ticket-form-row">
                <input
                  type="text"
                  name="promoCode"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder={t('event.promo_placeholder')}
                  className="get-ticket-input"
                  maxLength={32}
                />
                <button type="button" className="btn btn-outline-secondary ms-2" onClick={handlePromoApply} disabled={!promoCode}>{t('event.apply')}</button>
              </div>
              {promoStatus && <div className="text-success small">{promoStatus.description} {t('common.success')}</div>}
              {promoError && <div className="text-danger small">{promoError}</div>}
              {error && <div className="get-ticket-error">{t('common.error')}: {error}</div>}
              {success && <div className="get-ticket-success">{t('common.success')} {t('event.registration_success')}</div>}
              <button type="submit" className="get-ticket-btn">{t('event.purchase')}</button>
            </form>
            <div className="get-ticket-note">{t('event.all_sales_final')}</div>
          </div>
        </div>
      </div>
      <div className="event-detail-share">
        <h3>{t('event.share')}</h3>
        <div className="share-icons">
          <span onClick={() => handleShare('facebook')} style={{cursor:'pointer'}}><i className="fab fa-facebook"></i></span>
          <span onClick={() => handleShare('twitter')} style={{cursor:'pointer'}}><i className="fab fa-twitter"></i></span>
          <span onClick={() => handleShare('linkedin')} style={{cursor:'pointer'}}><i className="fab fa-linkedin"></i></span>
          <span onClick={() => handleShare('email')} style={{cursor:'pointer'}}><i className="fas fa-envelope"></i></span>
        </div>
      </div>
      {/* Event Feedback Section */}
      <EventFeedback eventId={event.id} />
    </div>
  );
}

export default EventDetailPage;
