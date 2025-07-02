import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [newKey, setNewKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/api-keys');
      setApiKeys(res.data);
    } catch {
      setApiKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/admin/api-keys', { label });
      setNewKey(res.data.api_key);
      setLabel('');
      fetchApiKeys();
    } catch {
      alert('Failed to create API key.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async id => {
    if (!window.confirm('Revoke this API key?')) return;
    try {
      await api.post(`/admin/api-keys/${id}/revoke`);
      fetchApiKeys();
    } catch {
      alert('Failed to revoke API key.');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this API key?')) return;
    try {
      await api.delete(`/admin/api-keys/${id}`);
      fetchApiKeys();
    } catch {
      alert('Failed to delete API key.');
    }
  };

  return (
    <div>
      <form onSubmit={handleCreate} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Label (optional)</label>
          <input className="form-control" value={label} onChange={e => setLabel(e.target.value)} maxLength={100} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={submitting}>Generate API Key</button>
      </form>
      {newKey && (
        <div className="alert alert-success">
          <strong>New API Key:</strong>
          <div className="d-flex align-items-center">
            <code className="me-2">{newKey}</code>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => {navigator.clipboard.writeText(newKey);}}>Copy</button>
          </div>
          <div className="text-danger mt-2">This key will not be shown again. Please copy and store it securely.</div>
        </div>
      )}
      <h6>Existing API Keys</h6>
      {loading ? <div>Loading...</div> : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Label</th>
                <th>Key (partial)</th>
                <th>Status</th>
                <th>Created</th>
                <th>Last Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(key => (
                <tr key={key.id}>
                  <td>{key.label || '-'}</td>
                  <td><code>{key.key.slice(0, 8)}...{key.key.slice(-4)}</code></td>
                  <td>{key.active ? 'Active' : 'Revoked'}</td>
                  <td>{key.created_at && new Date(key.created_at).toLocaleString()}</td>
                  <td>{key.last_used_at ? new Date(key.last_used_at).toLocaleString() : '-'}</td>
                  <td>
                    {key.active && <button className="btn btn-sm btn-warning me-1" onClick={() => handleRevoke(key.id)}>Revoke</button>}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(key.id)}>Delete</button>
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

export default ApiKeyManager;
