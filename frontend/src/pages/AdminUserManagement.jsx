import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const AdminUserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', role: '' });
  const [success, setSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/system-users');
        setUsers(res.data);
      } catch (err) {
        setError(t('admin_user_management.failed_load'));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t]);

  const handleDelete = async (id) => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      setSuccess(t('admin_user_management.user_deleted'));
    } catch (err) {
      setError(t('admin_user_management.failed_delete'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditData({ name: user.name, email: user.email, role: user.role });
    setEditError('');
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setEditError('');
    setActionLoading(true);
    setError('');
    setSuccess('');
    if (!editData.name || !editData.email || !editData.role) {
      setEditError(t('admin_user_management.all_fields_required'));
      setActionLoading(false);
      return;
    }
    try {
      await api.put(`/admin/users/${selectedUser.id}`, editData);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editData } : u));
      setSelectedUser(null);
      setSuccess(t('admin_user_management.user_updated'));
    } catch (err) {
      setEditError(t('admin_user_management.failed_update'));
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">{t('admin_user_management.title')}</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row mb-3">
        <div className="col-12 col-md-6 mx-auto">
          <input
            type="text"
            className="form-control mb-2 shadow-sm"
            placeholder={t('admin_user_management.search_placeholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            disabled={actionLoading}
            style={{ minHeight: 44 }}
          />
        </div>
      </div>
      <div className="table-responsive rounded shadow-sm">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>{t('admin_user_management.name')}</th>
              <th>{t('admin_user_management.email')}</th>
              <th>{t('admin_user_management.role')}</th>
              <th style={{ minWidth: 120 }}>{t('admin_user_management.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="4" className="text-center">{t('admin_user_management.no_users')}</td></tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td className="text-break">{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-info btn-sm me-2 mb-1 mb-md-0" onClick={() => handleEdit(user)} disabled={actionLoading} style={{ minWidth: 60 }}>{t('admin_user_management.edit')}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)} disabled={actionLoading} style={{ minWidth: 60 }}>{t('admin_user_management.delete')}</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Edit Modal */}
      {selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3">
              <div className="modal-header">
                <h5 className="modal-title">{t('admin_user_management.edit_user')}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedUser(null)} disabled={actionLoading}></button>
              </div>
              <div className="modal-body">
                {editError && <div className="alert alert-danger">{editError}</div>}
                <div className="mb-3">
                  <label className="form-label">{t('admin_user_management.name')}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder={t('admin_user_management.name')}
                    disabled={actionLoading}
                    style={{ minHeight: 40 }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">{t('admin_user_management.email')}</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    placeholder={t('admin_user_management.email')}
                    disabled={actionLoading}
                    style={{ minHeight: 40 }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">{t('admin_user_management.role')}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="role"
                    value={editData.role}
                    onChange={handleEditChange}
                    placeholder={t('admin_user_management.role')}
                    disabled={actionLoading}
                    style={{ minHeight: 40 }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedUser(null)} disabled={actionLoading}>{t('admin_user_management.cancel')}</button>
                <button className="btn btn-primary" onClick={handleEditSave} disabled={actionLoading}>
                  {actionLoading ? t('admin_user_management.saving') : t('admin_user_management.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {actionLoading && <div className="text-center mt-3"><span className="spinner-border"></span> {t('admin_user_management.processing')}</div>}
    </div>
  );
};

export default AdminUserManagement;
