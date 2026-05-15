<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Notifications\NewCaseReceived;
use App\Models\User;
// class StripeWebhookController extends Controller
// {
//     //
// public function handleWebhook(Request $request) {
//     $payload = $request->all();
//     $type = $payload['type'];

//     if ($type === 'payment_intent.succeeded') {
//         $intent = $payload['data']['object'];
        
//         Payment::where('stripe_id', $intent['id'])->update([
//             'status' => 'paid',
//             'paid_at' => now(),
//         ]);
//     }

//     return response()->json(['status' => 'success']);
// }
// }
class StripeWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->server('HTTP_STRIPE_SIGNATURE');
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');
        // $analysisId = $session->metadata->analysis_id;

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            \Log::error("Webhook Signature Error: " . $e->getMessage());
             return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $intent = $event->data->object;

            $analysisId = $intent->metadata->analysis_id ?? 123;
            $payment = Payment::where('stripe_id', $intent->id)->first();

            if ($payment) {
                $payment->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

               
                $doctor = User::where('role', 'doctor')->first(); 
                if ($doctor) {
                $doctor->notify(new \App\Notifications\NewCaseReceived($payment));
                }

                $client = User::find($payment->user_id);
                $customerEmail = $intent->metadata->customer_email; 
                $customerName= $intent->metadata->customer_name;

                if ($client) {
                    $client->notify(new \App\Notifications\PaymentSucceededNotification($payment, $customerEmail,$customerName));
                }

            
        }
        }

        return response()->json(['status' => 'success']);
    }
}
