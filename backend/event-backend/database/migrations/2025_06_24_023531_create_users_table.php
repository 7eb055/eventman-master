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
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name', 100); // Changed from full_name to name
                $table->string('email', 191)->unique();
                $table->string('password');
                $table->enum('role', ['organizer', 'attendee', 'admin']);
                $table->boolean('is_suspended')->default(false);
                $table->string('phone', 30)->nullable(); // Added phone
                $table->string('company_name', 255)->nullable(); // Added company_name
                $table->json('notification_preferences')->nullable(); // Added notification_preferences
                $table->timestamps();
            });
        } else {
            // Modify existing table
            Schema::table('users', function (Blueprint $table) {
                $table->string('name', 100)->change(); // Changed from full_name to name
                $table->string('email', 191)->unique()->change();
                $table->string('password')->change();
                $table->enum('role', ['organizer', 'attendee', 'admin'])->change();
                $table->boolean('is_suspended')->default(false)->change();
                if (!Schema::hasColumn('users', 'phone')) {
                    $table->string('phone', 30)->nullable();
                }
                if (!Schema::hasColumn('users', 'company_name')) {
                    $table->string('company_name', 255)->nullable();
                }
                if (!Schema::hasColumn('users', 'notification_preferences')) {
                    $table->json('notification_preferences')->nullable();
                }
            });
        }

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
