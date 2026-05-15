<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * نضيف user_id لجدول skin_analyses
     * عشان كل تحليل يرتبط بيوزر معين
     */
    public function up(): void
    {
        Schema::table('skin_analyses', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');

            // Foreign key — يربط user_id بجدول users
            // onDelete cascade — لو اليوزر اتحذف، تحليلاته تتحذف معه
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * نتراجع — نحذف العمود لو احتجنا
     */
    public function down(): void
    {
        Schema::table('skin_analyses', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};