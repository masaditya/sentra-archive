<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function user(Request $request)
    {
        $organizationId = $request->user()->organization_id;
        
        $stats = [
            'total' => Archive::where('organization_id', $organizationId)->count(),
            'aktif' => Archive::where('organization_id', $organizationId)->where('status', 'Aktif')->count(),
            'inaktif' => Archive::where('organization_id', $organizationId)->where('status', 'Inaktif')->count(),
            'permanen' => Archive::where('organization_id', $organizationId)->where('status', 'Permanen')->count(),
        ];

        $recentArchives = Archive::where('organization_id', $organizationId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $notificationsCount = Archive::where('organization_id', $organizationId)
            ->where('is_notified', true)
            ->count();

        return Inertia::render('user/dashboard', [
            'stats' => $stats,
            'recentArchives' => $recentArchives,
            'notificationsCount' => $notificationsCount,
        ]);
    }

    public function admin()
    {
        $stats = [
            'totalArchives' => Archive::count(),
            'totalOrganizations' => Organization::count(),
            'aktifInaktif' => Archive::whereIn('status', ['Aktif', 'Inaktif'])->count(),
            'permanen' => Archive::where('status', 'Permanen')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }
}
