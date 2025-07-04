import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const EventFeedback = ({ eventId }) => {
  const [allFeedback, setAllFeedback] = useState([]);
  const [myFeedback, setMyFeedback] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const [all, mine] = await Promise.all([
          axios.get(`${API_URL}/events/${eventId}/feedback`),
          axios.get(`${API_URL}/events/${eventId}/feedback/me`)
        ]);
        setAllFeedback(all.data);
        setMyFeedback({
          rating: mine.data?.rating || 0,
          comment: mine.data?.comment || ''
        });
      } catch (err) {
        setError('Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [eventId]);

  const handleStarClick = (rating) => {
    setMyFeedback(prev => ({ ...prev, rating }));
    setSuccess(null);
    setError(null);
  };

  const handleCommentChange = (e) => {
    setMyFeedback(prev => ({ ...prev, comment: e.target.value }));
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${API_URL}/events/${eventId}/feedback`, myFeedback);
      setSuccess('Feedback submitted!');
    } catch (err) {
      setError('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="event-feedback-section mt-5">
      <h2>Event Reviews</h2>
      <div className="mb-4">
        <h5>Your Feedback</h5>
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="d-flex align-items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi ${i < myFeedback.rating ? 'bi-star-fill' : 'bi-star'} me-1 text-warning`}
                style={{ cursor: 'pointer', fontSize: 24 }}
                onClick={() => handleStarClick(i + 1)}
              ></i>
            ))}
          </div>
          <textarea
            className="form-control mb-2"
            rows={2}
            maxLength={300}
            placeholder="Leave a review..."
            value={myFeedback.comment}
            onChange={handleCommentChange}
          />
          <button className="btn btn-primary btn-sm" type="submit" disabled={submitting || !myFeedback.rating}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          {error && <div className="text-danger small mt-2">{error}</div>}
          {success && <div className="text-success small mt-2">{success}</div>}
        </form>
      </div>
      <div>
        <h5>All Reviews</h5>
        {loading ? (
          <div>Loading reviews...</div>
        ) : allFeedback.length === 0 ? (
          <div className="text-muted">No reviews yet.</div>
        ) : (
          <ul className="list-unstyled">
            {allFeedback.map(fb => (
              <li key={fb.id} className="mb-3 border-bottom pb-2">
                <div className="d-flex align-items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi ${i < fb.rating ? 'bi-star-fill' : 'bi-star'} me-1 text-warning`}
                      style={{ fontSize: 18 }}
                    ></i>
                  ))}
                  <span className="ms-2 fw-bold">{fb.attendee?.name || 'Anonymous'}</span>
                  <span className="ms-2 text-muted small">{new Date(fb.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-muted">{fb.comment}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventFeedback;
