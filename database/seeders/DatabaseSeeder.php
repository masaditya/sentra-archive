<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        \App\Models\User::create([
            'name' => 'Super Admin',
            'username' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
        ]);

        // Sample Organizations
        $organizations = [
            ['name' => 'Badan Kepegawaian, Pendidikan, Dan Pelatihan', 'type' => 'Badan'],
            ['name' => 'Badan Kesatuan Bangsa Dan Politik', 'type' => 'Badan', 'address' => 'Jl Trunojoyo No. 12', 'phone' => '(0353) 893526'],
            ['name' => 'Badan Penanggulangan Bencana Daerah', 'type' => 'Badan', 'address' => 'Jl. A. Yani No. 06.', 'phone' => '(0353) 881826'],
            ['name' => 'Dinas Kependudukan Dan Pencatatan Sipil', 'type' => 'Dinas', 'address' => 'Jl. Patimura 26 A Bojonegoro', 'phone' => '(0353) 881256'],
            ['name' => 'Dinas Kesehatan', 'type' => 'Dinas', 'address' => 'Jalan Dr. Cipto, Mojo Kampung, Mojokampung, Kabupaten Bojonegoro', 'phone' => '(0353) 881350'],
        ];

        foreach ($organizations as $index => $org) {
            $o = \App\Models\Organization::create($org);
            
            // Create user for each organization
            $username = strtolower(str_replace([' ', ','], ['_', ''], $org['name']));
            \App\Models\User::create([
                'name' => 'Admin ' . $org['name'],
                'username' => substr($username, 0, 20) . '_user',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'user',
                'organization_id' => $o->id,
            ]);

            // Create sample archives for each organization
            \App\Models\Archive::create([
                'organization_id' => $o->id,
                'archive_number' => '001/' . $index . '/2023',
                'type' => 'Surat Masuk',
                'status' => 'Aktif',
                'year' => 2023,
                'retention_inactive_date' => now()->addYears(2),
                'retention_destruction_date' => now()->addYears(5),
            ]);

            \App\Models\Archive::create([
                'organization_id' => $o->id,
                'archive_number' => '002/' . $index . '/2021',
                'type' => 'Nota Dinas',
                'status' => 'Inaktif',
                'year' => 2021,
                'retention_inactive_date' => now()->subYears(1),
                'retention_destruction_date' => now()->addYears(3),
            ]);

            if ($index == 3) { // Let's make some archives notified for testing
                \App\Models\Archive::create([
                    'organization_id' => $o->id,
                    'archive_number' => '003/' . $index . '/2013',
                    'type' => 'SK Kepala',
                    'status' => 'Inaktif',
                    'year' => 2013,
                    'retention_inactive_date' => now()->subYears(5),
                    'retention_destruction_date' => now()->subDays(1), // Already due
                    'is_notified' => true,
                ]);
            }
        }
    }
}
