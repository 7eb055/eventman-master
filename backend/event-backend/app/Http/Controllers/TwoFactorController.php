<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PragmaRX\Google2FALaravel\Facade as Google2FA;
use Illuminate\Support\Facades\Crypt;

class TwoFactorController extends Controller
{
    // Enable 2FA: generate secret and return QR code URL
    public function enable(Request $request)
    {
        $user = $request->user();
        $secret = Google2FA::generateSecretKey();
        $user->google2fa_secret = Crypt::encrypt($secret);
        $user->google2fa_enabled = false; // Only enable after verification
        $user->save();

        $qrUrl = Google2FA::getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'qr_url' => $qrUrl,
            'secret' => $secret
        ]);
    }

    // Verify 2FA code and enable 2FA
    public function verify(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        $user = $request->user();
        $secret = Crypt::decrypt($user->google2fa_secret);
        $valid = Google2FA::verifyKey($secret, $request->code);
        if ($valid) {
            $user->google2fa_enabled = true;
            $user->save();
            return response()->json(['message' => '2FA enabled']);
        }
        return response()->json(['message' => 'Invalid code'], 422);
    }

    // Disable 2FA
    public function disable(Request $request)
    {
        $user = $request->user();
        $user->google2fa_secret = null;
        $user->google2fa_enabled = false;
        $user->save();
        return response()->json(['message' => '2FA disabled']);
    }

    // Check 2FA status
    public function status(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'enabled' => (bool) $user->google2fa_enabled
        ]);
    }
}
