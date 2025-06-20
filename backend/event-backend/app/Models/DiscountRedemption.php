<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountRedemption extends Model
{
    protected $fillable = ['promo_code_id', 'order_id', 'user_id', 'discount_amount'];

    public function promoCode()
    {
        return $this->belongsTo(PromoCode::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
