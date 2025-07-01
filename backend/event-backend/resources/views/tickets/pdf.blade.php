<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Event Ticket</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .ticket-container { border: 2px solid #0d6efd; border-radius: 16px; padding: 32px; max-width: 500px; margin: 0 auto; }
        .event-title { font-size: 2rem; color: #0d6efd; margin-bottom: 12px; }
        .ticket-info { margin-bottom: 18px; }
        .qr { text-align: center; margin-top: 18px; }
        .brand { color: #1e293b; font-size: 1.1rem; margin-top: 24px; }
    </style>
</head>
<body>
    <div class="ticket-container">
        <div class="event-title">{{ $event->title }}</div>
        <div class="ticket-info">
            <strong>Attendee:</strong> {{ $user->name }}<br>
            <strong>Ticket Type:</strong> {{ ucfirst($ticket->ticket_type) }}<br>
            <strong>Ticket Code:</strong> {{ $ticket->ticket_code }}<br>
            <strong>Date:</strong> {{ $event->start_date }}<br>
        </div>
        <div class="qr">
            <img src="{{ $qr }}" alt="QR Code" width="180" height="180">
        </div>
        <div class="brand">Powered by EventMan</div>
    </div>
</body>
</html>
