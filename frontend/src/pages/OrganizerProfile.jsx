import React, { useEffect, useState } from 'react';
import { getOrganizerProfile, updateOrganizerProfile } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const OrganizerProfile = () => {
  const { t } = useTranslation();
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
        setError(t('organizer_profile.load_error'));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [t]);

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
      setSuccess(t('organizer_profile.update_success'));
      toast.success(t('organizer_profile.update_success'));
    } catch (err) {
      setError(t('organizer_profile.update_error'));
      toast.error(t('organizer_profile.update_error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>{t('common.loading')}</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <h2 className="mb-4">{t('organizer_profile.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">{t('organizer_profile.logo')}</label>
          <input type="text" className="form-control" name="logo" value={form.logo} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('organizer_profile.description')}</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('organizer_profile.website')}</label>
          <input type="text" className="form-control" name="website" value={form.website} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('organizer_profile.facebook')}</label>
          <input type="text" className="form-control" name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('organizer_profile.twitter')}</label>
          <input type="text" className="form-control" name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('organizer_profile.linkedin')}</label>
          <input type="text" className="form-control" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/..." />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('organizer_profile.instagram')}</label>
          <input type="text" className="form-control" name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
        </div>
        <button type="submit" className="btn btn-primary">{t('organizer_profile.save_button')}</button>
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
      <ToastContainer />
    </div>
  );
};

export default OrganizerProfile;
