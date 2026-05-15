<?php

<<<<<<< HEAD
use Illuminate\Contracts\Http\Kernel;
=======
use Illuminate\Foundation\Application;
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

<<<<<<< HEAD
=======
// Determine if the application is in maintenance mode...
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

<<<<<<< HEAD
require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
=======
// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
