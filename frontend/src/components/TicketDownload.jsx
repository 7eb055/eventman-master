import React from 'react';
import './TicketDownload.css';

const TicketDownload = ({ ticketPdfUrl }) => {
  if (!ticketPdfUrl) return null;
  return (
    <div className="ticket-download">
      <a href={ticketPdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
        Download Your Ticket (PDF)
      </a>
    </div>
  );
};

export default TicketDownload;
