<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PlatformAnnouncement extends Notification implements ShouldQueue
{
    use Queueable;

    public $announcement;

    public function __construct($announcement)
    {
        $this->announcement = $announcement;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Platform Announcement')
            ->line($this->announcement->message)
            ->line('Thank you for being part of our platform!');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => $this->announcement->message,
            'created_at' => $this->announcement->created_at,
        ];
    }
}
