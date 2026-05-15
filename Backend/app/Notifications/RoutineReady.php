<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RoutineReady extends Notification
{
    use Queueable;

    protected $analysis;
    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        $this->analysis = $analysis;
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
        return (new MailMessage)
                ->subject('GlowSkin - Your Personalized Routine Is Ready! ✨')
                ->greeting('Hello ' . $notifiable->name . ',')
                ->line('Good news! The doctor has finished reviewing your case and designing the perfect routine for your skin.')
                ->action('View My Routine', url('/dashboard/my-routine'))
                ->line('Thank you for trusting GlowSkin!');
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

    public function toDatabase($notifiable)
{
    return [
        'message' => 'The doctor has prepared your skincare routine. You can now view it.',
        'analysis_id' => $this->analysis->id,
        'type' => 'routine_ready'
    ];
}
}




// $client = User::find($analysis->user_id);

//     $client->notify(new RoutineReady($analysis));

//     return response()->json(['message' => 'Routine sent to client successfully!']);
