<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';
$cfg = lot_load_config();

$eventsFile = __DIR__ . '/../events/events.json';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
  lot_require_admin($cfg);
  $data = lot_load_json_file($eventsFile, ['uk' => ['items' => []], 'en' => ['items' => []]]);
  lot_json(200, ['ok' => true, 'data' => $data]);
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
  $date = trim((string)($row['date'] ?? ''));
  $folder = trim((string)($row['folder'] ?? ''));
  $cover = trim((string)($row['cover'] ?? ''));
  $photos = (int)($row['photos'] ?? 0);
  $description = trim((string)($row['description'] ?? ''));
  $details = trim((string)($row['details'] ?? ''));
  if ($title === '' || $folder === '') continue;
  $clean[] = [
    'id' => (int)($row['id'] ?? 0) ?: (count($clean) + 1),
    'title' => $title,
    'date' => $date,
    'folder' => $folder,
    'cover' => $cover !== '' ? $cover : "/events/{$folder}/cover.webp",
    'photos' => $photos,
    'description' => $description,
    'details' => $details,
  ];
}

$data = lot_load_json_file($eventsFile, ['uk' => ['items' => []], 'en' => ['items' => []]]);
if (!isset($data['uk']) || !is_array($data['uk'])) $data['uk'] = [];
$data['uk']['items'] = $clean;
lot_save_json_file($eventsFile, $data);

lot_json(200, ['ok' => true, 'data' => $data]);
