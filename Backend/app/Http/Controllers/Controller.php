<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(title: "My API", version: "1.0.0")]
#[OA\PathItem(path: "/")]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "Token"
)]
abstract class Controller
{
    //
}