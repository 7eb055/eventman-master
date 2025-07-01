<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;

class AttendeeDashboardController extends Controller
{
    /**
     * Provide data for the attendee's dashboard.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $attendee = $request->user();

        // Fetch events the attendee has tickets for
        $events = Event::whereHas('tickets', function ($query) use ($attendee) {
            $query->where('attendee_id', $attendee->id);
        })->get();

        // Tickets purchased
        $ticketsPurchased = $attendee->tickets()->count();
        // Events attended (tickets with checked_in_at not null or status 'used')
        $eventsAttended = $attendee->tickets()->whereNotNull('checked_in_at')->orWhere('status', 'used')->count();

        return response()->json([
            'message' => "Dashboard data for {$attendee->name}",
            'data' => [
                'user' => [
                    'name' => $attendee->name,
                    'email' => $attendee->email,
                    'created_at' => $attendee->created_at,
                    'ticketsPurchased' => $ticketsPurchased,
                    'eventsAttended' => $eventsAttended,
                ],
                'events' => $events,
            ]
        ]);
    }
}
