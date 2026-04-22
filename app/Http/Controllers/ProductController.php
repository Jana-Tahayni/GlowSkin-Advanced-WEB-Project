<?php

namespace App\Http\Controllers;
use App\Services\ProductAnalyzerService;
use Illuminate\Http\Request;
use App\Models\ProductCheck;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\AnalyzeProductRequest;
use App\Http\Requests\AnalyzeImageRequest;
class ProductController extends Controller
{
     public function __construct(
        $userId = 5;
        private readonly ProductAnalyzerService $analyzerService
    ) {}
    public function analyze(AnalyzeProductRequest $request): JsonResponse
    {
        $skinType = $request->input('skin_type') 
                 ?? auth()->user()->skin_type;

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
        } catch (RuntimeException $e) {
            return response()->json(
                ['message' => $e->getMessage()],
                503
            );
        }

        $record = ProductCheck::create([
            'user_id'             => auth()->id(),
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

    public function analyzeImage(AnalyzeImageRequest $request): JsonResponse
        {
            $skinType = $request->input('skin_type')
                    ?? auth()->user()->skin_type;

            if (!$skinType) {
                return response()->json(
                    ['message' => 'Please complete your skin profile first'],
                    422
                );
            }

            $file       = $request->file('image');
            $storedPath = Storage::disk('public')->putFile('product_images', $file);

            $fullPath    = Storage::disk('public')->path($storedPath);
            $base64Image = base64_encode(file_get_contents($fullPath));
            $mimeType    = $file->getMimeType();

            try {
                $result = $this->analyzerService->analyzeByImage(
                    $base64Image,
                    $mimeType,
                    $skinType
                );
            } catch (RuntimeException $e) {
                Storage::disk('public')->delete($storedPath);
                return response()->json(
                    ['message' => $e->getMessage()],
                    503
                );
            }

            $record = ProductCheck::create([
                'user_id'             => auth()->id(),
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

        public function history(Request $request): JsonResponse
            {
                $query = ProductCheck::where('user_id', auth()->id())
                                    ->orderBy('created_at', 'desc');

                if ($search = $request->query('search')) {
                    $query->where('product_name', 'like', '%' . $search . '%');
                }
                if ($compatibility = $request->query('compatibility')) {
                    $query->where('compatibility', $compatibility);
                }
                $results = $query->get();
                return response()->json($results, 200);
            }
           
            public function show(int $id): JsonResponse
            {
                $record = ProductCheck::find($id);
                if (!$record) {
                    return response()->json(
                        ['message' => 'Record not found'],
                        404
                    );
                }
                if ($record->user_id !== auth()->id()) {
                    return response()->json(
                        ['message' => 'Forbidden'],
                        403
                    );
                }
                return response()->json($record, 200);
            }

            public function destroy(int $id): JsonResponse
            {
                $record = ProductCheck::find($id);
                if (!$record) {
                    return response()->json(
                        ['message' => 'Record not found'],
                        404
                    );
                }

                if ($record->user_id !== auth()->id()) {
                    return response()->json(
                        ['message' => 'Forbidden'],
                        403
                    );
                }

                if ($record->image_path) {
                    Storage::disk('public')->delete($record->image_path);
                }

                $record->delete();
                return response()->json(null, 204);
            }

        }
