import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AnnouncementManager = ({ roles }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ message: '', target_roles: [] });
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      setError('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'target_roles') {
      setForm(f => ({
        ...f,
        target_roles: checked
          ? [...f.target_roles, value]
          : f.target_roles.filter(r => r !== value)
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/admin/announcements/${editing.id}`, form);
      } else {
        await api.post('/admin/announcements', form);
      }
      setForm({ message: '', target_roles: [] });
      setEditing(null);
      fetchAnnouncements();
    } catch (err) {
      alert('Failed to send announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = ann => {
    setEditing(ann);
    setForm({
      message: ann.message,
      target_roles: ann.target_roles || []
    });
  };

  const handleDelete = async ann => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/admin/announcements/${ann.id}`);
      fetchAnnouncements();
    } catch {
      alert('Failed to delete announcement.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Announcement Message</label>
          <textarea className="form-control" name="message" value={form.message} onChange={handleChange} required rows={3} />
        </div>
        <div className="mb-3">
          <label className="form-label">Target Roles</label>
          <div>
            <label className="me-3">
              <input type="checkbox" name="target_roles" value="ALL" checked={form.target_roles.length === 0} onChange={() => setForm(f => ({ ...f, target_roles: [] }))} /> All Users
            </label>
            {roles.map(role => (
              <label key={role.name} className="me-3">
                <input
                  type="checkbox"
                  name="target_roles"
                  value={role.name}
                  checked={form.target_roles.includes(role.name)}
                  onChange={handleChange}
                  disabled={form.target_roles.length === 0}
                />{' '}
                {role.name}
              </label>
            ))}
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>{editing ? 'Update' : 'Send'} Announcement</button>
        {editing && <button className="btn btn-secondary ms-2" type="button" onClick={() => { setEditing(null); setForm({ message: '', target_roles: [] }); }}>Cancel</button>}
      </form>
      <h6>Past Announcements</h6>
      {loading ? <div>Loading...</div> : error ? <div className="text-danger">{error}</div> : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Message</th>
                <th>Target</th>
                <th>Created</th>
                <th>By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map(ann => (
                <tr key={ann.id}>
                  <td>{ann.message}</td>
                  <td>{!ann.target_roles || ann.target_roles.length === 0 ? 'All Users' : ann.target_roles.join(', ')}</td>
                  <td>{ann.created_at && new Date(ann.created_at).toLocaleString()}</td>
                  <td>{ann.creator?.name || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(ann)}><i className="fas fa-edit"></i></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(ann)}><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManager;
