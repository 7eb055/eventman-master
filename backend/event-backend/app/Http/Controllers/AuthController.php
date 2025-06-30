<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role' =>'required|in:organizer,attendee',
            'phone' => 'nullable|string',
            'company_name' => 'nullable|string',

        ]);

        $user = User::create([
            'name' => $data['full_name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'phone' => $data['phone'] ?? 'N/A',
            'company_name' => $data['company_name'] ?? 'N/A',
            'role'=> $data['role']
        ]);

        return response()->json([
            'token' => $user->createToken('auth-token')->plainTextToken
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function currentUser(Request $request)
    {
        return response()->json($request->user());
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->getAuthPassword())) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Revoke previous tokens (optional, for security)
        $user->tokens()->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }
     /**
     * Get authentication token (alternative login method)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getToken(Request $request) {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->getAuthPassword())) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        $user->tokens()->delete(); // clear old tokens

        $token = $user->createToken($request->ip())->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * Revoke all user tokens (logout from all devices)
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function revokeToken(Request $request) {
        $request->user()->currentAccessToken()->delete(); // remove current token only for consistency with logout method

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }
}
