<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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

        // Insert sample data (update to match new schema, using organizer_id = 1 for all for demo)
        DB::table('events')->insert([
            [
                'organizer_id' => 1,
                'title' => 'Tech Innovators Conference 2025',
                'event_type' => 'Conference',
                'image' => 'https://i.pinimg.com/736x/b6/55/2b/b6552be1a23bf22cd79c36747f384e71.jpg',
                'description' => 'Join industry leaders and tech enthusiasts for a day of innovation and networking.',
                'venue' => 'Accra International Conference Centre',
                'capacity' => 500,
                'ticket_price' => 150.00,
                'location' => 'Accra International Conference Centre',
                'start_date' => '2025-07-15 09:00:00',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organizer_id' => 1,
                'title' => 'Art & Design Expo',
                'event_type' => 'Trade Show/Exhibition',
                'image' => 'https://i.pinimg.com/736x/ae/dc/e5/aedce545eff4ee857d35a0c598fb88fa.jpg',
                'description' => 'Explore the latest trends in art and design from renowned artists and creators.',
                'venue' => 'National Theatre of Ghana, Accra',
                'capacity' => 300,
                'ticket_price' => 50.00,
                'location' => 'National Theatre of Ghana, Accra',
                'start_date' => '2025-08-10 10:00:00',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organizer_id' => 1,
                'title' => 'Startup Pitch Night',
                'event_type' => 'Networking Event/Meetup',
                'image' => 'https://i.pinimg.com/736x/50/2c/4c/502c4cd1a1c096085ff2aa4b1274a9a0.jpg',
                'description' => 'Watch startups pitch their ideas to investors and a live audience.',
                'venue' => 'Kumasi Innovation Hub',
                'capacity' => 150,
                'ticket_price' => 300.00,
                'location' => 'Kumasi Innovation Hub',
                'start_date' => '2025-09-05 18:00:00',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'organizer_id' => 1,
                'title' => 'Health & Wellness Retreat',
                'event_type' => 'Retreat/Conference Camping',
                'image' => 'https://i.pinimg.com/736x/98/1f/cb/981fcbfe57d17c65a9e4deca13c27550.jpg',
                'description' => 'A weekend of relaxation, mindfulness, and wellness workshops.',
                'venue' => 'Aqua Safari Resort, Ada',
                'capacity' => 100,
                'ticket_price' => 800.00,
                'location' => 'Aqua Safari Resort, Ada',
                'start_date' => '2025-07-22 08:00:00',
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
