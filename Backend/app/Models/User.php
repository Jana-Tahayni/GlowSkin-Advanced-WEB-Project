<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
class User extends Authenticatable
{
      use HasApiTokens;
    use HasFactory, Notifiable;

    protected $fillable = [
       'first_name',
        'last_name',
        'email',
        'password',
        'provider',
        'provider_id',
        'avatar',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'provider_id',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function getFullNameAttribute():string {
        return "{$this->first_name}  {$this->last_name}";
    }
    public function isSocialUser():bool{
        return $this->provider !=='email';
    }
}