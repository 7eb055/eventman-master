<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use App\Events\TicketPurchased;
use App\Notifications\TicketNotification;
use App\Models\Ticket;

class SendTicketNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TicketPurchased $event)
    {
        $ticket = $event->ticket;
        
        // Send email
        Notification::send($ticket->attendee, new TicketNotification($ticket));
        
        // Send SMS
        if ($ticket->attendee->phone) {
            // Integrate with SMS gateway
        }
    }
}
