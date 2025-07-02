import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '../services/api';

const AdminPanel = () => {
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
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">Total Users</div>
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
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">Total Events</div>
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
                  <div className="text-xs fw-bold text-info text-uppercase mb-1">Total Revenue</div>
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
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1">Active Events</div>
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
                  <div className="text-xs fw-bold text-secondary text-uppercase mb-1">Pending Approvals</div>
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
                  <div className="text-xs fw-bold text-dark text-uppercase mb-1">Support Tickets</div>
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
              <h6 className="m-0 fw-bold text-primary">Platform Growth Overview</h6>
            </div>
            <div className="card-body">
              <div className="chart-area" style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={platformData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#4e73df" strokeWidth={3} name="Users" />
                    <Line type="monotone" dataKey="events" stroke="#1cc88a" strokeWidth={3} name="Events" />
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
              <h6 className="m-0 fw-bold text-primary">User Distribution</h6>
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
              <h6 className="m-0 fw-bold text-primary">Recent System Activity</h6>
              <button className="btn btn-sm btn-outline-primary">View All</button>
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
              <h6 className="m-0 fw-bold text-primary">Pending Approvals</h6>
              <button className="btn btn-sm btn-outline-primary">Manage All</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Priority</th>
                      <th>Actions</th>
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
            <h6 className="m-0 fw-bold text-primary">System User Management</h6>
            <button className="btn btn-sm btn-primary">
              <i className="fas fa-plus me-1"></i> Add Admin User
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Actions</th>
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
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
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

  // Example: Replace hardcoded data in renderDashboardView and other render methods
  // (You may need to update the props/data passed to each chart/table component)

  // Example: Platform Usage Bar Chart (Users, Events, Revenue by Month)
  const renderPlatformUsageChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={platformData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="users" fill="#4e73df" name="Users" />
        <Bar dataKey="events" fill="#1cc88a" name="Events" />
        <Bar dataKey="revenue" fill="#f6c23e" name="Revenue" />
      </BarChart>
    </ResponsiveContainer>
  );

  // Example: User Role Distribution Pie Chart
  const renderUserRolePieChart = () => (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={userRoleData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {userRoleData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  // Example: System Activity Table
  const renderSystemActivityTable = () => (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>User</th>
          <th>Action</th>
          <th>Time</th>
          <th>Type</th>
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
          <th>Name</th>
          <th>Type</th>
          <th>Requestor</th>
          <th>Date</th>
          <th>Status/Priority</th>
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
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Join Date</th>
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

  // Example usage in your main render or dashboard view:
  // Place these where you want the charts/tables to appear
  // {renderPlatformUsageChart()}
  // {renderUserRolePieChart()}
  // {renderSystemActivityTable()}
  // {renderPendingApprovalsTable()}
  // {renderSystemUsersTable()}

  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!stats) return null;

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 mb-0 text-gray-800">System Administration</h1>
          <p className="text-muted mb-0">Manage platform operations, users, and system settings</p>
        </div>
        <div className="d-flex">
          <button className="btn btn-sm btn-outline-primary me-2">
            <i className="fas fa-download fa-sm me-1"></i> System Report
          </button>
          <button className="btn btn-sm btn-danger">
            <i className="fas fa-exclamation-triangle fa-sm me-1"></i> Emergency Actions
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
                <i className="fas fa-tachometer-alt me-1"></i> Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'users' ? 'active' : ''}`}
                onClick={() => setCurrentView('users')}
              >
                <i className="fas fa-users-cog me-1"></i> User Management
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'events' ? 'active' : ''}`}
                onClick={() => setCurrentView('events')}
              >
                <i className="fas fa-calendar-check me-1"></i> Event Oversight
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'analytics' ? 'active' : ''}`}
                onClick={() => setCurrentView('analytics')}
              >
                <i className="fas fa-chart-line me-1"></i> Analytics
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${currentView === 'settings' ? 'active' : ''}`}
                onClick={() => setCurrentView('settings')}
              >
                <i className="fas fa-cogs me-1"></i> System Settings
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body p-0">
          {currentView === 'dashboard' && renderDashboardView()}
          {currentView === 'users' && renderUserManagement()}
          {currentView === 'events' && (
            <div className="p-4 text-center">
              <i className="fas fa-calendar-check fa-3x text-muted mb-3"></i>
              <h5>Event Oversight</h5>
              <p className="text-muted">Monitor and manage all events across the platform</p>
            </div>
          )}
          {currentView === 'analytics' && (
            <div className="p-4 text-center">
              <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
              <h5>Advanced Analytics</h5>
              <p className="text-muted">Detailed platform analytics and reporting tools</p>
            </div>
          )}
          {currentView === 'settings' && (
            <div className="p-4 text-center">
              <i className="fas fa-cogs fa-3x text-muted mb-3"></i>
              <h5>System Settings</h5>
              <p className="text-muted">Configure platform settings and preferences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
