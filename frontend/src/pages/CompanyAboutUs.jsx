import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaCalendarAlt, FaGlobe, FaLightbulb, FaHandshake, FaChartLine } from 'react-icons/fa';

const AboutUs = () => {
  const { t } = useTranslation();

  // Team members data
  const teamMembers = [
    { id: 1, name: t('about.team.sarah'), role: t('about.team.ceo'), bio: t('about.team.sarah_bio'), imgClass: 'bg-ceo' },
    { id: 2, name: t('about.team.michael'), role: t('about.team.cto'), bio: t('about.team.michael_bio'), imgClass: 'bg-cto' },
    { id: 3, name: t('about.team.emma'), role: t('about.team.marketing'), bio: t('about.team.emma_bio'), imgClass: 'bg-marketing' },
    { id: 4, name: t('about.team.david'), role: t('about.team.cs'), bio: t('about.team.david_bio'), imgClass: 'bg-cs' }
  ];

  // Statistics data
  const stats = [
    { value: '250K+', label: t('about.stats.events'), icon: <FaCalendarAlt className="display-3" /> },
    { value: '8M+', label: t('about.stats.tickets'), icon: <FaUsers className="display-3" /> },
    { value: '120+', label: t('about.stats.countries'), icon: <FaGlobe className="display-3" /> },
    { value: '98.7%', label: t('about.stats.satisfaction'), icon: <FaHandshake className="display-3" /> }
  ];

  // Values data
  const values = [
    { icon: <FaLightbulb />, title: t('about.values.innovation'), desc: t('about.values.innovation_desc') },
    { icon: <FaUsers />, title: t('about.values.customer'), desc: t('about.values.customer_desc') },
    { icon: <FaHandshake />, title: t('about.values.integrity'), desc: t('about.values.integrity_desc') },
    { icon: <FaChartLine />, title: t('about.values.excellence'), desc: t('about.values.excellence_desc') }
  ];

  // Timeline data
  const timeline = [
    { year: '2015', title: t('about.timeline.founded'), desc: t('about.timeline.founded_desc') },
    { year: '2017', title: t('about.timeline.platform'), desc: t('about.timeline.platform_desc') },
    { year: '2019', title: t('about.timeline.expansion'), desc: t('about.timeline.expansion_desc') },
    { year: '2021', title: t('about.timeline.mobile'), desc: t('about.timeline.mobile_desc') },
    { year: '2023', title: t('about.timeline.ai'), desc: t('about.timeline.ai_desc') }
  ];

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="hero-section bg-dark text-white position-relative overflow-hidden">
        <div className="container py-8 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">
                {t('about.hero.title')} <span className="text-primary">{t('about.hero.highlight')}</span>
              </h1>
              <p className="lead mb-5">
                {t('about.hero.desc')}
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-bold">
                  {t('about.hero.cta')}
                </button>
                <button className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill fw-bold">
                  {t('about.hero.contact')}
                </button>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-lg">
                <div className="bg-primary d-flex align-items-center justify-content-center">
                  <div className="p-4 text-center">
                    <div className="display-1 text-white mb-3"><FaCalendarAlt /></div>
                    <h2 className="text-white">{t('about.hero.platform')}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute top-0 end-0 w-100 h-100 z-1">
          <div className="circles">
            {[...Array(12)].map((_, i) => <div key={i} className="circle"></div>)}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-7 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center mb-6">
              <h2 className="display-5 fw-bold mb-3">{t('about.mission_vision.title')}</h2>
              <div className="divider mx-auto bg-primary"></div>
            </div>
          </div>
          
          <div className="row g-5">
            <div className="col-md-6">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-body p-5">
                  <div className="icon-box bg-primary text-white mb-4">
                    <FaGlobe className="display-5" />
                  </div>
                  <h3 className="h2 fw-bold mb-3">{t('about.mission_vision.mission')}</h3>
                  <p className="fs-5 mb-0">
                    {t('about.mission_vision.mission_desc')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card border-0 shadow-lg h-100">
                <div className="card-body p-5">
                  <div className="icon-box bg-info text-white mb-4">
                    <FaLightbulb className="display-5" />
                  </div>
                  <h3 className="h2 fw-bold mb-3">{t('about.mission_vision.vision')}</h3>
                  <p className="fs-5 mb-0">
                    {t('about.mission_vision.vision_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-7 bg-primary-dark text-white">
        <div className="container">
          <div className="row justify-content-center mb-6">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-3">{t('about.stats.title')}</h2>
              <p className="lead">{t('about.stats.desc')}</p>
              <div className="divider mx-auto bg-white"></div>
            </div>
          </div>
          
          <div className="row g-5">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-sm-6">
                <div className="text-center">
                  <div className="text-warning mb-3">{stat.icon}</div>
                  <h3 className="display-4 fw-bold">{stat.value}</h3>
                  <p className="h5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-7">
        <div className="container">
          <div className="row justify-content-center mb-6">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-3">{t('about.values.title')}</h2>
              <p className="lead">{t('about.values.desc')}</p>
              <div className="divider mx-auto bg-primary"></div>
            </div>
          </div>
          
          <div className="row g-5">
            {values.map((value, index) => (
              <div key={index} className="col-md-3 col-sm-6">
                <div className="card border-0 h-100 text-center">
                  <div className="card-body p-4">
                    <div className="icon-box-md bg-light-primary text-primary mb-4 mx-auto">
                      {value.icon}
                    </div>
                    <h4 className="fw-bold mb-3">{value.title}</h4>
                    <p>{value.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-7 bg-light">
        <div className="container">
          <div className="row justify-content-center mb-6">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-3">{t('about.team.title')}</h2>
              <p className="lead">{t('about.team.desc')}</p>
              <div className="divider mx-auto bg-primary"></div>
            </div>
          </div>
          
          <div className="row g-5">
            {teamMembers.map(member => (
              <div key={member.id} className="col-md-3 col-sm-6">
                <div className="card border-0 shadow-sm h-100 overflow-hidden">
                  <div className={`team-img ${member.imgClass} d-flex align-items-end justify-content-center`}>
                    <div className="bg-white p-2 rounded-circle mb-n4 position-relative z-2">
                      <div className="bg-light rounded-circle" style={{width: '80px', height: '80px'}}></div>
                    </div>
                  </div>
                  <div className="card-body text-center pt-6 px-4 pb-4">
                    <h5 className="fw-bold mb-1">{member.name}</h5>
                    <p className="text-primary fw-bold">{member.role}</p>
                    <p className="mb-0">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-7">
        <div className="container">
          <div className="row justify-content-center mb-6">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-3">{t('about.timeline.title')}</h2>
              <p className="lead">{t('about.timeline.desc')}</p>
              <div className="divider mx-auto bg-primary"></div>
            </div>
          </div>
          
          <div className="timeline-wrapper position-relative">
            <div className="timeline-line position-absolute top-0 start-50 translate-middle-x h-100 bg-primary"></div>
            
            <div className="row g-5 position-relative">
              {timeline.map((item, index) => (
                <div key={index} className={`col-md-6 ${index % 2 === 0 ? '' : 'offset-md-6'}`}>
                  <div className={`timeline-card card ${index % 2 === 0 ? 'left' : 'right'} border-0 shadow-sm`}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="year-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                          {item.year}
                        </div>
                        <h5 className="ms-3 mb-0 fw-bold">{item.title}</h5>
                      </div>
                      <p className="mb-0">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-7 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-5 mb-lg-0">
              <h2 className="display-5 fw-bold mb-3">{t('about.cta.title')}</h2>
              <p className="lead mb-0">{t('about.cta.desc')}</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <button className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold">
                {t('about.cta.button')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-us-page {
          overflow-x: hidden;
        }
        
        .hero-section {
          padding-top: 7rem;
          padding-bottom: 7rem;
          background: linear-gradient(135deg, #1a2a6c, #2a4365, #0d1b2a);
        }
        
        .divider {
          width: 80px;
          height: 4px;
          border-radius: 2px;
        }
        
        .icon-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 20px;
        }
        
        .icon-box-md {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 15px;
        }
        
        .team-img {
          height: 200px;
          position: relative;
        }
        
        .bg-ceo {
          background: linear-gradient(45deg, #ff9a9e, #fad0c4);
        }
        
        .bg-cto {
          background: linear-gradient(45deg, #a1c4fd, #c2e9fb);
        }
        
        .bg-marketing {
          background: linear-gradient(45deg, #ffecd2, #fcb69f);
        }
        
        .bg-cs {
          background: linear-gradient(45deg, #84fab0, #8fd3f4);
        }
        
        .year-badge {
          width: 70px;
          height: 70px;
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .timeline-card {
          position: relative;
          z-index: 2;
        }
        
        .timeline-card.left:before {
          content: '';
          position: absolute;
          top: 40px;
          right: -15px;
          width: 0;
          height: 0;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          border-left: 15px solid white;
          z-index: 1;
        }
        
        .timeline-card.right:before {
          content: '';
          position: absolute;
          top: 40px;
          left: -15px;
          width: 0;
          height: 0;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          border-right: 15px solid white;
          z-index: 1;
        }
        
        .timeline-line {
          width: 4px;
          z-index: 1;
        }
        
        .circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .circles .circle {
          position: absolute;
          display: block;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: animate 25s linear infinite;
          bottom: -150px;
        }
        
        .circles .circle:nth-child(1) {
          width: 80px;
          height: 80px;
          left: 5%;
          animation-delay: 0s;
        }
        
        .circles .circle:nth-child(2) {
          width: 120px;
          height: 120px;
          left: 10%;
          animation-delay: 2s;
          animation-duration: 12s;
        }
        
        .circles .circle:nth-child(3) {
          width: 60px;
          height: 60px;
          left: 20%;
          animation-delay: 4s;
        }
        
        .circles .circle:nth-child(4) {
          width: 100px;
          height: 100px;
          left: 30%;
          animation-delay: 0s;
          animation-duration: 18s;
        }
        
        .circles .circle:nth-child(5) {
          width: 70px;
          height: 70px;
          left: 40%;
          animation-delay: 0s;
        }
        
        .circles .circle:nth-child(6) {
          width: 90px;
          height: 90px;
          left: 50%;
          animation-delay: 3s;
        }
        
        .circles .circle:nth-child(7) {
          width: 110px;
          height: 110px;
          left: 60%;
          animation-delay: 7s;
        }
        
        .circles .circle:nth-child(8) {
          width: 65px;
          height: 65px;
          left: 70%;
          animation-delay: 15s;
          animation-duration: 30s;
        }
        
        .circles .circle:nth-child(9) {
          width: 85px;
          height: 85px;
          left: 80%;
          animation-delay: 2s;
          animation-duration: 17s;
        }
        
        .circles .circle:nth-child(10) {
          width: 95px;
          height: 95px;
          left: 90%;
          animation-delay: 0s;
          animation-duration: 20s;
        }
        
        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
          }
        }
        
        .bg-primary-dark {
          background: linear-gradient(135deg, #0d1b2a, #1b3a4b);
        }
        
        .py-7 {
          padding-top: 7rem;
          padding-bottom: 7rem;
        }
        
        .py-8 {
          padding-top: 8rem;
          padding-bottom: 8rem;
        }
        
        .mb-6 {
          margin-bottom: 6rem;
        }
        
        .pt-6 {
          padding-top: 6rem;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;