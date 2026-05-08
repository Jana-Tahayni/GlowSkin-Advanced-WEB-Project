<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;

// Route::post('/checkout', [PaymentController::class, 'checkout']);
Route::post('/process-payment', [PaymentController::class, 'processPayment']);
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);