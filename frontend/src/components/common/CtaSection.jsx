import '../../components/css/CtaSection.css';

const CtaSection = ({
  title = 'Ready to create your own event?',
  description = 'Start organizing and selling tickets in minutes with our smart event platform.',
  buttonText = 'Create Event',
  buttonLink = '/create-event',
}) => (
  <section className="cta-section">
    <div className="cta-content">
      <h2 className="cta-title">{title}</h2>
      <p className="cta-description">{description}</p>
      <a href={buttonLink} className="cta-button">{buttonText}</a>
    </div>
  </section>
);

export default CtaSection;
