<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
        $table->id();
        // $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->unsignedBigInteger('user_id')->nullable();
        // $table->foreignId('analysis_id')->unique()->constrained('skin_analyses')->onDelete('cascade');
        $table->unsignedBigInteger('analysis_id')->nullable();
        $table->decimal('amount', 10, 2);
        $table->string('currency', 3)->default('USD');
        $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
        $table->string('stripe_id')->unique()->nullable();
        $table->timestamp('paid_at')->nullable();
        $table->timestamps(); 
    });

    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};