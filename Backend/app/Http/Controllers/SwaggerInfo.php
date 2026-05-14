<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'GlowSkin API',
    version: '1.0.0',
    description: 'AI-powered skin analysis API for GlowSkin application'
)]
#[OA\Server(
    url: 'http://127.0.0.1:8000',
    description: 'Local Development Server'
)]
class SwaggerInfo {}