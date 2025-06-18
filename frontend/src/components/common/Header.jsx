import React from 'react';
import { Link } from 'react-router-dom';
import '../../components/css/Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
          </div>

          <div className={`search-container ${isMenuOpen ? 'open' : ''}`}>
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
        </div>
      </div>
    </header>
  );
};

export default Header;
