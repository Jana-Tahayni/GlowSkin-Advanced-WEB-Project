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
        Schema::create('product_checks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('product_name', 255);
        $table->string('image_path')->nullable();
        $table->integer('effectiveness_score');
        $table->integer('safety_score');
        $table->string('compatibility', 50);
        $table->json('key_ingredients');
        $table->json('warnings');
        $table->text('verdict');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_checks');
    }
};
