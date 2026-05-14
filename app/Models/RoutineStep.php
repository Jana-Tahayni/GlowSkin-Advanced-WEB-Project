<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class RoutineStep extends Model
{
    protected $fillable = [
        'routine_id',
        'step_order',
        'product_name',
        'product_type',
        'time',
        'note',
        'is_checked',
    ];
 
    protected $casts = [
        'is_checked' => 'boolean',
    ];
 
    public function routine()
    {
        return $this->belongsTo(Routine::class);
    }
}
