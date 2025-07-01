<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // Update profile info
    public function update(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes','email','max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:30',
            'company_name' => 'nullable|string|max:255',
        ]);
        $user->update($data);
        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    // Change password
    public function changePassword(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }
        $user->password = bcrypt($request->new_password);
        $user->save();
        return response()->json(['message' => 'Password changed successfully']);
    }

    // Update notification preferences
    public function updateNotifications(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'notifications' => 'required|array',
        ]);
        $user->notification_preferences = $data['notifications'];
        $user->save();
        return response()->json(['message' => 'Notification preferences updated']);
    }
}
