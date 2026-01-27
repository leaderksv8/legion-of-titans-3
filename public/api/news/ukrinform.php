<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';

$cfg = lot_load_config();

function lot_news_cache_file(array $cfg): string {
  return lot_data_file($cfg, 'news_ukrinform.json');
}

function lot_news_cached(array $cfg, int $ttlSeconds): ?array {
  $file = lot_news_cache_file($cfg);
  if (!is_file($file)) return null;
  $raw = file_get_contents($file);
  if ($raw === false || trim($raw) === '') return null;
  $data = json_decode($raw, true);
  if (!is_array($data)) return null;
  $updated = (int)($data['updated_at'] ?? 0);
  if ($updated <= 0 || (time() - $updated) > $ttlSeconds) return null;
  return $data;
}

function lot_news_cached_any(array $cfg): ?array {
  $file = lot_news_cache_file($cfg);
  if (!is_file($file)) return null;
  $raw = file_get_contents($file);
  if ($raw === false || trim($raw) === '') return null;
  $data = json_decode($raw, true);
  return is_array($data) ? $data : null;
}

function lot_news_save(array $cfg, array $items): void {
  $payload = [
    'ok' => true,
    'source' => 'ukrinform',
    'updated_at' => time(),
    'items' => $items,
  ];
  lot_save_json_file(lot_news_cache_file($cfg), $payload);
}

function lot_news_fetch_rss(string $url): ?string {
  $ctx = stream_context_create([
    'http' => [
      'timeout' => 6,
      'user_agent' => 'LegionTitans/1.0 (+https://legion-of-titans.org)',
    ],
  ]);
  $xml = @file_get_contents($url, false, $ctx);
  if ($xml !== false && trim($xml) !== '') return $xml;

  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_CONNECTTIMEOUT => 4,
      CURLOPT_TIMEOUT => 6,
      CURLOPT_USERAGENT => 'LegionTitans/1.0 (+https://legion-of-titans.org)',
    ]);
    $xml = curl_exec($ch);
    curl_close($ch);
    if (is_string($xml) && trim($xml) !== '') return $xml;
  }

  return null;
}

function lot_news_parse_items(string $xml, int $limit): array {
  $items = [];
  $rss = @simplexml_load_string($xml);
  if (!$rss || !isset($rss->channel->item)) return $items;
  foreach ($rss->channel->item as $item) {
    if (count($items) >= $limit) break;
    $title = trim((string)($item->title ?? ''));
    $link = trim((string)($item->link ?? ''));
    $pubDate = trim((string)($item->pubDate ?? ''));
    if ($title === '' || $link === '') continue;
    $items[] = [
      'title' => $title,
      'url' => $link,
      'time' => $pubDate !== '' ? date('H:i', strtotime($pubDate)) : '',
      'date' => $pubDate !== '' ? date('d.m.Y', strtotime($pubDate)) : '',
      'source' => 'Укрінформ',
    ];
  }
  return $items;
}

$rssUrl = 'https://www.ukrinform.ua/rss';
$limit = 6;
$ttl = 3600;

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
  lot_json(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

$cached = lot_news_cached($cfg, $ttl);
if ($cached) {
  lot_json(200, $cached);
}

$xml = lot_news_fetch_rss($rssUrl);
if ($xml === null) {
  $stale = lot_news_cached_any($cfg);
  if ($stale && !empty($stale['items'])) {
    $stale['stale'] = true;
    lot_json(200, $stale);
  }
  lot_json(200, ['ok' => false, 'error' => 'fetch_failed', 'items' => []]);
}

$items = lot_news_parse_items($xml, $limit);
if (count($items) > 0) {
  lot_news_save($cfg, $items);
}

lot_json(200, ['ok' => true, 'source' => 'ukrinform', 'updated_at' => time(), 'items' => $items]);
