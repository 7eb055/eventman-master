<?php

namespace App\Services;

use Twilio\Rest\Client;

class SmsService
{
    protected $twilio;
    protected $from;

    public function __construct()
    {
        $this->twilio = new Client(config('services.twilio.sid'), config('services.twilio.token'));
        $this->from = config('services.twilio.from');
    }

    public function send($to, $message)
    {
        return $this->twilio->messages->create($to, [
            'from' => $this->from,
            'body' => $message,
        ]);
    }
}
