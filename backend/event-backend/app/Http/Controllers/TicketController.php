<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Events\TicketPurchased;
use App\Models\Ticket;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Services\TicketService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    protected $ticketService;

    public function __construct(TicketService $ticketService)
    {
        $this->ticketService = $ticketService;
    }

    public function purchase(Request $request, Event $event)
    {
        // Validate available capacity
        if ($event->tickets()->count() >= $event->capacity) {
            return response()->json(['message' => 'Event sold out'], 400);
        }

        $order = $request->user()->orders()->create([
            'total_amount' => $event->ticket_price
        ]);

        $ticket = $order->tickets()->create([
            'event_id' => $event->id,
            'attendee_id' => $request->user()->id,
            'qr_code' => $this->generateQRCode($order->id),
            'status' => 'valid'
        ]);

        // Trigger notification
        event(new TicketPurchased($ticket));

        return response()->json($ticket, 201);
    }

    private function generateQRCode($orderId)
    {
        return QrCode::size(200)
            ->generate(env('APP_URL').'/tickets/verify/'.$orderId);
    }

    public function verify(Request $request, Ticket $ticket)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180'
        ]);

        $eventLocation = $ticket->event->location; // Assuming location is stored as "lat,lng"
        [$eventLat, $eventLng] = explode(',', $eventLocation);
        
        $distance = $this->calculateDistance(
            (float)$request->latitude,
            (float)$request->longitude,
            (float)$eventLat,
            (float)$eventLng
        );
        
        // Allow check-in within 500 meters of event location
        if ($distance > 500) {
            return response()->json([
                'message' => 'You must be at the event location to check in',
                'distance' => $distance
            ], 403);
        }

        if ($ticket->status === 'used') {
            return response()->json(['message' => 'Ticket already used'], 400);
        }
        
        $ticket->checkIn(
            $request->latitude,
            $request->longitude,
            $request->ip()
        );
        
        return response()->json([
            'message' => 'Attendance confirmed',
            'attendee' => $ticket->attendee->full_name,
            'location' => [
                'latitude' => $ticket->check_in_lat,
                'longitude' => $ticket->check_in_lng
            ],
            'time' => $ticket->checked_in_at
        ]);
    }

    // Generate ticket after purchase/registration
    public function generate(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'ticket_type' => 'nullable|string',
        ]);
        $user = Auth::user();
        $event = Event::findOrFail($request->event_id);
        $result = $this->ticketService->generateTicket($user, $event, $request->ticket_type ?? 'standard');
        return response()->json([
            'ticket' => $result['ticket'],
            'pdf_path' => $result['pdf_path'],
            'qr' => $result['qr'],
        ]);
    }

    // Download ticket PDF
    public function download($ticketId)
    {
        $ticket = Ticket::findOrFail($ticketId);
        $user = Auth::user();
        if ($ticket->attendee_id !== $user->id) {
            abort(403, 'Unauthorized');
        }
        $pdfPath = 'tickets/ticket_' . $ticket->id . '.pdf';
        if (!Storage::exists($pdfPath)) {
            abort(404, 'Ticket PDF not found');
        }
        return response()->download(storage_path('app/' . $pdfPath), 'YourTicket.pdf');
    }

    /**
     * Calculate the distance in meters between two coordinates using the Haversine formula.
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Earth radius in meters
        
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        
        return $earthRadius * $c; // Distance in meters
    }
}
