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

        $notifications = Archive::where('organization_id', $organizationId)
            ->where('is_notified', false)
            ->where('status', 'Aktif')
            ->where(function($query) use ($oneMonthFromNow) {
                // Tampilkan yang sudah lewat atau yang akan datang dlm 1 bln
                $query->whereNotNull('retention_inactive_date')
                      ->where('retention_inactive_date', '<=', $oneMonthFromNow)
                      ->orWhereNotNull('retention_destruction_date')
                      ->where('retention_destruction_date', '<=', $oneMonthFromNow);
            })
            ->get()
            ->map(function($archive) use ($oneMonthFromNow, $simulationDate) {
                // Prioritas Musnah/Permanen
                if ($archive->retention_destruction_date && $archive->retention_destruction_date <= $oneMonthFromNow) {
                    $isPermanent = str_contains(strtolower($archive->series ?? ''), 'permanen') || 
                                  str_contains(strtolower($archive->sub_series ?? ''), 'permanen');
                    
                    $archive->action_type = $isPermanent ? 'Permanen' : 'Musnah';
                    $archive->action_date = $archive->retention_destruction_date;
                    
                    if ($archive->retention_destruction_date < $simulationDate->format('Y-m-d')) {
                        $archive->notif_description = 'TERLEWAT: Sewajarnya sudah ' . ($isPermanent ? 'Permanen' : 'Dimusnahkan') . ' pada ' . \Carbon\Carbon::parse($archive->retention_destruction_date)->format('d/m/Y');
                    } else {
                        $archive->notif_description = $isPermanent 
                            ? 'Mendekati batas waktu inaktif. Dijadwalkan menjadi Permanen.' 
                            : 'Masa retensi inaktif akan habis. Dijadwalkan untuk proses Pemusnahan.';
                    }
                } 
                else if ($archive->retention_inactive_date && $archive->retention_inactive_date <= $oneMonthFromNow) {
                    $archive->action_type = 'Inaktif';
                    $archive->action_date = $archive->retention_inactive_date;
                    
                    if ($archive->retention_inactive_date < $simulationDate->format('Y-m-d')) {
                        $archive->notif_description = 'TERLEWAT: Sewajarnya sudah pindah ke Inaktif pada ' . \Carbon\Carbon::parse($archive->retention_inactive_date)->format('d/m/Y');
                    } else {
                        $archive->notif_description = 'Mendekati masa inaktif. Segera pindahkan ke ruang penyimpanan inaktif.';
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

    public function admin()
    {
        $notifications = Archive::with('organization')
            ->where('is_notified', true)
            ->get()
            ->groupBy('organization_id');

        return Inertia::render('admin/notifications', [
            'notificationsGrouped' => $notifications,
        ]);
    }
}
