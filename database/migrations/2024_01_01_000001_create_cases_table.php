<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name');
            $table->string('patient_id')->unique();
            $table->string('image_path')->nullable();
            $table->string('condition')->nullable();      // acne, dry, oily, sensitive, combo
            $table->string('result')->nullable();         // AI result text
            $table->integer('confidence')->nullable();    // AI confidence %
            $table->enum('status', ['pending', 'reviewed', 'urgent'])->default('pending');
            $table->text('doctor_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
