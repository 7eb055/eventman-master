import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/Home';
import EventDetailPage from './pages/EventDetail';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TestApi from './components/TestApi';
import ApiConnectionTest from './components/ApiConnectionTest';
import ApiTestPage from './pages/ApiTestPage';
import BrowseEvents from './pages/BrowseEvents';
import CreateEvent from './pages/CreateEvents';
import GetTicket from './pages/GetTicket';
import TicketPurchase from './pages/TicketPurchase';
import AttendeeDashboard from './pages/AttendeeDashboard';
import Profile from './pages/Profile';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminPanel from './pages/AdminPanel';
import HelpPage from './pages/HelpPage';
import AboutUs from './pages/CompanyAboutUs';
import ContactUs from './pages/CompanyContactUs';
import ProtectedRoute from './components/common/ProtectedRoute';
import EditEvent from './pages/EditEvent';
import AnnouncementsBanner from './components/common/AnnouncementsBanner';

function App() {
  return (
    <Router>
      <Header />
      <AnnouncementsBanner />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/browse-events" element={<BrowseEvents />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/test-api" element={<TestApi />} />
          <Route path="/api-test" element={<ApiConnectionTest />} />
          <Route path="/api-diagnostics" element={<ApiTestPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Attendee Routes */}
          <Route path="/get-ticket" element={<ProtectedRoute roles={['attendee']}><GetTicket /></ProtectedRoute>} />
          <Route path="/ticket-purchase" element={<ProtectedRoute roles={['attendee']}><TicketPurchase /></ProtectedRoute>} />
          <Route path="/attendee-dashboard" element={<ProtectedRoute roles={['attendee']}><AttendeeDashboard /></ProtectedRoute>} />

          {/* Organizer Routes */}
          <Route path="/create-event" element={<ProtectedRoute roles={['organizer']}><CreateEvent /></ProtectedRoute>} />
          <Route path="/organizer-dashboard" element={<ProtectedRoute roles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/organizer-dashboard/events" element={<ProtectedRoute roles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/organizer-dashboard/reviews" element={<ProtectedRoute roles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/organizer-dashboard/pricing" element={<ProtectedRoute roles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/company-dashboard" element={<ProtectedRoute roles={['organizer']}><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company-dashboard/events" element={<ProtectedRoute roles={['organizer']}><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company-dashboard/analytics" element={<ProtectedRoute roles={['organizer']}><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company-dashboard/settings" element={<ProtectedRoute roles={['organizer']}><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/edit-event/:id" element={<ProtectedRoute roles={['organizer']}><EditEvent /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin-panel" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin-panel/dashboard" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin-panel/users" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin-panel/events" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin-panel/analytics" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin-panel/settings" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />

          {/* Shared Authenticated Routes */}
          <Route path="/profile" element={<ProtectedRoute roles={['attendee','organizer','admin']}><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;