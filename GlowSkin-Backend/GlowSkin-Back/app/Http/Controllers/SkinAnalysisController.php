<?php

namespace App\Http\Controllers;

use App\Models\SkinAnalysis;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;


class SkinAnalysisController extends Controller
{

    #[OA\Get(
    path: '/api/analyses',
    summary: 'Get all skin analyses',
    description: 'Returns all skin analyses ordered by date (newest first)',
    tags: ['Skin Analysis'],
    responses: [
        new OA\Response(
            response: 200,
            description: 'Success',
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'success', type: 'boolean', example: true),
                    new OA\Property(property: 'data', type: 'array', items: new OA\Items(type: 'object'))
                ]
            )
        )
    ]
)]
    public function index()
    {
        $analyses = SkinAnalysis::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $analyses,
        ]);
    }

    #[OA\Get(
    path: '/api/analyses/{id}',
    summary: 'Get a specific skin analysis',
    tags: ['Skin Analysis'],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1))
    ],
    responses: [
        new OA\Response(response: 200, description: 'Success'),
        new OA\Response(response: 404, description: 'Not found')
    ]
)]

    public function show($id)
    {
        $analysis = SkinAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'success' => false,
                'message' => 'Analysis not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $analysis,
        ]);
    }

#[OA\Post(
    path: '/api/analyze',
    summary: 'Analyze a skin photo',
    description: 'Sends a base64 image to Claude AI for skin analysis and saves the result',
    tags: ['Skin Analysis'],
    requestBody: new OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['image'],
            properties: [
                new OA\Property(
                    property: 'image',
                    type: 'string',
                    description: 'Base64 encoded image without data:image prefix',
                    example: '/9j/4AAQSkZJRgAB...'
                )
            ]
        )
    ),
    responses: [
        new OA\Response(response: 201, description: 'Analysis created successfully'),
        new OA\Response(response: 422, description: 'Validation error')
    ]
)]
    public function analyze(Request $request)
    {
        // 1. التحقق من البيانات الواردة
        $request->validate([
            'image' => 'required|string', // base64 image
        ]);

        // 2. نرسل الصورة لـ Claude API ونحصل على النتائج
        $results = $this->analyzeWithClaude($request->image);

        // 3. نخزن النتائج في الـ database
        $analysis = SkinAnalysis::create([
            'overall_score'   => $results['overall_score'],
            'skin_type'       => $results['skin_type'],
            'summary'         => $results['summary'],
            'metrics'         => $results['metrics'],
            'concerns'        => $results['concerns'],
            'image_path'      => null, // رح نضيفها لاحقاً
        ]);

        // 4. نرجع النتائج للفرونت
        return response()->json([
            'success' => true,
            'data'    => $analysis,
        ], 201);
    }


    #[OA\Delete(
    path: '/api/analyses/{id}',
    summary: 'Delete a skin analysis',
    tags: ['Skin Analysis'],
    parameters: [
        new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer', example: 1))
    ],
    responses: [
        new OA\Response(response: 200, description: 'Deleted successfully'),
        new OA\Response(response: 404, description: 'Not found')
    ]
)]

    public function destroy($id)
    {
        $analysis = SkinAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'success' => false,
                'message' => 'Analysis not found',
            ], 404);
        }

        $analysis->delete();

        return response()->json([
            'success' => true,
            'message' => 'Analysis deleted successfully',
        ]);
    }

#[OA\Get(
    path: '/api/analyses/compare',
    summary: 'Compare two skin analyses',
    description: 'Returns two analyses with score difference for Before/After comparison',
    tags: ['Skin Analysis'],
    parameters: [
        new OA\Parameter(name: 'before', in: 'query', required: true, schema: new OA\Schema(type: 'integer', example: 1)),
        new OA\Parameter(name: 'after', in: 'query', required: true, schema: new OA\Schema(type: 'integer', example: 2))
    ],
    responses: [
        new OA\Response(response: 200, description: 'Success'),
        new OA\Response(response: 404, description: 'One or both analyses not found')
    ]
)]
public function compare(Request $request)
{
    // 1. التحقق من البيانات الواردة
    $request->validate([
        'before' => 'required|integer',
        'after'  => 'required|integer',
    ]);

    // 2. نجيب التحليلين من الـ database
    $before = SkinAnalysis::find($request->before);
    $after  = SkinAnalysis::find($request->after);

    // 3. نتأكد إنهم موجودين
    if (!$before || !$after) {
        return response()->json([
            'success' => false,
            'message' => 'One or both analyses not found',
        ], 404);
    }

    // 4. نحسب الفرق في الـ score
    $scoreDiff = $after->overall_score - $before->overall_score;

    // 5. نرجع البيانات مع المقارنة
    return response()->json([
        'success' => true,
        'data'    => [
            'before'     => $before,
            'after'      => $after,
            'score_diff' => $scoreDiff,
        ],
    ]);
}


