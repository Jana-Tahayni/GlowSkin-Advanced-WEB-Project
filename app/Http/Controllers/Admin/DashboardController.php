<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SkinAnalysis;
use App\Models\Routine;
use App\Models\ProductCheck;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        // ── Stats Cards ──
        $totalUsers   = User::where('role', 'user')->count();
        $totalDoctors = User::where('role', 'doctor')->count();
        $totalAnalyses = SkinAnalysis::count();
        $totalRoutines = Routine::count();

        // ── Weekly Analyses (last 7 days) ──
        $days = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            return [
                'name'     => $date->format('D'),
                'analyses' => SkinAnalysis::whereDate('created_at', $date)->count(),
            ];
        });

        // ── Most Analyzed Products ──
        $topProducts = ProductCheck::select('product_name', DB::raw('count(*) as count'))
            ->groupBy('product_name')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'name'  => $p->product_name,
                'count' => $p->count,
            ]);

        // ── Recent Activity ──
        $recentUsers = User::where('role', 'user')
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn($u) => [
                'id'     => 'user_' . $u->id,
                'action' => 'New user registered',
                'user'   => $u->first_name . ' ' . $u->last_name,
                'time'   => $u->created_at->diffForHumans(),
                'type'   => 'user',
            ]);

        $recentAnalyses = SkinAnalysis::with('user')
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn($a) => [
                'id'     => 'analysis_' . $a->id,
                'action' => 'AI Analysis completed',
                'user'   => $a->user
                    ? $a->user->first_name . ' ' . $a->user->last_name
                    : 'Unknown',
                'time'   => $a->created_at->diffForHumans(),
                'type'   => 'analysis',
            ]);

        $recentActivity = $recentUsers
            ->concat($recentAnalyses)
            ->sortByDesc('time')
            ->values()
            ->take(5);

        return response()->json([
            'success' => true,
            'data'    => [
                'stats' => [
                    'totalUsers'    => $totalUsers,
                    'totalDoctors'  => $totalDoctors,
                    'totalAnalyses' => $totalAnalyses,
                    'totalRoutines' => $totalRoutines,
                ],
                'weeklyAnalyses' => $days,
                'topProducts'    => $topProducts,
                'recentActivity' => $recentActivity,
            ],
        ]);
    }
}