<?php

namespace App\Http\Controllers;

use App\Services\ProductAnalyzerService;
use Illuminate\Http\Request;
use App\Models\ProductCheck;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\AnalyzeProductRequest;
use App\Http\Requests\AnalyzeImageRequest;
use OpenApi\Attributes as OA;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductAnalyzerService $analyzerService
    ) {}

    #[OA\Post(
        path: "/api/product",
        summary: "Analyze product by name",
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["product_name"],
                properties: [
                    new OA\Property(property: "product_name", type: "string", example: "Neutrogena Hydro Boost"),
                    new OA\Property(property: "skin_type", type: "string", example: "oily"),
                ]
            )
        ),
        tags: ["Product"],
        responses: [
            new OA\Response(response: 200, description: "Product analyzed successfully"),
            new OA\Response(response: 422, description: "Skin profile incomplete"),
            new OA\Response(response: 503, description: "Service unavailable"),
        ]
    )]
    public function analyze(AnalyzeProductRequest $request): JsonResponse
    {
        $user     = $request->user();
        $userId   = $user->id;
        $skinType = $request->input('skin_type') ?? $user->skin_type;

        if (!$skinType) {
            return response()->json(
                ['message' => 'Please complete your skin profile first'],
                422
            );
        }

        try {
            $result = $this->analyzerService->analyzeByName(
                $request->input('product_name'),
                $skinType
            );
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 503);
        }

        $record = ProductCheck::create([
            'user_id'             => $userId,
            'product_name'        => $request->input('product_name'),
            'effectiveness_score' => $result['effectiveness_score'] ?? 0,
            'safety_score'        => $result['safety_score'] ?? 0,
            'compatibility'       => $result['compatibility'] ?? 'neutral',
            'key_ingredients'     => $result['key_ingredients'] ?? [],
            'warnings'            => $result['warnings'] ?? [],
            'verdict'             => $result['verdict'] ?? '',
        ]);

        return response()->json($record, 200);
    }

    #[OA\Post(
        path: "/api/product/image",
        summary: "Analyze product by image",
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["image"],
                    properties: [
                        new OA\Property(property: "image", type: "string", format: "binary"),
                        new OA\Property(property: "skin_type", type: "string", example: "dry"),
                    ]
                )
            )
        ),
        tags: ["Product"],
        responses: [
            new OA\Response(response: 200, description: "Image analyzed successfully"),
            new OA\Response(response: 422, description: "Skin profile incomplete"),
            new OA\Response(response: 503, description: "Service unavailable"),
        ]
    )]
    public function analyzeImage(AnalyzeImageRequest $request): JsonResponse
    {
        $user     = $request->user();
        $userId   = $user->id;
        $skinType = $request->input('skin_type') ?? $user->skin_type;

        if (!$skinType) {
            return response()->json(
                ['message' => 'Please complete your skin profile first'],
                422
            );
        }

        $file        = $request->file('image');
        $storedPath  = \Storage::disk('public')->putFile('product_images', $file);
        $base64Image = base64_encode(file_get_contents(\Storage::disk('public')->path($storedPath)));
        $mimeType    = $file->getMimeType();

        try {
            $result = $this->analyzerService->analyzeByImage($base64Image, $mimeType, $skinType);
        } catch (\RuntimeException $e) {
            \Storage::disk('public')->delete($storedPath);
            return response()->json(['message' => $e->getMessage()], 503);
        }

        $record = ProductCheck::create([
            'user_id'             => $userId,
            'product_name'        => $result['product_name'] ?? 'Unknown Product',
            'image_path'          => $storedPath,
            'effectiveness_score' => $result['effectiveness_score'] ?? 0,
            'safety_score'        => $result['safety_score'] ?? 0,
            'compatibility'       => $result['compatibility'] ?? 'neutral',
            'key_ingredients'     => $result['key_ingredients'] ?? [],
            'warnings'            => $result['warnings'] ?? [],
            'verdict'             => $result['verdict'] ?? '',
        ]);

        return response()->json($record, 200);
    }

    #[OA\Get(
        path: "/api/products/history",
        summary: "Get product check history",
        security: [["bearerAuth" => []]],
        tags: ["Product"],
        parameters: [
            new OA\Parameter(name: "search", in: "query", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "compatibility", in: "query", required: false, schema: new OA\Schema(type: "string")),
        ],
        responses: [
            new OA\Response(response: 200, description: "List of product checks"),
        ]
    )]
    public function history(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $query = ProductCheck::where('user_id', $userId)
                             ->orderBy('created_at', 'desc');

        if ($search = $request->query('search')) {
            $query->where('product_name', 'like', '%' . $search . '%');
        }
        if ($compatibility = $request->query('compatibility')) {
            $query->where('compatibility', $compatibility);
        }

        return response()->json($query->get(), 200);
    }

    #[OA\Get(
        path: "/api/products/history/{id}",
        summary: "Get single product check",
        security: [["bearerAuth" => []]],
        tags: ["Product"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Product check details"),
            new OA\Response(response: 404, description: "Record not found"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function show(Request $request, int $id): JsonResponse
    {
        $record = ProductCheck::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }
        if ($record->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($record, 200);
    }

    #[OA\Delete(
        path: "/api/products/history/{id}",
        summary: "Delete product check",
        security: [["bearerAuth" => []]],
        tags: ["Product"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 204, description: "Deleted successfully"),
            new OA\Response(response: 404, description: "Record not found"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function destroy(Request $request, int $id): JsonResponse
    {
        $record = ProductCheck::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }
        if ($record->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        if ($record->image_path) {
            \Storage::disk('public')->delete($record->image_path);
        }

        $record->delete();
        return response()->json(null, 204);
    }
}