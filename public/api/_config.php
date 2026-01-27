<?php
declare(strict_types=1);

/**
 * Config loader.
 *
 * Production recommendation:
 * - Create `public/api/config.local.php` on the server (not committed to git)
 *   and return an array with secrets (DB/SMTP/admin password).
 * - This file falls back to environment variables if `config.local.php` doesn't exist.
 */

function lot_load_config(): array {
  $local = __DIR__ . '/config.local.php';
  if (is_file($local)) {
    /** @var mixed $cfg */
    $cfg = require $local;
    if (is_array($cfg)) return $cfg;
  }

  return [
    'db' => [
      'host' => getenv('DB_HOST') ?: 'localhost',
      'name' => getenv('DB_NAME') ?: '',
      'user' => getenv('DB_USER') ?: '',
      'pass' => getenv('DB_PASS') ?: '',
      'charset' => 'utf8mb4',
    ],
    // Admin password:
    // - Prefer ADMIN_PASSWORD_HASH (bcrypt/argon2) and use password_hash() to generate it.
    // - Fallback to ADMIN_PASSWORD plaintext if you really must.
    'admin' => [
      'password_hash' => getenv('ADMIN_PASSWORD_HASH') ?: '',
      'password' => getenv('ADMIN_PASSWORD') ?: '',
      'session_minutes' => (int) (getenv('ADMIN_SESSION_MINUTES') ?: 30),
    ],
    'turnstile' => [
      'secret' => getenv('TURNSTILE_SECRET_KEY') ?: '',
    ],
    'smtp' => [
      'host' => getenv('SMTP_HOST') ?: '',
      'port' => (int) (getenv('SMTP_PORT') ?: 465),
      'secure' => (getenv('SMTP_SECURE') ?: 'true') === 'true', // true => implicit SSL (465)
      'user' => getenv('SMTP_USER') ?: '',
      'pass' => getenv('SMTP_PASS') ?: '',
      'to' => getenv('MAIL_TO') ?: '',
      'from' => getenv('MAIL_FROM') ?: '',
      'from_name' => getenv('MAIL_FROM_NAME') ?: 'ГО "Легіон Титанів"',
    ],
  ];
}

