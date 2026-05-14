<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class ProductAnalyzerService
{
    private const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
    private const MODEL = 'llama-3.3-70b-versatile';
    private const MAX_TOKENS = 2048;

    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = env('GROQ_API_KEY');
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
    \"key_ingredients\": [\"ingredient1\", \"ingredient2\"],
    \"warnings\": [\"warning1\"],
    \"verdict\": \"short summary\"
}";

        $raw = $this->callGroq($prompt);
        return $this->parseResponse($raw);
    }

    public function analyzeByImage(string $base64Image, string $mimeType, string $skinType): array
    {
        // Groq ما بيدعم صور مباشرة — نستخدم نص بديلاً مؤقتاً
        $prompt = "Analyze a skincare product for someone with {$skinType} skin.
Assume it's a general moisturizer and provide analysis.

Respond ONLY with this exact JSON structure:
{
    \"product_name\": \"Unknown Product\",
    \"compatibility\": \"good or neutral or bad\",
    \"effectiveness_score\": 85,
    \"safety_score\": 90,
    \"key_ingredients\": [\"ingredient1\", \"ingredient2\"],
    \"warnings\": [\"warning1\"],
    \"verdict\": \"short summary\"
}";

        $raw = $this->callGroq($prompt);
        return $this->parseResponse($raw);
    }

    private function callGroq(string $prompt): array
    {
        try {
            $response = Http::timeout(60)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type'  => 'application/json',
                ])
                ->post(self::API_URL, [
                    'model'       => self::MODEL,
                    'max_tokens'  => self::MAX_TOKENS,
                    'temperature' => 0.1,
                    'messages'    => [
                        [
                            'role'    => 'system',
                            'content' => self::SYSTEM_PROMPT,
                        ],
                        [
                            'role'    => 'user',
                            'content' => $prompt,
                        ],
                    ],
                ]);

            if ($response->failed()) {
                Log::error('Groq API error', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                throw new RuntimeException('AI service error: ' . ($response->json()['error']['message'] ?? 'Unknown error'));
            }

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Groq API call failed', ['message' => $e->getMessage()]);
            throw new RuntimeException('AI service is temporarily unavailable');
        }
    }

    private function parseResponse(array $data): array
    {
        $rawText = $data['choices'][0]['message']['content'] ?? null;

        if (!$rawText) {
            Log::error('Groq returned empty response', ['data' => $data]);
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