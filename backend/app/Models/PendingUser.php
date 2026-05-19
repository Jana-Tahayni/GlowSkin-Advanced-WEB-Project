<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingUser extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'verification_token',
        'token_expires_at',
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
    ];

    /**
     * Has the 15-minute verification window passed?
     */
    public function isTokenExpired(): bool
    {
        return now()->isAfter($this->token_expires_at);
    }

    /**
     * Was this record created more than 24 hours ago?
     * Used to decide whether to resend or permanently delete.
     */
    public function isOlderThan24Hours(): bool
    {
        return now()->isAfter($this->created_at->addHours(24));
    }
}