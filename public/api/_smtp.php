<?php
declare(strict_types=1);

require_once __DIR__ . '/_util.php';

/**
 * Minimal SMTP client (LOGIN auth), supports:
 * - implicit TLS (secure=true, typically port 465) via ssl://
 * - plain TCP + STARTTLS (secure=false, typically port 587)
 */

function lot_smtp_read($fp): string {
  $data = '';
  while (!feof($fp)) {
    $line = fgets($fp, 515);
    if ($line === false) break;
    $data .= $line;
    // Multi-line reply: "250-" continues, "250 " ends
    if (preg_match('/^\d{3} /', $line)) break;
  }
  return $data;
}

function lot_smtp_expect($fp, array $codes): void {
  $resp = lot_smtp_read($fp);
  if (!preg_match('/^(\d{3})/m', $resp, $m)) {
    throw new RuntimeException('smtp_bad_response');
  }
  $code = (int)$m[1];
  if (!in_array($code, $codes, true)) {
    throw new RuntimeException('smtp_' . $code);
  }
}

function lot_smtp_sendline($fp, string $line): void {
  fwrite($fp, $line . "\r\n");
}

function lot_send_smtp(array $smtp, string $subject, string $text, ?string $replyTo = null): void {
  $host = (string)($smtp['host'] ?? '');
  $port = (int)($smtp['port'] ?? 465);
  $secure = !empty($smtp['secure']);
  $user = (string)($smtp['user'] ?? '');
  $pass = (string)($smtp['pass'] ?? '');
  $to = (string)($smtp['to'] ?? '');
  $from = (string)($smtp['from'] ?? '');
  $fromName = (string)($smtp['from_name'] ?? 'Website');

  if ($host === '' || $port <= 0 || $user === '' || $pass === '' || $to === '' || $from === '') {
    throw new RuntimeException('smtp_not_configured');
  }

  $scheme = $secure ? 'ssl://' : 'tcp://';
  $fp = @stream_socket_client($scheme . $host . ':' . $port, $errno, $errstr, 12, STREAM_CLIENT_CONNECT);
  if (!$fp) throw new RuntimeException('smtp_connect_failed');
  stream_set_timeout($fp, 12);

  try {
    lot_smtp_expect($fp, [220]);

    $serverName = $_SERVER['SERVER_NAME'] ?? 'localhost';
    lot_smtp_sendline($fp, 'EHLO ' . $serverName);
    lot_smtp_expect($fp, [250]);

    if (!$secure) {
      // Try STARTTLS
      lot_smtp_sendline($fp, 'STARTTLS');
      lot_smtp_expect($fp, [220]);
      if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        throw new RuntimeException('smtp_starttls_failed');
      }
      lot_smtp_sendline($fp, 'EHLO ' . $serverName);
      lot_smtp_expect($fp, [250]);
    }

    // AUTH LOGIN
    lot_smtp_sendline($fp, 'AUTH LOGIN');
    lot_smtp_expect($fp, [334]);
    lot_smtp_sendline($fp, base64_encode($user));
    lot_smtp_expect($fp, [334]);
    lot_smtp_sendline($fp, base64_encode($pass));
    lot_smtp_expect($fp, [235]);

    lot_smtp_sendline($fp, 'MAIL FROM:<' . $from . '>');
    lot_smtp_expect($fp, [250]);
    lot_smtp_sendline($fp, 'RCPT TO:<' . $to . '>');
    lot_smtp_expect($fp, [250, 251]);

    lot_smtp_sendline($fp, 'DATA');
    lot_smtp_expect($fp, [354]);

    $headers = [];
    $headers[] = 'From: ' . mb_encode_mimeheader($fromName, 'UTF-8') . ' <' . $from . '>';
    $headers[] = 'To: <' . $to . '>';
    if ($replyTo) $headers[] = 'Reply-To: ' . $replyTo;
    $headers[] = 'Subject: ' . mb_encode_mimeheader($subject, 'UTF-8');
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';

    $msg = implode("\r\n", $headers) . "\r\n\r\n" . $text . "\r\n";
    // Dot-stuffing
    $msg = preg_replace('/\r\n\./', "\r\n..", $msg);
    fwrite($fp, $msg);
    lot_smtp_sendline($fp, '.');
    lot_smtp_expect($fp, [250]);

    lot_smtp_sendline($fp, 'QUIT');
  } finally {
    fclose($fp);
  }
}

