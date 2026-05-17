<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RoutineFactory extends Factory
{
    public function definition(): array
    {
        return [
            'patient_name' => fake()->name(),
            'time'         => fake()->randomElement(['Morning', 'Night', 'Both']),
            'notes'        => fake()->optional(0.6)->sentence(),
            'created_at'   => fake()->dateTimeBetween('-8 months', 'now'),
        ];
    }
}