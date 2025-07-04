import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ConfirmDeleteModal from '../components/common/ConfirmDeleteModal';

const OrganizerDashboard = () => {
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/organizer/dashboard');
        setDashboard(response.data.data);
      } catch (err) {
        // Show more detailed error for debugging
        let msg = 'Failed to load dashboard data.';
        if (err.response) {
          msg += ` (Status: ${err.response.status})`;
          if (err.response.data && err.response.data.message) {
            msg += ` - ${err.response.data.message}`;
          }
        } else if (err.message) {
          msg += ` (${err.message})`;
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Color palette for charts
  const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'];

  // Export handlers
  const exportEventsCSV = () => {
    if (!dashboard?.events?.length) return;
    const headers = ['Title', 'Start Date', 'Tickets Sold', 'Revenue'];
    const rows = dashboard.events.map(e => [e.title, e.start_date, e.tickets_sold, e.revenue]);
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'events.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportStatsJSON = () => {
    if (!dashboard) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dashboard, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'dashboard_stats.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (!dashboard?.events?.length) return;
    const doc = new jsPDF();
    doc.text('Organizer Events Report', 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [['Title', 'Start Date', 'Tickets Sold', 'Revenue']],
      body: dashboard.events.map(e => [e.title, e.start_date, e.tickets_sold, e.revenue]),
    });
    doc.save('events_report.pdf');
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setDeletingId(eventToDelete.id);
    try {
      await api.delete(`/events/${eventToDelete.id}`);
      setDashboard(prev => ({
        ...prev,
        events: prev.events.filter(e => e.id !== eventToDelete.id),
        total_events: prev.total_events - 1,
      }));
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (err) {
      alert('Failed to delete event. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  if (loading) return <div className="text-center mt-5">{t('organizer_dashboard.loading')}</div>;
  if (error) return <div className="alert alert-danger mt-5">{t('organizer_dashboard.error', { error })}</div>;
  if (!dashboard) return null;

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">{t('organizer_dashboard.title')}</h1>
        <Link to="/create-event" className="d-none d-sm-inline-block btn btn-primary shadow-sm">
          <i className="fas fa-plus fa-sm text-white-50 me-1"></i> {t('organizer_dashboard.create_event')}
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">
                    {t('organizer_dashboard.total_events')}
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{dashboard.total_events}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">
                    {t('organizer_dashboard.upcoming_events')}
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{dashboard.upcoming_events_count}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-bolt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-info text-uppercase mb-1">
                    {t('organizer_dashboard.tickets_sold')}
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{dashboard.total_tickets_sold}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-ticket-alt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1">
                    {t('organizer_dashboard.revenue')}
                  </div>
                  <div className="h5 mb-0 fw-bold text-gray-800">${dashboard.total_revenue}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 fw-bold text-primary">{t('organizer_dashboard.your_events')}</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>{t('organizer_dashboard.event_title')}</th>
                  <th>{t('organizer_dashboard.start_date')}</th>
                  <th>{t('organizer_dashboard.tickets_sold')}</th>
                  <th>{t('organizer_dashboard.revenue')}</th>
                  <th>{t('organizer_dashboard.edit')}</th>
                  <th>{t('organizer_dashboard.delete')}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.events && dashboard.events.length > 0 ? (
                  dashboard.events.map(event => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.start_date}</td>
                      <td>{event.tickets_sold}</td>
                      <td>${event.revenue}</td>
                      <td>
                        <Link to={`/edit-event/${event.id}`} className="btn btn-sm btn-outline-primary" title={t('organizer_dashboard.edit_event')}>
                          <i className="bi bi-pencil"></i>
                        </Link>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title={t('organizer_dashboard.delete_event')}
                          onClick={() => handleDeleteClick(event)}
                          disabled={deletingId === event.id}
                        >
                          {deletingId === event.id ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : (
                            <i className="bi bi-trash"></i>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center">{t('organizer_dashboard.no_events')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mb-4 d-flex gap-2">
        <button className="btn btn-outline-success" onClick={exportEventsCSV}>
          <i className="fas fa-file-csv me-1"></i> {t('organizer_dashboard.export_csv')}
        </button>
        <button className="btn btn-outline-info" onClick={exportStatsJSON}>
          <i className="fas fa-file-code me-1"></i> {t('organizer_dashboard.export_json')}
        </button>
        <button className="btn btn-outline-danger" onClick={exportPDF}>
          <i className="fas fa-file-pdf me-1"></i> {t('organizer_dashboard.export_pdf')}
        </button>
      </div>

      {/* Analytics & Charts Section */}
      <div className="row mb-4">
        {/* Revenue Over Time Bar Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">{t('organizer_dashboard.revenue_by_event')}</h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboard.events} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="title" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#4e73df" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* Tickets Sold Pie Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">{t('organizer_dashboard.tickets_sold_distribution')}</h6>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dashboard.events}
                    dataKey="tickets_sold"
                    nameKey="title"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#36b9cc"
                    label
                  >
                    {dashboard.events.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        eventTitle={eventToDelete?.title}
      />
    </div>
  );
};

export default OrganizerDashboard;