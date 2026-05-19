<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RoutineStepFactory extends Factory
{
    private static array $products = [
        'CeraVe Hydrating Cleanser'    => 'Cleanser',
        'Neutrogena Hydro Boost'        => 'Moisturizer',
        'La Roche-Posay SPF 50'         => 'Sunscreen',
        'The Ordinary Niacinamide 10%'  => 'Serum',
        'Paula\'s Choice BHA Exfoliant' => 'Treatment',
        'Differin Gel'                  => 'Treatment',
        'Hyaluronic Acid Serum'         => 'Serum',
        'Cetaphil Gentle Cleanser'      => 'Cleanser',
        'Aveeno Daily Moisturiser'      => 'Moisturizer',
        'EltaMD UV Clear SPF 46'        => 'Sunscreen',
    ];

    public function definition(): array
    {
        $name = fake()->randomElement(array_keys(self::$products));

        return [
            'product_name' => $name,
            'product_type' => self::$products[$name],
            'step_order'   => fake()->numberBetween(1, 5),
            'time'         => fake()->randomElement(['Morning', 'Night', 'Both']),
            'note'         => fake()->optional(0.4)->sentence(),
            'is_checked'   => false,
        ];
    }
}