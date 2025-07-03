import React, { useEffect, useState } from 'react';
import { getOrganizerProfile, updateOrganizerProfile } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrganizerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    logo: '',
    description: '',
    website: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getOrganizerProfile();
        setProfile(res);
        setForm({
          logo: res.logo || '',
          description: res.description || '',
          website: res.website || '',
          facebook: res.facebook || '',
          twitter: res.twitter || '',
          linkedin: res.linkedin || '',
          instagram: res.instagram || ''
        });
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateOrganizerProfile(form);
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h2 className="mb-4">Company Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Company Logo URL</label>
          <input type="text" className="form-control" name="logo" value={form.logo} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>
        <div className="mb-3">
          <label className="form-label">Website</label>
          <input type="text" className="form-control" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="mb-3">
          <label className="form-label">Facebook</label>
          <input type="text" className="form-control" name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
        </div>
        <div className="mb-3">
          <label className="form-label">Twitter</label>
          <input type="text" className="form-control" name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
        </div>
        <div className="mb-3">
          <label className="form-label">LinkedIn</label>
          <input type="text" className="form-control" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/..." />
        </div>
        <div className="mb-3">
          <label className="form-label">Instagram</label>
          <input type="text" className="form-control" name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
        </div>
        <button type="submit" className="btn btn-primary">Save Profile</button>
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
      <ToastContainer />
    </div>
  );
};

export default OrganizerProfile;
