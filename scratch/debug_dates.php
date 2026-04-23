<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$archives = App\Models\Archive::select('id', 'archive_number', 'start_date', 'end_date')->orderBy('id', 'desc')->take(10)->get();
foreach($archives as $a) {
    echo "ID: {$a->id} | No: {$a->archive_number} | Start: {$a->start_date} | End: {$a->end_date}\n";
}
