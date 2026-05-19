<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'user');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name',  'like', "%{$request->search}%")
                  ->orWhere('email',      'like', "%{$request->search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(8);

        return response()->json(['success' => true, 'data' => $users]);
    }

    public function show(User $user): JsonResponse
    {
        // ── Skin Analyses ──
        $analyses = $user->skinAnalyses()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn($a) => [
                'id'           => $a->id,
                'date'         => $a->created_at->format('Y-m-d'),
                'result'       => $a->summary,
                'healthScore'  => $a->overall_score,
                'image_path'   => $a->image_path,
            ]);

        $beforeImage = $analyses->first()['image_path'] ?? null;
$afterImage  = $analyses->last()['image_path'] ?? null;

        // ── Routines ──
        $routines = $user->routines()
            ->with('steps')
            ->orderBy('created_at', 'desc')
            ->get();

        $currentRoutine  = null;
        $previousRoutines = [];

        foreach ($routines as $index => $routine) {
            $products = $routine->steps->pluck('product_name')->toArray();
            $data = [
                'name'      => "Skin Care Routine ({$routine->time})",
                'startDate' => $routine->created_at->format('Y-m-d'),
                'products'  => $products,
                'notes'     => $routine->notes,
            ];
            if ($index === 0) {
                $currentRoutine = $data;
            } else {
                $previousRoutines[] = array_merge($data, [
                    'period' => $routine->created_at->format('M Y'),
                ]);
            }
        }

        // ── Analyzed Products ──
        $analyzedProducts = $user->productChecks()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => [
                'name'   => $p->product_name,
                'rating' => match(true) {
                    $p->effectiveness_score >= 85 => 'Excellent',
                    $p->effectiveness_score >= 70 => 'Good',
                    default                       => 'Average',
                },
                'match'  => $p->effectiveness_score,
            ]);

        return response()->json([
            'success' => true,
            'data'    => [
                'id'               => $user->id,
                'name'             => $user->first_name . ' ' . $user->last_name,
                'email'            => $user->email,
                'registeredAt'     => $user->created_at->format('Y-m-d'),
                'skinType'         => $user->skin_type ?? '—',
                'status'           => $user->email_verified_at ? 'Active' : 'Inactive',
                'analyses'         => $analyses,
                'beforeImage'      => $beforeImage,
                'afterImage'       => $afterImage,
                'currentRoutine'   => $currentRoutine,
                'previousRoutines' => $previousRoutines,
                'analyzedProducts' => $analyzedProducts,
            ],
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['success' => true, 'message' => 'User deleted successfully.']);
    }
}