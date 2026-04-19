<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class ProductAnalyzerService
{
    private const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    private const MODEL = 'gemini-1.5-flash';
    private const MAX_TOKENS = 1024;

    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
    }
    private const SYSTEM_PROMPT = "You are a professional cosmetic chemist and dermatologist.
                                    Analyze skincare products and their ingredients.
                                    Always respond ONLY with valid JSON — no explanation, no markdown, no code blocks.
                                    Never add any text outside the JSON object.";

    public function analyzeByName(string $productName, string $skinType): array
    {
        return [];
    }

    public function analyzeByImage(string $base64Image, string $mimeType, string $skinType): array
    {
        return [];
    }

    private function callGemini(string $prompt): array
    {
      
    try {
        $response = Http::timeout(60)
            ->post($this->API_URL . '?key=' . $this->apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => self::SYSTEM_PROMPT . "\n\n" . $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'maxOutputTokens' => self::MAX_TOKENS,
                    'temperature'     => 0.1, 
                ]
            ]);

        if ($response->failed()) {
            Log::error('Gemini API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            throw new RuntimeException('AI service is temporarily unavailable');
        }
        return $response->json();

    } catch (RuntimeException $e) {
        throw $e;
    } catch (\Exception $e) {
        Log::error('Gemini API call failed', ['message' => $e->getMessage()]);
        throw new RuntimeException('AI service is temporarily unavailable');
    }

    }

    private function parseGeminiResponse(array $data): array
    {
    return [];
    }
}