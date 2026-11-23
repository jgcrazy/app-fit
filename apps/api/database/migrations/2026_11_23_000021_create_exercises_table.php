<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();

            // Exercicio proprio do usuario (null = catalogo global)
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();

            // Proveniencia POR REGISTRO -- no wger a licenca varia por exercicio.
            $table->foreignId('data_source_id')->nullable()->constrained();
            $table->string('external_id')->nullable();
            $table->string('license_code', 64)->nullable();
            $table->string('license_author')->nullable();
            $table->string('source_url')->nullable();

            $table->string('name');
            $table->string('slug')->unique();
            $table->string('muscle_group', 64);
            $table->string('secondary_muscles')->nullable();
            $table->string('equipment', 64)->nullable();
            $table->string('difficulty', 32)->nullable();
            $table->boolean('is_compound')->default(false);

            // Conteudo editorial PROPRIO (nosso diferencial, nossa licenca).
            // Separado do texto importado de proposito -- ver ADR 0003.
            $table->text('instructions_pt')->nullable();
            $table->text('common_mistakes_pt')->nullable();
            $table->text('execution_tips_pt')->nullable();
            $table->string('video_url')->nullable();
            $table->string('thumbnail_path')->nullable();

            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->index(['muscle_group', 'is_published']);
            $table->unique(['data_source_id', 'external_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
