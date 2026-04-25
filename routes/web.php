<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    // User Routes
    Route::middleware(['role:user'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'user'])->name('dashboard');
        Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'user'])->name('notifications');
        Route::get('/upload', [\App\Http\Controllers\ArchiveController::class, 'upload'])->name('upload');
        Route::post('/upload', [\App\Http\Controllers\ArchiveController::class, 'store'])->name('archives.store');
        Route::get('/archives', [\App\Http\Controllers\ArchiveController::class, 'index'])->name('archives.index');
        Route::put('/archives/{archive}', [\App\Http\Controllers\ArchiveController::class, 'update'])->name('archives.update');
        Route::delete('/archives/{archive}', [\App\Http\Controllers\ArchiveController::class, 'destroy'])->name('archives.destroy');
        Route::post('/archives/{archive}/follow-up', [\App\Http\Controllers\ArchiveController::class, 'followUp'])->name('archives.follow-up');
        Route::get('/api/retention-schedules', [\App\Http\Controllers\ArchiveController::class, 'searchRetentionSchedules'])->name('api.retention-schedules');
        Route::post('/api/archives/validate', [\App\Http\Controllers\ArchiveController::class, 'validate'])->name('api.archives.validate');
    });

    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->as('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'admin'])->name('dashboard');
        Route::get('/organizations', [\App\Http\Controllers\Admin\OrganizationController::class, 'index'])->name('organizations.index');
        Route::post('/organizations', [\App\Http\Controllers\Admin\OrganizationController::class, 'store'])->name('organizations.store');
        Route::put('/organizations/{organization}', [\App\Http\Controllers\Admin\OrganizationController::class, 'update'])->name('organizations.update');
        Route::delete('/organizations/{organization}', [\App\Http\Controllers\Admin\OrganizationController::class, 'destroy'])->name('organizations.destroy');
        Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'admin'])->name('notifications');
    });
});

require __DIR__.'/settings.php';
