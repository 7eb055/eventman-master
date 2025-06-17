<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public function applyPromoCode(PromoCode $promoCode)
    {
        $discount = $promoCode->calculateDiscount($this->total_amount);
        $this->discount_amount = $discount;
        $this->final_amount = $this->total_amount - $discount;
        $this->promo_code_id = $promoCode->id;
        $this->save();

        // Record redemption
        DiscountRedemption::create([
            'promo_code_id' => $promoCode->id,
            'order_id' => $this->id,
            'user_id' => $this->user_id,
            'discount_amount' => $discount
        ]);

        // Increment usage count
        $promoCode->increment('used_count');
    }
}
