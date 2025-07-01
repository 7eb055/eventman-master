<?php

namespace App\Services;

use App\Models\Ticket;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class TicketService
{
    /**
     * Generate a unique ticket, QR code, and PDF for an event registration.
     */
    public function generateTicket($user, $event, $ticketType = 'standard')
    {
        // Generate unique ticket code
        $ticketCode = strtoupper(Str::random(10));

        // Create ticket in DB
        $ticket = Ticket::create([
            'event_id' => $event->id,
            'attendee_id' => $user->id,
            'ticket_type' => $ticketType,
            'ticket_code' => $ticketCode,
            'status' => 'valid',
        ]);

        // Generate QR code (as base64)
        $qr = QrCode::format('png')->size(220)->generate($ticketCode);
        $qrBase64 = 'data:image/png;base64,' . base64_encode($qr);

        // Generate PDF ticket
        $pdf = Pdf::loadView('tickets.pdf', [
            'ticket' => $ticket,
            'event' => $event,
            'user' => $user,
            'qr' => $qrBase64,
        ]);

        // Save PDF to storage (optional)
        $pdfPath = 'tickets/ticket_' . $ticket->id . '.pdf';
        \Storage::put($pdfPath, $pdf->output());

        // Optionally email ticket
        // Mail::to($user->email)->send(new \App\Mail\TicketMail($ticket, $pdfPath));

        return [
            'ticket' => $ticket,
            'pdf_path' => $pdfPath,
            'qr' => $qrBase64,
        ];
    }
}
