<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workout_reminder_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            // {"mon":"19:00","wed":"19:00"} -- horario de ida por dia da semana
            $table->json('weekday_times')->nullable();
            $table->unsignedSmallInteger('remind_minutes_before')->default(30);

            // Tempo limite de sessao + alerta antecipado + meta de esteira
            $table->unsignedSmallInteger('max_workout_minutes')->nullable();
            $table->unsignedSmallInteger('warn_before_limit_minutes')->default(10);
            $table->unsignedSmallInteger('cardio_minutes_target')->nullable();

            $table->boolean('notifications_enabled')->default(true);
            $table->timestamps();
        });

        Schema::create('weekly_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('week_starting_on');
            $table->json('blocked_weekdays')->nullable();   // dias que o motor nao pode usar
            $table->timestamps();

            $table->unique(['user_id', 'week_starting_on']);
        });

        Schema::create('schedule_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weekly_schedule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('workout_program_day_id')->nullable()->constrained()->nullOnDelete();

            $table->date('scheduled_on');
            $table->time('scheduled_at')->nullable();
            $table->string('type', 32)->default('workout');   // workout | rest | cardio
            $table->string('status', 32)->default('planned'); // planned | done | missed | rescheduled

            // Rastro da reorganizacao: qual estrategia moveu este item e de onde.
            $table->string('reschedule_strategy', 32)->nullable(); // push_next_day | express_version
            // | swap_rest_day | skip_without_guilt
            $table->date('original_scheduled_on')->nullable();
            $table->timestamps();

            $table->index(['weekly_schedule_id', 'scheduled_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_items');
        Schema::dropIfExists('weekly_schedules');
        Schema::dropIfExists('workout_reminder_settings');
    }
};
