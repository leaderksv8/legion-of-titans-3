<?php
declare(strict_types=1);

require_once __DIR__ . '/_util.php';

$cfg = lot_load_config();

$type = 'thanks';
$limit = (int)($_GET['limit'] ?? 3);
if ($limit <= 0) $limit = 3;
if ($limit > 50) $limit = 50;
$offset = (int)($_GET['offset'] ?? 0);
if ($offset < 0) $offset = 0;

if (lot_has_db($cfg)) {
  $pdo = lot_pdo($cfg);
  $stmt = $pdo->prepare(
    'SELECT id, type, name, message, created_at, published_at
     FROM lot_submissions
     WHERE status = "APPROVED" AND type = :t
     ORDER BY COALESCE(published_at, created_at) DESC
     LIMIT :lim OFFSET :off'
  );
  $stmt->bindValue(':t', $type, PDO::PARAM_STR);
  $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
  $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
  $stmt->execute();
  $items = $stmt->fetchAll() ?: [];
} else {
  $items = lot_list_public_store($cfg, $type, $limit, $offset);
}
lot_json(200, ['ok' => true, 'items' => $items]);

