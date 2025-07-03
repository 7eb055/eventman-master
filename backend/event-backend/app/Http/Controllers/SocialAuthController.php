<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    // Redirect to provider
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    // Handle provider callback
    public function callback($provider)
    {
        $socialUser = Socialite::driver($provider)->user();
        $user = User::where('email', $socialUser->getEmail())->first();
        if (!$user) {
            $user = User::create([
                'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'No Name',
                'email' => $socialUser->getEmail(),
                'password' => bcrypt(Str::random(16)),
                'role' => 'organizer',
                'email_verified_at' => now(),
            ]);
        }
        Auth::login($user);
        // You may want to return a token or redirect
        return response()->json([
            'token' => $user->createToken('auth-token')->plainTextToken,
            'role' => $user->role,
            'user' => $user
        ]);
    }
}
