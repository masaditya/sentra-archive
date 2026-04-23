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
        Schema::table('archives', function (Blueprint $table) {
            $table->string('definitive_number')->nullable()->after('archive_number');
            $table->string('temporary_number')->nullable()->after('definitive_number');
            $table->string('archivist_name')->nullable()->after('temporary_number');
            $table->string('series')->nullable()->after('archivist_name');
            $table->string('sub_series')->nullable()->after('series');
            $table->string('classification_code')->nullable()->after('sub_series');
            $table->string('file_number')->nullable()->after('classification_code');
            $table->text('description')->nullable()->after('file_number');
            $table->date('start_date')->nullable()->after('description');
            $table->date('end_date')->nullable()->after('start_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('archives', function (Blueprint $table) {
            $table->dropColumn([
                'definitive_number',
                'temporary_number',
                'archivist_name',
                'series',
                'sub_series',
                'classification_code',
                'file_number',
                'description',
                'start_date',
                'end_date',
            ]);
        });
    }
};
