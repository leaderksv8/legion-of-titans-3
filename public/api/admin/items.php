<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
  lot_json(405, ['ok' => false]);
}

$cfg = lot_load_config();
lot_require_admin($cfg);

$status = (string)($_GET['status'] ?? 'PENDING');
if (!in_array($status, ['PENDING', 'APPROVED', 'REJECTED', 'DELETED'], true)) $status = 'PENDING';

$type = 'thanks';

if (lot_has_db($cfg)) {
  $pdo = lot_pdo($cfg);
  
  if ($status === 'DELETED') {
    $sql =
      'SELECT id, type, name, email, message, status, created_at, published_at, deleted_at
       FROM lot_submissions
       WHERE deleted_at IS NOT NULL
       ORDER BY deleted_at DESC
       LIMIT 100';
    $stmt = $pdo->prepare($sql);
  } else {
    $sql =
      'SELECT id, type, name, email, message, status, created_at, published_at
       FROM lot_submissions
       WHERE status = :s AND deleted_at IS NULL' . ($type !== '' ? ' AND type = :t' : '') . '
       ORDER BY created_at DESC
       LIMIT 100';
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':s', $status, PDO::PARAM_STR);
    if ($type !== '') $stmt->bindValue(':t', $type, PDO::PARAM_STR);
  }
  
  $stmt->execute();
  $items = $stmt->fetchAll() ?: [];
} else {
  if ($status === 'DELETED') {
    $items = [];
  } else {
    $items = lot_list_items_store($cfg, $status, $type, 100);
  }
}
$csrf = lot_csrf_token();
lot_json(200, ['ok' => true, 'items' => $items, 'csrf' => $csrf]);

