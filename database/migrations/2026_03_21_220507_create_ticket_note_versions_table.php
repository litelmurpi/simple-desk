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
        Schema::create('ticket_note_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_note_id')->constrained()->cascadeOnDelete();
            $table->text('body');
            $table->integer('version_number');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_note_versions');
    }
};
