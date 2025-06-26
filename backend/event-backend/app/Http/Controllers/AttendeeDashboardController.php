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

        // Example: Fetch events the attendee has tickets for
        $events = Event::whereHas('tickets', function ($query) use ($attendee) {
            $query->where('user_id', $attendee->id);
        })->get();

        return response()->json([
            'message' => "Dashboard data for {$attendee->name}",
            'data' => [
                'events' => $events,
            ]
        ]);
    }
}
