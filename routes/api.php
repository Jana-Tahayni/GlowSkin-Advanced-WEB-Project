<?php
 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CaseController;
use App\Http\Controllers\Api\RoutineController;
 
/*
|--------------------------------------------------------------------------
| API Routes — SkinCare Dashboard
|--------------------------------------------------------------------------
*/
 
// ── CASES ──────────────────────────────────────────────────
Route::prefix('cases')->group(function () {
 
    Route::get('/',          [CaseController::class, 'index']);   // GET  /api/cases
    Route::get('/stats',     [CaseController::class, 'stats']);   // GET  /api/cases/stats
    Route::get('/{id}',      [CaseController::class, 'show']);    // GET  /api/cases/{id}
    Route::post('/',         [CaseController::class, 'store']);   // POST /api/cases
    Route::put('/{id}',      [CaseController::class, 'update']);  // PUT  /api/cases/{id}
    Route::post('/{id}/approve', [CaseController::class, 'approve']); // POST /api/cases/{id}/approve
    Route::post('/{id}/reject',  [CaseController::class, 'reject']);  // POST /api/cases/{id}/reject
    Route::delete('/{id}',   [CaseController::class, 'destroy']); // DELETE /api/cases/{id}
 
});
 
// ── ROUTINES ───────────────────────────────────────────────
Route::prefix('routines')->group(function () {
 
    Route::get('/',                        [RoutineController::class, 'index']);      // GET  /api/routines
    Route::get('/{id}',                    [RoutineController::class, 'show']);       // GET  /api/routines/{id}
    Route::post('/',                       [RoutineController::class, 'store']);      // POST /api/routines
    Route::post('/{id}/steps',             [RoutineController::class, 'addStep']);    // POST /api/routines/{id}/steps
    Route::patch('/steps/{stepId}/toggle', [RoutineController::class, 'toggleStep']);// PATCH /api/routines/steps/{id}/toggle
    Route::delete('/steps/{stepId}',       [RoutineController::class, 'deleteStep']); // DELETE /api/routines/steps/{id}
    Route::delete('/{id}',                 [RoutineController::class, 'destroy']);    // DELETE /api/routines/{id}
 
});
 
Route::get('/test', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Backend connected'
    ]);
});