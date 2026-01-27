<?php
declare(strict_types=1);

require_once __DIR__ . '/_util.php';
require_once __DIR__ . '/_smtp.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  lot_json(405, ['ok' => false]);
}

$cfg = lot_load_config();
$body = lot_read_json_body();

$hp = is_string($body['hp'] ?? null) ? trim((string)$body['hp']) : '';
if ($hp !== '') {
  lot_json(200, ['ok' => true]); // pretend ok
}

$name = is_string($body['name'] ?? null) ? trim((string)$body['name']) : '';
$email = is_string($body['email'] ?? null) ? trim((string)$body['email']) : '';
$message = is_string($body['message'] ?? null) ? trim((string)$body['message']) : '';

if ($message === '') lot_json(400, ['ok' => false, 'error' => 'message_required']);

$name = mb_substr($name, 0, 200);
$email = mb_substr($email, 0, 200);
$message = mb_substr($message, 0, 8000);

$subject = '[Legion of Titans] Повідомлення з сайту';
$text =
  "Нове повідомлення з сайту\n\n" .
  "Імʼя: " . ($name !== '' ? $name : '-') . "\n" .
  "Email: " . ($email !== '' ? $email : '-') . "\n\n" .
  "Повідомлення:\n" . $message . "\n";

try {
  lot_send_smtp($cfg['smtp'] ?? [], $subject, $text, $email !== '' ? $email : null);
} catch (Throwable $e) {
  lot_json(500, ['ok' => false, 'error' => 'smtp_send_failed']);
}

lot_json(200, ['ok' => true]);

