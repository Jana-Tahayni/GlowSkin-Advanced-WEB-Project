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
    // ── Public ──────────────────────────────────────────────
    Route::post('register',              [AuthController::class, 'register']);
    Route::post('login',                 [AuthController::class, 'login']);
    Route::get('verify/{token}',         [AuthController::class, 'verifyEmail']);
    Route::post('resend-verification',   [AuthController::class, 'resendVerification']);
    // ── Google OAuth ─────────────────────────────────────────
    Route::get('google',                 [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback',        [AuthController::class, 'handleGoogleCallback']);
    Route::post('forgot-password',       [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',        [AuthController::class, 'resetPassword']);
    // ── Protected ────────────────────────────────────────────
    Route::middleware('auth:api')->group(function () {
        Route::get('me',      [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Product Routes (Afnan)
|--------------------------------------------------------------------------
*/
Route::post('/product',                 [ProductController::class, 'analyze']);
Route::post('/product/image',           [ProductController::class, 'analyzeImage']);
Route::get('/products/history',         [ProductController::class, 'history']);
Route::get('/products/history/{id}',    [ProductController::class, 'show']);
Route::delete('/products/history/{id}', [ProductController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Skin Analysis Routes (Jana) — محمية بـ auth:api
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {

    // POST /api/analyze ← ترسل صورة وتحصل على نتائج
    Route::post('/analyze', [SkinAnalysisController::class, 'analyze']);

    // GET /api/analyses ← تحليلات اليوزر الحالي فقط
    Route::get('/analyses', [SkinAnalysisController::class, 'index']);

    // GET /api/analyses/compare ← Before/After
    Route::get('/analyses/compare', [SkinAnalysisController::class, 'compare']);

    // GET /api/analyses/{id} ← تحليل معين
    Route::get('/analyses/{id}', [SkinAnalysisController::class, 'show']);

    // DELETE /api/analyses/{id} ← حذف تحليل
    Route::delete('/analyses/{id}', [SkinAnalysisController::class, 'destroy']);

});