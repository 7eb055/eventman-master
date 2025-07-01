import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../components/css/Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search logic here
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-main">
          <div className="logo-container">
            <Link to="/" className="logo">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">Event<span>Smart</span></span>
            </Link>
            <button 
              className={`mobile-menu-button ${isMenuOpen ? 'open' : ''}`} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>          <div className={`search-container ${isMenuOpen ? 'open' : ''}`}>
            <form onSubmit={handleSearch} className="search-form">
              <div className="input-group">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="search-input"
                />
              </div>
              <div className="input-group">
                <i className="fas fa-map-marker-alt location-icon"></i>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="location-input"
                />
              </div>
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
                <span>Search</span>
              </button>
            </form>
          </div>

          <div className={`auth-buttons ${isMenuOpen ? 'open' : ''}`}>
            {!user && (
              <>
                <Link to="/sign-in" className="auth-button signin-button">
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Sign In</span>
                </Link>
                <Link to="/sign-up" className="auth-button signup-button">
                  <i className="fas fa-user-plus"></i>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
            {user && (
              <button onClick={logout} className="auth-button logout-button">
                <i className="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
