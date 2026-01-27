<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';
$cfg = lot_load_config();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
  lot_json(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$file = lot_data_file($cfg, 'team.json');
$data = lot_load_json_file($file, ['items' => []]);
lot_json(200, ['ok' => true, 'items' => $data['items'] ?? []]);
