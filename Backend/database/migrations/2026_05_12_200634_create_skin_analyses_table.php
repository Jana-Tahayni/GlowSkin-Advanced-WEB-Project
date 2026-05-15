<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  
    public function up(): void
    {
        Schema::create('skin_analyses', function (Blueprint $table) {
            $table->id();                                          // رقم التحليل (auto increment)
            $table->integer('overall_score');                      // النتيجة الكلية 0-100
            $table->string('skin_type');                          // نوع الجلد (Dry, Oily, Combination...)
            $table->text('summary');                              // ملخص التحليل النصي
            $table->json('metrics');                              // Hydration, Texture, Brightness...
            $table->json('concerns');                             // المشاكل المكتشفة
            $table->json('recommendations');                      // التوصيات والروتين
            $table->string('image_path')->nullable();             // مسار الصورة المحفوظة
            $table->timestamps();                                 // created_at و updated_at
        });
    }

   
    public function down(): void
    {
        Schema::dropIfExists('skin_analyses');
    }
};