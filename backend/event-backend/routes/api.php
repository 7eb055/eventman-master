<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\PromoCodeController;
use App\Http\Controllers\OrganizerDashboardController;
use App\Http\Controllers\AttendeeDashboardController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrganizerProfileController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\FeedbackController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes for registration and login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']); // Allow public access to event details

// Protected routes that require a valid token
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'currentUser']);
    Route::post('/token', [AuthController::class, 'getToken']);
    Route::post('/revoke-token', [AuthController::class, 'revokeToken'])->middleware('auth:sanctum');
    Route::post('/email/verification-notification', [AuthController::class, 'resendVerificationEmail']);

    // Events
    Route::apiResource('events', EventController::class)->except(['index', 'show']);
    Route::get('/events/category/{category}', [EventController::class, 'byCategory']);
    Route::get('/events/upcoming', [EventController::class, 'upcoming']);
    Route::get('/events/past', [EventController::class, 'past']);
    Route::get('/events/organizer/{organizerId}', [EventController::class, 'byOrganizer']);
    // Route::get('/events/{id}', [EventController::class, 'show']); // Remove from protected routes

    // Tickets
    Route::post('events/{event}/tickets', [TicketController::class, 'purchase']);

    // Reports
    Route::get('/reports/tickets-sold', [ReportController::class, 'ticketsSold']);
    Route::get('/reports/companies', [ReportController::class, 'companies']);
    Route::get('/reports/event-summary', [ReportController::class, 'eventSummary']);
    Route::get('/reports/revenue', [ReportController::class, 'revenue']);
    Route::get('/reports/user-activity', [ReportController::class, 'userActivity']);
    Route::get('/reports/event-feedback', [ReportController::class, 'eventFeedback']);
    Route::get('/reports/top-attendees', [ReportController::class, 'topAttendees']);

    // QR Verification
    Route::post('tickets/{ticket}/verify', [TicketController::class, 'verify']);

    // Payment routes
    Route::post('/orders/{order}/pay', [PaymentController::class, 'initiatePayment']);
    Route::post('/payments/confirm', [PaymentController::class, 'confirmPayment']);

    // Promo code routes
    Route::post('/promo-codes/validate', [PromoCodeController::class, 'validateCode']);
    Route::apiResource('promo-codes', PromoCodeController::class)->except(['show']);

    // Routes for Organizers
    Route::middleware('role:organizer')->group(function () {
        // Organizer profile management (role:organizer)
        Route::get('/organizer/profile', [OrganizerProfileController::class, 'show']);
        Route::put('/organizer/profile', [OrganizerProfileController::class, 'update']);
        Route::get('/organizer/dashboard', [OrganizerDashboardController::class, 'index']);
    });

    // Routes for Attendees
    Route::middleware('role:attendee')->group(function () {
        Route::get('/attendee/dashboard', [AttendeeDashboardController::class, 'index']);
    });

    Route::post('/events', [EventController::class, 'store']);

    // Ticket generation and download
    Route::post('/tickets/generate', [\App\Http\Controllers\TicketController::class, 'generate']);
    Route::get('/tickets/{ticket}/download', [\App\Http\Controllers\TicketController::class, 'download']);

    // For attended events
    Route::get('/users/{user}/events/attended', [AttendanceController::class, 'attendedEvents']);

    // For recommended events (simple example)
    Route::get('/events/recommended', [EventController::class, 'recommended']);

    // Profile routes
    Route::put('/user', [ProfileController::class, 'update']);
    Route::post('/user/password', [ProfileController::class, 'changePassword']);
    Route::post('/user/notifications', [ProfileController::class, 'updateNotifications']);

    // Admin dashboard endpoints
    Route::get('/admin/stats', [AdminDashboardController::class, 'stats']);
    Route::get('/admin/platform-usage', [AdminDashboardController::class, 'platformUsage']);
    Route::get('/admin/role-distribution', [AdminDashboardController::class, 'roleDistribution']);
    Route::get('/admin/system-activity', [AdminDashboardController::class, 'systemActivity']);
    Route::get('/admin/pending-approvals', [AdminDashboardController::class, 'pendingApprovals']);
    Route::get('/admin/system-users', [AdminDashboardController::class, 'systemUsers']);

    // Admin emergency actions
    Route::post('/admin/lockdown', [AdminController::class, 'lockdown']);
    Route::post('/admin/system-alert', [AdminController::class, 'systemAlert']);
    Route::post('/admin/purge-inactive-users', [AdminController::class, 'purgeInactiveUsers']);
    Route::post('/admin/users', [AdminController::class, 'createUser']);
    Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);

    // Admin event management
    Route::post('/admin/events/{id}/approve', [AdminController::class, 'approveEvent']);
    Route::post('/admin/events/{id}/reject', [AdminController::class, 'rejectEvent']);
    Route::delete('/admin/events/{id}', [AdminController::class, 'deleteEvent']);

    // Admin settings management
    Route::get('/admin/settings', [AdminController::class, 'getSettings']);
    Route::post('/admin/settings', [AdminController::class, 'saveSettings']);

    // Role management
    Route::get('/admin/roles', [AdminController::class, 'listRoles']);
    Route::post('/admin/roles', [AdminController::class, 'createRole']);
    Route::put('/admin/roles/{id}', [AdminController::class, 'updateRole']);
    Route::delete('/admin/roles/{id}', [AdminController::class, 'deleteRole']);
    Route::post('/admin/users/{userId}/assign-role', [AdminController::class, 'assignRoleToUser']);
    Route::post('/admin/users/{userId}/remove-role', [AdminController::class, 'removeRoleFromUser']);
    // Permission management
    Route::get('/admin/permissions', [AdminController::class, 'listPermissions']);
    Route::post('/admin/permissions', [AdminController::class, 'createPermission']);
    Route::put('/admin/permissions/{id}', [AdminController::class, 'updatePermission']);
    Route::delete('/admin/permissions/{id}', [AdminController::class, 'deletePermission']);
    Route::post('/admin/roles/{roleId}/assign-permission', [AdminController::class, 'assignPermissionToRole']);
    Route::post('/admin/roles/{roleId}/remove-permission', [AdminController::class, 'removePermissionFromRole']);

    // Announcements
    Route::get('/admin/announcements', [AdminController::class, 'listAnnouncements']);
    Route::post('/admin/announcements', [AdminController::class, 'createAnnouncement']);
    Route::put('/admin/announcements/{id}', [AdminController::class, 'updateAnnouncement']);
    Route::delete('/admin/announcements/{id}', [AdminController::class, 'deleteAnnouncement']);

    // API Key management
    Route::get('/admin/api-keys', [AdminController::class, 'listApiKeys']);
    Route::post('/admin/api-keys', [AdminController::class, 'createApiKey']);
    Route::post('/admin/api-keys/{id}/revoke', [AdminController::class, 'revokeApiKey']);
    Route::delete('/admin/api-keys/{id}', [AdminController::class, 'deleteApiKey']);

    // Feedback endpoints
    Route::get('/events/{event}/feedback', [FeedbackController::class, 'index']); // all feedback for event
    Route::get('/events/{event}/feedback/me', [FeedbackController::class, 'myFeedback']); // current user's feedback
    Route::post('/events/{event}/feedback', [FeedbackController::class, 'store']); // create/update feedback
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

// Social OAuth routes
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback']);
