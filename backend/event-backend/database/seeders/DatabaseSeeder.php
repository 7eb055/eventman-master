<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create the first user with id = 1
        User::factory()->create([
            'id' => 1,
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'organizer',
            'is_suspended' => false,
        ]);

        // Reset the users_id_seq sequence for PostgreSQL
        DB::statement("SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users))");

        // Create additional users without specifying id
        User::factory()->create([
            'name' => 'David Simons',
            'email' => 'simons@test.com',
            'password' => bcrypt('password'),
            'role' => 'attendee',
            'is_suspended' => false,
        ]);

        // Insert sample events after user is created
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
}
