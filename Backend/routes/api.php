<?php
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {
    Route::post('/product',               [ProductController::class, 'analyze']);
    Route::post('/product/image',         [ProductController::class, 'analyzeImage']);
    Route::get('/products/history',       [ProductController::class, 'history']);
    Route::get('/products/history/{id}',  [ProductController::class, 'show']);
    Route::delete('/products/history/{id}', [ProductController::class, 'destroy']);
});