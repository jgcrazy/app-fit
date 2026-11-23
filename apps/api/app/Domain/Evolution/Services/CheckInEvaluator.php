<?php

namespace App\Domain\Evolution\Services;

use App\Domain\Evolution\DTOs\CheckInSuggestion;
use App\Support\Enums\Goal;

/**
 * Avaliacao do check-in semanal.
 *
 * REGRA CENTRAL: este servico SUGERE. Nunca aplica.
 * O ajuste so vira meta ativa depois de aceite explicito do usuario.
 * Ver ADR 0006 -- foi a mudanca mais importante em cima do blueprint original,
 * que previa reducao calorica automatica.
 *
 * Travas, em ordem de precedencia:
 *  1. Supervisao clinica / gestacao / lactacao -> nenhuma sugestao automatica.
 *  2. Dados insuficientes (< 3 pesagens na semana) -> nao avalia tendencia.
 *  3. Aderencia < 70% -> NUNCA corta caloria. O problema e rotina, nao dieta.
 *  4. Estagnacao por 2 check-ins consecutivos com aderencia >= 75% -> sugere ajuste.
 */
final class CheckInEvaluator
{
    private const MIN_WEIGH_INS = 3;

    private const LOW_ADHERENCE_PCT = 70;

    private const ADJUST_ADHERENCE_PCT = 75;

    /** Faixa considerada estagnacao: variacao semanal dentro de +/- 0,2% do peso. */
    private const STALL_PCT = 0.002;

    private const CUT_DELTA = -100;

    private const BULK_DELTA = 150;

    public function evaluate(
        Goal $goal,
        float $avgWeightKg,
        ?float $previousAvgWeightKg,
        int $weighInCount,
        ?int $adherencePct,
        int $consecutiveStalledCheckIns = 0,
        bool $requiresClinicalSupervision = false,
    ): CheckInSuggestion {
        if ($requiresClinicalSupervision) {
            return new CheckInSuggestion(
                verdict: 'blocked_clinical',
                suggestedKcalDelta: 0,
                rationaleKey: 'clinical_supervision_required',
                requiresProfessionalReview: true,
            );
        }

        if ($weighInCount < self::MIN_WEIGH_INS || $previousAvgWeightKg === null) {
            return new CheckInSuggestion(
                verdict: 'insufficient_data',
                suggestedKcalDelta: 0,
                rationaleKey: 'need_more_weigh_ins',
            );
        }

        if ($adherencePct !== null && $adherencePct < self::LOW_ADHERENCE_PCT) {
            return new CheckInSuggestion(
                verdict: 'low_adherence',
                suggestedKcalDelta: 0,
                rationaleKey: 'fix_routine_before_calories',
            );
        }

        $delta = $avgWeightKg - $previousAvgWeightKg;
        $isStalled = abs($delta) <= ($previousAvgWeightKg * self::STALL_PCT);

        if (! $isStalled) {
            return new CheckInSuggestion(
                verdict: 'on_track',
                suggestedKcalDelta: 0,
                rationaleKey: 'trend_is_moving',
            );
        }

        $adherenceOk = $adherencePct !== null && $adherencePct >= self::ADJUST_ADHERENCE_PCT;

        // Uma semana parada nao e sinal: peso oscila por hidratacao, ciclo
        // menstrual, conteudo intestinal e medicacao. Exige 2 check-ins.
        if ($consecutiveStalledCheckIns < 1 || ! $adherenceOk) {
            return new CheckInSuggestion(
                verdict: 'stalled_observing',
                suggestedKcalDelta: 0,
                rationaleKey: 'one_week_is_not_a_trend',
            );
        }

        return new CheckInSuggestion(
            verdict: 'stalled_suggest_adjust',
            suggestedKcalDelta: match ($goal) {
                Goal::Cut => self::CUT_DELTA,
                Goal::Bulk => self::BULK_DELTA,
                Goal::Recomp, Goal::Maintain => 0,
            },
            rationaleKey: 'two_stalled_weeks_with_good_adherence',
        );
    }
}
