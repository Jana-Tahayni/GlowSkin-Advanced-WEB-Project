<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkinAnalysis extends Model
{
    use HasFactory;  
    /**
     * الجدول اللي يتعامل معه هذا الـ Model
     */
    protected $table = 'skin_analyses';

    /**
     * الأعمدة اللي يسمح بالكتابة فيها (Mass Assignment)
     * بدون هذا، Laravel يرفض يحفظ البيانات
     */
    protected $fillable = [
        'user_id', 
        'overall_score',
        'skin_type',
        'summary',
        'metrics',
        'concerns',
        'image_path',
    ];

    /**
     * الأعمدة اللي نوعها JSON
     * Laravel رح يحوّلها تلقائياً من/إلى array
     */
    protected $casts = [
        'metrics'         => 'array',
        'concerns'        => 'array',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}