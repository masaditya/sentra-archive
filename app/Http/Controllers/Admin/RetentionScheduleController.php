<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RetentionSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RetentionScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = RetentionSchedule::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $schedules = $query->orderBy('code')->paginate(50)->withQueryString();

        return Inertia::render('admin/jra/index', [
            'schedules' => $schedules,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:retention_schedules,code',
            'name' => 'required|string|max:255',
            'active_retention' => 'nullable|integer|min:0',
            'inactive_retention' => 'nullable|integer|min:0',
            'final_disposition' => 'required|string|in:Musnah,Permanen',
            'is_classification' => 'boolean',
        ]);

        RetentionSchedule::create($validated);

        return back()->with('success', 'JRA berhasil ditambahkan.');
    }

    public function update(Request $request, RetentionSchedule $jra)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:retention_schedules,code,' . $jra->id,
            'name' => 'required|string|max:255',
            'active_retention' => 'nullable|integer|min:0',
            'inactive_retention' => 'nullable|integer|min:0',
            'final_disposition' => 'required|string|in:Musnah,Permanen',
            'is_classification' => 'boolean',
        ]);

        $jra->update($validated);

        return back()->with('success', 'JRA berhasil diperbarui.');
    }

    public function destroy(RetentionSchedule $jra)
    {
        $jra->delete();

        return back()->with('success', 'JRA berhasil dihapus.');
    }
}
