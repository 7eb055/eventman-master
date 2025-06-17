<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class PaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createPaymentIntent(float $amount, string $currency = 'usd')
    {
        try {
            return PaymentIntent::create([
                'amount' => $amount * 100, // Convert to cents
                'currency' => $currency,
                'automatic_payment_methods' => ['enabled' => true],
                'metadata' => ['integration_check' => 'accept_a_payment']
            ]);
        } catch (ApiErrorException $e) {
            throw new \Exception("Payment error: " . $e->getMessage());
        }
    }

    public function confirmPayment(string $paymentIntentId)
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);
            return $paymentIntent->confirm();
        } catch (ApiErrorException $e) {
            throw new \Exception("Payment confirmation failed: " . $e->getMessage());
        }
    }
}