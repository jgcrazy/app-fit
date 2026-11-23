<?php

namespace Tests\Feature\Nutrition;

use Database\Seeders\DataSourceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Testes de DECISAO, nao de comportamento.
 *
 * Existem para falhar se alguem liberar uma fonte sem a auditoria correspondente.
 * A falha nao e um bug: e um pedido de conversa antes do commit.
 *
 * Ver docs/licencas-dados.md e ADR 0003 / ADR 0008.
 */
class DataSourceGuardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DataSourceSeeder::class);
    }

    /** Fontes descartadas por decisao de produto. */
    public static function discardedSources(): array
    {
        return [
            'TACO (sem licenca comercial explicita)' => ['taco'],
            'TheMealDB (fora de escopo)' => ['themealdb'],
        ];
    }

    #[DataProvider('discardedSources')]
    public function test_fonte_descartada_nunca_fica_liberada_para_producao(string $slug): void
    {
        $source = DB::table('data_sources')->where('slug', $slug)->first();

        $this->assertNotNull($source, "A fonte {$slug} deve permanecer registrada, para a decisao nao ser reaberta por esquecimento.");
        $this->assertFalse(
            (bool) $source->cleared_for_production,
            "A fonte {$slug} foi descartada por decisao de produto. Liberar exige decisao registrada em docs/licencas-dados.md."
        );
    }

    public function test_fonte_share_alike_exige_nota_de_revisao(): void
    {
        $shareAlike = DB::table('data_sources')->where('is_share_alike', true)->get();

        $this->assertNotEmpty($shareAlike, 'Esperado ao menos o Open Food Facts como fonte share-alike.');

        foreach ($shareAlike as $source) {
            $this->assertNotEmpty(
                $source->review_notes,
                "Fonte share-alike {$source->slug} precisa de nota de revisao explicando as obrigacoes."
            );
        }
    }

    public function test_fonte_sem_uso_comercial_confirmado_nao_pode_estar_liberada(): void
    {
        $inconsistent = DB::table('data_sources')
            ->where('cleared_for_production', true)
            ->where(fn ($q) => $q->whereNull('allows_commercial_use')->orWhere('allows_commercial_use', false))
            ->pluck('slug');

        $this->assertEmpty(
            $inconsistent,
            'Fonte liberada para producao sem uso comercial confirmado: '.$inconsistent->implode(', ')
        );
    }

    public function test_apenas_conteudo_proprio_esta_liberado_hoje(): void
    {
        $cleared = DB::table('data_sources')
            ->where('cleared_for_production', true)
            ->pluck('slug')
            ->sort()
            ->values()
            ->all();

        $this->assertSame(['own'], $cleared, 'Hoje so o conteudo proprio esta liberado. Mudou? Atualize docs/licencas-dados.md junto.');
    }
}
