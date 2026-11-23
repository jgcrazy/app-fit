<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * EXECUCAO. Escrito offline no device e sincronizado depois.
     *
     * `client_uuid` e obrigatorio e unico por usuario: a fila de sync reenvia
     * em caso de falha de rede, e sem chave de idempotencia o retry duplica
     * serie -- o que faz o grafico de carga do usuario mentir. Ver ADR 0002.
     */
    public function up(): void
    {
        Schema::create('workout_sessions', function (Blueprint $table) {
            $table->id();
            $table->uuid('client_uuid');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('workout_program_day_id')->nullable()->constrained()->nullOnDelete();

            // Data no fuso do usuario, nao derivada de UTC no servidor.
            $table->date('performed_on');
            $table->timestampTz('started_at');
            $table->timestampTz('finished_at')->nullable();

            $table->unsignedSmallInteger('duration_seconds')->nullable();
            $table->unsignedSmallInteger('cardio_minutes')->nullable();
            $table->string('feeling', 16)->nullable();   // great | ok | tired | bad
            $table->text('notes')->nullable();

            $table->timestampTz('synced_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'client_uuid']);
            $table->index(['user_id', 'performed_on']);
        });

        Schema::create('workout_set_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('client_uuid');
            $table->foreignId('workout_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained();

            $table->unsignedSmallInteger('set_number');
            $table->unsignedSmallInteger('reps')->nullable();
            $table->decimal('weight_kg', 6, 2)->nullable();
            $table->unsignedSmallInteger('rpe')->nullable();
            $table->boolean('is_warmup')->default(false);
            $table->boolean('is_completed')->default(true);
            $table->timestampTz('performed_at');
            $table->timestamps();

            $table->unique(['workout_session_id', 'client_uuid'], 'workout_set_logs_client_uuid_unique');
            $table->index(['exercise_id', 'performed_at']);
        });

        Schema::create('personal_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $table->foreignId('workout_set_log_id')->nullable()->constrained()->nullOnDelete();

            $table->string('type', 32);     // max_weight | estimated_1rm | max_volume | max_reps
            $table->decimal('value', 8, 2);
            $table->date('achieved_on');
            $table->timestamps();

            $table->unique(['user_id', 'exercise_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_records');
        Schema::dropIfExists('workout_set_logs');
        Schema::dropIfExists('workout_sessions');
    }
};
