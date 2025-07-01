<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Event Ticket</title>
</head>
<body>
    <h2>Thank you for your purchase!</h2>
    <p>Dear {{ $ticket->attendee->name }},</p>
    <p>Your ticket for <strong>{{ $ticket->event->title }}</strong> is attached as a PDF. Please present the QR code at the event entrance for check-in.</p>
    <p>Ticket Code: <strong>{{ $ticket->ticket_code }}</strong></p>
    <p>Date: {{ $ticket->event->start_date }}</p>
    <p>See you at the event!</p>
    <br>
    <small>Powered by EventMan</small>
</body>
</html>
