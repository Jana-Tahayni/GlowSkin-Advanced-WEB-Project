<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Routine;
use App\Models\RoutineStep;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
 
class RoutineController extends Controller
{
    // GET /api/routines
    public function index(Request $request): JsonResponse
    {
        $query = Routine::with('steps');
 
        if ($request->has('case_id')) {
            $query->where('case_id', $request->case_id);
        }
 
        if ($request->has('time') && $request->time !== 'All') {
            $query->where('time', $request->time);
        }
 
        $routines = $query->latest()->get();
 
        return response()->json([
            'success' => true,
            'data'    => $routines,
        ]);
    }
 
    // GET /api/routines/{id}
    public function show($id): JsonResponse
    {
        $routine = Routine::with('steps')->findOrFail($id);
 
        return response()->json([
            'success' => true,
            'data'    => $routine,
        ]);
    }
 
    // POST /api/routines
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'case_id'      => 'required|exists:cases,id',
            'patient_name' => 'required|string',
            'time'         => 'required|in:Morning,Night,Both',
            'notes'        => 'nullable|string',
            'steps'        => 'nullable|array',
            'steps.*.product_name' => 'required|string',
            'steps.*.product_type' => 'required|string',
            'steps.*.time'         => 'required|in:Morning,Night,Both',
            'steps.*.note'         => 'nullable|string',
        ]);
 
        $routine = Routine::create([
            'case_id'      => $request->case_id,
            'patient_name' => $request->patient_name,
            'time'         => $request->time,
            'notes'        => $request->notes,
        ]);
 
        // إضافة الخطوات لو في
        if ($request->has('steps')) {
            foreach ($request->steps as $index => $step) {
                RoutineStep::create([
                    'routine_id'   => $routine->id,
                    'step_order'   => $index + 1,
                    'product_name' => $step['product_name'],
                    'product_type' => $step['product_type'],
                    'time'         => $step['time'],
                    'note'         => $step['note'] ?? null,
                    'is_checked'   => false,
                ]);
            }
        }
 
        return response()->json([
            'success' => true,
            'message' => 'Routine created successfully',
            'data'    => $routine->load('steps'),
        ], 201);
    }
 
    // POST /api/routines/{id}/steps  — إضافة خطوة لروتين موجود
    public function addStep(Request $request, $id): JsonResponse
    {
        $routine = Routine::findOrFail($id);
 
        $request->validate([
            'product_name' => 'required|string',
            'product_type' => 'required|string',
            'time'         => 'required|in:Morning,Night,Both',
            'note'         => 'nullable|string',
        ]);
 
        $lastOrder = $routine->steps()->max('step_order') ?? 0;
 
        $step = RoutineStep::create([
            'routine_id'   => $routine->id,
            'step_order'   => $lastOrder + 1,
            'product_name' => $request->product_name,
            'product_type' => $request->product_type,
            'time'         => $request->time,
            'note'         => $request->note,
            'is_checked'   => false,
        ]);
 
        return response()->json([
            'success' => true,
            'message' => 'Step added',
            'data'    => $step,
        ], 201);
    }
 
    // PATCH /api/routines/steps/{stepId}/toggle — تشييك/إلغاء الخطوة
    public function toggleStep($stepId): JsonResponse
    {
        $step = RoutineStep::findOrFail($stepId);
        $step->update(['is_checked' => !$step->is_checked]);
 
        return response()->json([
            'success'    => true,
            'is_checked' => $step->is_checked,
        ]);
    }
 
    // DELETE /api/routines/steps/{stepId}
    public function deleteStep($stepId): JsonResponse
    {
        RoutineStep::findOrFail($stepId)->delete();
 
        return response()->json([
            'success' => true,
            'message' => 'Step deleted',
        ]);
    }
 
    // DELETE /api/routines/{id}
    public function destroy($id): JsonResponse
    {
        Routine::findOrFail($id)->delete();
 
        return response()->json([
            'success' => true,
            'message' => 'Routine deleted',
        ]);
    }
}
