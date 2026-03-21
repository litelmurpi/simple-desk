<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});


    // Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Tickets Core CRUD
    Route::resource('tickets', \App\Http\Controllers\TicketController::class);
    
    // Ticket Actions
    Route::post('/tickets/{ticket}/duplicate', [\App\Http\Controllers\TicketActionController::class, 'duplicate'])->name('tickets.duplicate');
    Route::patch('/tickets/{ticket}/status', [\App\Http\Controllers\TicketActionController::class, 'updateStatus'])->name('tickets.status.update');
    Route::patch('/tickets/{ticket}/priority', [\App\Http\Controllers\TicketActionController::class, 'updatePriority'])->name('tickets.priority.update');
    Route::patch('/tickets/{ticket}/archive', [\App\Http\Controllers\TicketActionController::class, 'archive'])->name('tickets.archive');
    Route::post('/tickets/{id}/restore', [\App\Http\Controllers\TicketActionController::class, 'restore'])->name('tickets.restore');
    Route::patch('/tickets-bulk', [\App\Http\Controllers\TicketActionController::class, 'bulkUpdate'])->name('tickets.bulk.update');
    Route::delete('/tickets-bulk', [\App\Http\Controllers\TicketActionController::class, 'bulkDelete'])->name('tickets.bulk.delete');

    // Subjects
    Route::resource('subjects', \App\Http\Controllers\SubjectController::class)->only(['index', 'show']);

    // Calendar
    Route::get('/calendar', [\App\Http\Controllers\CalendarController::class, 'index'])->name('calendar.index');

    // Notes
    Route::post('/tickets/{ticket}/notes', [\App\Http\Controllers\TicketNoteController::class, 'store'])->name('tickets.notes.store');
    Route::put('/tickets/{ticket}/notes/{ticket_note}', [\App\Http\Controllers\TicketNoteController::class, 'update'])->name('tickets.notes.update');
    Route::delete('/tickets/{ticket}/notes/{ticket_note}', [\App\Http\Controllers\TicketNoteController::class, 'destroy'])->name('tickets.notes.destroy');

    // Attachments
    Route::post('/tickets/{ticket}/attachments', [\App\Http\Controllers\TicketAttachmentController::class, 'store'])->name('tickets.attachments.store');
    Route::delete('/tickets/{ticket}/attachments/{ticket_attachment}', [\App\Http\Controllers\TicketAttachmentController::class, 'destroy'])->name('tickets.attachments.destroy');
    Route::get('/tickets/{ticket}/attachments/{ticket_attachment}/download', [\App\Http\Controllers\TicketAttachmentController::class, 'download'])->name('tickets.attachments.download');

    // Placeholders for future phases
    Route::get('/board', [\App\Http\Controllers\BoardController::class, 'index'])->name('board');
    Route::get('/stats', [\App\Http\Controllers\StatsController::class, 'index'])->name('stats');
    Route::get('/archive', [\App\Http\Controllers\ArchiveController::class, 'index'])->name('archive');
    Route::get('/settings', [\App\Http\Controllers\Settings\GeneralSettingController::class, 'index'])->name('settings.index');

    // Subject Settings
    Route::get('/settings/subjects', [\App\Http\Controllers\Settings\SubjectSettingController::class, 'index'])->name('settings.subjects.index');
    Route::post('/settings/subjects', [\App\Http\Controllers\Settings\SubjectSettingController::class, 'store'])->name('settings.subjects.store');
    Route::put('/settings/subjects/{subject}', [\App\Http\Controllers\Settings\SubjectSettingController::class, 'update'])->name('settings.subjects.update');
    Route::delete('/settings/subjects/{subject}', [\App\Http\Controllers\Settings\SubjectSettingController::class, 'destroy'])->name('settings.subjects.destroy');
    Route::post('/settings/subjects-bulk', [\App\Http\Controllers\Settings\SubjectSettingController::class, 'bulkSemester'])->name('settings.subjects.bulk');

    // Tag Settings
    Route::get('/settings/tags', [\App\Http\Controllers\Settings\TagSettingController::class, 'index'])->name('settings.tags.index');
    Route::post('/settings/tags', [\App\Http\Controllers\Settings\TagSettingController::class, 'store'])->name('settings.tags.store');
    Route::put('/settings/tags/{tag}', [\App\Http\Controllers\Settings\TagSettingController::class, 'update'])->name('settings.tags.update');
    Route::delete('/settings/tags/{tag}', [\App\Http\Controllers\Settings\TagSettingController::class, 'destroy'])->name('settings.tags.destroy');

    // Security Settings
    Route::get('/settings/security', [\App\Http\Controllers\Settings\SecurityController::class, 'index'])->name('settings.security.index');
    Route::post('/settings/security/toggle', [\App\Http\Controllers\Settings\SecurityController::class, 'toggle'])->name('settings.security.toggle');

    // App Lock
    Route::get('/locked', [\App\Http\Controllers\Settings\SecurityController::class, 'locked'])->name('locked');
    Route::post('/unlock', [\App\Http\Controllers\Settings\SecurityController::class, 'unlock'])->name('unlock');


    // Profile (from Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
