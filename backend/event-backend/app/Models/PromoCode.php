<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'max_uses', 'used_count',
        'valid_from', 'valid_until', 'is_active'
    ];

    public function redemptions()
    {
        return $this->hasMany(DiscountRedemption::class);
    }

    public function isValid()
    {
        return $this->is_active && 
               now()->between($this->valid_from, $this->valid_until) &&
               ($this->max_uses === null || $this->used_count < $this->max_uses);
    }

    public function calculateDiscount($amount)
    {
        if ($this->type === 'percentage') {
            return $amount * ($this->value / 100);
        } elseif ($this->type === 'fixed') {
            return min($this->value, $amount);
        }
        return 0;
    }
}
