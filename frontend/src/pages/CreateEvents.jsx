import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getToken } from '../services/auth';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'Conference',
    image: '',
    description: '',
    venue: '',
    capacity: '',
    ticket_price: '',
    location: '',
    start_date: '', // ISO string: 'YYYY-MM-DDTHH:mm'
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.event_type) newErrors.event_type = 'Event type is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.start_date) newErrors.start_date = 'Start date and time are required';
    if (!formData.capacity || isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) newErrors.capacity = 'Capacity must be a positive number';
    if (!formData.ticket_price || isNaN(formData.ticket_price) || parseFloat(formData.ticket_price) < 0) newErrors.ticket_price = 'Ticket price must be a number (0 for free)';
    if (formData.description && formData.description.length < 30) newErrors.description = 'Description must be at least 30 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (validateForm()) {
      try {
        const token = getToken();
        const response = await fetch('http://localhost:8000/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            event_type: formData.event_type,
            image: formData.image,
            description: formData.description,
            venue: formData.venue,
            capacity: formData.capacity,
            ticket_price: formData.ticket_price,
            location: formData.location,
            start_date: formData.start_date,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.errors) setErrors(errorData.errors);
          setApiError(errorData.message || 'Failed to create event.');
          return;
        }
        setSubmitted(true);
        setTimeout(() => {
          setFormData({
            title: '',
            event_type: 'Conference',
            image: '',
            description: '',
            venue: '',
            capacity: '',
            ticket_price: '',
            location: '',
            start_date: '',
          });
          setSubmitted(false);
        }, 3000);
      } catch (err) {
        setApiError('Network or server error.');
      }
    }
  };

  const eventTypes = [
    'Conference',
    'Trade Show/Exhibition',
    'Networking Event/Meetup',
    'Workshop',
    'Concert',
    'Festival',
    'Retreat/Conference Camping'
  ];

  return (
    <div className="page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white py-4">
                <h1 className="text-center mb-0">Create New Event</h1>
                <p className="text-center mb-0 opacity-75">Fill out the form to list your event</p>
              </div>
              <div className="card-body p-4 p-md-5">
                {submitted && (
                  <div className="alert alert-success d-flex align-items-center">
                    <i className="bi bi-check-circle-fill fs-3 me-3"></i>
                    <div>
                      <h4 className="mb-1">Event Created Successfully!</h4>
                      <p className="mb-0">Your event is now listed in our system.</p>
                    </div>
                  </div>
                )}
                {apiError && (
                  <div className="alert alert-danger d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill fs-3 me-3"></i>
                    <div>{apiError}</div>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="title" className="form-label fw-bold">Event Title *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-card-heading"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          id="title"
                          name="title"
                          placeholder="Enter event name"
                          value={formData.title}
                          onChange={handleChange}
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="event_type" className="form-label fw-bold">Event Type *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-tag"></i>
                        </span>
                        <select
                          className="form-select"
                          id="event_type"
                          name="event_type"
                          value={formData.event_type}
                          onChange={handleChange}
                        >
                          {eventTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.event_type && <div className="invalid-feedback">{errors.event_type}</div>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="venue" className="form-label fw-bold">Venue *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-geo-alt"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control ${errors.venue ? 'is-invalid' : ''}`}
                          id="venue"
                          name="venue"
                          placeholder="Venue name or address"
                          value={formData.venue}
                          onChange={handleChange}
                        />
                        {errors.venue && <div className="invalid-feedback">{errors.venue}</div>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="location" className="form-label fw-bold">Location *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-geo"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                          id="location"
                          name="location"
                          placeholder="City, Region, Country"
                          value={formData.location}
                          onChange={handleChange}
                        />
                        {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="start_date" className="form-label fw-bold">Start Date & Time *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-calendar"></i>
                        </span>
                        <input
                          type="datetime-local"
                          className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                          id="start_date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleChange}
                        />
                        {errors.start_date && <div className="invalid-feedback">{errors.start_date}</div>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="capacity" className="form-label fw-bold">Capacity *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-people"></i>
                        </span>
                        <input
                          type="number"
                          className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
                          id="capacity"
                          name="capacity"
                          placeholder="Number of attendees"
                          value={formData.capacity}
                          onChange={handleChange}
                        />
                        {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="ticket_price" className="form-label fw-bold">Ticket Price (GHS) *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-currency-exchange"></i>
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${errors.ticket_price ? 'is-invalid' : ''}`}
                          id="ticket_price"
                          name="ticket_price"
                          placeholder="0 for free events"
                          value={formData.ticket_price}
                          onChange={handleChange}
                        />
                        {errors.ticket_price && <div className="invalid-feedback">{errors.ticket_price}</div>}
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <label htmlFor="image" className="form-label fw-bold">Event Image URL</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-image"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="image"
                          name="image"
                          placeholder="https://example.com/image.jpg"
                          value={formData.image}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <label htmlFor="description" className="form-label fw-bold">Description</label>
                      <div className="input-group">
                        <span className="input-group-text align-items-start pt-2">
                          <i className="bi bi-textarea-t"></i>
                        </span>
                        <textarea
                          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                          id="description"
                          name="description"
                          rows="5"
                          placeholder="Describe your event in detail..."
                          value={formData.description}
                          onChange={handleChange}
                        ></textarea>
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                      </div>
                      <div className="form-text mt-1">
                        {formData.description.length}/300 characters
                      </div>
                    </div>
                    <div className="col-12 mt-4">
                      <div className="d-grid gap-3 d-md-flex justify-content-md-end">
                        <button
                          type="reset"
                          className="btn btn-outline-secondary px-4 py-2"
                          onClick={() => setFormData({
                            title: '',
                            event_type: 'Conference',
                            image: '',
                            description: '',
                            venue: '',
                            capacity: '',
                            ticket_price: '',
                            location: '',
                            start_date: '',
                          })}
                        >
                          <i className="bi bi-x-circle me-2"></i> Reset Form
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary px-4 py-2"
                        >
                          <i className="bi bi-calendar-plus me-2"></i> Create Event
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="mt-5 text-center">
              <h3 className="mb-4">Event Creation Tips</h3>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="text-primary mb-3">
                        <i className="bi bi-card-heading fs-1"></i>
                      </div>
                      <h5 className="card-title">Clear Title</h5>
                      <p className="card-text">Make your event title descriptive and attention-grabbing.</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="text-primary mb-3">
                        <i className="bi bi-image fs-1"></i>
                      </div>
                      <h5 className="card-title">Quality Images</h5>
                      <p className="card-text">Use high-quality images that represent your event well.</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="text-primary mb-3">
                        <i className="bi bi-info-circle fs-1"></i>
                      </div>
                      <h5 className="card-title">Detailed Info</h5>
                      <p className="card-text">Provide all necessary details to help attendees plan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;