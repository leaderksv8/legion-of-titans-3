<?php
declare(strict_types=1);

require_once __DIR__ . '/_config.php';

function lot_json(int $status, array $data): void {
  http_response_code($status);
  header('x-content-type-options: nosniff');
  header('x-frame-options: DENY');
  header('referrer-policy: no-referrer');
  header('permissions-policy: geolocation=(), microphone=(), camera=()');
  header('x-robots-tag: noindex, nofollow');
  header('content-type: application/json; charset=utf-8');
  header('cache-control: no-store');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function lot_read_json_body(): array {
  $raw = file_get_contents('php://input');
  if ($raw === false || trim($raw) === '') return [];
  $j = json_decode($raw, true);
  return is_array($j) ? $j : [];
}

function lot_client_ip(): string {
  $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
  if ($xff) {
    $parts = explode(',', $xff);
    $ip = trim($parts[0] ?? '');
    if ($ip !== '') return $ip;
  }
  $xr = $_SERVER['HTTP_X_REAL_IP'] ?? '';
  if ($xr) return trim($xr);
  return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function lot_pdo(array $cfg): PDO {
  $db = $cfg['db'] ?? [];
  $host = (string)($db['host'] ?? 'localhost');
  $name = (string)($db['name'] ?? '');
  $user = (string)($db['user'] ?? '');
  $pass = (string)($db['pass'] ?? '');
  $charset = (string)($db['charset'] ?? 'utf8mb4');

  if ($name === '' || $user === '') {
    lot_json(500, ['ok' => false, 'error' => 'db_not_configured']);
  }

  $dsn = "mysql:host={$host};dbname={$name};charset={$charset}";
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  return $pdo;
}

function lot_has_db(array $cfg): bool {
  $db = $cfg['db'] ?? [];
  $name = (string)($db['name'] ?? '');
  $user = (string)($db['user'] ?? '');
  return $name !== '' && $user !== '';
}

function lot_session_start(array $cfg): void {
  $mins = (int) (($cfg['admin']['session_minutes'] ?? 30));
  if ($mins <= 0) $mins = 30;
  $lifetime = $mins * 60;

  // Cookie flags
  $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
  session_name('lot_admin');
  session_set_cookie_params([
    'lifetime' => $lifetime,
    'path' => '/',
    'domain' => '',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
  ]);

  // Reduce fixation risk
  ini_set('session.use_strict_mode', '1');
  session_start();

  // Sliding expiration
  $now = time();
  if (isset($_SESSION['exp']) && is_int($_SESSION['exp']) && $now > $_SESSION['exp']) {
    $_SESSION = [];
    if (session_id() !== '') {
      session_destroy();
    }
    lot_json(401, ['ok' => false]);
  }
  $_SESSION['exp'] = $now + $lifetime;
}

function lot_require_admin(array $cfg): void {
  lot_session_start($cfg);
  if (empty($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    lot_json(401, ['ok' => false]);
  }
}

function lot_csrf_token(): string {
  $t = $_SESSION['csrf'] ?? '';
  if (!is_string($t) || $t === '') {
    $t = bin2hex(random_bytes(16));
    $_SESSION['csrf'] = $t;
  }
  return $t;
}

function lot_require_csrf(): void {
  $expected = $_SESSION['csrf'] ?? '';
  $got = $_SERVER['HTTP_X_LOT_CSRF'] ?? '';
  if (!is_string($expected) || $expected === '' || !is_string($got) || $got === '' || !hash_equals($expected, $got)) {
    lot_json(403, ['ok' => false, 'error' => 'CSRF']);
  }
}

function lot_rate_limit(PDO $pdo, string $key, int $limit, int $windowSeconds): void {
  $now = time();
  $resetAt = $now + $windowSeconds;

  // Try read existing bucket
  $stmt = $pdo->prepare('SELECT count, reset_at FROM lot_rate_limits WHERE `key` = :k LIMIT 1');
  $stmt->execute([':k' => $key]);
  $row = $stmt->fetch();

  if (!$row || (int)$row['reset_at'] < $now) {
    // Reset bucket
    $stmt = $pdo->prepare('REPLACE INTO lot_rate_limits (`key`, `count`, `reset_at`) VALUES (:k, 1, :r)');
    $stmt->execute([':k' => $key, ':r' => $resetAt]);
    return;
  }

  $count = (int)$row['count'];
  if ($count >= $limit) {
    lot_json(429, ['ok' => false, 'error' => 'RATE_LIMIT']);
  }

  $stmt = $pdo->prepare('UPDATE lot_rate_limits SET `count` = `count` + 1 WHERE `key` = :k');
  $stmt->execute([':k' => $key]);
}

function lot_data_dir(array $cfg): string {
  $dir = (string)($cfg['data_dir'] ?? '');
  if ($dir === '') {
    $env = getenv('LOT_DATA_DIR');
    $dir = is_string($env) ? trim($env) : '';
  }

  if ($dir === '') {
    $dir = __DIR__ . '/_data';
  } elseif ($dir[0] !== '/' && !preg_match('/^[A-Za-z]:[\\\\\\/]/', $dir)) {
    $dir = __DIR__ . '/' . $dir;
  }

  if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
  }
  return $dir;
}

function lot_data_file(array $cfg, string $name): string {
  return rtrim(lot_data_dir($cfg), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $name;
}

function lot_load_json_file(string $file, array $default): array {
  if (!is_file($file)) return $default;
  $raw = file_get_contents($file);
  if ($raw === false || trim($raw) === '') return $default;
  $data = json_decode($raw, true);
  return is_array($data) ? $data : $default;
}

function lot_save_json_file(string $file, array $data): void {
  $tmp = $file . '.tmp';
  $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($json === false) $json = '{}';
  file_put_contents($tmp, $json, LOCK_EX);
  rename($tmp, $file);
}

function lot_load_store(array $cfg): array {
  $file = lot_data_file($cfg, 'submissions.json');
  $default = ['last_id' => 0, 'submissions' => []];
  $data = lot_load_json_file($file, $default);
  if (!isset($data['last_id']) || !is_array($data['submissions'] ?? null)) return $default;
  return $data;
}

function lot_save_store(array $cfg, array $store): void {
  $file = lot_data_file($cfg, 'submissions.json');
  lot_save_json_file($file, $store);
}

function lot_insert_submission(array $cfg, array $input): int {
  $store = lot_load_store($cfg);
  $id = (int)$store['last_id'] + 1;
  $store['last_id'] = $id;
  $now = gmdate('Y-m-d H:i:s');

  $store['submissions'] = $store['submissions'] ?? [];
  array_unshift($store['submissions'], [
    'id' => $id,
    'type' => $input['type'],
    'name' => $input['name'] ?? null,
    'email' => $input['email'] ?? null,
    'message' => $input['message'],
    'consent' => !empty($input['consent']) ? 1 : 0,
    'status' => 'PENDING',
    'created_at' => $now,
    'updated_at' => $now,
    'published_at' => null,
  ]);

  lot_save_store($cfg, $store);
  return $id;
}

function lot_list_public_store(array $cfg, string $type, int $limit, int $offset): array {
  $store = lot_load_store($cfg);
  $items = array_filter($store['submissions'] ?? [], function ($s) use ($type) {
    return ($s['status'] ?? '') === 'APPROVED' && ($s['type'] ?? '') === $type;
  });
  usort($items, function ($a, $b) {
    $da = strtotime($a['published_at'] ?? $a['created_at'] ?? '') ?: 0;
    $db = strtotime($b['published_at'] ?? $b['created_at'] ?? '') ?: 0;
    return $db <=> $da;
  });
  return array_slice(array_values($items), $offset, $limit);
}

function lot_list_items_store(array $cfg, string $status, string $type, int $limit): array {
  $store = lot_load_store($cfg);
  $items = array_filter($store['submissions'] ?? [], function ($s) use ($status, $type) {
    if (($s['status'] ?? '') !== $status) return false;
    if ($type !== '' && ($s['type'] ?? '') !== $type) return false;
    return true;
  });
  usort($items, function ($a, $b) {
    $da = strtotime($a['created_at'] ?? '') ?: 0;
    $db = strtotime($b['created_at'] ?? '') ?: 0;
    return $db <=> $da;
  });
  return array_slice(array_values($items), 0, $limit);
}

function lot_update_status_store(array $cfg, int $id, string $status): bool {
  $store = lot_load_store($cfg);
  $items = $store['submissions'] ?? [];
  $now = gmdate('Y-m-d H:i:s');
  $updated = false;

  foreach ($items as &$row) {
    if ((int)($row['id'] ?? 0) !== $id) continue;
    $row['status'] = $status;
    $row['updated_at'] = $now;
    if ($status === 'APPROVED' && empty($row['published_at'])) {
      $row['published_at'] = $now;
    }
    $updated = true;
    break;
  }
  unset($row);

  if ($updated) {
    $store['submissions'] = $items;
    lot_save_store($cfg, $store);
  }
  return $updated;
}

function lot_rate_limit_file(array $cfg, string $key, int $limit, int $windowSeconds): void {
  $file = lot_data_file($cfg, 'rate_limits.json');
  $data = lot_load_json_file($file, []);
  $now = time();
  $entry = $data[$key] ?? null;
  if (!is_array($entry) || (int)($entry['reset_at'] ?? 0) < $now) {
    $data[$key] = ['count' => 1, 'reset_at' => $now + $windowSeconds];
    lot_save_json_file($file, $data);
    return;
  }

  $count = (int)($entry['count'] ?? 0);
  if ($count >= $limit) {
    lot_json(429, ['ok' => false, 'error' => 'RATE_LIMIT']);
  }
  $data[$key]['count'] = $count + 1;
  lot_save_json_file($file, $data);
}
