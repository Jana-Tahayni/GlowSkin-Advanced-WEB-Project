<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('cases')->onDelete('cascade');
            $table->string('patient_name');
            $table->enum('time', ['Morning', 'Night', 'Both'])->default('Morning');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
 
        Schema::create('routine_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routine_id')->constrained('routines')->onDelete('cascade');
            $table->integer('step_order');
            $table->string('product_name');
            $table->string('product_type'); // Cleanser, Moisturizer, Sunscreen, Serum, Treatment
            $table->enum('time', ['Morning', 'Night', 'Both']);
            $table->string('note')->nullable();
            $table->boolean('is_checked')->default(false);
            $table->timestamps();
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('routine_steps');
        Schema::dropIfExists('routines');
    }
};
