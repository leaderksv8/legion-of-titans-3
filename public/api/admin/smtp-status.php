<?php
declare(strict_types=1);

require_once __DIR__ . '/../_util.php';

$cfg = lot_load_config();

$smtp = $cfg['smtp'] ?? [];
$host = !empty($smtp['host']);
$user = !empty($smtp['user']);
$pass = !empty($smtp['pass']);
$to = !empty($smtp['to']);
$from = !empty($smtp['from']);

$ok = $host && $user && $pass && $to && $from;
lot_json(200, ['ok' => $ok, 'has' => ['host' => $host, 'user' => $user, 'pass' => $pass, 'to' => $to, 'from' => $from]]);

