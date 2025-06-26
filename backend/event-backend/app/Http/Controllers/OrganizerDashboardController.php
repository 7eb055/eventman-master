<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;

class OrganizerDashboardController extends Controller
{
    /**
     * Provide data for the organizer's dashboard.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $organizer = $request->user();

        // Eager load tickets to calculate sales and revenue efficiently
        $events = Event::with('tickets')->where('user_id', $organizer->id)->get();

        $totalEvents = $events->count();
        $upcomingEventsCount = $events->where('start_date', '>=', now())->count();
        $totalTicketsSold = $events->sum(function ($event) {
            return $event->tickets->count();
        });

        // Example of calculating revenue, assuming tickets have a price
        $totalRevenue = $events->sum(function ($event) {
            return $event->tickets->sum('price');
        });

        return response()->json([
            'message' => "Dashboard data for {$organizer->name}",
            'data' => [
                'total_events' => $totalEvents,
                'upcoming_events_count' => $upcomingEventsCount,
                'total_tickets_sold' => $totalTicketsSold,
                'total_revenue' => $totalRevenue,
                'events' => $events->map(function ($event) { // Return a summary of events
                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'start_date' => $event->start_date,
                        'tickets_sold' => $event->tickets->count(),
                        'revenue' => $event->tickets->sum('price'),
                    ];
                }),
            ]
        ]);
    }
}
