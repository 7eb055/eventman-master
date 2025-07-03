<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrganizerProfileController extends Controller
{
    // Get organizer profile
    public function show(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'organizer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($user->only([
            'company_name', 'logo', 'description', 'website', 'facebook', 'twitter', 'linkedin', 'instagram'
        ]));
    }

    // Update organizer profile
    public function update(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'organizer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $data = $request->validate([
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'website' => 'nullable|url|max:255',
            'facebook' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
        ]);
        $user->update($data);
        return response()->json(['message' => 'Organizer profile updated', 'profile' => $user->only(array_keys($data))]);
    }
}
