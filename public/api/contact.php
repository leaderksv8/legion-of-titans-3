<?php
declare(strict_types=1);

require_once __DIR__ . '/_util.php';
require_once __DIR__ . '/_smtp.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  lot_json(405, ['ok' => false]);
}

$cfg = lot_load_config();
$body = lot_read_json_body();

// Get locale from request
$locale = (string)($body['locale'] ?? 'uk');
if (!in_array($locale, ['uk', 'en'])) {
  $locale = 'uk';
}

// Error messages in both languages
$errors = [
  'uk' => [
    'message_required' => 'Повідомлення обов\'язкове',
    'message_too_short' => 'Повідомлення занадто коротке (мінімум 10 символів)',
    'smtp_send_failed' => 'Не вдалося надіслати. Спробуйте ще раз трохи пізніше.',
  ],
  'en' => [
    'message_required' => 'Message is required',
    'message_too_short' => 'Message is too short (minimum 10 characters)',
    'smtp_send_failed' => 'Failed to send. Please try again later.',
  ]
];

$hp = is_string($body['hp'] ?? null) ? trim((string)$body['hp']) : '';
if ($hp !== '') {
  lot_json(200, ['ok' => true]); // pretend ok
}

$name = is_string($body['name'] ?? null) ? trim((string)$body['name']) : '';
$email = is_string($body['email'] ?? null) ? trim((string)$body['email']) : '';
$message = is_string($body['message'] ?? null) ? trim((string)$body['message']) : '';

if ($message === '') {
  lot_json(400, ['ok' => false, 'error' => $errors[$locale]['message_required']]);
}

if (mb_strlen($message) < 10) {
  lot_json(400, ['ok' => false, 'error' => $errors[$locale]['message_too_short']]);
}

$name = mb_substr($name, 0, 200);
$email = mb_substr($email, 0, 200);
$message = mb_substr($message, 0, 8000);

$subject_text = $locale === 'uk' ? '[Legion of Titans] Повідомлення з сайту' : '[Legion of Titans] Website Message';
$text =
  ($locale === 'uk' ? "Нове повідомлення з сайту\n\n" : "New message from website\n\n") .
  ($locale === 'uk' ? "Імʼя: " : "Name: ") . ($name !== '' ? $name : '-') . "\n" .
  ($locale === 'uk' ? "Email: " : "Email: ") . ($email !== '' ? $email : '-') . "\n\n" .
  ($locale === 'uk' ? "Повідомлення:\n" : "Message:\n") . $message . "\n";

try {
  lot_send_smtp($cfg['smtp'] ?? [], $subject_text, $text, $email !== '' ? $email : null);
} catch (Throwable $e) {
  lot_json(500, ['ok' => false, 'error' => $errors[$locale]['smtp_send_failed']]);
}

lot_json(200, ['ok' => true]);

