<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {

    // ── Public ──────────────────────────────────────────────
    Route::post('register',              [AuthController::class, 'register']);
    Route::post('login',                 [AuthController::class, 'login']);
    Route::get('verify/{token}',         [AuthController::class, 'verifyEmail']);
    Route::post('resend-verification',   [AuthController::class, 'resendVerification']);

    // ── Google OAuth ─────────────────────────────────────────
    Route::get('google',                 [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback',        [AuthController::class, 'handleGoogleCallback']);

    // ── Protected ────────────────────────────────────────────
    Route::middleware('auth:api')->group(function () {
        Route::get('me',     [AuthController::class, 'me']);
        Route::post('logout',[AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Product Routes
|--------------------------------------------------------------------------
*/
Route::post('/product',               [ProductController::class, 'analyze']);
Route::post('/product/image',         [ProductController::class, 'analyzeImage']);
Route::get('/products/history',       [ProductController::class, 'history']);
Route::get('/products/history/{id}',  [ProductController::class, 'show']);
Route::delete('/products/history/{id}', [ProductController::class, 'destroy']);