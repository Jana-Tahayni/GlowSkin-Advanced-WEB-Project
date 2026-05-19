<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{
public function up():void{
    Schema::table("users",function (Blueprint $table){
      $table->string('first_name',100)->after('id');
      $table->string('last_name',100)->after('first_name');
      $table->dropColumn('name');
      $table->string('provider')->default('email')->after('password');
      $table->string('provider_id')->nullable()->after('provider');
      $table->string('avatar')->nullable()->after('provider_id');
      $table->index(['provider', 'provider_id']);

    });
}
public function down():void{
     Schema::table('users', function (Blueprint $table) {

            $table->dropIndex(['provider', 'provider_id']);

            $table->dropColumn([
                'first_name',
                'last_name',
                'provider',
                'provider_id',
                'avatar'
            ]);
        });
    }

};