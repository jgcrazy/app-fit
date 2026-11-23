<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Metas VERSIONADAS, nunca sobrescritas.
     *
     * Cada check-in cria uma linha nova e fecha a anterior (`active_to`).
     * Num app de saude isso nao e luxo: e o que permite auditar depois o que
     * foi recomendado, quando e com base em qual peso. Ver ADR 0004.
     */
    public function up(): void
    {
        Schema::create('nutrition_targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('superseded_by_id')->nullable()->constrained('nutrition_targets')->nullOnDelete();

            $table->unsignedSmallInteger('target_kcal');
            $table->unsignedSmallInteger('protein_g');
            $table->unsignedSmallInteger('carb_g');
            $table->unsignedSmallInteger('fat_g');
            $table->unsignedSmallInteger('water_ml')->nullable();

            // Entradas do calculo, guardadas junto do resultado para reproducao.
            $table->decimal('bmr_kcal', 7, 2);
            $table->decimal('tdee_kcal', 7, 2);
            $table->decimal('activity_factor', 4, 3);
            $table->decimal('weight_kg_at_calc', 5, 2);
            $table->unsignedSmallInteger('age_at_calc');
            $table->string('formula', 32)->default('mifflin_st_jeor');
            $table->string('goal', 32);

            // O app SUGERE, o usuario ACEITA. Meta nunca entra em vigor sozinha.
            $table->string('origin', 32);                       // onboarding | check_in | manual
            $table->timestampTz('accepted_by_user_at')->nullable();

            $table->date('active_from');
            $table->date('active_to')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'active_from']);
        });

        Schema::create('check_ins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('week_starting_on');

            // Media semanal -- nunca pesagem isolada de um unico dia.
            $table->decimal('avg_weight_kg', 5, 2)->nullable();
            $table->decimal('previous_avg_weight_kg', 5, 2)->nullable();
            $table->decimal('trend_kg', 5, 2)->nullable();
            $table->unsignedSmallInteger('weigh_in_count')->default(0);
            $table->unsignedSmallInteger('adherence_pct')->nullable();

            // Resultado da avaliacao e a SUGESTAO gerada (nao aplicada).
            $table->string('verdict', 48)->nullable();          // on_track | stalled | low_adherence | blocked
            $table->smallInteger('suggested_kcal_delta')->nullable();
            $table->text('suggestion_rationale')->nullable();
            $table->boolean('suggestion_accepted')->nullable();
            $table->foreignId('resulting_target_id')->nullable()->constrained('nutrition_targets')->nullOnDelete();

            $table->timestamps();

            $table->unique(['user_id', 'week_starting_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('check_ins');
        Schema::dropIfExists('nutrition_targets');
    }
};
