<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{

    public function index() {
        $events = Event::all();
        return response()->json($events);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:175',
            'event_type' => 'required|string|max:100',
            'image' => 'nullable|string|max:175',
            'description' => 'nullable|string',
            'venue' => 'required|string|max:175',
            'capacity' => 'required|integer',
            'ticket_price' => 'required|numeric',
            'location' => 'required|string|max:175',
            'start_date' => 'required|date',
        ]);

        $validated['organizer_id'] = $request->user()->id;

        $event = Event::create($validated);

        return response()->json(['message' => 'Event created!', 'event' => $event], 201);
    }

    public function byCategory($category)
    {
        $events = Event::where('category', $category)->get();
        return response()->json($events);
    }

    public function upcoming()
    {
        $events = Event::where('start_date', '>', now())->get();
        return response()->json($events);
    }

    public function past()
    {
        $events = Event::where('start_date', '<', now())->get();
        return response()->json($events);
    }

    public function byOrganizer($organizerId)
    {
        $events = Event::where('organizer_id', $organizerId)->get();
        return response()->json($events);
    }

    public function show($id) {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
        return response()->json($event);
    }
}
