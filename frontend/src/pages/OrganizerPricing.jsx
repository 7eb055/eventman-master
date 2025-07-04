import { useTranslation } from 'react-i18next';

const Pricing = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h1>{t('organizer_pricing.title')}</h1>
      <div className="pricing-tier">
        <h2>{t('organizer_pricing.basic_tier')}</h2>
        <ul>
          <li>{t('organizer_pricing.basic_attendees')}</li>
          <li>{t('organizer_pricing.basic_support')}</li>
        </ul>
      </div>
      <div className="pricing-tier">
        <h2>{t('organizer_pricing.pro_tier')}</h2>
        <ul>
          <li>{t('organizer_pricing.pro_attendees')}</li>
          <li>{t('organizer_pricing.pro_support')}</li>
          <li>{t('organizer_pricing.pro_analytics')}</li>
        </ul>
      </div>
    </div>
  );
};

export default Pricing;