<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->date('date');
            $table->string('venue');
            $table->decimal('price', 8, 2);
            $table->integer('capacity');
            $table->string('organizer');
            $table->enum('status', ['active', 'cancelled', 'completed'])->default('active');
            $table->string('image_url');
            $table->timestamps();
        });

        // Insert sample data
        DB::table('events')->insert([
            [
                'title' => 'Tech Innovators Conference 2025',
                'description' => 'Join industry leaders and tech enthusiasts for a day of innovation and networking.',
                'category' => 'Conference',
                'date' => '2025-07-15',
                'venue' => 'Accra International Conference Centre',
                'price' => 150.00,
                'capacity' => 500,
                'organizer' => 'Tech Ghana',
                'status' => 'active',
                'image_url' => 'https://i.pinimg.com/736x/b6/55/2b/b6552be1a23bf22cd79c36747f384e71.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Art & Design Expo',
                'description' => 'Explore the latest trends in art and design from renowned artists and creators.',
                'category' => 'Trade Show/Exhibition',
                'date' => '2025-08-10',
                'venue' => 'National Theatre of Ghana, Accra',
                'price' => 50.00,
                'capacity' => 300,
                'organizer' => 'Creative Arts Council',
                'status' => 'active',
                'image_url' => 'https://i.pinimg.com/736x/ae/dc/e5/aedce545eff4ee857d35a0c598fb88fa.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Startup Pitch Night',
                'description' => 'Watch startups pitch their ideas to investors and a live audience.',
                'category' => 'Networking Event/Meetup',
                'date' => '2025-09-05',
                'venue' => 'Kumasi Innovation Hub',
                'price' => 300.00,
                'capacity' => 150,
                'organizer' => 'Startup Ghana',
                'status' => 'active',
                'image_url' => 'https://i.pinimg.com/736x/50/2c/4c/502c4cd1a1c096085ff2aa4b1274a9a0.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Health & Wellness Retreat',
                'description' => 'A weekend of relaxation, mindfulness, and wellness workshops.',
                'category' => 'Retreat/Conference Camping',
                'date' => '2025-07-22',
                'venue' => 'Aqua Safari Resort, Ada',
                'price' => 800.00,
                'capacity' => 100,
                'organizer' => 'Wellness Ghana',
                'status' => 'active',
                'image_url' => 'https://i.pinimg.com/736x/98/1f/cb/981fcbfe57d17c65a9e4deca13c27550.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
};
