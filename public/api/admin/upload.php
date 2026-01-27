<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';
$cfg = lot_load_config();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
  lot_json(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

lot_require_admin($cfg);
lot_require_csrf();

$type = (string)($_POST['type'] ?? '');
$kind = (string)($_POST['kind'] ?? '');
$folder = (string)($_POST['folder'] ?? '');

function lot_upload_error(string $msg): void {
  lot_json(400, ['ok' => false, 'error' => $msg]);
}

function lot_safe_slug(string $s): string {
  $s = strtolower($s);
  $s = preg_replace('/[^a-z0-9\\-_]+/i', '-', $s);
  $s = trim($s, '-');
  return $s !== '' ? $s : 'item';
}

function lot_image_from_file(string $tmp, string $mime) {
  if (!function_exists('imagecreatefromjpeg')) return false;
  if ($mime === 'image/jpeg') return @imagecreatefromjpeg($tmp);
  if ($mime === 'image/png') return @imagecreatefrompng($tmp);
  if ($mime === 'image/webp') return @imagecreatefromwebp($tmp);
  if ($mime === 'image/gif') return @imagecreatefromgif($tmp);
  return false;
}

function lot_save_webp($img, string $dest, int $maxSize, int $quality): void {
  $w = imagesx($img);
  $h = imagesy($img);
  $scale = min(1.0, $maxSize / max($w, $h));
  $nw = (int)round($w * $scale);
  $nh = (int)round($h * $scale);
  $dst = imagecreatetruecolor($nw, $nh);
  imagealphablending($dst, false);
  imagesavealpha($dst, true);
  imagecopyresampled($dst, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
  imagewebp($dst, $dest, $quality);
  imagedestroy($dst);
}

function lot_imagick_available(): bool {
  return class_exists('Imagick');
}

function lot_imagick_save_webp(string $tmp, string $dest, int $maxSize, int $quality): bool {
  if (!lot_imagick_available()) return false;
  $im = new Imagick();
  $im->readImage($tmp);
  if (method_exists($im, 'autoOrient')) {
    $im->autoOrient();
  }
  $w = $im->getImageWidth();
  $h = $im->getImageHeight();
  $scale = min(1.0, $maxSize / max($w, $h));
  $nw = (int)round($w * $scale);
  $nh = (int)round($h * $scale);
  if ($nw > 0 && $nh > 0 && ($nw !== $w || $nh !== $h)) {
    $im->resizeImage($nw, $nh, Imagick::FILTER_LANCZOS, 1);
  }
  $im->setImageFormat('webp');
  $im->setImageCompressionQuality($quality);
  $ok = $im->writeImage($dest);
  $im->clear();
  $im->destroy();
  return $ok;
}

function lot_collect_files(array $files, string $key): array {
  if (!isset($files[$key])) return [];
  $f = $files[$key];
  if (!is_array($f['name'])) {
    return [$f];
  }
  $out = [];
  foreach ($f['name'] as $i => $name) {
    $out[] = [
      'name' => $name,
      'type' => $f['type'][$i] ?? '',
      'tmp_name' => $f['tmp_name'][$i] ?? '',
      'error' => $f['error'][$i] ?? UPLOAD_ERR_NO_FILE,
      'size' => $f['size'][$i] ?? 0,
    ];
  }
  return $out;
}

$files = lot_collect_files($_FILES, 'file');
if (count($files) === 0) $files = lot_collect_files($_FILES, 'files');
if (count($files) === 0) {
  lot_upload_error('no_files');
}

$maxSize = 1600;
$quality = 82;
$baseDir = '';
$publicBase = '';

if ($type === 'team') {
  $maxSize = 900;
  $baseDir = __DIR__ . '/../images/team';
  $publicBase = '/images/team';
} elseif ($type === 'events') {
  if ($folder === '') lot_upload_error('missing_folder');
  $folder = lot_safe_slug($folder);
  $baseDir = __DIR__ . '/../events/' . $folder;
  $publicBase = '/events/' . $folder;
  $maxSize = 1600;
} else {
  lot_upload_error('unknown_type');
}

if (!is_dir($baseDir)) {
  mkdir($baseDir, 0755, true);
}

$saved = [];
foreach ($files as $f) {
  if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) continue;
  $tmp = (string)$f['tmp_name'];
  if ($tmp === '' || !is_file($tmp)) continue;
  $info = @getimagesize($tmp);
  if (!$info || empty($info['mime'])) continue;
  $mime = $info['mime'];
  $img = lot_image_from_file($tmp, $mime);
  $usingImagick = false;
  if (!$img && lot_imagick_available()) {
    $usingImagick = true;
  } elseif (!$img) {
    continue;
  }

  if ($type === 'events') {
    if ($kind === 'cover') {
      $filename = 'cover.webp';
    } else {
      $existing = glob($baseDir . '/*.webp') ?: [];
      $maxIndex = 0;
      foreach ($existing as $path) {
        if (preg_match('/\\/(\\d+)\\.webp$/', $path, $m)) {
          $idx = (int)$m[1];
          if ($idx > $maxIndex) $maxIndex = $idx;
        }
      }
      $filename = ($maxIndex + 1) . '.webp';
    }
  } else {
    $slug = lot_safe_slug(pathinfo((string)$f['name'], PATHINFO_FILENAME));
    $filename = $slug . '-' . time() . '.webp';
  }

  $dest = $baseDir . '/' . $filename;
  if ($usingImagick) {
    if (!lot_imagick_save_webp($tmp, $dest, $maxSize, $quality)) continue;
  } else {
    lot_save_webp($img, $dest, $maxSize, $quality);
    imagedestroy($img);
  }
  $saved[] = $publicBase . '/' . $filename;
}

lot_json(200, ['ok' => true, 'paths' => $saved]);
