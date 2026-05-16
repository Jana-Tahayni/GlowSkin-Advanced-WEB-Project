<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
{
    Schema::table('users', function (Blueprint $table) {

        if (!Schema::hasColumn('users', 'skin_type')) {
            $table->string('skin_type')->nullable()->after('password');
        }

        if (!Schema::hasColumn('users', 'role')) {
            $table->enum('role', ['user', 'doctor', 'admin'])
                  ->default('user')
                  ->after('skin_type');
        }

    });
}
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['skin_type', 'role']);
        });
    }
};