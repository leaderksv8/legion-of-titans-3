<?php
declare(strict_types=1);

require_once __DIR__ . '/_util.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  lot_json(405, ['ok' => false]);
}

$cfg = lot_load_config();

$ip = lot_client_ip();
$useDb = lot_has_db($cfg);
if ($useDb) {
  $pdo = lot_pdo($cfg);
  lot_rate_limit($pdo, 'submit:' . $ip, 6, 10 * 60);
}
// If DB not configured, rate limiting is skipped (feature requires database)

$body = lot_read_json_body();
if (!$body) lot_json(400, ['ok' => false, 'error' => 'BAD_JSON']);

// honeypot
$hp = is_string($body['hp'] ?? null) ? trim((string)$body['hp']) : '';
if ($hp !== '') {
  lot_json(200, ['ok' => true]); // pretend ok
}

$type = 'thanks';
$name = is_string($body['name'] ?? null) ? trim((string)$body['name']) : '';
$email = is_string($body['email'] ?? null) ? trim((string)$body['email']) : '';
$message = is_string($body['message'] ?? null) ? trim((string)$body['message']) : '';
$consent = !empty($body['consent']);

if (!$consent) lot_json(400, ['ok' => false, 'error' => 'NO_CONSENT']);
if (mb_strlen($message) < 10) lot_json(400, ['ok' => false, 'error' => 'TOO_SHORT']);
if (mb_strlen($message) > 5000) lot_json(400, ['ok' => false, 'error' => 'TOO_LONG']);

$name = mb_substr($name, 0, 80);
$email = mb_substr($email, 0, 120);

// Optional: Cloudflare Turnstile
$ts = is_string($body['turnstileToken'] ?? null) ? (string)$body['turnstileToken'] : '';
$secret = (string)($cfg['turnstile']['secret'] ?? '');
if ($secret !== '') {
  if ($ts === '') lot_json(400, ['ok' => false, 'error' => 'BOT_CHECK']);
  $payload = http_build_query([
    'secret' => $secret,
    'response' => $ts,
    'remoteip' => ($ip !== 'unknown') ? $ip : '',
  ]);
  $opts = [
    'http' => [
      'method' => 'POST',
      'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
      'content' => $payload,
      'timeout' => 8,
    ],
  ];
  $ctx = stream_context_create($opts);
  $resp = @file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx);
  $j = $resp ? json_decode($resp, true) : null;
  if (!is_array($j) || empty($j['success'])) {
    lot_json(400, ['ok' => false, 'error' => 'BOT_CHECK']);
  }
}

$id = 0;
if ($useDb) {
  $now = gmdate('Y-m-d H:i:s');
  $stmt = $pdo->prepare(
    'INSERT INTO lot_submissions (type, name, email, message, consent, status, created_at, updated_at, published_at)
     VALUES (:type, :name, :email, :message, :consent, "PENDING", :created, :updated, NULL)'
  );
  $stmt->execute([
    ':type' => $type,
    ':name' => ($name !== '') ? $name : null,
    ':email' => ($email !== '') ? $email : null,
    ':message' => $message,
    ':consent' => 1,
    ':created' => $now,
    ':updated' => $now,
  ]);
  $id = (int)$pdo->lastInsertId();
} else {
  $id = lot_insert_submission($cfg, [
    'type' => $type,
    'name' => ($name !== '') ? $name : null,
    'email' => ($email !== '') ? $email : null,
    'message' => $message,
    'consent' => $consent,
  ]);
}
lot_json(200, ['ok' => true, 'id' => $id]);

