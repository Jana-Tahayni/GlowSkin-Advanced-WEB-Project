<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Routine;
use App\Models\SkinAnalysis;
use App\Models\RoutineStep;
use App\Models\ProductCheck;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $demo = User::factory()->active()->create([
            'first_name' => 'Sara',
            'last_name'  => 'Hassan',
            'email'      => 'sara@demo.com',
            'skin_type'  => 'Combination',
        ]);
        $this->seedUserData($demo, analyses: 5, routines: 3, products: 6);

        User::factory()->active()->count(80)->create()->each(function ($user) {
            $this->seedUserData($user,
                analyses: rand(2, 6),
                routines: rand(1, 3),
                products: rand(2, 8),
            );
        });

        User::factory()->active()->count(10)->create()->each(function ($user) {
            $this->seedAnalyses($user, rand(1, 3));
        });

        User::factory()->unverified()->count(9)->create();

        $this->command->info('Users seeded: ' . User::where('role', 'user')->count());
    }

    private function seedUserData(User $user, int $analyses, int $routines, int $products): void
    {
        $this->seedAnalyses($user, $analyses);
        $this->seedRoutines($user, $routines);
        $user->productChecks()->createMany(
            ProductCheck::factory()->count($products)->make()->toArray()
        );
    }

    private function seedAnalyses(User $user, int $count): void
    {
        $base = now()->subMonths($count);
        for ($i = 0; $i < $count; $i++) {
            $user->skinAnalyses()->create(
                SkinAnalysis::factory()->make([
                    'created_at' => (clone $base)->addMonths($i),
                ])->toArray()
            );
        }
    }

    private function seedRoutines(User $user, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            $routine = $user->routines()->create(
                Routine::factory()->make([
                    'created_at' => now()->subMonths($i),
                ])->toArray()
            );
            $routine->steps()->createMany(
                RoutineStep::factory()->count(rand(3, 5))->make()->toArray()
            );
        }
    }
}