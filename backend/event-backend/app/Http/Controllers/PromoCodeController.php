<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PromoCode;

class PromoCodeController extends Controller
{
    public function validateCode(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $promoCode = PromoCode::where('code', $request->code)->first();

        if (!$promoCode) {
            return response()->json(['error' => 'Invalid promo code'], 404);
        }

        if (!$promoCode->isValid()) {
            return response()->json(['error' => 'Promo code is not valid or expired'], 400);
        }

        return response()->json([
            'code' => $promoCode->code,
            'type' => $promoCode->type,
            'value' => $promoCode->value,
            'description' => $this->getDescription($promoCode)
        ]);
    }

    private function getDescription(PromoCode $promoCode)
    {
        if ($promoCode->type === 'percentage') {
            return "{$promoCode->value}% off";
        } elseif ($promoCode->type === 'fixed') {
            return '$' . number_format($promoCode->value, 2) . " off";
        }
        return "Special discount";
    }
}
