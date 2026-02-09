<?php
declare(strict_types=1);

// Handle CORS
require_once __DIR__ . '/api/_cors.php';

// Simple router for PHP built-in server to mimic .htaccess rules.
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri = is_string($uri) ? $uri : '/';

// Serve existing files directly.
$path = __DIR__ . $uri;
if ($uri !== '/' && is_file($path)) {
  // When running the PHP built-in server from project root, returning false
  // would try to serve from the wrong docroot. Execute API PHP files here.
  if (str_starts_with($uri, '/api/')) {
    require $path;
    exit;
  }
  return false;
}

// API routes -> map to PHP files.
$routes = [
  '/api/contact' => __DIR__ . '/api/contact.php',
  '/api/submit' => __DIR__ . '/api/submit.php',
  '/api/public' => __DIR__ . '/api/public.php',
  '/api/admin/login' => __DIR__ . '/api/admin/login.php',
  '/api/admin/logout' => __DIR__ . '/api/admin/logout.php',
  '/api/admin/items' => __DIR__ . '/api/admin/items.php',
  '/api/admin/update' => __DIR__ . '/api/admin/update.php',
  '/api/admin/smtp-status' => __DIR__ . '/api/admin/smtp-status.php',
];

if (isset($routes[$uri])) {
  require $routes[$uri];
  exit;
}

// Fallback to SPA entry for non-file routes.
readfile(__DIR__ . '/index.html');
exit;

