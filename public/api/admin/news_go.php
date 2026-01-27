<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';
$cfg = lot_load_config();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
  lot_require_admin($cfg);
  $file = lot_data_file($cfg, 'news_go.json');
  $data = lot_load_json_file($file, ['items' => []]);
  lot_json(200, ['ok' => true, 'items' => $data['items'] ?? []]);
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  lot_json(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

lot_require_admin($cfg);
lot_require_csrf();
$input = lot_read_json_body();
$items = $input['items'] ?? [];
if (!is_array($items)) {
  lot_json(400, ['ok' => false, 'error' => 'bad_items']);
}

$clean = [];
foreach ($items as $row) {
  if (!is_array($row)) continue;
  $title = trim((string)($row['title'] ?? ''));
  $summary = trim((string)($row['summary'] ?? ''));
  $source = trim((string)($row['source'] ?? ''));
  $time = trim((string)($row['time'] ?? ''));
  $url = trim((string)($row['url'] ?? ''));
  if ($title === '') continue;
  $clean[] = [
    'id' => (int)($row['id'] ?? 0) ?: (count($clean) + 1),
    'title' => $title,
    'summary' => $summary,
    'source' => $source,
    'time' => $time,
    'url' => $url !== '' ? $url : '/#news',
  ];
}

$file = lot_data_file($cfg, 'news_go.json');
lot_save_json_file($file, ['items' => $clean]);
lot_json(200, ['ok' => true, 'items' => $clean]);
