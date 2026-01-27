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

if ($id <= 0) lot_json(400, ['ok' => false]);
if (!in_array($status, ['PENDING', 'APPROVED', 'REJECTED'], true)) lot_json(400, ['ok' => false]);

$now = gmdate('Y-m-d H:i:s');
if (lot_has_db($cfg)) {
  $pdo = lot_pdo($cfg);
  $published = ($status === 'APPROVED') ? $now : null;
  $stmt = $pdo->prepare(
    'UPDATE lot_submissions
     SET status = :st,
         updated_at = :u,
         published_at = CASE
           WHEN :st = "APPROVED" AND published_at IS NULL THEN :p
           ELSE published_at
         END
     WHERE id = :id'
  );
  $stmt->execute([
    ':st' => $status,
    ':u' => $now,
    ':p' => $published,
    ':id' => $id,
  ]);
  $ok = $stmt->rowCount() > 0;
} else {
  $ok = lot_update_status_store($cfg, $id, $status);
}
lot_json(200, ['ok' => $ok]);

