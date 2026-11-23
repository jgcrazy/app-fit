<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * NUTRICAO -- planejado para a v2. Ver docs/roadmap.md.
     *
     * O schema nasce agora porque a decisao estrutural precisa valer desde ja:
     * dado importado e dado proprio NAO se misturam na mesma linha.
     *
     *   foods             -> espelho do registro externo, como veio
     *   food_enrichments  -> traducao/curadoria NOSSA, em tabela separada
     *
     * O ODbL do Open Food Facts e share-alike: se a traducao e o enriquecimento
     * morarem dentro da mesma tabela do dado importado, a fronteira do que e
     * "banco derivado" some, e com ela a chance de argumentar que a curadoria
     * propria nao esta contaminada. Ver docs/licencas-dados.md e ADR 0003.
     *
     * NENHUMA base externa deve ser importada antes de `data_sources
     * .cleared_for_production = true`.
     */
    public function up(): void
    {
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_source_id')->constrained();
            $table->string('external_id')->nullable();
            $table->string('barcode', 32)->nullable();

            $table->string('name');
            $table->string('brand')->nullable();
            $table->string('category', 64)->nullable();

            // Sempre por 100 g/ml. Porcoes praticas vivem em food_portions.
            $table->decimal('kcal_100g', 7, 2);
            $table->decimal('protein_100g', 6, 2)->default(0);
            $table->decimal('carb_100g', 6, 2)->default(0);
            $table->decimal('fat_100g', 6, 2)->default(0);
            $table->decimal('fiber_100g', 6, 2)->nullable();
            $table->decimal('sodium_mg_100g', 8, 2)->nullable();
            $table->decimal('saturated_fat_100g', 6, 2)->nullable();
            $table->decimal('sugar_100g', 6, 2)->nullable();

            $table->json('allergen_codes')->nullable();
            $table->string('source_version', 64)->nullable();
            $table->timestampTz('imported_at')->nullable();
            $table->timestamps();

            $table->unique(['data_source_id', 'external_id']);
            $table->index('barcode');
            $table->index('name');
        });

        Schema::create('food_enrichments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('food_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('name_pt')->nullable();
            $table->string('common_portion_label')->nullable();
            $table->text('notes_pt')->nullable();
            $table->boolean('is_reviewed')->default(false);
            $table->timestamps();
        });

        Schema::create('food_portions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('food_id')->constrained()->cascadeOnDelete();
            $table->string('label', 64);        // "1 fatia", "1 colher de sopa"
            $table->decimal('grams', 7, 2);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_source_id')->nullable()->constrained();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();

            $table->string('name');
            $table->string('slug')->unique();
            $table->text('instructions_pt')->nullable();
            $table->unsignedSmallInteger('servings')->default(1);
            $table->unsignedSmallInteger('prep_minutes')->nullable();
            $table->json('allergen_codes')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete();
            $table->foreignId('food_id')->nullable()->constrained()->nullOnDelete();
            $table->string('free_text')->nullable();
            $table->decimal('quantity', 7, 2)->nullable();
            $table->string('unit', 16)->nullable();
            $table->unsignedSmallInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('diet_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('nutrition_target_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->date('starts_on')->nullable();
            $table->date('ends_on')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        Schema::create('diet_plan_meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diet_plan_id')->constrained()->cascadeOnDelete();
            $table->string('name', 64);         // "Cafe da manha"
            $table->time('suggested_at')->nullable();
            $table->unsignedSmallInteger('position');
            $table->timestamps();

            $table->unique(['diet_plan_id', 'position']);
        });

        Schema::create('diet_plan_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diet_plan_meal_id')->constrained()->cascadeOnDelete();
            $table->foreignId('food_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('recipe_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('quantity', 7, 2);
            $table->string('unit', 16)->default('g');
            $table->timestamps();
        });

        Schema::create('meal_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('client_uuid');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('food_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('recipe_id')->nullable()->constrained()->nullOnDelete();

            $table->date('logged_on');
            $table->timestampTz('logged_at');
            $table->string('meal_type', 32);    // breakfast | lunch | dinner | snack
            $table->decimal('quantity', 7, 2);
            $table->string('unit', 16)->default('g');

            // SNAPSHOT nutricional do momento do registro.
            //
            // O Open Food Facts e colaborativo e corrige registros retroativamente.
            // Se o diario so referenciasse food_id, uma correcao reescreveria o
            // passado do usuario. Referencia + snapshot: o historico fica estavel
            // e a referencia continua viva para a tela de detalhe. Ver ADR 0004.
            $table->decimal('kcal', 7, 2);
            $table->decimal('protein_g', 6, 2)->default(0);
            $table->decimal('carb_g', 6, 2)->default(0);
            $table->decimal('fat_g', 6, 2)->default(0);
            $table->string('snapshot_source_version', 64)->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'client_uuid']);
            $table->index(['user_id', 'logged_on']);
        });

        Schema::create('shopping_list_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('food_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('category', 64)->nullable();
            $table->decimal('quantity', 7, 2)->nullable();
            $table->string('unit', 16)->nullable();
            $table->boolean('is_checked')->default(false);
            $table->date('for_week_starting_on')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_checked']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shopping_list_items');
        Schema::dropIfExists('meal_logs');
        Schema::dropIfExists('diet_plan_items');
        Schema::dropIfExists('diet_plan_meals');
        Schema::dropIfExists('diet_plans');
        Schema::dropIfExists('recipe_ingredients');
        Schema::dropIfExists('recipes');
        Schema::dropIfExists('food_portions');
        Schema::dropIfExists('food_enrichments');
        Schema::dropIfExists('foods');
    }
};
