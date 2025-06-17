<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\PromoCodeController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'currentUser']);
    
    // Events
    Route::apiResource('events', EventController::class);
    Route::get('/events/category/{category}', [EventController::class, 'byCategory']);
    Route::get('/events/upcoming', [EventController::class, 'upcoming']);
    Route::get('/events/past', [EventController::class, 'past']);
    Route::get('/events/organizer/{organizerId}', [EventController::class, 'byOrganizer']);
    
    // Tickets
    Route::post('events/{event}/tickets', [TicketController::class, 'purchase']);
    
    // Reports
    Route::get('events/{event}/attendance-report', [ReportController::class, 'eventAttendance']);
    
    // QR Verification
    Route::post('tickets/{ticket}/verify', [TicketController::class, 'verify']);
    
    // Payment routes
    Route::post('/orders/{order}/pay', [PaymentController::class, 'initiatePayment']);
    Route::post('/payments/confirm', [PaymentController::class, 'confirmPayment']);
    
    // Promo code routes
    Route::post('/promo-codes/validate', [PromoCodeController::class, 'validateCode']);
    Route::apiResource('promo-codes', PromoCodeController::class)->except(['show']);
});

// Webhook route (exclude CSRF protection)
Route::post('/stripe/webhook', [WebhookController::class, 'handleStripeWebhook'])
    ->withoutMiddleware([VerifyCsrfToken::class]);

// Test webhook route (authenticated, for testing)
Route::middleware('auth:sanctum')->post('/test/webhook', function (Request $request) {
    // Simulate webhook event
    $webhookController = new WebhookController;
    return $webhookController->handleStripeWebhook($request);
});