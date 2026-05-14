<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class ProductAnalyzerService
{
    private const API_URL  = 'https://api.anthropic.com/v1/messages';
    private const MODEL    = 'claude-opus-4-5';
    private const MAX_TOKENS = 1024;

    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = env('ANTHROPIC_API_KEY');
    }

    private const SYSTEM_PROMPT = "You are a professional cosmetic chemist and dermatologist.
Analyze skincare products and their ingredients accurately.
Always respond ONLY with valid JSON — no markdown, no code blocks, no extra text.";

    public function analyzeByName(string $productName, string $skinType): array
    {
        $prompt = "Analyze this skincare product for someone with {$skinType} skin.
Product name: {$productName}

Respond ONLY with this exact JSON structure:
{
    \"product_name\": \"product name\",
    \"compatibility\": \"good or neutral or bad\",
    \"effectiveness_score\": 85,
    \"safety_score\": 90,
    \"key_ingredients\": [
    {\"name\": \"ingredient name\", \"desc\": \"what it does\", \"status\": \"good or caution or bad\"},
    {\"name\": \"ingredient name\", \"desc\": \"what it does\", \"status\": \"good or caution or bad\"}
],
    \"warnings\": [\"warning1\"],
    \"verdict\": \"short summary\"
}";

        $raw = $this->callClaude($prompt);
        return $this->parseResponse($raw);
    }

    public function analyzeByImage(string $base64Image, string $mimeType, string $skinType): array
    {
        $messages = [
            [
                'role'    => 'user',
                'content' => [
                    [
                        'type'   => 'image',
                        'source' => [
                            'type'       => 'base64',
                            'media_type' => $mimeType,
                            'data'       => $base64Image,
                        ],
                    ],
                    [
                        'type' => 'text',
                        'text' => "Analyze the ingredients in this skincare product image for someone with {$skinType} skin.

Respond ONLY with this exact JSON structure:
{
    \"product_name\": \"product name if visible or Unknown Product\",
    \"compatibility\": \"good or neutral or bad\",
    \"effectiveness_score\": 85,
    \"safety_score\": 90,
    \"key_ingredients\": [
    {\"name\": \"ingredient name\", \"desc\": \"what it does\", \"status\": \"good or caution or bad\"},
    {\"name\": \"ingredient name\", \"desc\": \"what it does\", \"status\": \"good or caution or bad\"}
],
    \"warnings\": [\"warning1\"],
    \"verdict\": \"short summary\"
}",
                    ],
                ],
            ],
        ];

        $raw = $this->callClaude(null, $messages);
        return $this->parseResponse($raw);
    }

    private function callClaude(?string $prompt, ?array $messages = null): array
    {
        // إذا مافي messages جاهزة، اعمل واحدة بسيطة من الـ prompt
        if (!$messages) {
            $messages = [
                ['role' => 'user', 'content' => $prompt]
            ];
        }

        try {
            $response = Http::timeout(60)
                ->withHeaders([
                    'x-api-key'         => $this->apiKey,
                    'anthropic-version' => '2023-06-01',
                    'Content-Type'      => 'application/json',
                ])
                ->post(self::API_URL, [
                    'model'      => self::MODEL,
                    'max_tokens' => self::MAX_TOKENS,
                    'system'     => self::SYSTEM_PROMPT,
                    'messages'   => $messages,
                ]);

            if ($response->failed()) {
                Log::error('Claude API error', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                throw new RuntimeException('AI service error: ' . ($response->json()['error']['message'] ?? 'Unknown error'));
            }

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Claude API call failed', ['message' => $e->getMessage()]);
            throw new RuntimeException('AI service is temporarily unavailable');
        }
    }

    private function parseResponse(array $data): array
    {
        $rawText = $data['content'][0]['text'] ?? null;

        if (!$rawText) {
            Log::error('Claude returned empty response', ['data' => $data]);
            throw new RuntimeException('AI returned empty response');
        }

        $cleanText = preg_replace('/^```(?:json)?\s*/i', '', trim($rawText));
        $cleanText = preg_replace('/\s*```$/', '', $cleanText);

        $parsed = json_decode(trim($cleanText), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($parsed)) {
            Log::error('JSON Parsing failed', ['raw' => $rawText]);
            throw new RuntimeException('Invalid JSON format from AI');
        }

        return array_merge([
            'product_name'        => 'Unknown Product',
            'compatibility'       => 'neutral',
            'effectiveness_score' => 0,
            'safety_score'        => 0,
            'key_ingredients'     => [],
            'warnings'            => [],
            'verdict'             => '',
        ], $parsed);
    }
}