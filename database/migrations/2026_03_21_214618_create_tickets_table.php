<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['tugas', 'bug', 'todo', 'project'])->default('todo');
            $table->enum('status', ['open', 'in_progress', 'blocked', 'done', 'archived'])->default('open');
            $table->enum('priority', ['urgent', 'high', 'medium', 'low'])->default('medium');
            
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            
            $table->dateTime('deadline_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->softDeletes();
            $table->timestamps();
            
            $table->index(['status', 'priority', 'deadline_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
