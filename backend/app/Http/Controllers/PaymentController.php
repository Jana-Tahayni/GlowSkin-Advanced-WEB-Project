<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Exception;

class PaymentController extends Controller
{
  /**
     * @OA\Post(
     * path="/api/checkout",
     * summary="Process payment for custom routine",
     * description="Handles the payment transaction using Stripe/PayPal for the specialist review service.",
     * tags={"Payments"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"analysis_id"},
     * @OA\Property(property="analysis_id", type="integer", example=1)
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Payment successful",
     * @OA\JsonContent(
     * @OA\Property(property="url", type="string")
     * )
     * )
     * )
     */
    public function checkout(Request $request)
    {
        try {
            $stripeSecret = env('STRIPE_SECRET');
            
            if (!$stripeSecret) {
                return response()->json(['error' => 'Stripe Secret Key missing in .env'], 500);
            }

            Stripe::setApiKey($stripeSecret);

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Glow Skin Premium',
                        ],
                        'unit_amount' => 2900,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => 'http://localhost:3000/success',
                'cancel_url' => 'http://localhost:3000/cancel',
            ]);

            return response()->json(['url' => $session->url]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}