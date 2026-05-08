<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent; 
use Exception;

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
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
            ]);
            // if ($intent->status === 'succeeded') {
                Payment::create([
                // 'user_id' => auth()->id(), 
                'user_id' => auth()->id() ?? 1,
                // 'analysis_id' => $request->analysis_id, 
                'analysis_id' => null,
                'amount' => 29.00,
                'currency' => 'USD',
                'status' => 'pending',
                'stripe_id' => $intent->id,
                'paid_at' => null,
                ]);
            // }

            return response()->json([
                'success' => true,
                'message' => 'Payment Successful!',
                'intent' => $intent
            ]);

        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}