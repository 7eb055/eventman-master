<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Ticket;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\PromoCode;

class PaymentController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function initiatePayment(Request $request, Order $order)
    {
        $request->validate([
            'payment_method' => 'required|in:card,upi,net_banking','stripe'
        ]);

        try {
            $paymentIntent = $this->paymentService->createPaymentIntent(
                $order->total_amount
            );

            // Create pending payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $order->total_amount,
                'method' => $request->payment_method,
                'status' => 'pending',
                'transaction_id' => $paymentIntent->id,
                'otp_verified' => false
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'paymentId' => $payment->id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

         // Apply promo code if provided
        if ($request->has('promo_code')) {
            $promoCode = PromoCode::where('code', $request->promo_code)->first();
            
            if ($promoCode && $promoCode->isValid()) {
                $order->applyPromoCode($promoCode);
            }
        }
    }

    public function confirmPayment(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'payment_intent_id' => 'required'
        ]);

        try {
            $payment = Payment::find($request->payment_id);
            
            // Confirm payment with Stripe
            $paymentIntent = $this->paymentService->confirmPayment(
                $request->payment_intent_id
            );

            if ($paymentIntent->status === 'succeeded') {
                // Update payment status
                $payment->update([
                    'status' => 'success',
                    'transaction_id' => $paymentIntent->id
                ]);

                // Update order status
                $payment->order->update(['status' => 'success']);

                // Generate tickets
                foreach ($payment->order->items as $item) {
                    Ticket::create([
                        'order_id' => $payment->order->id,
                        'event_id' => $item->event_id,
                        'attendee_id' => $payment->order->user_id,
                        'qr_code' => $this->generateQRCode($item->id),
                        'status' => 'valid'
                    ]);
                }

                return response()->json([
                    'message' => 'Payment successful!',
                    'tickets' => $payment->order->tickets
                ]);
            }

            return response()->json(['error' => 'Payment failed'], 400);
        } catch (\Exception $e) {
            Log::error('Payment confirmation error: ' . $e->getMessage());
            return response()->json(['error' => 'Payment processing failed'], 500);
        }
    }

    private function generateQRCode($ticketId)
    {
        return 'TICKET-' . $ticketId . '-' . bin2hex(random_bytes(8));
    }

    
}