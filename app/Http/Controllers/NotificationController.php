<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function user(Request $request)
    {
        $organizationId = $request->user()->organization_id;

        // In a real app, you would calculate this based on retention dates.
        // For this demo, we'll label archives that have is_notified = true.
        $notifications = Archive::where('organization_id', $organizationId)
            ->where('is_notified', true)
            ->get()
            ->map(function($archive) {
                // Logic to determine action group based on year or specific field
                // This is a simplification for the prototype
                if ($archive->year < 2016) {
                    $archive->status = 'Musnah';
                    $archive->description = 'Jadwal retensi JRA telah habis dan arsip dinilai musnah.';
                } elseif ($archive->year >= 2021) {
                    $archive->status = 'Inaktif';
                    $archive->description = 'Masa aktif selesai, harus dipindahkan ke Gudang Inaktif.';
                } else {
                    $archive->status = 'Permanen';
                    $archive->description = 'Dinilai memiliki nilai guna kesejarahan. Serahkan ke LKD.';
                }
                return $archive;
            });

        return Inertia::render('user/notifications', [
            'notifications' => $notifications,
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
