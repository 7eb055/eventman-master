import React from 'react';
import TicketDownload from '../components/TicketDownload';

const TicketReceipt = ({ ticket, pdfUrl }) => {
  return (
    <div className="ticket-receipt-page">
      <h2>Thank you for your purchase!</h2>
      <p>Your ticket for <strong>{ticket.eventTitle}</strong> has been generated.</p>
      <p>Ticket Code: <strong>{ticket.ticket_code}</strong></p>
      <p>Date: {ticket.eventDate}</p>
      <TicketDownload ticketPdfUrl={pdfUrl} />
      <div className="qr-section">
        {ticket.qr && <img src={ticket.qr} alt="QR Code" width={180} height={180} />}
      </div>
      <p>Please present this QR code at the event entrance for check-in.</p>
    </div>
  );
};

export default TicketReceipt;
