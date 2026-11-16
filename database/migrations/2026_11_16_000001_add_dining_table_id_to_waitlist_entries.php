<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('waitlist_entries', 'dining_table_id')) {
            Schema::table('waitlist_entries', function (Blueprint $table) {
                $table->foreignId('dining_table_id')->nullable()->after('place_id')->constrained()->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('waitlist_entries', 'dining_table_id')) {
            Schema::table('waitlist_entries', function (Blueprint $table) {
                $table->dropConstrainedForeignId('dining_table_id');
            });
        }
    }
};
