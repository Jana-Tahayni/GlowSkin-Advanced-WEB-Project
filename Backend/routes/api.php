<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\NotificationController;

/**
 * @route   POST /api/process-payment
 * @desc    Handle the payment process via Stripe and record pending transactions.
 * @access  Public (or Authenticated)
 */
Route::post('/process-payment', [PaymentController::class, 'processPayment']);

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);


// Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
// });