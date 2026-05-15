<?php
<<<<<<< HEAD
 
namespace Database\Seeders;
 
use Illuminate\Database\Seeder;
use App\Models\Case_;
use App\Models\Routine;
use App\Models\RoutineStep;
 
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── SAMPLE CASES ──────────────────────────────────────
        $cases = [
            [
                'patient_name' => 'Sara Al-Ahmad',
                'patient_id'   => '#C-2024',
                'condition'    => 'acne',
                'result'       => 'Acne — Grade II',
                'confidence'   => 89,
                'status'       => 'pending',
            ],
            [
                'patient_name' => 'Maya Khalil',
                'patient_id'   => '#C-2023',
                'condition'    => 'dry',
                'result'       => 'Dry Skin',
                'confidence'   => 95,
                'status'       => 'reviewed',
                'doctor_notes' => 'Recommend heavy moisturizer and hydrating serum.',
            ],
            [
                'patient_name' => 'Rania Nasser',
                'patient_id'   => '#C-2022',
                'condition'    => 'sensitive',
                'result'       => 'Rosacea — Mild',
                'confidence'   => 76,
                'status'       => 'urgent',
            ],
            [
                'patient_name' => 'Ali Hassan',
                'patient_id'   => '#C-2021',
                'condition'    => 'oily',
                'result'       => 'Oily T-Zone',
                'confidence'   => 91,
                'status'       => 'reviewed',
                'doctor_notes' => 'Use niacinamide and oil-free moisturizer.',
            ],
            [
                'patient_name' => 'Lina Mansour',
                'patient_id'   => '#C-2020',
                'condition'    => 'combo',
                'result'       => 'Combo + Oily T-Zone',
                'confidence'   => 92,
                'status'       => 'pending',
            ],
        ];
 
        foreach ($cases as $caseData) {
            $case = Case_::create($caseData);
 
            // أضف روتين للحالة الأولى كمثال
            if ($case->patient_id === '#C-2024') {
                $routine = Routine::create([
                    'case_id'      => $case->id,
                    'patient_name' => $case->patient_name,
                    'time'         => 'Morning',
                    'notes'        => 'Acne-focused morning routine',
                ]);
 
                $steps = [
                    ['product_name' => 'Gentle Salicylic Cleanser', 'product_type' => 'Cleanser',    'time' => 'Morning', 'note' => 'Massage 60 seconds, rinse lukewarm'],
                    ['product_name' => 'Niacinamide 10% Serum',     'product_type' => 'Serum',       'time' => 'Morning', 'note' => 'Apply 2-3 drops on damp skin'],
                    ['product_name' => 'Oil-Free Moisturizer',       'product_type' => 'Moisturizer', 'time' => 'Morning', 'note' => 'Light layer only'],
                    ['product_name' => 'SPF 50 Sunscreen',           'product_type' => 'Sunscreen',   'time' => 'Morning', 'note' => 'Last step always'],
                ];
 
                foreach ($steps as $i => $step) {
                    RoutineStep::create([
                        'routine_id'   => $routine->id,
                        'step_order'   => $i + 1,
                        'product_name' => $step['product_name'],
                        'product_type' => $step['product_type'],
                        'time'         => $step['time'],
                        'note'         => $step['note'],
                        'is_checked'   => false,
                    ]);
                }
            }
        }
=======

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
    }
}
