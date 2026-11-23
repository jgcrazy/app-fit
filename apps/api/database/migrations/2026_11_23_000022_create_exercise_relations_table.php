<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Substituicao rapida por equipamento/limitacao (GET /exercises/{id}/substitutes)
        Schema::create('exercise_substitutes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $table->foreignId('substitute_exercise_id')->constrained('exercises')->cascadeOnDelete();
            $table->string('reason', 64);   // no_equipment | joint_limitation | crowded_gym
            $table->unsignedSmallInteger('priority')->default(0);
            $table->timestamps();

            $table->unique(['exercise_id', 'substitute_exercise_id', 'reason'], 'exercise_substitutes_unique');
        });

        // Limitacao como RELACAO, nao campo texto: precisa ser filtravel por
        // indice no catalogo inteiro, nao com LIKE em coluna livre.
        Schema::create('exercise_limitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_id')->constrained()->cascadeOnDelete();
            $table->string('limitation_code', 64);  // knee | lower_back | shoulder | wrist | hernia
            $table->string('severity', 16)->default('contraindicated'); // contraindicated | caution
            $table->timestamps();

            $table->unique(['exercise_id', 'limitation_code']);
            $table->index('limitation_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exercise_limitations');
        Schema::dropIfExists('exercise_substitutes');
    }
};
