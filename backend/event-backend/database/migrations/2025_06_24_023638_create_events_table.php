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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->string('title', 175);
            $table->string('event_type', 100)->default('Conference');
            $table->string('image', 175)->nullable();
            $table->text('description')->nullable();
            $table->string('venue', 175);
            $table->integer('capacity');
            $table->decimal('ticket_price', 10, 2);
            $table->string('location', 175);
            $table->dateTime('start_date');
            $table->enum('status', ['pending', 'started', 'completed', 'suspended'])->default('pending');
            $table->timestamps();
            $table->index(['organizer_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
