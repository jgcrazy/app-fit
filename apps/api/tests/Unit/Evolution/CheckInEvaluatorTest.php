<?php

namespace Tests\Unit\Evolution;

use App\Domain\Evolution\Services\CheckInEvaluator;
use App\Support\Enums\Goal;
use PHPUnit\Framework\TestCase;

class CheckInEvaluatorTest extends TestCase
{
    private CheckInEvaluator $evaluator;

    protected function setUp(): void
    {
        $this->evaluator = new CheckInEvaluator;
    }

    public function test_aderencia_baixa_nunca_corta_caloria(): void
    {
        $s = $this->evaluator->evaluate(
            goal: Goal::Cut,
            avgWeightKg: 80.0,
            previousAvgWeightKg: 80.0,
            weighInCount: 5,
            adherencePct: 55,
            consecutiveStalledCheckIns: 3,
        );

        $this->assertSame('low_adherence', $s->verdict);
        $this->assertSame(0, $s->suggestedKcalDelta);
    }

    public function test_uma_semana_parada_nao_gera_ajuste(): void
    {
        $s = $this->evaluator->evaluate(
            goal: Goal::Cut,
            avgWeightKg: 80.0,
            previousAvgWeightKg: 80.05,
            weighInCount: 5,
            adherencePct: 90,
            consecutiveStalledCheckIns: 0,
        );

        $this->assertSame('stalled_observing', $s->verdict);
        $this->assertSame(0, $s->suggestedKcalDelta);
    }

    public function test_duas_semanas_paradas_com_boa_aderencia_sugere_ajuste(): void
    {
        $s = $this->evaluator->evaluate(
            goal: Goal::Cut,
            avgWeightKg: 80.0,
            previousAvgWeightKg: 80.05,
            weighInCount: 5,
            adherencePct: 85,
            consecutiveStalledCheckIns: 1,
        );

        $this->assertSame('stalled_suggest_adjust', $s->verdict);
        $this->assertSame(-100, $s->suggestedKcalDelta);
    }

    public function test_bulk_estagnado_sugere_aumento(): void
    {
        $s = $this->evaluator->evaluate(
            goal: Goal::Bulk,
            avgWeightKg: 80.0,
            previousAvgWeightKg: 80.0,
            weighInCount: 4,
            adherencePct: 80,
            consecutiveStalledCheckIns: 2,
        );

        $this->assertSame(150, $s->suggestedKcalDelta);
    }

    public function test_poucas_pesagens_nao_avalia_tendencia(): void
    {
        $s = $this->evaluator->evaluate(
            goal: Goal::Cut,
            avgWeightKg: 80.0,
            previousAvgWeightKg: 81.0,
            weighInCount: 1,
            adherencePct: 100,
        );

        $this->assertSame('insufficient_data', $s->verdict);
    }

    public function test_supervisao_clinica_bloqueia_qualquer_sugestao(): void
    {
        $s = $this->evaluator->evaluate(
            goal: Goal::Cut,
            avgWeightKg: 80.0,
            previousAvgWeightKg: 80.0,
            weighInCount: 7,
            adherencePct: 100,
            consecutiveStalledCheckIns: 5,
            requiresClinicalSupervision: true,
        );

        $this->assertSame('blocked_clinical', $s->verdict);
        $this->assertSame(0, $s->suggestedKcalDelta);
        $this->assertTrue($s->requiresProfessionalReview);
    }

    public function test_tendencia_em_movimento_nao_mexe_na_meta(): void
    {
        $s = $this->evaluator->evaluate(
            goal: Goal::Cut,
            avgWeightKg: 79.4,
            previousAvgWeightKg: 80.0,
            weighInCount: 5,
            adherencePct: 90,
            consecutiveStalledCheckIns: 1,
        );

        $this->assertSame('on_track', $s->verdict);
        $this->assertSame(0, $s->suggestedKcalDelta);
    }
}
