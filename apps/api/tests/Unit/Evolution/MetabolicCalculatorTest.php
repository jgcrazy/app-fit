<?php

namespace Tests\Unit\Evolution;

use App\Domain\Evolution\Services\MetabolicCalculator;
use App\Support\Enums\ActivityLevel;
use App\Support\Enums\Goal;
use App\Support\Enums\Sex;
use PHPUnit\Framework\TestCase;

class MetabolicCalculatorTest extends TestCase
{
    private MetabolicCalculator $calc;

    protected function setUp(): void
    {
        $this->calc = new MetabolicCalculator;
    }

    public function test_bmr_masculino_mifflin_st_jeor(): void
    {
        // (10*80) + (6.25*180) - (5*30) + 5 = 800 + 1125 - 150 + 5 = 1780
        $this->assertSame(1780.0, $this->calc->bmr(Sex::Male, 80, 180, 30));
    }

    public function test_bmr_feminino_mifflin_st_jeor(): void
    {
        // (10*60) + (6.25*165) - (5*30) - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
        $this->assertSame(1320.25, $this->calc->bmr(Sex::Female, 60, 165, 30));
    }

    public function test_tdee_aplica_fator_de_atividade(): void
    {
        $this->assertSame(2759.0, $this->calc->tdee(1780.0, ActivityLevel::Moderate));
    }

    public function test_rejeita_entrada_invalida(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->calc->bmr(Sex::Male, 0, 180, 30);
    }

    public function test_cut_fica_abaixo_do_gasto_e_bulk_acima(): void
    {
        $cut = $this->calc->estimate(Sex::Male, 80, 180, 30, ActivityLevel::Moderate, Goal::Cut);
        $bulk = $this->calc->estimate(Sex::Male, 80, 180, 30, ActivityLevel::Moderate, Goal::Bulk);

        $this->assertLessThan($cut->tdeeKcal, $cut->targetKcal);
        $this->assertGreaterThan($bulk->tdeeKcal, $bulk->targetKcal);
    }

    public function test_ritmo_conservador_corta_menos_que_o_agressivo(): void
    {
        $slow = $this->calc->estimate(Sex::Male, 80, 180, 30, ActivityLevel::Moderate, Goal::Cut, pace: 0.0);
        $fast = $this->calc->estimate(Sex::Male, 80, 180, 30, ActivityLevel::Moderate, Goal::Cut, pace: 1.0);

        $this->assertGreaterThan($fast->targetKcal, $slow->targetKcal);
    }

    public function test_pace_fora_da_faixa_e_limitado_sem_estourar(): void
    {
        $a = $this->calc->estimate(Sex::Male, 80, 180, 30, ActivityLevel::Moderate, Goal::Cut, pace: 9.0);
        $b = $this->calc->estimate(Sex::Male, 80, 180, 30, ActivityLevel::Moderate, Goal::Cut, pace: 1.0);

        $this->assertSame($b->targetKcal, $a->targetKcal);
    }

    public function test_nunca_sugere_meta_abaixo_do_piso_de_seguranca(): void
    {
        // Pessoa pequena + sedentaria + cut agressivo: calculo cru cairia abaixo do piso.
        $e = $this->calc->estimate(Sex::Female, 45, 150, 55, ActivityLevel::Sedentary, Goal::Cut, pace: 1.0);

        $this->assertTrue($e->hitSafetyFloor);
        $this->assertSame(1200, $e->targetKcal);
        $this->assertContains('target_below_safety_floor', $e->warnings);
    }

    public function test_macros_nunca_estouram_a_meta_calorica(): void
    {
        foreach ([45.0, 60.0, 80.0, 120.0] as $weight) {
            foreach (Goal::cases() as $goal) {
                $e = $this->calc->estimate(Sex::Female, $weight, 160, 40, ActivityLevel::Sedentary, $goal, pace: 1.0);

                $fromMacros = ($e->proteinG * 4) + ($e->carbG * 4) + ($e->fatG * 9);

                $this->assertLessThanOrEqual(
                    $e->targetKcal + 5,
                    $fromMacros,
                    "Macros estouraram a meta para {$weight}kg / {$goal->value}"
                );
                $this->assertGreaterThanOrEqual(0, $e->carbG);
            }
        }
    }

    public function test_maintain_fica_no_gasto_estimado(): void
    {
        $e = $this->calc->estimate(Sex::Male, 80, 180, 30, ActivityLevel::Light, Goal::Maintain);

        $this->assertSame((int) round($e->tdeeKcal), $e->targetKcal);
    }

    public function test_colisao_entre_piso_e_proteina_rebalanceia_sem_estourar(): void
    {
        // Colisao real entre as duas regras do blueprint: o piso de seguranca
        // segura a meta embaixo e a proteina em g/kg empurra o consumo pra cima.
        // Em 120 kg ainda cabe, cortando gordura e proteina.
        $e = $this->calc->estimate(Sex::Female, 120, 160, 40, ActivityLevel::Sedentary, Goal::Cut, pace: 1.0);

        $this->assertTrue($e->hitSafetyFloor);
        $this->assertTrue($e->requiresProfessionalReview);
        $this->assertContains('macros_rebalanced_low_protein', $e->warnings);
        $this->assertLessThanOrEqual($e->targetKcal, $e->kcalFromMacros());
    }

    public function test_quando_nao_cabe_a_meta_sobe_em_vez_de_mentir(): void
    {
        // Acima de ~130 kg o minimo de proteina + gordura nao cabe no piso.
        // O plano honesto e elevar a meta e marcar para revisao profissional.
        $e = $this->calc->estimate(Sex::Female, 160, 165, 45, ActivityLevel::Sedentary, Goal::Cut, pace: 1.0);

        $this->assertContains('goal_not_safely_achievable', $e->warnings);
        $this->assertContains('target_raised_to_minimum_viable', $e->warnings);
        $this->assertTrue($e->requiresProfessionalReview);
        $this->assertGreaterThan(1200, $e->targetKcal);
        $this->assertLessThanOrEqual($e->targetKcal, $e->kcalFromMacros());
    }

    public function test_proteina_nunca_cai_abaixo_do_minimo_por_kg(): void
    {
        foreach ([45.0, 80.0, 120.0, 160.0] as $weight) {
            $e = $this->calc->estimate(Sex::Female, $weight, 160, 40, ActivityLevel::Sedentary, Goal::Cut, pace: 1.0);

            $this->assertGreaterThanOrEqual(
                (int) ceil($weight * 1.2),
                $e->proteinG,
                "Proteina caiu abaixo de 1,2 g/kg em {$weight}kg"
            );
        }
    }
}
