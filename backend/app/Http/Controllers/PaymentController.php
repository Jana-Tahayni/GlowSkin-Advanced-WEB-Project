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