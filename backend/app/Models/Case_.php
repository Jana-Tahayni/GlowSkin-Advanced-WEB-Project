<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Case_ extends Model
{
    use HasFactory;

    protected $table = 'cases';

    protected $fillable = [
        'user_id',
        'patient_name',
        'patient_id',
        'image_path',
        'condition',
        'result',
        'confidence',
        'status',
        'doctor_notes',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'confidence'  => 'integer',
    ];

    // العلاقة مع المريض
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // العلاقة مع الروتينات
    public function routines()
    {
        return $this->hasMany(Routine::class, 'case_id');
    }

    // رابط الصورة كامل
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path
            ? asset('storage/' . $this->image_path)
            : null;
    }
}