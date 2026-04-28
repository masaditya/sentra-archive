<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function user(Request $request)
    {
        $organizationId = $request->user()->organization_id ?? 1;
        $simulationDate = $request->input('simulation_date') ? \Carbon\Carbon::parse($request->input('simulation_date')) : now();
        $oneMonthFromNow = $simulationDate->copy()->addMonth();

        $notifications = Archive::with('classification')
            ->where('organization_id', $organizationId)
            ->where('is_notified', false)
            ->whereIn('status', ['Aktif', 'Inaktif']) // Bisa aktif atau inaktif
            ->where(function($query) use ($oneMonthFromNow) {
                // Tampilkan yang sudah lewat atau yang akan datang dlm 1 bln
                $query->whereNotNull('retention_inactive_date')
                      ->where('retention_inactive_date', '<=', $oneMonthFromNow)
                      ->orWhereNotNull('retention_destruction_date')
                      ->where('retention_destruction_date', '<=', $oneMonthFromNow);
            })
            ->get()
            ->map(function($archive) use ($oneMonthFromNow, $simulationDate) {
                $schedule = $archive->classification;
                
                // Prioritas 1: Musnah/Permanen (Setelah Inaktif)
                if ($archive->retention_destruction_date && $archive->retention_destruction_date <= $oneMonthFromNow) {
                    $finalAction = $schedule ? $schedule->final_disposition : 'Musnah';
                    $isPermanent = strtolower($finalAction) === 'permanen';
                    
                    $archive->action_type = $isPermanent ? 'Permanen' : 'Musnah';
                    $archive->action_date = $archive->retention_destruction_date;
                    
                    if ($archive->retention_destruction_date < $simulationDate->format('Y-m-d')) {
                        $archive->notif_description = 'TERLEWAT: Seharusnya sudah ' . ($isPermanent ? 'Permanen' : 'Dimusnahkan') . ' pada ' . \Carbon\Carbon::parse($archive->retention_destruction_date)->format('d/m/Y');
                    } else {
                        $archive->notif_description = $isPermanent 
                            ? 'Masa retensi inaktif habis. Berdasarkan JRA, arsip ini harus menjadi PERMANEN.' 
                            : 'Masa retensi inaktif habis. Berdasarkan JRA, arsip ini harus DIMUSNAHKAN.';
                    }
                } 
                // Prioritas 2: Pindah ke Inaktif (Setelah Aktif)
                else if ($archive->retention_inactive_date && $archive->retention_inactive_date <= $oneMonthFromNow && $archive->status === 'Aktif') {
                    $archive->action_type = 'Inaktif';
                    $archive->action_date = $archive->retention_inactive_date;
                    
                    if ($archive->retention_inactive_date < $simulationDate->format('Y-m-d')) {
                        $archive->notif_description = 'TERLEWAT: Seharusnya sudah pindah ke Inaktif pada ' . \Carbon\Carbon::parse($archive->retention_inactive_date)->format('d/m/Y');
                    } else {
                        $archive->notif_description = 'Masa aktif berakhir. Segera pindahkan ke ruang penyimpanan inaktif sesuai jadwal JRA.';
                    }
                }
                
                $archive->archive_id = $archive->id;
                return $archive;
            })
            ->filter(fn($a) => isset($a->action_type))
            ->values();

        return Inertia::render('user/notifications', [
            'notifications' => $notifications,
            'simulationDate' => $simulationDate->format('Y-m-d'),
        ]);
    }

    public function admin(Request $request)
    {
        $simulationDate = $request->input('simulation_date') ? \Carbon\Carbon::parse($request->input('simulation_date')) : now();
        $oneMonthFromNow = $simulationDate->copy()->addMonth();

        $notifications = Archive::with(['organization', 'retentionActions', 'classification'])
            ->where(function($query) use ($oneMonthFromNow) {
                $query->whereNotNull('retention_inactive_date')
                      ->where('retention_inactive_date', '<=', $oneMonthFromNow)
                      ->orWhereNotNull('retention_destruction_date')
                      ->where('retention_destruction_date', '<=', $oneMonthFromNow);
            })
            ->whereIn('status', ['Aktif', 'Inaktif']) // Hanya yang belum diproses tuntas
            ->get()
            ->map(function($archive) use ($oneMonthFromNow, $simulationDate) {
                $schedule = $archive->classification;
                
                // Tentukan apa yang sedang jatuh tempo
                if ($archive->retention_destruction_date && $archive->retention_destruction_date <= $oneMonthFromNow) {
                    $finalAction = $schedule ? $schedule->final_disposition : 'Musnah';
                    $archive->due_type = strtolower($finalAction) === 'permanen' ? 'Permanen' : 'Musnah';
                    $archive->due_date = $archive->retention_destruction_date;
                } else if ($archive->retention_inactive_date && $archive->retention_inactive_date <= $oneMonthFromNow && $archive->status === 'Aktif') {
                    $archive->due_type = 'Inaktif';
                    $archive->due_date = $archive->retention_inactive_date;
                }

                $archive->is_followed_up = $archive->retentionActions->isNotEmpty();
                $archive->latest_action = $archive->retentionActions->last();

                return $archive;
            })
            ->filter(fn($a) => isset($a->due_type))
            ->groupBy('organization_id');

        return Inertia::render('admin/notifications', [
            'notificationsGrouped' => $notifications,
            'simulationDate' => $simulationDate->format('Y-m-d'),
        ]);
    }

    public function export(Request $request)
    {
        $simulationDate = $request->input('simulation_date') ? \Carbon\Carbon::parse($request->input('simulation_date')) : now();
        $oneMonthFromNow = $simulationDate->copy()->addMonth();

        $notifications = Archive::with(['organization', 'classification'])
            ->where(function($query) use ($oneMonthFromNow) {
                $query->whereNotNull('retention_inactive_date')
                      ->where('retention_inactive_date', '<=', $oneMonthFromNow)
                      ->orWhereNotNull('retention_destruction_date')
                      ->where('retention_destruction_date', '<=', $oneMonthFromNow);
            })
            ->whereIn('status', ['Aktif', 'Inaktif'])
            ->get()
            ->map(function($archive) use ($oneMonthFromNow) {
                $schedule = $archive->classification;
                if ($archive->retention_destruction_date && $archive->retention_destruction_date <= $oneMonthFromNow) {
                    $finalAction = $schedule ? $schedule->final_disposition : 'Musnah';
                    $archive->due_type = strtolower($finalAction) === 'permanen' ? 'Permanen' : 'Musnah';
                    $archive->due_date = $archive->retention_destruction_date;
                } else if ($archive->retention_inactive_date && $archive->retention_inactive_date <= $oneMonthFromNow && $archive->status === 'Aktif') {
                    $archive->due_type = 'Inaktif';
                    $archive->due_date = $archive->retention_inactive_date;
                }
                return $archive;
            })
            ->filter(fn($a) => isset($a->due_type));

        return view('reports.notifications', [
            'notifications' => $notifications,
            'date' => $simulationDate->format('d F Y')
        ]);
    }
}
