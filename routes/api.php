<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/product', [ProductController::class, 'analyze'])
    ->middleware('auth:sanctum');

Route::post('/product/image', [ProductController::class, 'analyzeImage'])
    ->middleware('auth:sanctum');

Route::get('/products/history', [ProductController::class, 'history'])
    ->middleware('auth:sanctum');

Route::get('/products/history/{id}', [ProductController::class, 'show'])
    ->middleware('auth:sanctum');

Route::delete('/products/history/{id}', [ProductController::class, 'destroy'])
    ->middleware('auth:sanctum');