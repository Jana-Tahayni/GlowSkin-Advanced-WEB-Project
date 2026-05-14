<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCaseReceived extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $payment;
    public function __construct($payment)
    {
        $this->payment = $payment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
       return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $userName = optional($this->payment->user)->name ?? 'عميل جديد';
        return (new MailMessage)
                ->subject('GlowSkin - New case assigned ✨')
                    ->greeting('Dear Doctor,')
                    ->line('A new client has purchased the "Routine Review" service.')
                    ->line('Client Name: ' . $userName) 
                    ->action('View Case Details', url('/doctor/dashboard')) 
                    ->line('Please review the case as soon as possible.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $userName = optional($this->payment->user)->name ?? 'عميل جديد';
        return [
            'message' => 'You have a new case waiting for review from ' . $userName,
            'payment_id' => $this->payment->id,
            'type' => 'new_case'
        ];
    }

    public function toDatabase($notifiable)
{
    return [
        'message' =>'You have a new case waiting for review from ' . (optional($this->payment->user)->name ?? 'عميل جديد'),
        'payment_id' => $this->payment->id,
        'type' => 'new_case'
    ];
}
}
