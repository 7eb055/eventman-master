<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;

class ReportController extends Controller
{
    public function eventAttendance(Event $event)
    {
        $tickets = $event->tickets()->with('attendee')->get();
        
        return response()->json([
            'event' => $event->title,
            'total_tickets' => $tickets->count(),
            'checked_in' => $tickets->where('status', 'used')->count(),
            'attendance_rate' => $tickets->count() > 0 
                ? round(($tickets->where('status', 'used')->count() / $tickets->count()) * 100, 2)
                : 0,
            'checkin_locations' => $tickets->where('status', 'used')->map(function($ticket) {
                return [
                    'attendee' => $ticket->attendee->full_name,
                    'time' => $ticket->checked_in_at,
                    'latitude' => $ticket->check_in_lat,
                    'longitude' => $ticket->check_in_lng,
                    'distance' => $this->distanceFromCenter(
                        $ticket->check_in_lat, 
                        $ticket->check_in_lng,
                        $ticket->event->location
                    )
                ];
            })
        ]);
    }

    private function distanceFromCenter($lat, $lng, $center)
    {
        [$centerLat, $centerLng] = explode(',', $center);
        return $this->calculateDistance($lat, $lng, $centerLat, $centerLng);
    }

    // Haversine formula to calculate distance between two lat/lng points in kilometers
    private function calculateDistance($lat1, $lng1, $lat2, $lng2)
    {
        $earthRadius = 6371; // Radius of the earth in km
        $lat1 = deg2rad($lat1);
        $lng1 = deg2rad($lng1);
        $lat2 = deg2rad($lat2);
        $lng2 = deg2rad($lng2);

        $dlat = $lat2 - $lat1;
        $dlng = $lng2 - $lng1;

        $a = sin($dlat/2) * sin($dlat/2) +
            cos($lat1) * cos($lat2) *
            sin($dlng/2) * sin($dlng/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        $distance = $earthRadius * $c;

        return round($distance, 2);
    }

    // Tickets Sold Report
    public function ticketsSold()
    {
        $tickets = Ticket::with('event')->get();
        $report = $tickets->groupBy('event_id')->map(function($tickets, $eventId) {
            $event = $tickets->first()->event;
            return [
                'event' => $event ? $event->title : 'Unknown',
                'tickets_sold' => $tickets->count(),
                'revenue' => $tickets->sum('price'),
            ];
        })->values();
        return response()->json($report);
    }

    // Company List Report
    public function companies()
    {
        $companies = User::where('role', 'organizer')->get(['id', 'name', 'email', 'company_name', 'phone']);
        return response()->json($companies);
    }

    // Example: Event Summary Report
    public function eventSummary()
    {
        $events = Event::withCount('tickets')->get();
        $summary = $events->map(function($event) {
            return [
                'event' => $event->title,
                'date' => $event->start_date,
                'tickets' => $event->tickets_count,
            ];
        });
        return response()->json($summary);
    }

    // Revenue Report
    public function revenue()
    {
        $tickets = \App\Models\Ticket::with('event')->get();
        $report = $tickets->groupBy('event_id')->map(function($tickets, $eventId) {
            $event = $tickets->first()->event;
            return [
                'event' => $event ? $event->title : 'Unknown',
                'revenue' => $tickets->sum('price'),
                'tickets_sold' => $tickets->count(),
            ];
        })->values();
        return response()->json($report);
    }

    // User Activity Report
    public function userActivity()
    {
        $users = \App\Models\User::with(['tickets', 'organizedEvents'])->get();
        $report = $users->map(function($user) {
            return [
                'user' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'events_attended' => $user->tickets->count(),
                'events_organized' => $user->organizedEvents->count(),
            ];
        });
        return response()->json($report);
    }

    // Event Feedback Report
    public function eventFeedback()
    {
        $feedbacks = \App\Models\Event::with('feedback')->get();
        $report = $feedbacks->map(function($event) {
            return [
                'event' => $event->title,
                'feedback_count' => $event->feedback ? $event->feedback->count() : 0,
                'average_rating' => $event->feedback && $event->feedback->count() > 0 ? round($event->feedback->avg('rating'), 2) : null,
            ];
        });
        return response()->json($report);
    }

    // Top Attendees Report
    public function topAttendees()
    {
        $users = \App\Models\User::withCount('tickets')->orderBy('tickets_count', 'desc')->take(10)->get();
        $report = $users->map(function($user) {
            return [
                'user' => $user->name,
                'email' => $user->email,
                'tickets_purchased' => $user->tickets_count,
            ];
        });
        return response()->json($report);
    }
}
