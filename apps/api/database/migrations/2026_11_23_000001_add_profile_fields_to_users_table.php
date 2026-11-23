<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->date('birth_date')->nullable()->after('email');
            $table->string('sex', 16)->nullable()->after('birth_date');
            $table->unsignedSmallInteger('height_cm')->nullable()->after('sex');

            // Fronteira de "dia" do usuario. Toda agregacao diaria (agua, refeicao,
            // treino, habito) usa este fuso para derivar `logged_on`. Ver ADR 0004.
            $table->string('timezone', 64)->default('America/Sao_Paulo')->after('height_cm');
            $table->string('locale', 10)->default('pt_BR')->after('timezone');

            $table->timestamp('deleted_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'birth_date', 'sex', 'height_cm', 'timezone', 'locale', 'deleted_at',
            ]);
        });
    }
};
