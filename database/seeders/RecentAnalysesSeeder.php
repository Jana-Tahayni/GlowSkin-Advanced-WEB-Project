<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SkinAnalysis;
use Illuminate\Database\Seeder;

class RecentAnalysesSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();

        foreach ($users as $user) {
        
            $user->skinAnalyses()->create(
                SkinAnalysis::factory()->make([
                    'created_at' => fake()->dateTimeBetween('-7 days', 'now'),
                ])->toArray()
            );
        }

        $this->command->info('Recent analyses added: ' . $users->count());
    }
}