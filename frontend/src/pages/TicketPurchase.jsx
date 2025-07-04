import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TicketPurchase = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get ticket data from previous page or use default
  const ticketData = location.state || {
    event: {
      title: "Tech Innovators Conference 2025",
      date: "July 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Accra International Conference Centre",
      image: "https://i.pinimg.com/736x/b6/55/2b/b6552be1a23bf22cd79c36747f384e71.jpg",
      organizer: "Tech Ghana Association"
    },
    selectedTicket: {
      id: 'general',
      name: 'General Admission',
      price: 150,
      benefits: ['Event Access', 'Lunch Included', 'Swag Bag']
    },
    quantity: 1,
    subtotal: 150,
    serviceFee: 5,
    total: 155
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [errors, setErrors] = useState({});

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emergencyContact: ''
  });

  const [billingInfo, setBillingInfo] = useState({
    address: '',
    city: '',
    region: '',
    country: 'Ghana'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    mobileNetwork: 'MTN',
    mobileNumber: ''
  });

  const steps = [
    { number: 1, title: t('ticket_purchase.steps.customer_info'), icon: 'fas fa-user' },
    { number: 2, title: t('ticket_purchase.steps.billing_details'), icon: 'fas fa-address-card' },
    { number: 3, title: t('ticket_purchase.steps.payment'), icon: 'fas fa-credit-card' },
    { number: 4, title: t('ticket_purchase.steps.confirmation'), icon: 'fas fa-check-circle' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!customerInfo.firstName) newErrors.firstName = t('ticket_purchase.errors.first_name');
      if (!customerInfo.lastName) newErrors.lastName = t('ticket_purchase.errors.last_name');
      if (!customerInfo.email) newErrors.email = t('ticket_purchase.errors.email');
      if (!customerInfo.phone) newErrors.phone = t('ticket_purchase.errors.phone');
    }
    if (step === 2) {
      if (!billingInfo.address) newErrors.address = t('ticket_purchase.errors.address');
      if (!billingInfo.city) newErrors.city = t('ticket_purchase.errors.city');
      if (!billingInfo.region) newErrors.region = t('ticket_purchase.errors.region');
    }
    if (step === 3) {
      if (paymentMethod === 'card') {
        if (!paymentInfo.cardNumber) newErrors.cardNumber = t('ticket_purchase.errors.card_number');
        if (!paymentInfo.cardName) newErrors.cardName = t('ticket_purchase.errors.card_name');
        if (!paymentInfo.expiryDate) newErrors.expiryDate = t('ticket_purchase.errors.expiry_date');
        if (!paymentInfo.cvv) newErrors.cvv = t('ticket_purchase.errors.cvv');
      } else if (paymentMethod === 'mobile') {
        if (!paymentInfo.mobileNumber) newErrors.mobileNumber = t('ticket_purchase.errors.mobile_number');
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (section, field, value) => {
    switch (section) {
      case 'customer':
        setCustomerInfo({ ...customerInfo, [field]: value });
        break;
      case 'billing':
        setBillingInfo({ ...billingInfo, [field]: value });
        break;
      case 'payment':
        setPaymentInfo({ ...paymentInfo, [field]: value });
        break;
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handlePurchase = async () => {
    if (!validateStep(3)) return;
    
    setProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setPurchaseComplete(true);
      setCurrentStep(4);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="row justify-content-center mb-5">
      <div className="col-md-8">
        <div className="d-flex justify-content-between align-items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="d-flex flex-column align-items-center flex-grow-1">
              <div className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                currentStep >= step.number 
                  ? 'bg-primary text-white' 
                  : 'bg-light text-muted'
              }`} style={{ width: '50px', height: '50px' }}>
                <i className={step.icon}></i>
              </div>
              <span className={`small fw-medium ${
                currentStep >= step.number ? 'text-primary' : 'text-muted'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`position-absolute border-top ${
                  currentStep > step.number ? 'border-primary' : 'border-light'
                }`} style={{ 
                  width: 'calc(100% - 100px)', 
                  left: '50px', 
                  top: '25px',
                  zIndex: -1
                }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomerInfoStep = () => (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-header bg-white py-4">
            <h3 className="mb-0 fw-bold">{t('ticket_purchase.customer_info.title')}</h3>
            <p className="text-muted mb-0">{t('ticket_purchase.customer_info.subtitle')}</p>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.first_name')}</label>
                <input
                  type="text"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  value={customerInfo.firstName}
                  onChange={(e) => handleInputChange('customer', 'firstName', e.target.value)}
                  placeholder={t('ticket_purchase.placeholders.first_name')}
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.last_name')}</label>
                <input
                  type="text"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  value={customerInfo.lastName}
                  onChange={(e) => handleInputChange('customer', 'lastName', e.target.value)}
                  placeholder={t('ticket_purchase.placeholders.last_name')}
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.email')}</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
                  placeholder={t('ticket_purchase.placeholders.email')}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.phone')}</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                  placeholder={t('ticket_purchase.placeholders.phone')}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
              <div className="col-md-12">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.emergency_contact')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerInfo.emergencyContact}
                  onChange={(e) => handleInputChange('customer', 'emergencyContact', e.target.value)}
                  placeholder={t('ticket_purchase.placeholders.emergency_contact')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingInfoStep = () => (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-header bg-white py-4">
            <h3 className="mb-0 fw-bold">{t('ticket_purchase.billing_info.title')}</h3>
            <p className="text-muted mb-0">{t('ticket_purchase.billing_info.subtitle')}</p>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.street_address')}</label>
                <input
                  type="text"
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  value={billingInfo.address}
                  onChange={(e) => handleInputChange('billing', 'address', e.target.value)}
                  placeholder={t('ticket_purchase.placeholders.street_address')}
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.city')}</label>
                <input
                  type="text"
                  className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                  value={billingInfo.city}
                  onChange={(e) => handleInputChange('billing', 'city', e.target.value)}
                  placeholder={t('ticket_purchase.placeholders.city')}
                />
                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.region')}</label>
                <select
                  className={`form-select ${errors.region ? 'is-invalid' : ''}`}
                  value={billingInfo.region}
                  onChange={(e) => handleInputChange('billing', 'region', e.target.value)}
                >
                  <option value="">{t('ticket_purchase.placeholders.select_region')}</option>
                  <option value="Greater Accra">{t('regions.Greater Accra')}</option>
                  <option value="Ashanti">{t('regions.Ashanti')}</option>
                  <option value="Central">{t('regions.Central')}</option>
                  <option value="Eastern">{t('regions.Eastern')}</option>
                  <option value="Northern">{t('regions.Northern')}</option>
                  <option value="Upper East">{t('regions.Upper East')}</option>
                  <option value="Upper West">{t('regions.Upper West')}</option>
                  <option value="Volta">{t('regions.Volta')}</option>
                  <option value="Western">{t('regions.Western')}</option>
                  <option value="Brong Ahafo">{t('regions.Brong Ahafo')}</option>
                </select>
                {errors.region && <div className="invalid-feedback">{errors.region}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label fw-medium">{t('ticket_purchase.labels.country')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={billingInfo.country}
                  onChange={(e) => handleInputChange('billing', 'country', e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-header bg-white py-4">
            <h3 className="mb-0 fw-bold">{t('ticket_purchase.payment_info.title')}</h3>
            <p className="text-muted mb-0">{t('ticket_purchase.payment_info.subtitle')}</p>
          </div>
          <div className="card-body p-4">
            {/* Payment Method Selection */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div
                  className={`card border-2 p-3 cursor-pointer ${
                    paymentMethod === 'card' ? 'border-primary' : 'border-light'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-credit-card fa-2x text-primary me-3"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">{t('ticket_purchase.payment_methods.card.title')}</h6>
                      <small className="text-muted">{t('ticket_purchase.payment_methods.card.subtitle')}</small>
                    </div>
                    {paymentMethod === 'card' && (
                      <i className="fas fa-check-circle text-primary ms-auto"></i>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className={`card border-2 p-3 cursor-pointer ${
                    paymentMethod === 'mobile' ? 'border-primary' : 'border-light'
                  }`}
                  onClick={() => setPaymentMethod('mobile')}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-mobile-alt fa-2x text-primary me-3"></i>
                    <div>
                      <h6 className="mb-0 fw-bold">{t('ticket_purchase.payment_methods.mobile.title')}</h6>
                      <small className="text-muted">{t('ticket_purchase.payment_methods.mobile.subtitle')}</small>
                    </div>
                    {paymentMethod === 'mobile' && (
                      <i className="fas fa-check-circle text-primary ms-auto"></i>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethod === 'card' && (
              <div className="bg-light p-4 rounded-3">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium">{t('ticket_purchase.labels.card_number')}</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                      placeholder={t('ticket_purchase.placeholders.card_number')}
                    />
                    {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium">{t('ticket_purchase.labels.card_name')}</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                      value={paymentInfo.cardName}
                      onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                      placeholder={t('ticket_purchase.placeholders.card_name')}
                    />
                    {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">{t('ticket_purchase.labels.expiry_date')}</label>
                    <input
                      type="text"
                      className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                      value={paymentInfo.expiryDate}
                      onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                      placeholder={t('ticket_purchase.placeholders.expiry_date')}
                    />
                    {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">{t('ticket_purchase.labels.cvv')}</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                      value={paymentInfo.cvv}
                      onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                      placeholder={t('ticket_purchase.placeholders.cvv')}
                    />
                    {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'mobile' && (
              <div className="bg-light p-4 rounded-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">{t('ticket_purchase.labels.mobile_network')}</label>
                    <select
                      className="form-select"
                      value={paymentInfo.mobileNetwork}
                      onChange={(e) => handleInputChange('payment', 'mobileNetwork', e.target.value)}
                    >
                      <option value="MTN">{t('mobile_networks.MTN')}</option>
                      <option value="Vodafone">{t('mobile_networks.Vodafone')}</option>
                      <option value="AirtelTigo">{t('mobile_networks.AirtelTigo')}</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">{t('ticket_purchase.labels.phone_number')}</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                      value={paymentInfo.mobileNumber}
                      onChange={(e) => handleInputChange('payment', 'mobileNumber', e.target.value)}
                      placeholder={t('ticket_purchase.placeholders.phone_number')}
                    />
                    {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="row justify-content-center">
      <div className="col-md-8">
        {purchaseComplete ? (
          <div className="card shadow-lg rounded-4 border-0 text-center">
            <div className="card-body p-5">
              <div className="mb-4">
                <i className="fas fa-check-circle fa-5x text-success"></i>
              </div>
              <h2 className="fw-bold text-success mb-3">{t('ticket_purchase.confirmation.success_title')}</h2>
              <p className="lead mb-4">
                {t('ticket_purchase.confirmation.success_message')}
              </p>
              <div className="bg-light p-4 rounded-3 mb-4">
                <h5 className="fw-bold mb-3">{t('ticket_purchase.confirmation.order_summary')}</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>{ticketData.quantity} x {ticketData.selectedTicket.name}</span>
                  <span>GHS {ticketData.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>{t('ticket_purchase.confirmation.service_fee')}</span>
                  <span>GHS {ticketData.serviceFee.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>{t('ticket_purchase.confirmation.total_paid')}</span>
                  <span className="text-success">GHS {ticketData.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-center">
                <button className="btn btn-primary" onClick={() => navigate('/attendee-dashboard')}>
                  {t('ticket_purchase.confirmation.view_tickets')}
                </button>
                <button className="btn btn-outline-primary" onClick={() => navigate('/browse-events')}>
                  {t('ticket_purchase.confirmation.browse_events')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card shadow-lg rounded-4 border-0">
            <div className="card-body p-4 text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">{t('ticket_purchase.confirmation.processing')}</span>
              </div>
              <h4 className="fw-bold mb-2">{t('ticket_purchase.confirmation.processing_title')}</h4>
              <p className="text-muted">{t('ticket_purchase.confirmation.processing_message')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="page bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">{t('ticket_purchase.header.title')}</h1>
          <p className="lead text-muted">{t('ticket_purchase.header.subtitle')}</p>
        </div>

        {renderStepIndicator()}

        <div className="row">
          <div className="col-lg-8">
            {currentStep === 1 && renderCustomerInfoStep()}
            {currentStep === 2 && renderBillingInfoStep()}
            {currentStep === 3 && renderPaymentStep()}
            {currentStep === 4 && renderConfirmationStep()}
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div className="card shadow-lg rounded-4 border-0 sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">{t('ticket_purchase.order_summary.title')}</h5>
              </div>
              <div className="card-body p-4">
                {/* Event Details */}
                <div className="mb-4">
                  <img
                    src={ticketData.event.image}
                    alt={ticketData.event.title}
                    className="img-fluid rounded mb-3"
                  />
                  <h6 className="fw-bold">{ticketData.event.title}</h6>
                  <div className="small text-muted">
                    <div className="d-flex align-items-center mb-1">
                      <i className="fas fa-calendar me-2"></i>
                      {ticketData.event.date}
                    </div>
                    <div className="d-flex align-items-center mb-1">
                      <i className="fas fa-clock me-2"></i>
                      {ticketData.event.time}
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {ticketData.event.location}
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>{ticketData.quantity} x {ticketData.selectedTicket.name}</span>
                    <span>GHS {ticketData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>{t('ticket_purchase.order_summary.service_fee')}</span>
                    <span>GHS {ticketData.serviceFee.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>{t('ticket_purchase.order_summary.total')}</span>
                    <span className="text-primary">GHS {ticketData.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {currentStep < 4 && !processing && (
                  <div className="d-flex gap-2">
                    {currentStep > 1 && (
                      <button
                        className="btn btn-outline-secondary flex-grow-1"
                        onClick={handlePrevious}
                      >
                        {t('ticket_purchase.actions.previous')}
                      </button>
                    )}
                    {currentStep < 3 ? (
                      <button
                        className="btn btn-primary flex-grow-1"
                        onClick={handleNext}
                      >
                        {t('ticket_purchase.actions.next')}
                      </button>
                    ) : (
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={handlePurchase}
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            {t('ticket_purchase.actions.processing')}
                          </>
                        ) : (
                          `${t('ticket_purchase.actions.complete_purchase')} - GHS ${ticketData.total.toFixed(2)}`
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Security Badge */}
                <div className="text-center mt-3">
                  <p className="small text-muted mb-0">
                    <i className="fas fa-lock me-1"></i>
                    {t('ticket_purchase.security.ssl_encryption')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .position-relative {
          position: relative;
        }
        .position-absolute {
          position: absolute;
        }
      `}</style>
    </div>
  );
};

export default TicketPurchase;
