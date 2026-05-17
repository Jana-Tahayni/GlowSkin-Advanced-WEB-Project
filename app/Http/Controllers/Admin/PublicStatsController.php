<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SkinAnalysis;
use App\Models\Payment;

class PublicStatsController extends Controller
{
    public function getHomeStats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'users' => User::count(),
                'analyses' => SkinAnalysis::count(),
                'consultations' => Payment::where('status', 'paid')->count()
            ]
        ]);
    }
}