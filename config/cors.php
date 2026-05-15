<?php
<<<<<<< HEAD
 
// config/cors.php
// يسمح لـ React (localhost:3000) يتكلم مع Laravel API
 
return [
 
    'paths' => ['api/*'],
 
    'allowed_methods' => ['*'],
 
    'allowed_origins' => [
       '*',
    ],
 
    'allowed_origins_patterns' => [],
 
    'allowed_headers' => ['*'],
 
    'exposed_headers' => [],
 
    'max_age' => 0,
 
    'supports_credentials' => false,
 
=======

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

   'allowed_origins' => [
    'http://localhost:3000', 
    'http://127.0.0.1:3000'
],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
];
