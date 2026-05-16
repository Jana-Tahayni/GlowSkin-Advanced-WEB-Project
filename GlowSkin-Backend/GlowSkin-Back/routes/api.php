<?php

use App\Http\Controllers\SkinAnalysisController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — GlowSkin
|--------------------------------------------------------------------------
|
|
| ── [تغيير] غلّفنا كل الـ routes بـ auth:api middleware ──
| يعني اليوزر لازم يبعت Bearer token مع كل request
| وإلا يرجع 401 Unauthorized
|
*/

Route::middleware('auth:api')->group(function () {

    // POST /api/analyze       ← ترسل صورة وتحصل على نتائج
    Route::post('/analyze', [SkinAnalysisController::class, 'analyze']);

    // GET /api/analyses       ← تحليلات اليوزر الحالي فقط
    Route::get('/analyses', [SkinAnalysisController::class, 'index']);

    // GET /api/analyses/compare?before={id}&after={id} ← Before/After
    Route::get('/analyses/compare', [SkinAnalysisController::class, 'compare']);

    // GET /api/analyses/{id}  ← تحليل معين
    Route::get('/analyses/{id}', [SkinAnalysisController::class, 'show']);

    // DELETE /api/analyses/{id} ← حذف تحليل
    Route::delete('/analyses/{id}', [SkinAnalysisController::class, 'destroy']);

});