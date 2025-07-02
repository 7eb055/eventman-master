import React, { useState, useEffect } from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 2000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
};

const UserModal = ({ show, onClose, onSave, user }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin',
  });
  useEffect(() => {
    if (user) {
      setForm({ ...user, password: '' });
    } else {
      setForm({ name: '', email: '', password: '', role: 'Admin' });
    }
  }, [user, show]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  if (!show) return null;
  return (
    <div style={modalStyle}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content bg-white">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">{user ? 'Edit User' : 'Add Admin User'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password {user && <span className="text-muted">(leave blank to keep unchanged)</span>}</label>
                <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} placeholder={user ? 'Leave blank to keep current password' : ''} required={!user} />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">{user ? 'Save Changes' : 'Add User'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
