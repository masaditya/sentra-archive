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

        $notifications = Archive::where('organization_id', $organizationId)
            ->where('is_notified', true)
            ->get();

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
