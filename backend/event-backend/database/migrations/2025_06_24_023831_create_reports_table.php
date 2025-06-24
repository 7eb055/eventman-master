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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained(); // references id on events table
            $table->foreignId('organizer_id')->constrained('users'); // references id on users table
            $table->enum('type', ['event', 'participant']);
            $table->enum('format', ['csv', 'pdf']);
            $table->timestamp('generated_at')->useCurrent();
            $table->string('file_path', 191); // 191 for MySQL index compatibility
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
