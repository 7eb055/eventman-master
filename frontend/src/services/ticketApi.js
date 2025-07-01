import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const generateTicket = async (eventId, ticketType = 'standard', token) => {
  const response = await axios.post(
    `${API_URL}/tickets/generate`,
    { event_id: eventId, ticket_type: ticketType },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getTicketPdfUrl = (ticketId) => {
  return `${API_URL}/tickets/${ticketId}/download`;
};