private function analyzeWithClaude(string $imageBase64): array
{
    $client = new \GuzzleHttp\Client();

    $prompt = "You are a professional AI dermatologist with 20 years of experience analyzing skin conditions.

TASK: Analyze the skin in this photo with clinical precision.

INSTRUCTIONS:
- Examine the skin carefully for: texture, pores, hydration, oiliness, redness, dark spots, wrinkles, acne, pigmentation
- Base ALL scores on what you actually see in the image — do not guess
- Be specific in concerns based on the actual skin condition you observe

SCORING GUIDE:
- 90-100: Excellent, nearly perfect
- 75-89:  Good, minor issues
- 60-74:  Fair, noticeable issues
- 40-59:  Poor, significant concerns
- 0-39:   Critical, needs immediate attention

Return ONLY this JSON with no markdown, no code blocks, no extra text:
{
  \"overall_score\": <weighted average of all metrics>,
  \"skin_type\": \"<Dry|Oily|Combination|Normal|Sensitive>\",
  \"summary\": \"<3 clinical sentences: what you see, main concerns, general outlook>\",
  \"metrics\": [
    {\"id\": \"hydration\",   \"label\": \"Hydration\",   \"score\": <0-100>, \"color\": \"#5ba4cf\"},
    {\"id\": \"texture\",     \"label\": \"Texture\",     \"score\": <0-100>, \"color\": \"#b8c9a3\"},
    {\"id\": \"brightness\",  \"label\": \"Brightness\",  \"score\": <0-100>, \"color\": \"#f5c9b3\"},
    {\"id\": \"protection\",  \"label\": \"Protection\",  \"score\": <0-100>, \"color\": \"#c9a3b8\"},
    {\"id\": \"sensitivity\", \"label\": \"Sensitivity\", \"score\": <0-100>, \"color\": \"#f0a090\"}
  ],
  \"concerns\": [
    {\"tag\": \"<specific concern>\", \"severity\": \"<mild|moderate|high>\"}
  ]
}";

    try {
        $response = $client->post('https://api.anthropic.com/v1/messages', [
            'headers' => [
                'x-api-key'         => env('ANTHROPIC_API_KEY'),
                'anthropic-version' => '2023-06-01',
                'content-type'      => 'application/json',
            ],
            'json' => [
                'model'      => 'claude-opus-4-5',
                'max_tokens' => 2048,
                'messages'   => [
                    [
                        'role'    => 'user',
                        'content' => [
                            [
                                'type'   => 'image',
                                'source' => [
                                    'type'       => 'base64',
                                    'media_type' => 'image/jpeg',
                                    'data'       => $imageBase64,
                                ],
                            ],
                            [
                                'type' => 'text',
                                'text' => $prompt,
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $body    = json_decode($response->getBody()->getContents(), true);
        $content = $body['content'][0]['text'];

        // نظّف أي markdown
        $content = preg_replace('/```json|```/i', '', $content);
        $content = trim($content);

        // نشوف شو رجع Claude قبل نحاول نعمل parse
        \Log::info('Claude raw response: ' . $content);

        $result = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            \Log::error('JSON parse error: ' . json_last_error_msg());
            \Log::error('Raw content was: ' . $content);
            throw new \Exception('Claude returned invalid JSON: ' . json_last_error_msg());
        }

        return $result;

    } catch (\GuzzleHttp\Exception\ClientException $e) {
        $errorBody = $e->getResponse()->getBody()->getContents();
        \Log::error('Claude API client error: ' . $errorBody);
        throw new \Exception('Claude API error: ' . $errorBody);
    } catch (\Exception $e) {
        \Log::error('analyzeWithClaude error: ' . $e->getMessage());
        throw $e;
    }
}
}