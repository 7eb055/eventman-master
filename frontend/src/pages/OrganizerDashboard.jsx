import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrganizerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!dashboard) return null;

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Organizer Dashboard</h1>
        <Link to="/create-event" className="d-none d-sm-inline-block btn btn-primary shadow-sm">
          <i className="fas fa-plus fa-sm text-white-50 me-1"></i> Create Event
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
                    Total Events
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
                    Upcoming Events
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
                    Tickets Sold
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
                    Revenue
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
          <h6 className="m-0 fw-bold text-primary">Your Events</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start Date</th>
                  <th>Tickets Sold</th>
                  <th>Revenue</th>
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
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center">No events found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mb-4 d-flex gap-2">
        <button className="btn btn-outline-success" onClick={exportEventsCSV}>
          <i className="fas fa-file-csv me-1"></i> Export Events CSV
        </button>
        <button className="btn btn-outline-info" onClick={exportStatsJSON}>
          <i className="fas fa-file-code me-1"></i> Export Dashboard JSON
        </button>
        <button className="btn btn-outline-danger" onClick={exportPDF}>
          <i className="fas fa-file-pdf me-1"></i> Export Events PDF
        </button>
      </div>

      {/* Analytics & Charts Section */}
      <div className="row mb-4">
        {/* Revenue Over Time Bar Chart */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow h-100">
            <div className="card-header py-3">
              <h6 className="m-0 fw-bold text-primary">Revenue by Event</h6>
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
              <h6 className="m-0 fw-bold text-primary">Tickets Sold Distribution</h6>
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
    </div>
  );
};

export default OrganizerDashboard;