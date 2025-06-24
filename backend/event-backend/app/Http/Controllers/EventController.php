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
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'venue' => 'required|string',
            'capacity' => 'required|integer',
            'ticket_price' => 'required|numeric',
            'location' => 'required|string',
            'start_date' => 'required|date'
        ]);

        $event = $request->user()->organizedEvents()->create($data);

        return response()->json($event, 201);
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
}
