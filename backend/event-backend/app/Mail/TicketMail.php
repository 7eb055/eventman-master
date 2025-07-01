<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TicketMail extends Mailable
{
    use Queueable, SerializesModels;

    public $ticket;
    public $pdfPath;

    public function __construct($ticket, $pdfPath)
    {
        $this->ticket = $ticket;
        $this->pdfPath = $pdfPath;
    }

    public function build()
    {
        return $this->subject('Your Event Ticket')
            ->view('emails.ticket')
            ->attach(storage_path('app/' . $this->pdfPath), [
                'as' => 'YourTicket.pdf',
                'mime' => 'application/pdf',
            ]);
    }
}
