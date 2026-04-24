<?php
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::post('/checkout', [PaymentController::class, 'checkout']);