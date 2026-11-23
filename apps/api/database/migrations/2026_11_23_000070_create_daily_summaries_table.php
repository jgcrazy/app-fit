<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Resumo diario pre-agregado para GET /api/v1/dashboard/today.
     *
     * A Home e a tela que todo mundo abre primeiro e o endpoint agregador
     * toca oito tabelas. Agregar sob demanda faz dela a rota mais lenta do app.
     * Atualizada por evento (listener nos logs) e invalidada
     * quando algo do dia muda. Ver ADR 0005.
     */
    public function up(): void
    {
        Schema::create('daily_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('summary_on');

            $table->unsignedSmallInteger('kcal_consumed')->default(0);
            $table->unsignedSmallInteger('protein_g')->default(0);
            $table->unsignedSmallInteger('carb_g')->default(0);
            $table->unsignedSmallInteger('fat_g')->default(0);
            $table->unsignedInteger('water_ml')->default(0);

            $table->boolean('workout_planned')->default(false);
            $table->boolean('workout_done')->default(false);
            $table->unsignedSmallInteger('workout_duration_seconds')->nullable();

            $table->decimal('weight_kg', 5, 2)->nullable();
            $table->unsignedSmallInteger('habits_done')->default(0);
            $table->unsignedSmallInteger('habits_total')->default(0);

            $table->timestampTz('recalculated_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'summary_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_summaries');
    }
};
