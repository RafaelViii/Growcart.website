<?php
header('Content-Type: application/json');
$dir = __DIR__ . '/Assets/products/';
$allowed = ['jpg','jpeg','png','gif','webp','svg'];
$files = [];
if (is_dir($dir)) {
    foreach (scandir($dir) as $file) {
        if ($file === '.' || $file === '..') continue;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $allowed)) {
            $files[] = $file;
        }
    }
}
echo json_encode($files);