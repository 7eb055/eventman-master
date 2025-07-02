import React from 'react';

const TicketModal = ({ show, onClose, ticketUrl, qrCodeUrl }) => {
  if (!show) return null;
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
      <div className="modal-dialog" style={{ maxWidth: 400, margin: '10vh auto', background: '#fff', borderRadius: 8, padding: 24, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, border: 'none', background: 'none', fontSize: 24, cursor: 'pointer' }}>&times;</button>
        <h3>Your Ticket</h3>
        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" style={{ width: 200, display: 'block', margin: '16px auto' }} />}
        {ticketUrl && (
          <a href={ticketUrl} download className="btn btn-primary w-100 mt-3">Download PDF</a>
        )}
      </div>
    </div>
  );
};

export default TicketModal;
