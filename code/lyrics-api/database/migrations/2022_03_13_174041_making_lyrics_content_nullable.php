<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // https://stackoverflow.com/a/41205861/17712310
        // https://laravel.com/docs/9.x/migrations#prerequisites
        // https://laravel.com/docs/9.x/migrations#updating-column-attributes
        Schema::table('lyrics', function (Blueprint $table) {
            $table->string('content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
