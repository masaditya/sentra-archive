<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use App\Models\RetentionAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ArchiveController extends Controller
{
    public function upload()
    {
        return Inertia::render('user/upload');
    }

    public function index(Request $request)
    {
        $organizationId = $request->user()->organization_id ?? 1;
        $archives = Archive::with('classification')
            ->where('organization_id', $organizationId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $retentionSchedules = \App\Models\RetentionSchedule::where('is_classification', 0)
            ->whereNotNull('active_retention')
            ->orderBy('code')
            ->limit(30)
            ->get(['code', 'name', 'active_retention', 'inactive_retention', 'final_disposition']);

        return Inertia::render('user/archives/index', [
            'archives' => $archives,
            'retentionSchedules' => $retentionSchedules
        ]);
    }

    public function searchRetentionSchedules(Request $request)
    {
        $search = $request->query('search');
        
        $schedules = \App\Models\RetentionSchedule::where('is_classification', 0)
            ->whereNotNull('active_retention')
            ->when($search, function ($query, $search) {
                return $query->where(function($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                      ->orWhere('name', 'like', "%{$search}%");
                });
            })
            ->orderBy('code')
            ->limit(30)
            ->get(['code', 'name', 'active_retention', 'inactive_retention', 'final_disposition']);

        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $request->validate([
            'archives' => 'required|array|min:1',
        ]);

        try {
            DB::beginTransaction();

            $organizationId = $request->user()->organization_id ?? 1;
            $archives = $request->input('archives');

            foreach ($archives as $archiveData) {
                // Determine dates
                $startDate = $this->parseIndonesianDate($archiveData['tanggalTertua'] ?? null);
                $endDate = $this->parseIndonesianDate($archiveData['tanggalTermuda'] ?? null);
                $classificationCode = substr(strval($archiveData['kodeKlasifikasi']), 0, 255);

                // Kalkulasi JRA
                $jra = $this->calculateJRADates($classificationCode, $endDate);

                \App\Models\Archive::create([
                    'organization_id' => $organizationId,
                    'archive_number' => substr(strval($archiveData['noDefinitif']), 0, 255),
                    'definitive_number' => substr(strval($archiveData['noDefinitif']), 0, 255),
                    'temporary_number' => substr(strval($archiveData['noArsipSementara'] ?? ''), 0, 255),
                    'archivist_name' => substr(strval($archiveData['namaArsiparis'] ?? ''), 0, 255),
                    'series' => substr(strval($archiveData['seri'] ?? ''), 0, 255),
                    'sub_series' => substr(strval($archiveData['masalah'] ?? ''), 0, 255),
                    'classification_code' => $classificationCode,
                    'file_number' => substr(strval($archiveData['noBerkas'] ?? ''), 0, 255),
                    'description' => $archiveData['berkasInformasi'] ?? null,
                    'status' => 'Aktif',
                    'year' => date('Y'),
                    'type' => 'Daftar Arsip',
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'retention_inactive_date' => $jra['inactive_date'],
                    'retention_destruction_date' => $jra['destruction_date'],
                    'is_notified' => false,
                ]);
            }

            DB::commit();
            return redirect()->route('archives.index')->with('success', count($archives) . ' data arsip berhasil diimpor.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal mengimpor data: ' . $e->getMessage());
        }
    }

    public function validate(Request $request)
    {
        $request->validate([
            'archives' => 'required|array',
        ]);

        $organizationId = $request->user()->organization_id ?? 1;
        $archives = $request->input('archives');
        
        $valid = [];
        $duplicates = [];

        // Pre-fetch existing definitive numbers for this organization
        $existingNumbers = \App\Models\Archive::where('organization_id', $organizationId)
            ->pluck('definitive_number')
            ->toArray();

        foreach ($archives as $archive) {
            $noDefinitif = strval($archive['noDefinitif'] ?? '');
            
            if (in_array($noDefinitif, $existingNumbers)) {
                $duplicates[] = $archive;
            } else {
                $valid[] = $archive;
                // Add to existing numbers to prevent duplicates within the same batch if not already there
                // (though the Excel might have internal duplicates)
                $existingNumbers[] = $noDefinitif;
            }
        }

        return response()->json([
            'valid' => $valid,
            'duplicates' => $duplicates
        ]);
    }

    protected function parseIndonesianDate($dateStr)
    {
        if (!$dateStr) return null;
        $dateStr = trim($dateStr);
        
        // 1. Jika hanya Tahun (4 digit angka saja) -> Menjadi 1 Januari
        if (is_numeric($dateStr) && strlen($dateStr) === 4) {
            return $dateStr . '-01-01';
        }

        $months = [
            'Januari' => 'January', 'Februari' => 'February', 'Maret' => 'March', 'April' => 'April',
            'Mei' => 'May', 'Juni' => 'June', 'Juli' => 'July', 'Agustus' => 'August',
            'September' => 'September', 'Oktober' => 'October', 'November' => 'November', 'Desember' => 'December'
        ];
        
        $translatedDate = $dateStr;
        foreach ($months as $id => $en) {
            if (stripos($dateStr, $id) !== false) {
                $translatedDate = str_ireplace($id, $en, $dateStr);
                break;
            }
        }

        try {
            // Cek apakah ada format Tanggal (DD) dalam string
            // Jika polanya "Oktober 2013" (tanpa angka tanggal di depan), paksa jadi tanggal 1
            if (preg_match('/^[a-zA-Z]+\s+\d{4}$/', trim($translatedDate))) {
                return \Carbon\Carbon::parse("1 " . $translatedDate)->format('Y-m-d');
            }

            // Jika ada tanggal lengkap "28 Oktober 2013" atau format standar lainnya
            return \Carbon\Carbon::parse($translatedDate)->format('Y-m-d');
        } catch (\Exception $e) {
            // Fallback: Cari tahun 4 digit jika semua gagal
            if (preg_match('/\b(19|20)\d{2}\b/', $dateStr, $matches)) {
                return $matches[0] . '-01-01';
            }
            return null;
        }
    }

    public function followUp(Request $request, Archive $archive)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,png|max:2048',
            'action_type' => 'required|string',
        ]);

        $path = $request->file('file')->store('retention_docs');

        RetentionAction::create([
            'archive_id' => $archive->id,
            'action_type' => $request->action_type,
            'file_path' => $path,
        ]);

        $status = $archive->status;
        $actionLower = strtolower($request->action_type);
        if (str_contains($actionLower, 'inaktif')) {
            $status = 'Inaktif';
        } elseif (str_contains($actionLower, 'musnah')) {
            $status = 'Musnah';
        } elseif (str_contains($actionLower, 'permanen')) {
            $status = 'Permanen';
        }

        $archive->update([
            'status' => $status,
            'is_notified' => false,
        ]);

        return back()->with('success', 'Tindakan berhasil dicatat.');
    }

    public function update(Request $request, Archive $archive)
    {
        $validated = $request->validate([
            'archive_number' => 'required|string|max:255',
            'series' => 'nullable|string|max:255',
            'sub_series' => 'nullable|string|max:255',
            'classification_code' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|string|in:Aktif,Inaktif,Musnah,Permanen',
        ]);

        // Recalculate JRA if classification or end_date changed
        $jra = $this->calculateJRADates($validated['classification_code'], $validated['end_date']);
        $validated['retention_inactive_date'] = $jra['inactive_date'];
        $validated['retention_destruction_date'] = $jra['destruction_date'];

        $archive->update($validated);

        return back()->with('success', 'Data arsip berhasil diperbarui.');
    }

    protected function calculateJRADates($code, $endDate)
    {
        $inactiveDate = null;
        $destructionDate = null;

        if ($endDate) {
            $schedule = \App\Models\RetentionSchedule::where('code', $code)->first();
            if ($schedule) {
                $endCarbon = \Carbon\Carbon::parse($endDate);
                
                // Pindah ke Inaktif = Tanggal Terakhir + Masa Aktif
                $inactiveDate = $endCarbon->copy()->addYears($schedule->active_retention)->format('Y-m-d');
                
                // Musnah/Permanen = Tanggal Inaktif + Masa Inaktif
                $destructionDate = \Carbon\Carbon::parse($inactiveDate)->addYears($schedule->inactive_retention)->format('Y-m-d');
            }
        }

        return [
            'inactive_date' => $inactiveDate,
            'destruction_date' => $destructionDate
        ];
    }

    public function destroy(Archive $archive)
    {
        $archive->delete();

        return back()->with('success', 'Data arsip berhasil dihapus.');
    }
}
