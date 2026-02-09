<?php
declare(strict_types=1);

// Handle CORS preflight requests
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $allowed_raw = getenv('CORS_ALLOWED_ORIGINS') ?: '';
  $allowed = array_filter(array_map('trim', explode(',', $allowed_raw)));
  if ($origin !== '' && in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-LOT-CSRF');
    header('Access-Control-Max-Age: 3600');
  }
  http_response_code(200);
  exit;
}
