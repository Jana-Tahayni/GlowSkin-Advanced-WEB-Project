<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SkinAnalysisFactory extends Factory
{
    private static array $summaries = [
        'Mild dehydration detected with slight redness around the T-zone.',
        'Skin shows good hydration levels with minimal pore visibility.',
        'Early signs of hyperpigmentation on cheeks. SPF recommended.',
        'Oily skin with clogged pores. Recommend salicylic acid cleanser.',
        'Well-balanced skin with even tone and smooth texture.',
        'Slight sensitivity detected. Avoid fragrance-based products.',
        'Dry patches on forehead and chin. Increase moisturiser frequency.',
        'Healthy skin barrier. Continue current routine.',
    ];

    public function definition(): array
    {
        return [
            'summary'       => fake()->randomElement(self::$summaries),
            'overall_score' => fake()->numberBetween(40, 98),
            'skin_type'     => fake()->randomElement(['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive']),
            'image_path'    => 'analyses/sample-' . fake()->numberBetween(1, 10) . '.jpg',
            'metrics'       => json_encode([
                'hydration'  => fake()->numberBetween(30, 100),
                'texture'    => fake()->numberBetween(30, 100),
                'brightness' => fake()->numberBetween(30, 100),
                'oiliness'   => fake()->numberBetween(30, 100),
            ]),
            'concerns' => json_encode(
                fake()->randomElements([
                    'Acne', 'Dryness', 'Oiliness', 'Hyperpigmentation',
                    'Redness', 'Wrinkles', 'Dark circles', 'Large pores',
                ], rand(1, 3))
            ),
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}