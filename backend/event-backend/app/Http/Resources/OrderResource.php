<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;


class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'payment' => $this->payment ? [
                'id' => $this->payment->id,
                'amount' => $this->payment->amount,
                'method' => $this->payment->method,
                'status' => $this->payment->status
            ] : null,
            'tickets' => TicketResource::collection($this->tickets)
        ];
    }
}