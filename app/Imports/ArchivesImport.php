<?php

namespace App\Imports;

use App\Models\Archive;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Carbon\Carbon;

class ArchivesImport implements ToCollection
{
    protected $organizationId;

    public function __construct($organizationId)
    {
        $this->organizationId = $organizationId;
    }

    public function collection(Collection $rows)
    {
        $currentParent = null;
        
        foreach ($rows as $index => $row) {
            // Skip headers (Row 0 and 1)
            if ($index < 2) continue;

            // Mapping based on new template structure:
            // Index 0: Nomor Definitif
            // Index 1: Nomor Arsip Sementara
            // Index 2: Nama Arsiparis
            // Index 3: Seri
            // Index 4: Masalah
            // Index 5: Kode Klasifikasi
            // Index 6: Nomor Berkas (Parent)
            // Index 7: Berkas / Informasi (Parent)
            // Index 8: Nomor Isi Berkas (Child)
            // Index 9: Isi Berkas / Informasi (Child)
            // Index 10: Kurun Waktu (Tanggal)
            
            $noDefinitif = $row[0] ?? null;
            $kodeKlasifikasi = $row[5] ?? null;

            // Detect Parent Row: Index 0 is numeric/present
            if ($noDefinitif && $kodeKlasifikasi && (is_numeric($noDefinitif) || !empty(trim($noDefinitif)))) {
                // Save previous parent if it exists
                if ($currentParent) {
                    $this->saveArchive($currentParent);
                }

                $currentParent = [
                    'organization_id' => $this->organizationId,
                    'archive_number' => substr(strval($noDefinitif), 0, 255),
                    'definitive_number' => substr(strval($noDefinitif), 0, 255),
                    'temporary_number' => substr(strval($row[1] ?? ''), 0, 255),
                    'archivist_name' => substr(strval($row[2] ?? ''), 0, 255),
                    'series' => substr(strval($row[3] ?? ''), 0, 255),
                    'sub_series' => substr(strval($row[4] ?? ''), 0, 255),
                    'classification_code' => substr(strval($kodeKlasifikasi), 0, 255),
                    'file_number' => substr(strval($row[6] ?? ''), 0, 255),
                    'description' => $row[7] ?? null,
                    'status' => 'Aktif',
                    'year' => date('Y'),
                    'type' => 'Daftar Arsip',
                    'children' => []
                ];

                // Check if this first row also has child data
                if (isset($row[9])) {
                    $currentParent['children'][] = [
                        'tanggal' => $row[10] ?? $row[11] ?? null
                    ];
                }
            } elseif ($currentParent && isset($row[9])) {
                // This is a child row (Parent Definitif is empty but child info is present)
                $currentParent['children'][] = [
                    'tanggal' => $row[10] ?? $row[11] ?? null
                ];
            }
        }

        // Save the last parent
        if ($currentParent) {
            $this->saveArchive($currentParent);
        }
    }

    protected function saveArchive($data)
    {
        $children = $data['children'];
        unset($data['children']);

        if (count($children) > 0) {
            // Tanggal Tertua from first child
            $data['start_date'] = $this->transformDate($children[0]['tanggal']);
            // Tanggal Termuda from last child
            $data['end_date'] = $this->transformDate($children[count($children) - 1]['tanggal']);
        }

        Archive::create($data);
    }

    protected function transformDate($value)
    {
        if (!$value) return null;
        
        try {
            if (is_numeric($value)) {
                // If it's a small number, it's likely just a year
                if ($value < 3000) return $value . '-01-01'; 
                
                return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value);
            }
            return Carbon::parse($value);
        } catch (\Exception $e) {
            return null;
        }
    }
}
