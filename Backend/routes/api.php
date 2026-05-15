<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SkinAnalysisController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('register',              [AuthController::class, 'register']);
    Route::post('login',                 [AuthController::class, 'login']);
    Route::get('verify/{token}',         [AuthController::class, 'verifyEmail']);
    Route::post('resend-verification',   [AuthController::class, 'resendVerification']);
    Route::get('google',                 [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback',        [AuthController::class, 'handleGoogleCallback']);
    Route::post('forgot-password',       [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',        [AuthController::class, 'resetPassword']);
    Route::middleware('auth:api')->group(function () {
        Route::get('me',      [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Product Routes (Hala)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    Route::post('/product',               [ProductController::class, 'analyze']);
    Route::post('/product/image',         [ProductController::class, 'analyzeImage']);
    Route::get('/products/history',       [ProductController::class, 'history']);
    Route::get('/products/history/{id}',  [ProductController::class, 'show']);
    Route::delete('/products/history/{id}', [ProductController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Skin Analysis Routes (Jana)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    Route::post('/analyze',            [SkinAnalysisController::class, 'analyze']);
    Route::get('/analyses',            [SkinAnalysisController::class, 'index']);
    Route::get('/analyses/compare',    [SkinAnalysisController::class, 'compare']);
    Route::get('/analyses/{id}',       [SkinAnalysisController::class, 'show']);
    Route::delete('/analyses/{id}',    [SkinAnalysisController::class, 'destroy']);
});