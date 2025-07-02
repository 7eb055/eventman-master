import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getToken } from '../services/auth';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = getToken();
        const res = await api.get(`/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
      } catch (err) {
        setError('Failed to load event data.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = getToken();
      await api.put(`/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/organizer-dashboard');
    } catch (err) {
      setError('Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!formData) return null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-4">
              <h1 className="text-center mb-0">Edit Event</h1>
            </div>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Title</label>
                  <input type="text" className="form-control" name="title" value={formData.title || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Event Type</label>
                  <input type="text" className="form-control" name="event_type" value={formData.event_type || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Venue</label>
                  <input type="text" className="form-control" name="venue" value={formData.venue || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Location</label>
                  <input type="text" className="form-control" name="location" value={formData.location || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Start Date</label>
                  <input type="datetime-local" className="form-control" name="start_date" value={formData.start_date ? formData.start_date.substring(0,16) : ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Capacity</label>
                  <input type="number" className="form-control" name="capacity" value={formData.capacity || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Ticket Price</label>
                  <input type="number" className="form-control" name="ticket_price" value={formData.ticket_price || ''} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Image URL</label>
                  <input type="text" className="form-control" name="image" value={formData.image || ''} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <textarea className="form-control" name="description" rows="4" value={formData.description || ''} onChange={handleChange}></textarea>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
