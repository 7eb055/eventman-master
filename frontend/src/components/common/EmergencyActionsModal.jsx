import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 2000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)'
};

const EmergencyActionsModal = ({ show, onClose, onLockdown, onAlert, onPurge }) => {
  if (!show) return null;
  return (
    <div style={modalStyle}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content bg-white">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Emergency Actions</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="mb-3">Select a critical action to perform. These actions may affect all users and platform operations.</p>
            <button className="btn btn-warning w-100 mb-2" onClick={onLockdown}>
              <i className="fas fa-lock me-2"></i> Lockdown Platform
            </button>
            <button className="btn btn-info w-100 mb-2" onClick={onAlert}>
              <i className="fas fa-bullhorn me-2"></i> Send System-wide Alert
            </button>
            <button className="btn btn-secondary w-100" onClick={onPurge}>
              <i className="fas fa-user-slash me-2"></i> Purge Inactive Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyActionsModal;
