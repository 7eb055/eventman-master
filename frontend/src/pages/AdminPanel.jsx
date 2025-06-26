import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminPanel = () => {
  // System statistics
  const stats = {
    totalUsers: 2847,
    totalEvents: 156,
    totalRevenue: "$125,430",
    activeEvents: 24,
    pendingApprovals: 12,
    supportTickets: 8
  };

  // Platform usage data
  const platformData = [
    { month: 'Jan', users: 1200, events: 45, revenue: 15500 },
    { month: 'Feb', users: 1350, events: 52, revenue: 18200 },
    { month: 'Mar', users: 1580, events: 38, revenue: 14800 },
    { month: 'Apr', users: 1740, events: 64, revenue: 22500 },
    { month: 'May', users: 1950, events: 71, revenue: 26200 },
    { month: 'Jun', users: 2240, events: 58, revenue: 21800 },
    { month: 'Jul', users: 2450, events: 82, revenue: 31200 },
    { month: 'Aug', users: 2680, events: 76, revenue: 28600 },
    { month: 'Sep', users: 2520, events: 69, revenue: 24800 },
    { month: 'Oct', users: 2750, events: 85, revenue: 33500 },
    { month: 'Nov', users: 2840, events: 78, revenue: 29200 },
    { month: 'Dec', users: 2847, events: 92, revenue: 35400 }
  ];

  // User role distribution
  const userRoleData = [
    { name: 'Attendees', value: 2245, color: '#4e73df' },
    { name: 'Organizers', value: 387, color: '#1cc88a' },
    { name: 'Companies', value: 158, color: '#36b9cc' },
    { name: 'Admins', value: 57, color: '#f6c23e' }
  ];

  // Recent system activity
  const [systemActivity] = useState([
    { id: 1, user: "System", action: "Database backup completed", time: "5 min ago", type: "system" },
    { id: 2, user: "Admin", action: "Approved event: Tech Conference 2024", time: "12 min ago", type: "approval" },
    { id: 3, user: "Security", action: "Failed login attempts blocked", time: "18 min ago", type: "security" },
    { id: 4, user: "System", action: "Payment processing resumed", time: "25 min ago", type: "system" },
    { id: 5, user: "Admin", action: "User account suspended: suspicious activity", time: "1 hour ago", type: "security" },
    { id: 6, user: "System", action: "Email notification sent: 1,245 users", time: "2 hours ago", type: "system" },
    { id: 7, user: "Admin", action: "New company registered: TechCorp Ltd", time: "3 hours ago", type: "approval" }
  ]);

  // Pending approvals
  const [pendingApprovals] = useState([
    { id: 1, type: "Event", name: "AI Summit 2024", requestor: "TechCorp", date: "2024-01-15", priority: "High" },
    { id: 2, type: "Company", name: "EventPro Solutions", requestor: "John Smith", date: "2024-01-14", priority: "Medium" },
    { id: 3, type: "Event", name: "Music Festival Summer", requestor: "Entertainment Plus", date: "2024-01-13", priority: "High" },
    { id: 4, type: "Refund", name: "Ticket refund request", requestor: "Jane Doe", date: "2024-01-12", priority: "Low" },
    { id: 5, type: "Event", name: "Business Workshop Series", requestor: "EduEvents", date: "2024-01-11", priority: "Medium" }
  ]);

  // System users management
  const [systemUsers] = useState([
    { id: 1, name: "Sarah Johnson", email: "sarah@eventman.com", role: "Super Admin", lastActive: "Online", status: "Active", joinDate: "2023-01-15" },
    { id: 2, name: "Michael Chen", email: "michael@eventman.com", role: "Admin", lastActive: "2 hours ago", status: "Active", joinDate: "2023-03-22" },
    { id: 3, name: "Emily Rodriguez", email: "emily@eventman.com", role: "Moderator", lastActive: "Yesterday", status: "Active", joinDate: "2023-05-10" },
    { id: 4, name: "David Kim", email: "david@eventman.com", role: "Support", lastActive: "Today", status: "Active", joinDate: "2023-07-18" },
    { id: 5, name: "Lisa Wang", email: "lisa@eventman.com", role: "Admin", lastActive: "3 days ago", status: "Inactive", joinDate: "2023-02-05" }
  ]);

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
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.totalUsers.toLocaleString()}</div>
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
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.totalRevenue}</div>
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
                  <i className="fas fa-clock fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-2 col-md-4 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-danger text-uppercase mb-1">Pending Approvals</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.pendingApprovals}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
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
                  <div className="text-xs fw-bold text-secondary text-uppercase mb-1">Support Tickets</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{stats.supportTickets}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-life-ring fa-2x text-gray-300"></i>
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
