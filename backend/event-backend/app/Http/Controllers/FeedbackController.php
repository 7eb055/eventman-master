<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    // Get all feedback for an event
    public function index($eventId)
    {
        $feedback = Feedback::where('event_id', $eventId)->with('attendee:id,name')->orderByDesc('created_at')->get();
        return response()->json($feedback);
    }

    // Get current user's feedback for an event
    public function myFeedback($eventId)
    {
        $user = Auth::user();
        $feedback = Feedback::where('event_id', $eventId)->where('attendee_id', $user->id)->first();
        return response()->json($feedback);
    }

    // Create or update feedback for an event
    public function store(Request $request, $eventId)
    {
        $user = Auth::user();
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:300',
        ]);
        // Only allow feedback if user attended (checked in or ticket used)
        $attended = $user->tickets()->where('event_id', $eventId)->where(function($q) {
            $q->where('status', 'used')->orWhereNotNull('checked_in_at');
        })->exists();
        if (!$attended) {
            return response()->json(['message' => 'You can only leave feedback for events you attended.'], 403);
        }
        $feedback = Feedback::updateOrCreate(
            [ 'event_id' => $eventId, 'attendee_id' => $user->id ],
            [ 'rating' => $request->rating, 'comment' => $request->comment ]
        );
        return response()->json($feedback);
    }
}
