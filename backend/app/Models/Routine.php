<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
 
class Routine extends Model
{
    use HasFactory;
 
    protected $fillable = [
        'case_id',
        'patient_name',
        'time',
        'notes',
    ];
 
    public function case_()
    {
        return $this->belongsTo(Case_::class, 'case_id');
    }
 
    public function steps()
    {
        return $this->hasMany(RoutineStep::class)->orderBy('step_order');
    }
}