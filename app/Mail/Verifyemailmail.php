<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $verificationUrl;
    public string $firstName;

    public function __construct(string $firstName, string $token)
    {
        $this->firstName       = $firstName;
        // The frontend verification route — adjust the base URL via APP_URL in .env
        $this->verificationUrl = config('app.frontend_url') . '/verify/' . $token;
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Verify your GlowSkin email address');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.verify-email');
    }
}