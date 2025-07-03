import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminEventApprovals = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events?status=pending');
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleApprove = async (id) => {
    await api.post(`/admin/events/${id}/approve`);
    setEvents(events.filter(e => e.id !== id));
  };
  const handleReject = async (id) => {
    await api.post(`/admin/events/${id}/reject`);
    setEvents(events.filter(e => e.id !== id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2>Pending Event Approvals</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Organizer</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.organizer_name || event.organizer_id}</td>
                <td>{event.start_date}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(event.id)}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(event.id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEventApprovals;
