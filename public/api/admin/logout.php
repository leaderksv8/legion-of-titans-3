<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  lot_json(405, ['ok' => false]);
}

$cfg = lot_load_config();
lot_require_admin($cfg);
lot_require_csrf();

$_SESSION = [];
if (session_id() !== '') {
  session_destroy();
}
lot_json(200, ['ok' => true]);

