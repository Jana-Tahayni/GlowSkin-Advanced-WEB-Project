<?php

require 'vendor/autoload.php';

$openapi = \OpenApi\Generator::scan(['app']);

$json = $openapi->toJson();
$decoded = json_decode($json, true);

if (isset($decoded['info'])) {
    echo "✅ @OA\Info() FOUND: " . $decoded['info']['title'] . "\n";
} else {
    echo "❌ @OA\Info() NOT FOUND\n";
}

echo "\nScanned paths count: " . count($decoded['paths'] ?? []) . "\n";
echo "\nFull JSON:\n" . $json . "\n";