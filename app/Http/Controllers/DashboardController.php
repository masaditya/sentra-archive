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
        $organizationId = $request->user()->organization_id ?? 1;
        
        $stats = [
            'total' => Archive::where('organization_id', $organizationId)->count(),
            'aktif' => Archive::where('organization_id', $organizationId)->where('status', 'Aktif')->count(),
            'inaktif' => Archive::where('organization_id', $organizationId)->where('status', 'Inaktif')->count(),
            'permanen' => Archive::where('organization_id', $organizationId)->where('status', 'Permanen')->count(),
        ];

        // Fetch real yearly data for the organization
        $years = Archive::where('organization_id', $organizationId)
            ->select('year')
            ->distinct()
            ->orderBy('year')
            ->pluck('year')
            ->toArray();
            
        if (empty($years)) {
            $years = [date('Y')];
        }

        $yearlyDatasets = [
            'labels' => array_map('strval', $years),
            'datasets' => [
                'aktif' => [],
                'inaktif' => [],
                'musnah' => [],
                'permanen' => []
            ]
        ];

        foreach ($years as $year) {
            $yearlyDatasets['datasets']['aktif'][] = Archive::where('organization_id', $organizationId)->where('year', $year)->where('status', 'Aktif')->count();
            $yearlyDatasets['datasets']['inaktif'][] = Archive::where('organization_id', $organizationId)->where('year', $year)->where('status', 'Inaktif')->count();
            $yearlyDatasets['datasets']['musnah'][] = Archive::where('organization_id', $organizationId)->where('year', $year)->where('status', 'Musnah')->count();
            $yearlyDatasets['datasets']['permanen'][] = Archive::where('organization_id', $organizationId)->where('year', $year)->where('status', 'Permanen')->count();
        }

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
            'yearlyData' => $yearlyDatasets,
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

        // Fetch real yearly data
        $years = Archive::select('year')->distinct()->orderBy('year')->pluck('year')->toArray();
        if (empty($years)) {
            $years = [date('Y')];
        }

        $yearlyDatasets = [
            'labels' => array_map('strval', $years),
            'datasets' => [
                'aktif' => [],
                'inaktif' => [],
                'musnah' => [],
                'permanen' => []
            ]
        ];

        foreach ($years as $year) {
            $yearlyDatasets['datasets']['aktif'][] = Archive::where('year', $year)->where('status', 'Aktif')->count();
            $yearlyDatasets['datasets']['inaktif'][] = Archive::where('year', $year)->where('status', 'Inaktif')->count();
            $yearlyDatasets['datasets']['musnah'][] = Archive::where('year', $year)->where('status', 'Musnah')->count();
            $yearlyDatasets['datasets']['permanen'][] = Archive::where('year', $year)->where('status', 'Permanen')->count();
        }

        // Fetch top organizations by archive count
        $topOrganizations = Organization::withCount('archives')
            ->orderBy('archives_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function($org) {
                return [
                    'id' => $org->id,
                    'name' => $org->name,
                    'count' => $org->archives_count,
                    'percent' => Archive::count() > 0 ? round(($org->archives_count / Archive::count()) * 100) : 0
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'yearlyData' => $yearlyDatasets,
            'topOrganizations' => $topOrganizations,
        ]);
    }
}
