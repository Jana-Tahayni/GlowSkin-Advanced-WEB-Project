<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
<<<<<<< HEAD

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
=======
use Illuminate\Support\Facades\Schedule;
use App\Models\PendingUser;
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
Schedule::call(function () {
    PendingUser::where('created_at', '<', now()->subHours(24))->delete();
})->hourly();
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
