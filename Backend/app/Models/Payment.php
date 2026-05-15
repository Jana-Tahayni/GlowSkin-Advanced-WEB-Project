<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
    'user_id',
    'analysis_id',
    'amount',
    'currency',
    'status',
    'stripe_id',
    'paid_at'
];

public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function analysis()
    {
        return $this->belongsTo(SkinAnalysis::class, 'analysis_id');
    }
}
