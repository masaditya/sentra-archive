<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->string('archive_number'); // Nomor Arsip
            $table->string('type'); // Jenis Arsip (e.g., Surat Masuk, Nota Dinas)
            $table->string('status'); // Aktif, Inaktif, Permanen, Musnah
            $table->integer('year'); // Tahun
            $table->date('retention_inactive_date')->nullable();
            $table->date('retention_destruction_date')->nullable();
            $table->boolean('is_notified')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('archives');
    }
};
