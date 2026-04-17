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
       
    }

    public function analyzeByImage(string $base64Image, string $mimeType, string $skinType): array
    {
       
    }

    private function callGemini(array $messages): array
    {
     
    }

    private function parseGeminiResponse(array $data): array
    {
    }
}