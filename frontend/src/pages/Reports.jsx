import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import AttendanceReport from './AttendanceReport';
import TicketsSoldReport from './TicketsSoldReport';
import CompanyListReport from './CompanyListReport';
import EventSummaryReport from './EventSummaryReport';
import RevenueReport from './RevenueReport';
import UserActivityReport from './UserActivityReport';
import EventFeedbackReport from './EventFeedbackReport';
import TopAttendeesReport from './TopAttendeesReport';
import AdminEventApprovals from './AdminEventApprovals';
import AdminUserManagement from './AdminUserManagement';

const Reports = () => {
  return (
    <div className="container py-4">
      <h1>Reports</h1>
      <nav className="mb-4">
        <Link to="attendance" className="btn btn-outline-primary me-2">Attendance Report</Link>
        <Link to="tickets" className="btn btn-outline-success me-2">Tickets Sold</Link>
        <Link to="companies" className="btn btn-outline-info me-2">Company List</Link>
        <Link to="event-summary" className="btn btn-outline-warning me-2">Event Summary</Link>
        <Link to="revenue" className="btn btn-outline-dark me-2">Revenue Report</Link>
        <Link to="user-activity" className="btn btn-outline-secondary me-2">User Activity</Link>
        <Link to="event-feedback" className="btn btn-outline-secondary me-2">Event Feedback</Link>
        <Link to="top-attendees" className="btn btn-outline-secondary me-2">Top Attendees</Link>
        <Link to="/admin/event-approvals" className="btn btn-outline-danger me-2">Event Approvals</Link>
        <Link to="/admin/user-management" className="btn btn-outline-danger">User Management</Link>
      </nav>
      <Routes>
        <Route path="attendance" element={<AttendanceReport />} />
        <Route path="tickets" element={<TicketsSoldReport />} />
        <Route path="companies" element={<CompanyListReport />} />
        <Route path="event-summary" element={<EventSummaryReport />} />
        <Route path="revenue" element={<RevenueReport />} />
        <Route path="user-activity" element={<UserActivityReport />} />
        <Route path="event-feedback" element={<EventFeedbackReport />} />
        <Route path="top-attendees" element={<TopAttendeesReport />} />
        <Route path="/admin/event-approvals" element={<AdminEventApprovals />} />
        <Route path="/admin/user-management" element={<AdminUserManagement />} />
      </Routes>
    </div>
  );
};

export default Reports;
