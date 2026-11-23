<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('water_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('client_uuid');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('logged_on');               // fuso do usuario
            $table->timestampTz('logged_at');
            $table->integer('delta_ml');             // negativo permite desfazer
            $table->timestamps();

            $table->unique(['user_id', 'client_uuid']);
            $table->index(['user_id', 'logged_on']);
        });

        Schema::create('sleep_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('logged_on');
            $table->decimal('sleep_hours', 3, 1)->nullable();
            $table->unsignedSmallInteger('sleep_quality')->nullable();   // 1-5
            $table->unsignedSmallInteger('recovery_score')->nullable();  // 1-5
            $table->timestamps();

            $table->unique(['user_id', 'logged_on']);
        });

        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('icon', 32)->nullable();
            $table->unsignedSmallInteger('position')->default(0);
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });

        Schema::create('daily_habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')->constrained()->cascadeOnDelete();
            $table->date('logged_on');
            $table->boolean('is_done')->default(false);
            $table->timestamps();

            $table->unique(['habit_id', 'logged_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_habit_logs');
        Schema::dropIfExists('habits');
        Schema::dropIfExists('sleep_logs');
        Schema::dropIfExists('water_logs');
    }
};
