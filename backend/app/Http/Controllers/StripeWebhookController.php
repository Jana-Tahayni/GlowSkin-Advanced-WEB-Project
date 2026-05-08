<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends Controller
{
    //
public function handleWebhook(Request $request) {
    $payload = $request->all();
    $type = $payload['type'];

    if ($type === 'payment_intent.succeeded') {
        $intent = $payload['data']['object'];
        
        Payment::where('stripe_id', $intent['id'])->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    return response()->json(['status' => 'success']);
}
}
