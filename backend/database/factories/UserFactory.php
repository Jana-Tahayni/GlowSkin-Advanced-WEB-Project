<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name'        => fake()->firstName(),
            'last_name'         => fake()->lastName(),
            'email'             => fake()->unique()->safeEmail(),
            'password'          => Hash::make('Password123'),
            'skin_type'         => fake()->randomElement(['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']),
            'role'              => 'user',
            'provider'          => 'email',
            'provider_id'       => null,
            'avatar'            => null,
            'email_verified_at' => fake()->boolean(80) ? now() : null,
        ];
    }

    public function unverified(): static
{
    return $this->state(fn () => ['email_verified_at' => null]);
}

public function active(): static
{
    return $this->state(fn () => ['email_verified_at' => now()]);
}
}