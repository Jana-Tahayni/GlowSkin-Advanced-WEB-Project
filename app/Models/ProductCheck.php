<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCheck extends Model
{
     protected $fillable = [
        'user_id',
        'product_name',
        'image_path',
        'effectiveness_score',
        'safety_score',
        'compatibility',
        'key_ingredients',
        'warnings',
        'verdict',
    ];
      protected $casts = [
        'key_ingredients' => 'array', // JSON في DB ← array في PHP
        'warnings'        => 'array', // JSON في DB ← array في PHP
    ];

     public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

}
