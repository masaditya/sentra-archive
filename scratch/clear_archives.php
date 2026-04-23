<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$countBefore = App\Models\Archive::count();
App\Models\Archive::query()->delete();
$countAfter = App\Models\Archive::count();

echo "Data dibersihkan. Sebelum: $countBefore | Sesudah: $countAfter\n";
