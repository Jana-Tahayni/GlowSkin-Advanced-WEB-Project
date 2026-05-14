<?php
 
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
 
];
