<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; 
class RoutineStep extends Model
{
    use HasFactory;
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
