import '../../components/css/CtaSection.css';
import { useTranslation } from 'react-i18next';

const CtaSection = ({
  title,
  description,
  buttonText,
  buttonLink = '/create-event',
}) => {
  const { t } = useTranslation();
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">{title || t('home.cta_title')}</h2>
        <p className="cta-description">{description || t('home.cta_description')}</p>
        <a href={buttonLink} className="cta-button">{buttonText || t('home.cta_button')}</a>
      </div>
    </section>
  );
};

export default CtaSection;
