<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

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
}
