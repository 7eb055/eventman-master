import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AnnouncementsBanner = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [show, setShow] = useState(true);

  // Disable announcements fetch for now to avoid 401 errors
  // useEffect(() => {
  //   fetchAnnouncements();
  //   // eslint-disable-next-line
  // }, [user]);

  // const fetchAnnouncements = async () => {
  //   try {
  //     const res = await api.get('/admin/announcements');
  //     // Filter by user role and recent (last 7 days)
  //     const now = new Date();
  //     const filtered = res.data.filter(a => {
  //       const created = new Date(a.created_at);
  //       const isRecent = (now - created) / (1000 * 60 * 60 * 24) <= 7;
  //       if (!isRecent) return false;
  //       if (!a.target_roles || a.target_roles.length === 0 || a.target_roles.includes('ALL')) return true;
  //       if (!user || !user.role) return false;
  //       return a.target_roles.includes(user.role);
  //     });
  //     setAnnouncements(filtered);
  //   } catch {}
  // };

  // Hide banner for now
  if (true) return null;

  return (
    <div className="alert alert-info alert-dismissible fade show" role="alert" style={{zIndex: 1200, position: 'sticky', top: 0}}>
      <strong>Announcement:</strong>
      <ul className="mb-0">
        {announcements.map(a => (
          <li key={a.id}>{a.message}</li>
        ))}
      </ul>
      <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(false)}></button>
    </div>
  );
};

export default AnnouncementsBanner;
