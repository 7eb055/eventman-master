<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        // ... existing fields ...
        'check_in_lat', 'check_in_lng', 'checked_in_at', 'check_in_ip'
    ];

    public function checkIn($lat, $lng, $ip)
    {
        $this->update([
            'status' => 'used',
            'check_in_lat' => $lat,
            'check_in_lng' => $lng,
            'checked_in_at' => now(),
            'check_in_ip' => $ip
        ]);
    }
}
