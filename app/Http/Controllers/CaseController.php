<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Case_;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
 
class CaseController extends Controller
{
    // GET /api/cases
    public function index(Request $request): JsonResponse
    {
        $query = Case_::query();
 
        // فلتر حسب الـ status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
 
        // فلتر حسب الـ condition
        if ($request->has('condition')) {
            $query->where('condition', $request->condition);
        }
 
        // بحث بالاسم
        if ($request->has('search')) {
            $query->where('patient_name', 'like', '%' . $request->search . '%');
        }
 
        $cases = $query->latest()->get()->map(function ($case) {
            return [
                'id'           => $case->id,
                'patientName'  => $case->patient_name,
                'patientId'    => $case->patient_id,
                'image'        => $case->image_url,
                'condition'    => $case->condition,
                'result'       => $case->result,
                'confidence'   => $case->confidence,
                'status'       => $case->status,
                'doctorNotes'  => $case->doctor_notes,
                'date'         => $case->created_at->format('d M'),
                'reviewedAt'   => $case->reviewed_at,
            ];
        });
 
        return response()->json([
            'success' => true,
            'data'    => $cases,
        ]);
    }
 
    // GET /api/cases/stats
    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'total'    => Case_::count(),
                'pending'  => Case_::where('status', 'pending')->count(),
                'reviewed' => Case_::where('status', 'reviewed')->count(),
                'urgent'   => Case_::where('status', 'urgent')->count(),
                 'rejected'   => Case_::where('status', 'rejected')->count(),
                'byCondition' => Case_::selectRaw('`condition`, count(*) as count')
                    ->groupBy('condition')
                    ->pluck('count', 'condition'),
            ],
        ]);
    }
 
    // GET /api/cases/{id}
    public function show($id): JsonResponse
    {
        $case = Case_::with('routines.steps')->findOrFail($id);
 
        return response()->json([
            'success' => true,
            'data'    => [
                'id'          => $case->id,
                'patientName' => $case->patient_name,
                'patientId'   => $case->patient_id,
                'image'       => $case->image_url,
                'condition'   => $case->condition,
                'result'      => $case->result,
                'confidence'  => $case->confidence,
                'status'      => $case->status,
                'doctorNotes' => $case->doctor_notes,
                'date'        => $case->created_at->format('d M Y'),
                'routines'    => $case->routines,
            ],
        ]);
    }
 
    // POST /api/cases
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'patient_name' => 'required|string|max:255',
            'image'        => 'nullable|image|max:5120',
            'condition'    => 'nullable|string',
            'result'       => 'nullable|string',
            'confidence'   => 'nullable|integer|min:0|max:100',
            'status'       => 'nullable|in:pending,reviewed,urgent,rejected',
        ]);
 
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('cases', 'public');
        }
 
        // توليد patient_id تلقائي
        $lastId = Case_::max('id') ?? 0;
        $patientId = '#C-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT);
 
        $case = Case_::create([
            'patient_name' => $request->patient_name,
            'patient_id'   => $patientId,
            'image_path'   => $imagePath,
            'condition'    => $request->condition,
            'result'       => $request->result,
            'confidence'   => $request->confidence,
            'status'       => $request->status ?? 'pending',
        ]);
 
        return response()->json([
            'success' => true,
            'message' => 'Case created successfully',
            'data'    => $case,
        ], 201);
    }
 
    // PUT /api/cases/{id}
    public function update(Request $request, $id): JsonResponse
    {
        $case = Case_::findOrFail($id);
 
        $request->validate([
            'status'       => 'nullable|in:pending,reviewed,urgent,rejected',
            'doctor_notes' => 'nullable|string',
            'condition'    => 'nullable|string',
            'result'       => 'nullable|string',
        ]);
 
        $data = $request->only(['status', 'doctor_notes', 'condition', 'result', 'confidence']);
 
        // لو صار reviewed نحفظ الوقت
        if (isset($data['status']) && $data['status'] === 'reviewed') {
            $data['reviewed_at'] = Carbon::now();
        }
 
        $case->update($data);
 
        return response()->json([
            'success' => true,
            'message' => 'Case updated successfully',
            'data'    => $case,
        ]);
    }
 
    // POST /api/cases/{id}/approve
  public function approve($id)
{
    $case = Case_::findOrFail($id);

    $case->status = 'reviewed';

    $case->save();

    return response()->json([
        'message' => 'Case approved successfully'
    ]);
}
 
    // POST /api/cases/{id}/reject
    public function reject(Request $request, $id): JsonResponse
    {
        $case = Case_::findOrFail($id);
        $case->update([
            'status'       => 'pending',
            'doctor_notes' => $request->reason ?? 'Rejected - needs re-evaluation',
        ]);
 
        return response()->json([
            'success' => true,
            'message' => 'Case rejected',
        ]);
    }
 
    // DELETE /api/cases/{id}
    public function destroy($id): JsonResponse
    {
        $case = Case_::findOrFail($id);
 
        if ($case->image_path) {
            Storage::disk('public')->delete($case->image_path);
        }
 
        $case->delete();
 
        return response()->json([
            'success' => true,
            'message' => 'Case deleted successfully',
        ]);
    }
}
