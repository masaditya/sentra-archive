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
        Schema::create('retention_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            $table->text('name');
            $table->integer('active_retention')->nullable();
            $table->integer('inactive_retention')->nullable();
            $table->string('final_disposition')->nullable();
            $table->text('active_retention_notes')->nullable();
            $table->text('inactive_retention_notes')->nullable();
            $table->text('final_disposition_notes')->nullable();
            $table->boolean('is_classification')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('retention_schedules');
    }
};
