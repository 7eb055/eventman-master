import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const AdminEventApprovals = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events?status=pending');
        setEvents(res.data);
      } catch (err) {
        setError(t('admin_event_approvals.failed_load'));
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [t]);

  const handleApprove = async (id) => {
    await api.post(`/admin/events/${id}/approve`);
    setEvents(events.filter(e => e.id !== id));
  };
  const handleReject = async (id) => {
    await api.post(`/admin/events/${id}/reject`);
    setEvents(events.filter(e => e.id !== id));
  };

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2>{t('admin_event_approvals.title')}</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>{t('admin_event_approvals.event_title')}</th>
              <th>{t('admin_event_approvals.organizer')}</th>
              <th>{t('admin_event_approvals.date')}</th>
              <th>{t('admin_event_approvals.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.organizer_name || event.organizer_id}</td>
                <td>{event.start_date}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(event.id)}>{t('admin_event_approvals.approve')}</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(event.id)}>{t('admin_event_approvals.reject')}</button>
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
