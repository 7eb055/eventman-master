import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import EmergencyActionsModal from '../components/common/EmergencyActionsModal';
import UserModal from '../components/common/UserModal';
import AnnouncementManager from '../components/admin/AnnouncementManager';
import ApiKeyManager from '../components/admin/ApiKeyManager';
import { useTranslation } from 'react-i18next';

const AdminPanel = () => {
  const { t } = useTranslation();

  // Dynamic state for all admin data
  const [stats, setStats] = useState(null);
  const [platformData, setPlatformData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [systemActivity, setSystemActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, platformRes, roleRes, activityRes, pendingRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/platform-usage'),
          api.get('/admin/role-distribution'),
          api.get('/admin/system-activity'),
          api.get('/admin/pending-approvals'),
          api.get('/admin/system-users'),
        ]);
        setStats(statsRes.data);
        // Merge platform usage data for charting
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const usage = months.map((month, idx) => {
          const users = platformRes.data.usersByMonth.find(u => u.month === idx + 1)?.users || 0;
          const events = platformRes.data.eventsByMonth.find(e => e.month === idx + 1)?.events || 0;
          const revenue = platformRes.data.revenueByMonth.find(r => r.month === idx + 1)?.revenue || 0;
          return { month, users, events, revenue };
        });
        setPlatformData(usage);
        // Role distribution for pie chart
        setUserRoleData(roleRes.data.map(role => ({ name: role.role, value: role.value })));
        setSystemActivity(activityRes.data);
        setPendingApprovals(pendingRes.data);
        setSystemUsers(usersRes.data);
      } catch (err) {
        setError('Failed to load admin data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Color palette for charts
  const COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];

  // Current view state
  const [currentView, setCurrentView] = useState('dashboard');

  const getActivityIcon = (type) => {
    switch(type) {
      case 'system': return 'fas fa-cogs text-info';
      case 'approval': return 'fas fa-check-circle text-success';
      case 'security': return 'fas fa-shield-alt text-warning';
      default: return 'fas fa-info-circle text-primary';
    }
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'High': 'bg-danger',
      'Medium': 'bg-warning',
      'Low': 'bg-secondary'
    };
    return badges[priority] || 'bg-secondary';
  };

  const renderDashboardView = () => (
    <>
      {/* Stats Cards */}
      <div className="row">
        <div className="col-xl-2 col-md-4 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">{t('admin.total_users')}</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.totalUsers?.toLocaleString?.() ?? stats.totalUsers}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">{t('admin.total_events')}</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.totalEvents}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-info text-uppercase mb-1">{t('admin.total_revenue')}</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">${Number(stats.totalRevenue).toLocaleString()}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1">{t('admin.active_events')}</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.activeEvents}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-bolt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 mb-4">
          <div className="card border-left-secondary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-secondary text-uppercase mb-1">{t('admin.pending_approvals')}</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.pendingApprovals}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-hourglass-half fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 mb-4">
          <div className="card border-left-dark shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-dark text-uppercase mb-1">{t('admin.support_tickets')}</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.supportTickets}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-ticket-alt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        {/* Platform Growth Chart */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">{t('admin.platform_growth_overview')}</h6>
            </div>
            <div className="card-body">
              <div className="chart-area" style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={platformData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#4e73df" strokeWidth={3} name={t('admin.users')} />
                    <Line type="monotone" dataKey="events" stroke="#1cc88a" strokeWidth={3} name={t('admin.events')} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">{t('admin.user_distribution')}</h6>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRoleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {userRoleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center small">
                {userRoleData.map((data, index) => (
                  <span key={index} className="me-3">
                    <i className="fas fa-circle" style={{ color: data.color }}></i> {data.name} ({data.value})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Activity and Pending Approvals */}
      <div className="row">
        {/* System Activity */}
        <div className="col-xl-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">{t('admin.recent_system_activity')}</h6>
              <button className="btn btn-sm btn-outline-primary" onClick={handleViewAllActivity}>{t('admin.view_all')}</button>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {systemActivity.slice(0, 6).map(activity => (
                  <div key={activity.id} className="list-group-item border-0 px-0">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <i className={getActivityIcon(activity.type)}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-gray-800">{activity.action}</div>
                        <small className="text-muted">by {activity.user} • {activity.time}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="col-xl-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">{t('admin.pending_approvals')}</h6>
              <button className="btn btn-sm btn-outline-primary">{t('admin.manage_all')}</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>{t('admin.type')}</th>
                      <th>{t('admin.name')}</th>
                      <th>{t('admin.priority')}</th>
                      <th>{t('admin.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.slice(0, 5).map(approval => (
                      <tr key={approval.id}>
                        <td>
                          <span className="badge bg-secondary">{approval.type}</span>
                        </td>
                        <td>
                          <div className="fw-bold">{approval.name}</div>
                          <small className="text-muted">by {approval.requestor}</small>
                        </td>
                        <td>
                          <span className={`badge ${getPriorityBadge(approval.priority)}`}>
                            {approval.priority}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-success me-1">
                            <i className="fas fa-check"></i>
                          </button>
                          <button className="btn btn-sm btn-danger">
                            <i className="fas fa-times"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderUserManagement = () => (
    <div className="row">
      <div className="col-12">
        <div className="card shadow mb-4">
          <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 className="m-0 fw-bold text-primary">{t('admin.system_user_management')}</h6>
            <button className="btn btn-sm btn-primary" onClick={handleAddUser}>
              <i className="fas fa-plus me-1"></i> {t('admin.add_admin_user')}
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>{t('admin.name')}</th>
                    <th>{t('admin.email')}</th>
                    <th>{t('admin.role')}</th>
                    <th>{t('admin.last_active')}</th>
                    <th>{t('admin.status')}</th>
                    <th>{t('admin.join_date')}</th>
                    <th>{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {systemUsers.map(user => (
                    <tr key={user.id}>
                      <td className="fw-bold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === 'Super Admin' ? 'bg-danger' :
                          user.role === 'Admin' ? 'bg-primary' :
                          user.role === 'Moderator' ? 'bg-warning' :
                          'bg-info'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.lastActive}</td>
                      <td>
                        <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.joinDate}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditUser(user)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // System Report Download Handlers
  const handleDownloadCSV = () => {
    if (!stats) return;
    const headers = ['Total Users', 'Total Events', 'Total Revenue', 'Active Events', 'Pending Approvals', 'Support Tickets'];
    const row = [
      stats.totalUsers,
      stats.totalEvents,
      stats.totalRevenue,
      stats.activeEvents,
      stats.pendingApprovals,
      stats.supportTickets
    ];
    let csvContent = headers.join(',') + '\n' + row.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    if (!stats) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'system_report.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (!stats) return;
    const doc = new jsPDF();
    doc.text('System Report', 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [['Total Users', 'Total Events', 'Total Revenue', 'Active Events', 'Pending Approvals', 'Support Tickets']],
      body: [[
        stats.totalUsers,
        stats.totalEvents,
        stats.totalRevenue,
        stats.activeEvents,
        stats.pendingApprovals,
        stats.supportTickets
      ]],
    });
    doc.save('system_report.pdf');
  };

  // Emergency Actions Modal State and Handlers
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'lockdown' | 'alert' | 'purge' | null
  const [loadingAction, setLoadingAction] = useState(false);

  const handleLockdown = () => setConfirmAction('lockdown');
  const handleAlert = () => setConfirmAction('alert');
  const handlePurge = () => setConfirmAction('purge');

  const handleConfirmAction = async () => {
    setLoadingAction(true);
    try {
      if (confirmAction === 'lockdown') {
        await api.post('/admin/lockdown');
        alert('Platform lockdown initiated!');
      } else if (confirmAction === 'alert') {
        await api.post('/admin/system-alert', { message: 'System-wide alert from admin.' });
        alert('System-wide alert sent!');
      } else if (confirmAction === 'purge') {
        await api.post('/admin/purge-inactive-users');
        alert('Inactive users purged!');
      }
    } catch (err) {
      alert('Action failed. Please try again.');
    } finally {
      setLoadingAction(false);
      setConfirmAction(null);
      setShowEmergencyModal(false);
    }
  };

  const handleCancelConfirm = () => setConfirmAction(null);

  // User Modal State and Handlers
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userModalLoading, setUserModalLoading] = useState(false);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };
  const handleSaveUser = async (form) => {
    setUserModalLoading(true);
    try {
      if (editingUser) {
        // Edit existing user
        await api.put(`/admin/users/${editingUser.id}`, form);
      } else {
        // Add new user
        await api.post('/admin/users', form);
      }
      setShowUserModal(false);
      // Refresh user list
      const usersRes = await api.get('/admin/system-users');
      setSystemUsers(usersRes.data);
    } catch (err) {
      alert('Failed to save user.');
    } finally {
      setUserModalLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      // Refresh user list
      const usersRes = await api.get('/admin/system-users');
      setSystemUsers(usersRes.data);
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  // Event Oversight State and Handlers
  const [eventList, setEventList] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventError, setEventError] = useState(null);
  const [eventActionLoading, setEventActionLoading] = useState(false);

  const fetchEvents = async () => {
    setEventLoading(true);
    setEventError(null);
    try {
      const res = await api.get('/events');
      setEventList(res.data);
    } catch (err) {
      setEventError('Failed to load events.');
    } finally {
      setEventLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'events') fetchEvents();
  }, [currentView]);

  const handleApproveEvent = async (event) => {
    if (!window.confirm(`Approve event "${event.title}"?`)) return;
    setEventActionLoading(true);
    try {
      await api.post(`/admin/events/${event.id}/approve`);
      fetchEvents();
    } catch (err) {
      alert('Failed to approve event.');
    } finally {
      setEventActionLoading(false);
    }
  };
  const handleRejectEvent = async (event) => {
    if (!window.confirm(`Reject event "${event.title}"?`)) return;
    setEventActionLoading(true);
    try {
      await api.post(`/admin/events/${event.id}/reject`);
      fetchEvents();
    } catch (err) {
      alert('Failed to reject event.');
    } finally {
      setEventActionLoading(false);
    }
  };
  const handleDeleteEvent = async (event) => {
    if (!window.confirm(`Delete event "${event.title}"? This cannot be undone.`)) return;
    setEventActionLoading(true);
    try {
      await api.delete(`/admin/events/${event.id}`);
      fetchEvents();
    } catch (err) {
      alert('Failed to delete event.');
    } finally {
      setEventActionLoading(false);
    }
  };

  // System Settings State and Handlers
  const [settings, setSettings] = useState({ maintenance: false, emailTemplate: '', supportEmail: '', maxUploadSize: 10 });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [settingsSuccess, setSettingsSuccess] = useState(null);

  const fetchSettings = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const res = await api.get('/admin/settings');
      setSettings({
        maintenance: res.data.maintenance,
        emailTemplate: res.data.emailTemplate,
        supportEmail: res.data.supportEmail || '',
        maxUploadSize: res.data.maxUploadSize ? Number(res.data.maxUploadSize) : 10,
      });
    } catch (err) {
      setSettingsError('Failed to load settings.');
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'settings') fetchSettings();
  }, [currentView]);

  const handleSettingsChange = e => {
    const { name, value, type, checked } = e.target;
    setSettings(s => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSaveSettings = async e => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsError(null);
    setSettingsSuccess(null);
    try {
      await api.post('/admin/settings', settings);
      setSettingsSuccess('Settings saved successfully.');
    } catch (err) {
      setSettingsError('Failed to save settings.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // System Activity Modal State
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [activityPerPage] = useState(20);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityAll, setActivityAll] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState(null);

  const fetchAllActivity = async (page = 1) => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const res = await api.get(`/admin/system-activity?page=${page}&perPage=${activityPerPage}`);
      setActivityAll(res.data.data || res.data);
      setActivityTotal(res.data.total || res.data.length);
      setActivityPage(page);
    } catch (err) {
      setActivityError('Failed to load system activity.');
    } finally {
      setActivityLoading(false);
    }
  };

  const handleViewAllActivity = () => {
    setShowActivityModal(true);
    fetchAllActivity(1);
  };

  const renderSystemActivityTable = () => (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>{t('admin.user')}</th>
          <th>{t('admin.action')}</th>
          <th>{t('admin.time')}</th>
          <th>{t('admin.type')}</th>
        </tr>
      </thead>
      <tbody>
        {systemActivity.map((activity, idx) => (
          <tr key={activity.id || idx}>
            <td>{activity.user}</td>
            <td>{activity.action}</td>
            <td>{activity.time || activity.created_at}</td>
            <td>{activity.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Example: Pending Approvals Table
  const renderPendingApprovalsTable = () => (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>{t('admin.name')}</th>
          <th>{t('admin.type')}</th>
          <th>{t('admin.requestor')}</th>
          <th>{t('admin.date')}</th>
          <th>{t('admin.status_priority')}</th>
        </tr>
      </thead>
      <tbody>
        {pendingApprovals.map((item, idx) => (
          <tr key={item.id || idx}>
            <td>{item.name || item.title}</td>
            <td>{item.type || 'Event'}</td>
            <td>{item.requestor || item.organizer_id || '-'}</td>
            <td>{item.date || item.created_at}</td>
            <td>{item.priority || item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Example: System Users Table
  const renderSystemUsersTable = () => (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>{t('admin.name')}</th>
          <th>{t('admin.email')}</th>
          <th>{t('admin.role')}</th>
          <th>{t('admin.status')}</th>
          <th>{t('admin.join_date')}</th>
        </tr>
      </thead>
      <tbody>
        {systemUsers.map((user, idx) => (
          <tr key={user.id || idx}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.status || (user.deleted_at ? 'Inactive' : 'Active')}</td>
            <td>{user.joinDate || user.created_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Example: Events Table
  const renderEventsTable = () => (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>{t('admin.title')}</th>
            <th>{t('admin.type')}</th>
            <th>{t('admin.organizer')}</th>
            <th>{t('admin.status')}</th>
            <th>{t('admin.start_date')}</th>
            <th>{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {eventList.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.event_type}</td>
              <td>{event.organizer_id}</td>
              <td>{event.status || '-'}</td>
              <td>{event.start_date}</td>
              <td>
                <button className="btn btn-sm btn-success me-1" onClick={() => handleApproveEvent(event)} disabled={eventActionLoading}>
                  <i className="fas fa-check"></i>
                </button>
                <button className="btn btn-sm btn-warning me-1" onClick={() => handleRejectEvent(event)} disabled={eventActionLoading}>
                  <i className="fas fa-times"></i>
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEvent(event)} disabled={eventActionLoading}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Role Management State and Handlers
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] });

  const fetchRoles = async () => {
    setRoleLoading(true);
    setRoleError(null);
    try {
      const res = await api.get('/admin/roles');
      setRoles(res.data);
    } catch (err) {
      setRoleError('Failed to load roles.');
    } finally {
      setRoleLoading(false);
    }
  };
  const fetchPermissions = async () => {
    try {
      const res = await api.get('/admin/permissions');
      setPermissions(res.data);
    } catch {}
  };
  useEffect(() => {
    if (currentView === 'roles') {
      fetchRoles();
      fetchPermissions();
    }
  }, [currentView]);

  const handleAddRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: [] });
    setShowRoleModal(true);
  };
  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions ? role.permissions.map(p => p.id) : [],
    });
    setShowRoleModal(true);
  };
  const handleRoleFormChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'permissions') {
      const id = Number(value);
      setRoleForm(f => ({
        ...f,
        permissions: checked ? [...f.permissions, id] : f.permissions.filter(pid => pid !== id)
      }));
    } else {
      setRoleForm(f => ({ ...f, [name]: value }));
    }
  };
  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      let roleRes;
      if (editingRole) {
        roleRes = await api.put(`/admin/roles/${editingRole.id}`, { name: roleForm.name, description: roleForm.description });
      } else {
        roleRes = await api.post('/admin/roles', { name: roleForm.name, description: roleForm.description });
      }
      // Assign permissions
      const roleId = editingRole ? editingRole.id : roleRes.data.role.id;
      for (const pid of roleForm.permissions) {
        await api.post(`/admin/roles/${roleId}/assign-permission`, { permission_id: pid });
      }
      setShowRoleModal(false);
      fetchRoles();
    } catch (err) {
      alert('Failed to save role.');
    }
  };
  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Delete role "${role.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/roles/${role.id}`);
      fetchRoles();
    } catch (err) {
      alert('Failed to delete role.');
    }
  };

  // Example usage in your main render or dashboard view:
  // Place these where you want the charts/tables to appear
  // {renderPlatformUsageChart()}
  // {renderUserRolePieChart()}
  // {renderSystemActivityTable()}
  // {renderPendingApprovalsTable()}
  // {renderSystemUsersTable()}
  // {renderEventsTable()}

  if (loading) return <div>{t('admin.loading_dashboard')}</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!stats) return null;

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">{t('admin.system_administration')}</h1>
          <p className="text-muted mb-0">{t('admin.manage_platform_operations')}</p>
        </div>
        <div className="d-flex">
          <div className="btn-group me-2">
            <button className="btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-download fa-sm me-1"></i> {t('admin.system_report')}
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={handleDownloadCSV}>{t('admin.download_csv')}</button></li>
              <li><button className="dropdown-item" onClick={handleDownloadPDF}>{t('admin.download_pdf')}</button></li>
              <li><button className="dropdown-item" onClick={handleDownloadJSON}>{t('admin.download_json')}</button></li>
            </ul>
          </div>
          <button className="btn btn-sm btn-danger" onClick={() => setShowEmergencyModal(true)}>
            <i className="fas fa-exclamation-triangle fa-sm me-1"></i> {t('admin.emergency_actions')}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card shadow mb-4">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentView('dashboard')}
              >
                <i className="fas fa-tachometer-alt me-1"></i> {t('admin.dashboard')}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'users' ? 'active' : ''}`}
                onClick={() => setCurrentView('users')}
              >
                <i className="fas fa-users-cog me-1"></i> {t('admin.user_management')}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'events' ? 'active' : ''}`}
                onClick={() => setCurrentView('events')}
              >
                <i className="fas fa-calendar-check me-1"></i> {t('admin.event_oversight')}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'analytics' ? 'active' : ''}`}
                onClick={() => setCurrentView('analytics')}
              >
                <i className="fas fa-chart-line me-1"></i> {t('admin.analytics')}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'settings' ? 'active' : ''}`}
                onClick={() => setCurrentView('settings')}
              >
                <i className="fas fa-cogs me-1"></i> {t('admin.system_settings')}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'roles' ? 'active' : ''}`}
                onClick={() => setCurrentView('roles')}
              >
                <i className="fas fa-user-shield me-1"></i> {t('admin.role_management')}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'announcements' ? 'active' : ''}`}
                onClick={() => setCurrentView('announcements')}
              >
                <i className="fas fa-bullhorn me-1"></i> {t('admin.announcements')}
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'apiKeys' ? 'active' : ''}`}
                onClick={() => setCurrentView('apiKeys')}
              >
                <i className="fas fa-key me-1"></i> {t('admin.api_keys')}
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body p-0">
          {currentView === 'dashboard' && renderDashboardView()}
          {currentView === 'users' && renderUserManagement()}
          {currentView === 'events' && (
            <div className="p-4">
              <h5 className="mb-3">{t('admin.event_oversight')}</h5>
              {eventLoading ? (
                <div>{t('admin.loading_events')}</div>
              ) : eventError ? (
                <div className="text-danger">{eventError}</div>
              ) : (
                renderEventsTable()
              )}
            </div>
          )}
          {currentView === 'analytics' && (
            <div className="p-4 text-center">
              <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
              <h5>{t('admin.advanced_analytics')}</h5>
              <p className="text-muted">{t('admin.detailed_platform_analytics')}</p>
            </div>
          )}
          {currentView === 'settings' && (
            <div className="p-4" style={{maxWidth: 600}}>
              <h5 className="mb-3">{t('admin.system_settings')}</h5>
              {settingsLoading ? (
                <div>{t('admin.loading_settings')}</div>
              ) : settingsError ? (
                <div className="text-danger">{settingsError}</div>
              ) : (
                <form onSubmit={handleSaveSettings}>
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" id="maintenance" name="maintenance" checked={settings.maintenance} onChange={handleSettingsChange} />
                    <label className="form-check-label" htmlFor="maintenance">{t('admin.maintenance_mode')}</label>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t('admin.default_email_template')}</label>
                    <textarea className="form-control" name="emailTemplate" rows="4" value={settings.emailTemplate} onChange={handleSettingsChange}></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t('admin.support_email')}</label>
                    <input className="form-control" name="supportEmail" type="email" value={settings.supportEmail} onChange={handleSettingsChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{t('admin.max_upload_size')} (MB)</label>
                    <input className="form-control" name="maxUploadSize" type="number" min="1" max="100" value={settings.maxUploadSize} onChange={handleSettingsChange} required />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={settingsLoading}>{t('admin.save_settings')}</button>
                  {settingsSuccess && <span className="text-success ms-3">{settingsSuccess}</span>}
                </form>
              )}
            </div>
          )}
          {currentView === 'roles' && (
            <div className="p-4" style={{maxWidth: 800}}>
              <h5 className="mb-3">{t('admin.role_management')}</h5>
              <button className="btn btn-primary mb-3" onClick={handleAddRole}><i className="fas fa-plus me-1"></i> {t('admin.add_role')}</button>
              {roleLoading ? <div>{t('admin.loading_roles')}</div> : roleError ? <div className="text-danger">{roleError}</div> : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>{t('admin.name')}</th>
                        <th>{t('admin.description')}</th>
                        <th>{t('admin.permissions')}</th>
                        <th>{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map(role => (
                        <tr key={role.id}>
                          <td>{role.name}</td>
                          <td>{role.description}</td>
                          <td>{role.permissions && role.permissions.length ? role.permissions.map(p => p.name).join(', ') : '-'}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEditRole(role)}><i className="fas fa-edit"></i></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteRole(role)}><i className="fas fa-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Role Modal */}
              {showRoleModal && (
                <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:2100,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
                  <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content bg-white">
                      <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">{editingRole ? t('admin.edit_role') : t('admin.add_role')}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={()=>setShowRoleModal(false)}></button>
                      </div>
                      <form onSubmit={handleSaveRole}>
                        <div className="modal-body">
                          <div className="mb-3">
                            <label className="form-label">{t('admin.role_name')}</label>
                            <input className="form-control" name="name" value={roleForm.name} onChange={handleRoleFormChange} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">{t('admin.description')}</label>
                            <input className="form-control" name="description" value={roleForm.description} onChange={handleRoleFormChange} />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">{t('admin.permissions')}</label>
                            <div className="row">
                              {permissions.map(perm => (
                                <div className="col-md-4" key={perm.id}>
                                  <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="permissions" value={perm.id} id={`perm-${perm.id}`} checked={roleForm.permissions.includes(perm.id)} onChange={handleRoleFormChange} />
                                    <label className="form-check-label" htmlFor={`perm-${perm.id}`}>{perm.name}</label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={()=>setShowRoleModal(false)}>{t('admin.cancel')}</button>
                          <button type="submit" className="btn btn-primary">{editingRole ? t('admin.save_changes') : t('admin.add_role')}</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {currentView === 'announcements' && (
            <div className="p-4" style={{maxWidth: 700}}>
              <h5 className="mb-3">{t('admin.platform_announcements')}</h5>
              <AnnouncementManager roles={roles} />
            </div>
          )}
          {currentView === 'apiKeys' && (
            <div className="p-4" style={{maxWidth: 700}}>
              <h5 className="mb-3">{t('admin.api_key_management')}</h5>
              <ApiKeyManager />
            </div>
          )}
        </div>
      </div>

      {/* Emergency Actions Modal */}
      <EmergencyActionsModal
        show={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onLockdown={handleLockdown}
        onAlert={handleAlert}
        onPurge={handlePurge}
      />
      {/* Emergency Action Confirmation Modal */}
      {confirmAction && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:2100,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-white">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">{t('admin.confirm_action')}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCancelConfirm}></button>
              </div>
              <div className="modal-body">
                <p>{t(`admin.confirm_${confirmAction}`)}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelConfirm} disabled={loadingAction}>{t('admin.cancel')}</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmAction} disabled={loadingAction}>
                  {loadingAction ? t('admin.processing') : t('admin.confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        show={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSave={handleSaveUser}
        user={editingUser}
        loading={userModalLoading}
      />

      {/* System Activity Modal */}
      {showActivityModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:2100,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
            <div className="modal-content bg-white">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">{t('admin.system_activity_log')}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={()=>setShowActivityModal(false)}></button>
              </div>
              <div className="modal-body">
                {activityLoading ? <div>{t('admin.loading')}</div> : activityError ? <div className="text-danger">{activityError}</div> : (
                  <div className="table-responsive" style={{maxHeight: '60vh', overflowY: 'auto'}}>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>{t('admin.user')}</th>
                          <th>{t('admin.action')}</th>
                          <th>{t('admin.time')}</th>
                          <th>{t('admin.type')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activityAll.map((activity, idx) => (
                          <tr key={activity.id || idx}>
                            <td>{activity.user}</td>
                            <td>{activity.action}</td>
                            <td>{activity.time || activity.created_at}</td>
                            <td>{activity.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer justify-content-between">
                <div>
                  {t('admin.page')} {activityPage} {t('admin.of')} {Math.ceil(activityTotal / activityPerPage)}
                </div>
                <div>
                  <button className="btn btn-secondary me-2" disabled={activityPage === 1} onClick={()=>fetchAllActivity(activityPage-1)}>{t('admin.previous')}</button>
                  <button className="btn btn-secondary" disabled={activityPage >= Math.ceil(activityTotal / activityPerPage)} onClick={()=>fetchAllActivity(activityPage+1)}>{t('admin.next')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
