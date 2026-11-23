<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Registro de proveniencia das bases externas.
     *
     * Existe porque "dado gratuito" nao e "dado liberado": wger licencia os
     * exercicios POR REGISTRO sob variantes de Creative Commons, e o Open Food
     * Facts usa ODbL, que e share-alike. Sem rastrear fonte + licenca por linha
     * nao da para saber, depois, o que pode ser exibido, traduzido ou vendido.
     *
     * Ver docs/licencas-dados.md e ADR 0003.
     */
    public function up(): void
    {
        Schema::create('data_sources', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 64)->unique();   // wger | open_food_facts | taco | own
            $table->string('name');
            $table->string('license_code', 64);     // CC-BY-SA-4.0 | ODbL-1.0 | proprietary | unknown
            $table->string('license_url')->nullable();
            $table->text('attribution_text')->nullable();

            // Preenchidos pela auditoria juridica, NAO por suposicao.
            $table->boolean('allows_commercial_use')->nullable();
            $table->boolean('allows_redistribution')->nullable();
            $table->boolean('is_share_alike')->nullable();
            $table->boolean('cleared_for_production')->default(false);

            $table->date('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_sources');
    }
};
