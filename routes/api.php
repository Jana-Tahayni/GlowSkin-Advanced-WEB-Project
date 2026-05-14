<?php
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/product', [ProductController::class, 'analyze']);
    Route::post('/product/image', [ProductController::class, 'analyzeImage']);
    Route::get('/products/history', [ProductController::class, 'history']);
    Route::get('/products/history/{id}', [ProductController::class, 'show']);
    Route::delete('/products/history/{id}', [ProductController::class, 'destroy']);
});