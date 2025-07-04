import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EventCard from './EventCard';
import Button from '../Button';
import '../../components/css/EventList.css';
import { getEvents } from '../../services/api';

const EventList = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchEvents = async (pageNum, filterValue = filter) => {
    setLoading(true);
    try {
      // Pass filter to getEvents API
      const data = await getEvents(pageNum, filterValue);
      setEvents(prev => pageNum === 1 ? data.events : [...prev, ...data.events]);
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Falling back to mock data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(1, filter);
    // eslint-disable-next-line
  }, [filter]);

  const handleFilter = (newFilter) => {
    setFilter(newFilter);
    fetchEvents(1, newFilter);
  };

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h1 className="event-list-title">{t('event_list.title')}</h1>
        <p className="event-list-subtitle">{t('event_list.subtitle')}</p>
        
        <div className="event-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilter('all')}
          >
            {t('event_list.filters.all')}
          </button>
          <button 
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => handleFilter('today')}
          >
            {t('event_list.filters.today')}
          </button>
          <button 
            className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
            onClick={() => handleFilter('week')}
          >
            {t('event_list.filters.week')}
          </button>
          <button 
            className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
            onClick={() => handleFilter('month')}
          >
            {t('event_list.filters.month')}
          </button>
        </div>
      </div>

      <div className="event-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{t('event_list.loading')}</p>
        </div>
      )}

      {hasMore && !loading && (
        <div className="load-more">
          <Button 
            onClick={() => fetchEvents(page + 1)} 
            variant="outline"
            className="load-more-btn"
          >
            {t('event_list.show_more')}
            <i className="fas fa-arrow-down"></i>
          </Button>
        </div>
      )}

      {!hasMore && (
        <div className="no-more-events">
          <div className="divider-line"></div>
          <p>{t('event_list.no_more')}</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error.message || t('event_list.error')}</p>
          <Button onClick={() => fetchEvents(1)}>{t('common.try_again')}</Button>
        </div>
      )}
    </div>
  );
};

export default EventList;
