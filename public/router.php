<?php
declare(strict_types=1);

// Simple router for PHP built-in server to mimic .htaccess rules.
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri = is_string($uri) ? $uri : '/';

// Serve existing files directly.
$path = __DIR__ . $uri;
if ($uri !== '/' && is_file($path)) {
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

