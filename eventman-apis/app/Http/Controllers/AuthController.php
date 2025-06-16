<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Register a new user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100', // Max length adjusted to match database
            'email' => 'required|string|email|max:190|unique:users', // Max length adjusted to match database
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:attendee,organizer,admin',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'full_name' => $request->full_name ?? $request->name,
                'email' => $request->email,
                'password_hash' => \Hash::make($request->password),
                'role' => $request->role ?? 'user',
                'location' => $request->role === 'organizer' ? $request->location : null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        // Add explicit password_hash check
        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            \Log::error('Login failed for: ' . $request->email); // Add logging
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Optionally, generate token or session here
        return response()->json([
            'user' => $user,
            'message' => 'Login successful',
        ]);
    }

    /**
     * Logout user (revoke token)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        Auth::logout();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Get authenticated user
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->full_name,
            'email' => $user->email,
            'role' => $user->role
        ]);
    }
}
