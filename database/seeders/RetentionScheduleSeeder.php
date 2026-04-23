<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RetentionSchedule;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Support\Facades\DB;

class RetentionScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $filePath = public_path('jangka_retensi_arsip.xlsx');
        
        $data = Excel::toCollection(new class implements ToCollection {
            public function collection(Collection $rows) {}
        }, $filePath)->first();

        // Skip header
        $rows = $data->slice(1);
        
        RetentionSchedule::truncate();

        $batch = [];
        foreach ($rows as $row) {
            $fullName = trim($row[0] ?? '');
            if (empty($fullName)) continue;

            // Extract code and name
            $parts = explode(' ', $fullName, 2);
            $code = $parts[0] ?? null;
            $name = $parts[1] ?? $parts[0];

            $activeRetentionText = trim($row[1] ?? '');
            $inactiveRetentionText = trim($row[2] ?? '');
            $finalDispositionText = trim($row[3] ?? '');

            // Convert "1 Tahun" to integer 1
            $activeRetention = null;
            if (!empty($activeRetentionText) && $activeRetentionText !== '-') {
                $num = preg_replace('/[^0-9]/', '', $activeRetentionText);
                if (is_numeric($num)) $activeRetention = (int)$num;
            }

            $inactiveRetention = null;
            if (!empty($inactiveRetentionText) && $inactiveRetentionText !== '-') {
                $num = preg_replace('/[^0-9]/', '', $inactiveRetentionText);
                if (is_numeric($num)) $inactiveRetention = (int)$num;
            }

            $batch[] = [
                'code' => $code,
                'name' => $name,
                'active_retention' => $activeRetention,
                'inactive_retention' => $inactiveRetention,
                'final_disposition' => $finalDispositionText,
                'active_retention_notes' => $activeRetentionText,
                'inactive_retention_notes' => $inactiveRetentionText,
                'final_disposition_notes' => $finalDispositionText, // Storing original text in notes too
                'is_classification' => empty($activeRetentionText) || $activeRetentionText === '-',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($batch) >= 100) {
                RetentionSchedule::insert($batch);
                $batch = [];
            }
        }

        if (count($batch) > 0) {
            RetentionSchedule::insert($batch);
        }
    }
}
