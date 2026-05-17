<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\SkinAnalysis;
use App\Models\Payment;
use Illuminate\Http\Request;

class PublicStatsController extends Controller
{
public function getHomeStats()
{
    try {
        // نستخدم المسار الكامل للموديل لنتأكد أنه سيجده
        $usersCount = \App\Models\User::count();
        $analysesCount = \App\Models\SkinAnalysis::count();
        $consultationsCount = \App\Models\Payment::where('status', 'paid')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'users' => $usersCount,
                'analyses' => $analysesCount,
                'consultations' => $consultationsCount,
                'rating' => 4.9
            ]
        ]);
    } catch (\Exception $e) {
        // إذا ظهر خطأ هنا، سيعطيكِ اسم الموديل الذي فيه مشكلة بالضبط
        return response()->json([
            'success' => false, 
            'error' => $e->getMessage()
        ], 500);
    }
}
}