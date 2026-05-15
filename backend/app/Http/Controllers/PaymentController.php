<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent; 
use Exception;
use OpenApi\Attributes as OA;

class PaymentController extends Controller
{

#[OA\Post(
        path: "/api/process-payment",
        summary: "Process a Stripe Payment",
        tags: ["Payments"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["payment_method_id", "email", "name"],
                properties: [
                    new OA\Property(property: "analysis_id", type: "integer", example: 124),
                    new OA\Property(property: "payment_method_id", type: "string", example: "pm_12345"),
                    new OA\Property(property: "email", type: "string", example: "user@example.com"),
                    new OA\Property(property: "name", type: "string", example: "Ahmed Mohamed")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Payment Intent Created Successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Payment Intent Created Successfully")
                    ]
                )
            ),
            new OA\Response(response: 400, description: "Analysis already paid"),
            new OA\Response(response: 401, description: "Unauthorized"),
            new OA\Response(response: 500, description: "Server Error")
        ]
    )]
    public function processPayment(Request $request)
    {
        $analysisId = $request->analysis_id;
        $checkId = $analysisId ?? 124;

        // $alreadyPaid = \App\Models\Payment::where('analysis_id', $analysisId)
        $alreadyPaid = \App\Models\Payment::where('analysis_id', $checkId)
             ->where('status', 'paid')
            ->exists();

        if ($alreadyPaid) {
        return response()->json([
            'success' => false, 
            'message' => 'This analysis has already been paid for.'
        ], 400);
        }
        
        try {
            $stripeSecret = env('STRIPE_SECRET');
            
            if (!$stripeSecret) {
                return response()->json(['error' => 'Stripe Secret Key missing'], 500);
            }

            Stripe::setApiKey($stripeSecret);

            $intent = PaymentIntent::create([
                'amount' => 2900, 
                'currency' => 'usd',
                'payment_method' => $request->payment_method_id,
                'confirm' => true,
                'automatic_payment_methods' => [
                    'enabled' => true,
                    'allow_redirects' => 'never' 
                ],
                'metadata' => [
                'customer_email' => $request->email, 
                'customer_name' => $request->name,
                // 'analysis_id' => $request->analysis_id 
                'analysis_id' => $checkId
                ],
            ]);
            // if ($intent->status === 'succeeded') {
                Payment::create([
                    // TODO: Replace with user.id after linking Auth Context
                // 'user_id' => auth()->id(), 
                'user_id' => auth()->id() ?? 2,
                // TODO: Replace with analysis after linking Auth Context
                // 'analysis_id' => $request->analysis_id, 
                'analysis_id' => 124,
                'amount' => 29.00,
                'currency' => 'USD',
                'status' => 'pending',
                'stripe_id' => $intent->id,
                'paid_at' => null,
                ]);
            // }
            return response()->json([
            'success' => true,
            'message' => 'Payment Intent Created Successfully'
        ]);


        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}