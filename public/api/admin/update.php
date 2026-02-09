<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  lot_json(405, ['ok' => false]);
}

$cfg = lot_load_config();
lot_require_admin($cfg);
lot_require_csrf();

$body = lot_read_json_body();
$id = (int)($body['id'] ?? 0);
$status = (string)($body['status'] ?? '');
$action = (string)($body['action'] ?? 'update');

if ($id <= 0) lot_json(400, ['ok' => false]);
if ($action === 'update' && !in_array($status, ['PENDING', 'APPROVED', 'REJECTED'], true)) lot_json(400, ['ok' => false]);
if (!in_array($action, ['update', 'delete', 'restore'], true)) lot_json(400, ['ok' => false]);

$now = gmdate('Y-m-d H:i:s');
if (lot_has_db($cfg)) {
  $pdo = lot_pdo($cfg);
  
  if ($action === 'delete') {
    $stmt = $pdo->prepare('UPDATE lot_submissions SET deleted_at = :d, updated_at = :u WHERE id = :id');
    $stmt->execute([':d' => $now, ':u' => $now, ':id' => $id]);
    $ok = $stmt->rowCount() > 0;
  } elseif ($action === 'restore') {
    $stmt = $pdo->prepare('UPDATE lot_submissions SET deleted_at = NULL, updated_at = :u WHERE id = :id');
    $stmt->execute([':u' => $now, ':id' => $id]);
    $ok = $stmt->rowCount() > 0;
  } else {
    $published = ($status === 'APPROVED') ? $now : null;
    $stmt = $pdo->prepare(
      'UPDATE lot_submissions
       SET status = :st,
           updated_at = :u,
           published_at = CASE
             WHEN :st = "APPROVED" AND published_at IS NULL THEN :p
             ELSE published_at
           END
       WHERE id = :id AND deleted_at IS NULL'
    );
    $stmt->execute([
      ':st' => $status,
      ':u' => $now,
      ':p' => $published,
      ':id' => $id,
    ]);
    $ok = $stmt->rowCount() > 0;
  }
} else {
  if ($action === 'delete' || $action === 'restore') {
    $ok = false;
  } else {
    $ok = lot_update_status_store($cfg, $id, $status);
  }
}
lot_json(200, ['ok' => $ok]);

