<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use PragmaRX\Google2FALaravel\Facade as Google2FA;

class TwoFactorLoginController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'code' => 'required|string',
        ]);
        $user = User::find($request->user_id);
        if (!$user || !$user->google2fa_enabled) {
            return response()->json(['message' => '2FA not enabled for this user'], 400);
        }
        $secret = Crypt::decrypt($user->google2fa_secret);
        if (!Google2FA::verifyKey($secret, $request->code)) {
            return response()->json(['message' => 'Invalid 2FA code'], 422);
        }
        // Revoke previous tokens (optional)
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }
}
