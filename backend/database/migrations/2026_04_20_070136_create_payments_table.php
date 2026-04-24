<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id(); // bigint PK
            
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->foreignId('analysis_id')->constrained('skin_analyses')->onDelete('cascade');
            
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('USD');
            
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            
            $table->string('stripe_id')->nullable(); 
            $table->timestamp('paid_at')->nullable();
            
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};