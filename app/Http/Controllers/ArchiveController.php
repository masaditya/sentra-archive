<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use App\Models\RetentionAction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function upload()
    {
        return Inertia::render('user/upload');
    }

    public function store(Request $request)
    {
        // Placeholder for Excel/CSV import logic
        // In a real app, use Maatwebsite/Laravel-Excel
        return back()->with('success', 'Data arsip berhasil diunggah.');
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

        // Update archive status or flag it as processed
        $archive->update(['is_notified' => false]); 

        return back()->with('success', 'Tindakan berhasil dicatat.');
    }
}
