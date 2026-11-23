<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Registro de proveniencia das fontes externas.
 *
 * Este seeder e a forma executavel das decisoes de docs/licencas-dados.md.
 * `cleared_for_production = false` e o que impede qualquer importador de rodar
 * contra producao. Nao virar nenhuma dessas flags sem decisao registrada.
 */
class DataSourceSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $sources = [
            [
                'slug' => 'own',
                'name' => 'Conteudo proprio',
                'license_code' => 'proprietary',
                'license_url' => null,
                'attribution_text' => null,
                'allows_commercial_use' => true,
                'allows_redistribution' => true,
                'is_share_alike' => false,
                'cleared_for_production' => true,
                'reviewed_at' => $now->toDateString(),
                'review_notes' => 'Conteudo editorial produzido pelo projeto. Fonte preferencial.',
            ],
            [
                'slug' => 'open_food_facts',
                'name' => 'Open Food Facts',
                'license_code' => 'ODbL-1.0',
                'license_url' => 'https://opendatacommons.org/licenses/odbl/1.0/',
                'attribution_text' => '(c) Open Food Facts contributors',
                'allows_commercial_use' => true,
                'allows_redistribution' => true,
                'is_share_alike' => true,
                'cleared_for_production' => false,
                'reviewed_at' => $now->toDateString(),
                'review_notes' => 'ODbL e share-alike: versao adaptada do banco precisa ser oferecida sob ODbL. '
                    .'Exige isolamento entre dado importado e curadoria propria (ADR 0003) e atribuicao '
                    .'em toda tela que exibe o dado. Imagens sao CC-BY-SA. Pendente de parecer juridico.',
            ],
            [
                'slug' => 'wger',
                'name' => 'wger Workout Manager',
                'license_code' => 'CC-variable-per-record',
                'license_url' => 'https://github.com/wger-project/wger',
                'attribution_text' => 'Exercicios: wger project e colaboradores',
                'allows_commercial_use' => null,
                'allows_redistribution' => null,
                'is_share_alike' => null,
                'cleared_for_production' => false,
                'reviewed_at' => $now->toDateString(),
                'review_notes' => 'Licenca varia POR REGISTRO (Creative Commons, conforme cada exercicio). '
                    .'O AGPL se aplica ao codigo, nao aos dados -- nao usamos o codigo. '
                    .'Cada exercicio importado precisa de license_code proprio na linha. '
                    .'Pendente de auditoria registro a registro.',
            ],
            [
                'slug' => 'taco',
                'name' => 'Tabela TACO (NEPA/Unicamp)',
                'license_code' => 'unknown',
                'license_url' => null,
                'attribution_text' => null,
                'allows_commercial_use' => null,
                'allows_redistribution' => null,
                'is_share_alike' => null,
                'cleared_for_production' => false,
                'reviewed_at' => $now->toDateString(),
                'review_notes' => 'DESCARTADA por decisao de produto em 2026-11-23. Sem licenca publica '
                    .'explicita de redistribuicao comercial. Registro mantido para que a questao nao '
                    .'seja reaberta por esquecimento. NAO importar. Ver ADR 0008 e docs/licencas-dados.md.',
            ],
            [
                'slug' => 'themealdb',
                'name' => 'TheMealDB',
                'license_code' => 'proprietary-api',
                'license_url' => 'https://www.themealdb.com/terms_of_use.php',
                'attribution_text' => 'Receitas: TheMealDB',
                'allows_commercial_use' => true,
                'allows_redistribution' => false,
                'is_share_alike' => false,
                'cleared_for_production' => false,
                'reviewed_at' => $now->toDateString(),
                'review_notes' => 'DESCARTADA por escopo: receitas internacionais nao servem a um app '
                    .'brasileiro. Chave de teste e para desenvolvimento; producao exigiria chave de '
                    .'supporter. Receitas serao proprias.',
            ],
            [
                'slug' => 'pof_ibge',
                'name' => 'POF / IBGE — composicao de alimentos',
                'license_code' => 'unknown',
                'license_url' => null,
                'attribution_text' => null,
                'allows_commercial_use' => null,
                'allows_redistribution' => null,
                'is_share_alike' => null,
                'cleared_for_production' => false,
                'reviewed_at' => null,
                'review_notes' => 'CANDIDATA a substituir a TACO como fonte de alimentos naturais '
                    .'brasileiros. Producao estatistica oficial. Confirmar termos de uso antes de '
                    .'assumir liberacao: dado de governo nao e automaticamente livre para uso comercial.',
            ],
        ];

        foreach ($sources as $source) {
            DB::table('data_sources')->updateOrInsert(
                ['slug' => $source['slug']],
                [...$source, 'updated_at' => $now, 'created_at' => $now],
            );
        }
    }
}
