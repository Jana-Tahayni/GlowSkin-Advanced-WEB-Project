<?php

use App\Http\Controllers\SkinAnalysisController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — GlowSkin
|--------------------------------------------------------------------------
|
| كل الـ routes هنا تبدأ بـ /api تلقائياً
| مثال: /api/analyze, /api/analyses
|
*/

// ── Skin Analysis Routes ──────────────────────────────

// POST /api/analyze       ← ترسل صورة وتحصل على نتائج
Route::post('/analyze', [SkinAnalysisController::class, 'analyze']);

// GET /api/analyses       ← كل التحليلات (History page)
Route::get('/analyses', [SkinAnalysisController::class, 'index']);

// GET /api/analyses/compare?before={id}&after={id} ← Before/After
Route::get('/analyses/compare', [SkinAnalysisController::class, 'compare']);

// GET /api/analyses/{id}  ← تحليل معين
Route::get('/analyses/{id}', [SkinAnalysisController::class, 'show']);

// DELETE /api/analyses/{id} ← حذف تحليل
Route::delete('/analyses/{id}', [SkinAnalysisController::class, 'destroy']);