<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Drop the old constraint if it exists
        DB::statement("ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;");
        // Add the new constraint with 'approved' and 'rejected' included
        DB::statement("ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('pending', 'active', 'cancelled', 'approved', 'rejected'));");
    }

    public function down(): void
    {
        // Revert to the previous constraint (edit as needed)
        DB::statement("ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;");
        DB::statement("ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('pending', 'active', 'cancelled', 'approved'));");
    }
};
