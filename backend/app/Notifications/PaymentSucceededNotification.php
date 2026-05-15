<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PaymentSucceededNotification extends Notification
{
    use Queueable;

    protected $payment;
    protected $customerEmail;
    /**
     * Create a new notification instance.
     */
    public function __construct($payment, $customerEmail,$customerName)
    {
        $this->payment = $payment;
        $this->customerEmail = $customerEmail;
        $this->customerName = $customerName;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail','database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $recipients = array_unique([
        $this->customerEmail, 
        $notifiable->email
    ]);

        $data = [
            'payment' => $this->payment,
            'user_email' => $this->customerEmail,
            'user_name' => $this->customerName
        ];

        try {
        $pdf = Pdf::loadView('emails.invoice', $data);
        // Storage::put('public/invoices/invoice_' . $this->payment->stripe_id . '.pdf', $pdf->output());
        Storage::disk('public')->put(
        'invoices/invoice_' . $this->payment->stripe_id . '.pdf',
        $pdf->output()
        );
        
        return (new MailMessage)
            ->subject('GlowSkin - Official Purchase Invoice ✨')
            ->greeting('Welcome to GlowSkin,' . $this->customerName . '!')
            ->cc($this->customerEmail)
            ->line('Your payment has been received successfully. Your new skincare routine will begin soon.')
            ->attachData($pdf->output(), "Invoice_GlowSkin.pdf", [
             'mime' => 'application/pdf',
            ]);

        } catch (\Exception $e) {
            \Log::error('Mail Error: ' . $e->getMessage());
            return null; 
        }
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Payment completed successfully with an amount of ' . $this->payment->amount . '$',
            'payment_id' => $this->payment->id,
            'type' => 'payment_success'
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
