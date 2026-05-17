<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductCheckFactory extends Factory
{
    private static array $products = [
        'CeraVe Moisturising Cream',
        'The Ordinary Glycolic Acid 7%',
        'Bioderma Sensibio H2O',
        'La Roche-Posay Toleriane',
        'Neutrogena Rapid Clear',
        'COSRX Snail Mucin Essence',
        'Drunk Elephant Lala Retro',
        'Tatcha The Water Cream',
        'Paula\'s Choice BHA Exfoliant',
        'EltaMD UV Clear SPF 46',
    ];

    private static array $ingredients = [
        'Niacinamide', 'Hyaluronic Acid', 'Retinol', 'Vitamin C',
        'Salicylic Acid', 'Ceramides', 'Glycerin', 'Zinc',
    ];

    public function definition(): array
    {
        $effectiveness = fake()->numberBetween(50, 99);

        return [
            'product_name'        => fake()->randomElement(self::$products),
            'image_path'          => null,
            'effectiveness_score' => $effectiveness,
            'safety_score'        => fake()->numberBetween(60, 99),
            'compatibility'       => fake()->randomElement(['High', 'Medium', 'Low']),
            'key_ingredients'     => json_encode(
                fake()->randomElements(self::$ingredients, rand(2, 4))
            ),
            'warnings' => json_encode(
                fake()->optional(0.4)->randomElements(
                    ['Fragrance', 'Alcohol', 'Sulfates', 'Parabens'],
                    rand(1, 2)
                ) ?? []
            ),
            'verdict' => fake()->randomElement([
                'Excellent choice for your skin type.',
                'Generally safe but patch test recommended.',
                'Good product with minor concerns.',
                'Use with caution — contains potential irritants.',
                'Highly compatible with your current routine.',
            ]),
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}