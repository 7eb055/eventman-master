import React from 'react';
import { useTranslation } from 'react-i18next';
import EventList from '../components/event/EventList';
import CtaSection from '../components/common/CtaSection';
import './css/HomePage.css';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">{t('home.discover_events')}</h1>
        <p className="hero-description">
          {t('home.join_thousands')}
        </p>
      </section>
      
      <div className="content-section">
        <EventList />
        <CtaSection 
          title={t('home.cta_title')}
          description={t('home.cta_description')}
          buttonText={t('home.cta_button')}
        />
      </div>
    </div>
  );
}

export default HomePage;