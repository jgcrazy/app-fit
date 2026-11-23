<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Perfil de saude: camada de seguranca, SEMPRE fora do paywall.
     *
     * Os campos de conteudo clinico sao gravados criptografados em nivel de
     * aplicacao (cast `encrypted` no model) porque sao dado pessoal SENSIVEL
     * sob a LGPD -- criptografia de disco nao basta. Por isso sao `text`:
     * o ciphertext nao e consultavel via SQL, e isso e intencional.
     */
    public function up(): void
    {
        Schema::create('health_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            $table->string('goal', 32);              // cut | bulk | recomp | maintain
            $table->string('activity_level', 32);    // sedentary | light | moderate | very_active

            // Criptografados em repouso (ver App\Domain\Identity\Models\HealthProfile)
            $table->text('allergies')->nullable();
            $table->text('dietary_restrictions')->nullable();
            $table->text('physical_limitations')->nullable();
            $table->text('clinical_notes')->nullable();

            // Travas de seguranca: bloqueiam metas automaticas (ver ADR 0006)
            $table->boolean('is_pregnant_or_lactating')->default(false);
            $table->boolean('requires_clinical_supervision')->default(false);

            // Consentimento LGPD -- versionado para provar O QUE foi aceito
            $table->timestamp('consented_at')->nullable();
            $table->string('consent_version', 32)->nullable();
            $table->timestamp('disclaimer_accepted_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_profiles');
    }
};
