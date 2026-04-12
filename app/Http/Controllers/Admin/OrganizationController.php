<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index(Request $request)
    {
        $query = Organization::with('users');

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $organizations = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/organizations', [
            'organizations' => $organizations,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username',
            'password' => 'required|string|min:4',
        ]);

        $organization = Organization::create([
            'name' => $request->name,
        ]);

        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'organization_id' => $organization->id,
        ]);

        return back()->with('success', 'OPD berhasil ditambahkan.');
    }

    public function update(Request $request, Organization $organization)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|unique:users,username,' . $organization->users->first()?->id,
            'password' => 'nullable|string|min:4',
        ]);

        $organization->update([
            'name' => $request->name,
        ]);

        $user = $organization->users->first();
        if ($user) {
            $user->update([
                'name' => $request->name,
                'username' => $request->username,
            ]);

            if ($request->password) {
                $user->update(['password' => Hash::make($request->password)]);
            }
        }

        return back()->with('success', 'OPD berhasil diupdate.');
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();
        return back()->with('success', 'OPD berhasil dihapus.');
    }
}
