import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HelpPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const helpCategories = [
    {
      id: 'getting-started',
      title: t('help.categories.getting_started'),
      icon: 'fas fa-play-circle',
      description: t('help.categories.getting_started_desc')
    },
    {
      id: 'events',
      title: t('help.categories.events'),
      icon: 'fas fa-calendar-alt',
      description: t('help.categories.events_desc')
    },
    {
      id: 'tickets',
      title: t('help.categories.tickets'),
      icon: 'fas fa-ticket-alt',
      description: t('help.categories.tickets_desc')
    },
    {
      id: 'account',
      title: t('help.categories.account'),
      icon: 'fas fa-user-cog',
      description: t('help.categories.account_desc')
    },
    {
      id: 'organizer',
      title: t('help.categories.organizer'),
      icon: 'fas fa-users-cog',
      description: t('help.categories.organizer_desc')
    },
    {
      id: 'troubleshooting',
      title: t('help.categories.troubleshooting'),
      icon: 'fas fa-tools',
      description: t('help.categories.troubleshooting_desc')
    },
    {
      id: 'billing',
      title: t('help.categories.billing'),
      icon: 'fas fa-credit-card',
      description: t('help.categories.billing_desc')
    },
    {
      id: 'technical',
      title: t('help.categories.technical'),
      icon: 'fas fa-headset',
      description: t('help.categories.technical_desc')
    }
  ];

  const helpContent = {
    'getting-started': {
      title: 'Getting Started with EventMan',
      articles: [
        {
          title: 'Welcome to EventMan',
          content: `
            <h5>What is EventMan?</h5>
            <p>EventMan is Ghana's premier event management platform that connects event organizers with attendees. Whether you're planning a conference, concert, workshop, or any other gathering, EventMan provides all the tools you need to create, promote, and manage successful events.</p>
            
            <h5>Key Features:</h5>
            <ul>
              <li><strong>Event Creation:</strong> Easy-to-use tools for creating and customizing events</li>
              <li><strong>Ticket Sales:</strong> Secure payment processing with mobile money support</li>
              <li><strong>Attendee Management:</strong> Track registrations and manage participant lists</li>
              <li><strong>Analytics:</strong> Detailed insights into your event performance</li>
              <li><strong>Mobile-Friendly:</strong> Access from any device, anywhere</li>
            </ul>
          `
        },
        {
          title: 'Creating Your First Account',
          content: `
            <h5>Sign Up Process:</h5>
            <ol>
              <li>Click the "Sign Up" button in the top right corner</li>
              <li>Choose your account type:
                <ul>
                  <li><strong>Attendee:</strong> For discovering and attending events</li>
                  <li><strong>Organizer:</strong> For creating and managing events</li>
                  <li><strong>Company:</strong> For businesses hosting multiple events</li>
                </ul>
              </li>
              <li>Fill in your details and verify your email</li>
              <li>Complete your profile to get personalized recommendations</li>
            </ol>
            
            <div class="alert alert-info">
              <i class="fas fa-lightbulb me-2"></i>
              <strong>Tip:</strong> You can upgrade your account type later if your needs change.
            </div>
          `
        },
        {
          title: 'Navigating the Platform',
          content: `
            <h5>Main Navigation:</h5>
            <ul>
              <li><strong>Home:</strong> Discover trending and recommended events</li>
              <li><strong>Browse Events:</strong> Search and filter all available events</li>
              <li><strong>Create Event:</strong> Start creating your own event (organizers only)</li>
              <li><strong>Dashboard:</strong> Manage your events, tickets, and account</li>
              <li><strong>Profile:</strong> Update your personal information and preferences</li>
            </ul>
            
            <h5>Quick Actions:</h5>
            <p>Look for these common actions throughout the platform:</p>
            <ul>
              <li><i class="fas fa-search text-primary"></i> Search for specific events or content</li>
              <li><i class="fas fa-heart text-danger"></i> Save events to your favorites</li>
              <li><i class="fas fa-share text-info"></i> Share events with friends</li>
              <li><i class="fas fa-calendar-plus text-success"></i> Add events to your calendar</li>
            </ul>
          `
        }
      ]
    },
    'events': {
      title: 'Managing Events',
      articles: [
        {
          title: 'Creating an Event',
          content: `
            <h5>Step-by-Step Guide:</h5>
            <ol>
              <li><strong>Basic Information:</strong>
                <ul>
                  <li>Event title and description</li>
                  <li>Date, time, and duration</li>
                  <li>Location (physical or virtual)</li>
                  <li>Category and tags</li>
                </ul>
              </li>
              <li><strong>Event Details:</strong>
                <ul>
                  <li>Upload event images or videos</li>
                  <li>Set capacity limits</li>
                  <li>Add agenda or schedule</li>
                  <li>Include speaker information</li>
                </ul>
              </li>
              <li><strong>Ticketing Setup:</strong>
                <ul>
                  <li>Define ticket types (free, paid, VIP)</li>
                  <li>Set pricing and availability</li>
                  <li>Configure early bird discounts</li>
                  <li>Set up group pricing</li>
                </ul>
              </li>
              <li><strong>Publishing:</strong>
                <ul>
                  <li>Preview your event page</li>
                  <li>Set visibility (public/private)</li>
                  <li>Schedule publication date</li>
                  <li>Launch your event</li>
                </ul>
              </li>
            </ol>
          `
        },
        {
          title: 'Event Promotion Tips',
          content: `
            <h5>Maximize Your Event's Reach:</h5>
            <ul>
              <li><strong>Compelling Title:</strong> Use action words and be specific about benefits</li>
              <li><strong>High-Quality Images:</strong> Upload professional photos that represent your event</li>
              <li><strong>Detailed Description:</strong> Include what, when, where, who, and why</li>
              <li><strong>Early Bird Pricing:</strong> Encourage early registrations with discounts</li>
              <li><strong>Social Sharing:</strong> Use the built-in sharing tools</li>
              <li><strong>Regular Updates:</strong> Keep your event page fresh with updates</li>
            </ul>
            
            <div class="alert alert-success">
              <i class="fas fa-chart-line me-2"></i>
              <strong>Pro Tip:</strong> Events with complete profiles get 3x more registrations than basic listings.
            </div>
          `
        },
        {
          title: 'Managing Registrations',
          content: `
            <h5>Registration Management:</h5>
            <ul>
              <li><strong>Real-time Tracking:</strong> Monitor registrations as they happen</li>
              <li><strong>Attendee Communication:</strong> Send updates and reminders</li>
              <li><strong>Check-in System:</strong> Digital check-in for event day</li>
              <li><strong>Waitlist Management:</strong> Handle overflow registrations</li>
              <li><strong>Refund Processing:</strong> Manage cancellations and refunds</li>
            </ul>
            
            <h5>Export Options:</h5>
            <p>Download attendee lists in various formats:</p>
            <ul>
              <li>CSV for spreadsheet analysis</li>
              <li>PDF for printing</li>
              <li>Excel for detailed reporting</li>
            </ul>
          `
        }
      ]
    },
    'tickets': {
      title: 'Tickets & Payments',
      articles: [
        {
          title: 'Buying Tickets',
          content: `
            <h5>Purchase Process:</h5>
            <ol>
              <li><strong>Find Your Event:</strong> Browse or search for events</li>
              <li><strong>Select Tickets:</strong> Choose ticket type and quantity</li>
              <li><strong>Enter Information:</strong> Provide attendee details</li>
              <li><strong>Choose Payment:</strong> Select from available payment methods</li>
              <li><strong>Complete Purchase:</strong> Receive confirmation and tickets</li>
            </ol>
            
            <h5>Payment Methods:</h5>
            <div class="row">
              <div class="col-md-6">
                <h6><i class="fas fa-credit-card text-primary me-2"></i>Credit/Debit Cards</h6>
                <ul>
                  <li>Visa and Mastercard accepted</li>
                  <li>Secure SSL encryption</li>
                  <li>Instant confirmation</li>
                </ul>
              </div>
              <div class="col-md-6">
                <h6><i class="fas fa-mobile-alt text-success me-2"></i>Mobile Money</h6>
                <ul>
                  <li>MTN Mobile Money</li>
                  <li>Vodafone Cash</li>
                  <li>AirtelTigo Money</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          title: 'Digital Tickets',
          content: `
            <h5>Your Digital Tickets:</h5>
            <ul>
              <li><strong>Email Delivery:</strong> Tickets sent to your email immediately</li>
              <li><strong>QR Code:</strong> Each ticket has a unique QR code for entry</li>
              <li><strong>Mobile Access:</strong> View tickets on your phone anytime</li>
              <li><strong>Print Option:</strong> Download PDF version for printing</li>
              <li><strong>Transfer Feature:</strong> Send tickets to other attendees</li>
            </ul>
            
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>Important:</strong> Keep your tickets safe and don't share screenshots publicly to prevent fraud.
            </div>
          `
        },
        {
          title: 'Refund Policy',
          content: `
            <h5>Refund Guidelines:</h5>
            <ul>
              <li><strong>Event Cancellation:</strong> Full refund if event is cancelled by organizer</li>
              <li><strong>Event Postponement:</strong> Choose between refund or transfer to new date</li>
              <li><strong>Voluntary Cancellation:</strong> Subject to event organizer's policy</li>
              <li><strong>Processing Time:</strong> 5-10 business days for approved refunds</li>
            </ul>
            
            <h5>How to Request a Refund:</h5>
            <ol>
              <li>Go to your dashboard and find the event</li>
              <li>Click "Request Refund" button</li>
              <li>Fill out the refund form with reason</li>
              <li>Submit supporting documents if required</li>
              <li>Wait for approval notification</li>
            </ol>
          `
        }
      ]
    },
    'account': {
      title: 'Account & Profile Management',
      articles: [
        {
          title: 'Profile Settings',
          content: `
            <h5>Personal Information:</h5>
            <ul>
              <li><strong>Basic Details:</strong> Name, email, phone number</li>
              <li><strong>Profile Picture:</strong> Upload a professional photo</li>
              <li><strong>Bio/Description:</strong> Tell others about yourself</li>
              <li><strong>Location:</strong> Set your city and region</li>
              <li><strong>Interests:</strong> Select event categories you enjoy</li>
            </ul>
            
            <h5>Privacy Settings:</h5>
            <ul>
              <li>Control who can see your profile</li>
              <li>Manage event attendance visibility</li>
              <li>Set communication preferences</li>
              <li>Configure notification settings</li>
            </ul>
          `
        },
        {
          title: 'Notification Preferences',
          content: `
            <h5>Email Notifications:</h5>
            <ul>
              <li><strong>Event Reminders:</strong> Get notified about upcoming events</li>
              <li><strong>New Events:</strong> Discover events matching your interests</li>
              <li><strong>Ticket Updates:</strong> Important ticket and payment information</li>
              <li><strong>Marketing:</strong> Promotional offers and platform updates</li>
            </ul>
            
            <h5>SMS Notifications:</h5>
            <ul>
              <li>Event day reminders</li>
              <li>Last-minute event changes</li>
              <li>Payment confirmations</li>
              <li>Security alerts</li>
            </ul>
            
            <div class="alert alert-info">
              <i class="fas fa-bell me-2"></i>
              <strong>Tip:</strong> Customize notifications to stay informed without being overwhelmed.
            </div>
          `
        }
      ]
    },
    'organizer': {
      title: 'For Event Organizers',
      articles: [
        {
          title: 'Organizer Dashboard',
          content: `
            <h5>Dashboard Overview:</h5>
            <ul>
              <li><strong>Event Analytics:</strong> Track registrations, revenue, and engagement</li>
              <li><strong>Quick Actions:</strong> Create events, manage tickets, communicate with attendees</li>
              <li><strong>Calendar View:</strong> See all your events in one place</li>
              <li><strong>Performance Metrics:</strong> Understand what works best</li>
            </ul>
            
            <h5>Key Metrics to Monitor:</h5>
            <ul>
              <li>Registration conversion rates</li>
              <li>Revenue per event</li>
              <li>Attendee satisfaction scores</li>
              <li>Social media engagement</li>
              <li>Repeat attendee percentage</li>
            </ul>
          `
        },
        {
          title: 'Best Practices',
          content: `
            <h5>Event Planning Tips:</h5>
            <ul>
              <li><strong>Start Early:</strong> Begin promoting at least 4-6 weeks in advance</li>
              <li><strong>Know Your Audience:</strong> Create detailed attendee personas</li>
              <li><strong>Set Clear Objectives:</strong> Define success metrics before launching</li>
              <li><strong>Plan for Scale:</strong> Prepare for both low and high attendance</li>
              <li><strong>Have a Backup:</strong> Always have contingency plans</li>
            </ul>
            
            <h5>Engagement Strategies:</h5>
            <ul>
              <li>Send regular updates to registered attendees</li>
              <li>Create interactive content and polls</li>
              <li>Offer networking opportunities</li>
              <li>Provide valuable takeaways and resources</li>
              <li>Follow up after the event</li>
            </ul>
          `
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting Common Issues',
      articles: [
        {
          title: 'Login & Access Issues',
          content: `
            <h5>Can't Log In?</h5>
            <ul>
              <li><strong>Forgot Password:</strong> Use the "Reset Password" link on the login page</li>
              <li><strong>Account Locked:</strong> Wait 15 minutes or contact support</li>
              <li><strong>Email Not Verified:</strong> Check spam folder and resend verification</li>
              <li><strong>Wrong Credentials:</strong> Ensure caps lock is off and check spelling</li>
            </ul>
            
            <h5>Browser Issues:</h5>
            <ul>
              <li>Clear browser cache and cookies</li>
              <li>Disable browser extensions temporarily</li>
              <li>Try a different browser (Chrome, Firefox, Safari)</li>
              <li>Enable JavaScript and cookies</li>
              <li>Update your browser to the latest version</li>
            </ul>
          `
        },
        {
          title: 'Payment Problems',
          content: `
            <h5>Payment Failed?</h5>
            <ul>
              <li><strong>Insufficient Funds:</strong> Check your account balance</li>
              <li><strong>Card Declined:</strong> Contact your bank or card issuer</li>
              <li><strong>Mobile Money Issues:</strong> Ensure your mobile money account is active</li>
              <li><strong>Network Timeout:</strong> Try again with a stable internet connection</li>
            </ul>
            
            <h5>Duplicate Charges:</h5>
            <p>If you see multiple charges for the same ticket:</p>
            <ol>
              <li>Check your email for multiple confirmation receipts</li>
              <li>Contact our support team with transaction details</li>
              <li>We'll investigate and refund any duplicate charges</li>
            </ol>
          `
        }
      ]
    },
    'billing': {
      title: 'Billing & Financial Information',
      articles: [
        {
          title: 'Understanding Fees',
          content: `
            <h5>Service Fees:</h5>
            <ul>
              <li><strong>Attendee Fee:</strong> Small service charge added to ticket price</li>
              <li><strong>Organizer Fee:</strong> Commission on ticket sales (for paid events)</li>
              <li><strong>Payment Processing:</strong> Standard payment gateway fees</li>
              <li><strong>Currency Conversion:</strong> Applicable for international transactions</li>
            </ul>
            
            <h5>Fee Structure:</h5>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Attendee Fee</th>
                    <th>Organizer Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Free Events</td>
                    <td>Free</td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td>Paid Events</td>
                    <td>GHS 5 + 2.5%</td>
                    <td>5% of gross sales</td>
                  </tr>
                  <tr>
                    <td>Premium Events</td>
                    <td>GHS 3 + 2%</td>
                    <td>3% of gross sales</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `
        }
      ]
    },
    'technical': {
      title: 'Technical Requirements & Support',
      articles: [
        {
          title: 'System Requirements',
          content: `
            <h5>Supported Browsers:</h5>
            <ul>
              <li><strong>Chrome:</strong> Version 80 or later (Recommended)</li>
              <li><strong>Firefox:</strong> Version 75 or later</li>
              <li><strong>Safari:</strong> Version 13 or later</li>
              <li><strong>Edge:</strong> Version 80 or later</li>
            </ul>
            
            <h5>Mobile Support:</h5>
            <ul>
              <li><strong>iOS:</strong> 12.0 or later</li>
              <li><strong>Android:</strong> 8.0 or later</li>
              <li>Responsive design works on all screen sizes</li>
              <li>No app download required</li>
            </ul>
            
            <h5>Internet Connection:</h5>
            <ul>
              <li>Minimum: 1 Mbps for basic functionality</li>
              <li>Recommended: 5 Mbps for optimal experience</li>
              <li>Mobile data and WiFi both supported</li>
            </ul>
          `
        }
      ]
    }
  };

  const faqs = [
    {
      question: "How do I create my first event?",
      answer: "Creating your first event is easy! Simply sign up for an organizer account, click 'Create Event' in your dashboard, and follow our step-by-step wizard. You'll need to provide basic event information, upload images, set up ticketing, and publish your event."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit/debit cards (Visa, Mastercard) and popular mobile money services in Ghana including MTN Mobile Money, Vodafone Cash, and AirtelTigo Money. All payments are processed securely with SSL encryption."
    },
    {
      question: "Can I get a refund for my ticket?",
      answer: "Refund policies depend on the event organizer's terms. If an event is cancelled by the organizer, you'll receive a full refund. For voluntary cancellations, please check the specific event's refund policy or contact the organizer directly."
    },
    {
      question: "How do I check in attendees at my event?",
      answer: "EventMan provides a digital check-in system. Attendees will have QR codes on their tickets that you can scan using our mobile-friendly check-in interface. You can also manually mark attendees as present in your organizer dashboard."
    },
    {
      question: "Is there a mobile app?",
      answer: "EventMan is fully mobile-optimized and works perfectly in your web browser. You don't need to download any app - simply visit our website from your phone or tablet for the full experience."
    },
    {
      question: "How do I promote my event?",
      answer: "Use our built-in sharing tools to promote on social media, create compelling event descriptions with high-quality images, offer early bird discounts, and regularly update your event page. Complete profiles get significantly more registrations."
    },
    {
      question: "What fees do you charge?",
      answer: "We charge a small service fee to attendees (GHS 5 + 2.5% for paid events) and take a 5% commission from organizers on ticket sales. Free events have no fees at all. Premium organizers get reduced rates."
    },
    {
      question: "Can I create private events?",
      answer: "Yes! You can create private events that are only accessible via direct link or invitation. Private events won't appear in our public event listings but can still use all our ticketing and management features."
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="page bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">{t('help.title')}</h1>
          <p className="lead text-muted">{t('help.subtitle')}</p>
          
          {/* Search Bar */}
          <div className="row justify-content-center mt-4">
            <div className="col-md-6">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder={t('help.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="card shadow-sm rounded-3 border-0 sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">{t('help.categories.title')}</h5>
              </div>
              <div className="list-group list-group-flush">
                {helpCategories.map(category => (
                  <button
                    key={category.id}
                    className={`list-group-item list-group-item-action border-0 py-3 ${
                      activeCategory === category.id ? 'active' : ''
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <div className="d-flex align-items-start">
                      <i className={`${category.icon} me-3 mt-1`}></i>
                      <div>
                        <h6 className="mb-1 fw-bold">{category.title}</h6>
                        <small className={activeCategory === category.id ? 'text-white-50' : 'text-muted'}>
                          {category.description}
                        </small>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Help Articles */}
            <div className="card shadow-sm rounded-3 border-0 mb-4">
              <div className="card-header bg-white py-4">
                <h3 className="mb-0 fw-bold">{t(helpContent[activeCategory]?.title)}</h3>
              </div>
              <div className="card-body p-4">
                {helpContent[activeCategory]?.articles.map((article, index) => (
                  <div key={index} className="mb-5">
                    <h4 className="fw-bold text-primary mb-3">{article.title}</h4>
                    <div 
                      className="help-content"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    {index < helpContent[activeCategory].articles.length - 1 && <hr className="my-4" />}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="card shadow-sm rounded-3 border-0">
              <div className="card-header bg-white py-4">
                <h3 className="mb-0 fw-bold">{t('help.faq_title')}</h3>
              </div>
              <div className="card-body p-4">
                <div className="accordion" id="faqAccordion">
                  {filteredFAQs.map((faq, index) => (
                    <div key={index} className="accordion-item border-0 mb-3">
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${openFAQ === index ? '' : 'collapsed'} bg-light`}
                          type="button"
                          onClick={() => toggleFAQ(index)}
                        >
                          <i className="fas fa-question-circle text-primary me-2"></i>
                          {faq.question}
                        </button>
                      </h2>
                      <div className={`accordion-collapse collapse ${openFAQ === index ? 'show' : ''}`}>
                        <div className="accordion-body bg-white">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredFAQs.length === 0 && searchTerm && (
                  <div className="text-center py-5">
                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5>{t('help.no_results')}</h5>
                    <p className="text-muted">{t('help.no_results_desc')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className="card shadow-lg rounded-4 border-0 bg-primary text-white">
              <div className="card-body p-5 text-center">
                <i className="fas fa-headset fa-3x mb-3"></i>
                <h3 className="fw-bold mb-3">{t('help.still_need_help')}</h3>
                <p className="lead mb-4">
                  {t('help.still_need_help_desc')}
                </p>
                <div className="row g-3 justify-content-center">
                  <div className="col-md-4">
                    <Link to="/contact-us" className="btn btn-light btn-lg w-100">
                      <i className="fas fa-envelope me-2"></i>
                      Contact Support
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <a href="mailto:help@eventman.com" className="btn btn-outline-light btn-lg w-100">
                      <i className="fas fa-at me-2"></i>
                      Email Us
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a href="tel:+233123456789" className="btn btn-outline-light btn-lg w-100">
                      <i className="fas fa-phone me-2"></i>
                      Call Us
                    </a>
                  </div>
                </div>
                <div className="mt-4">
                  <small>
                    <i className="fas fa-clock me-1"></i>
                    {t('help.support_hours')}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .help-content h5 {
          color: #495057;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .help-content h6 {
          color: #6c757d;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .help-content ul, .help-content ol {
          margin-bottom: 1rem;
        }
        
        .help-content li {
          margin-bottom: 0.25rem;
        }
        
        .accordion-button:not(.collapsed) {
          background-color: #e7f3ff !important;
          color: #0d6efd;
        }
        
        .list-group-item.active {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
        
        .sticky-top {
          position: sticky;
        }
      `}</style>
    </div>
  );
};

export default HelpPage;
