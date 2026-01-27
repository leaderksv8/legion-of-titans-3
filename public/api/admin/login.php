<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  lot_json(405, ['ok' => false]);
}

$cfg = lot_load_config();
lot_session_start($cfg);

$body = lot_read_json_body();
$pw = is_string($body['password'] ?? null) ? (string)$body['password'] : '';

$hash = (string)($cfg['admin']['password_hash'] ?? '');
$plain = (string)($cfg['admin']['password'] ?? '');

$ok = false;
if ($hash !== '') {
  $ok = password_verify($pw, $hash);
} elseif ($plain !== '') {
  $ok = hash_equals($plain, $pw);
}

if (!$ok) {
  $_SESSION = [];
  if (session_id() !== '') session_destroy();
  lot_json(401, ['ok' => false]);
}

session_regenerate_id(true);
$_SESSION['admin'] = true;
$csrf = lot_csrf_token();
lot_json(200, ['ok' => true, 'csrf' => $csrf]);

