<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PRESCRICAO. O que o usuario deveria fazer.
     * O que ele realmente fez vive em workout_sessions / workout_set_logs.
     * Nao misturar os dois e o que permite medir aderencia e progressao.
     */
    public function up(): void
    {
        Schema::create('workout_programs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();

            $table->string('name');
            $table->string('goal', 32)->nullable();
            $table->string('split_type', 32)->nullable();   // full_body | upper_lower | abc | abcd
            $table->unsignedSmallInteger('weeks')->nullable();
            $table->unsignedSmallInteger('days_per_week')->nullable();
            $table->text('description')->nullable();

            $table->boolean('is_template')->default(false);
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });

        Schema::create('workout_program_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_program_id')->constrained()->cascadeOnDelete();
            $table->string('label', 64);                 // "Treino A"
            $table->string('focus', 64)->nullable();     // "Peito e triceps"
            $table->unsignedSmallInteger('position');
            $table->unsignedSmallInteger('estimated_minutes')->nullable();
            $table->timestamps();

            $table->unique(['workout_program_id', 'position']);
        });

        Schema::create('workout_day_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_program_day_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained();

            $table->unsignedSmallInteger('position');
            $table->unsignedSmallInteger('sets');
            $table->string('target_reps', 32);            // "8-12" ou "10"
            $table->unsignedSmallInteger('rest_seconds')->default(90);
            $table->decimal('suggested_weight_kg', 6, 2)->nullable();
            $table->string('technique', 32)->nullable();  // dropset | restpause | bisset
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['workout_program_day_id', 'position'], 'workout_day_exercises_position_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workout_day_exercises');
        Schema::dropIfExists('workout_program_days');
        Schema::dropIfExists('workout_programs');
    }
};
