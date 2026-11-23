<?php

namespace App\Domain\Evolution\Services;

use App\Domain\Evolution\DTOs\MetabolicEstimate;
use App\Support\Enums\ActivityLevel;
use App\Support\Enums\Goal;
use App\Support\Enums\Sex;
use InvalidArgumentException;

/**
 * Calculadora metabolica (Mifflin-St Jeor).
 *
 * Servico PURO de proposito: sem Eloquent, sem request, sem efeito colateral.
 * As formulas mudam, e quando mudarem o teste precisa ser o unico lugar a
 * quebrar.
 *
 * Os pisos caloricos sao GUARDRAILS conservadores de produto para impedir meta
 * absurda gerada por software -- nao sao recomendacao clinica. Usuario que bate
 * no piso recebe aviso e orientacao de procurar profissional.
 */
final class MetabolicCalculator
{
    /** 1 kg de tecido ~ 7700 kcal; dividido por 7 dias ~ 1100 kcal/dia por kg/semana. */
    private const KCAL_PER_KG_PER_WEEK_PER_DAY = 1100.0;

    private const FLOOR_KCAL_MALE = 1500;

    private const FLOOR_KCAL_FEMALE = 1200;

    /** Ritmos semanais seguros, como % do peso corporal. */
    private const CUT_PCT_MIN = 0.005;   // -0,5%/semana

    private const CUT_PCT_MAX = 0.010;   // -1,0%/semana

    private const BULK_PCT_MIN = 0.0025; // +0,25%/semana

    private const BULK_PCT_MAX = 0.005;  // +0,5%/semana

    public function bmr(Sex $sex, float $weightKg, int $heightCm, int $age): float
    {
        if ($weightKg <= 0 || $heightCm <= 0 || $age <= 0) {
            throw new InvalidArgumentException('Peso, altura e idade precisam ser positivos.');
        }

        $base = (10 * $weightKg) + (6.25 * $heightCm) - (5 * $age);

        return round($base + ($sex === Sex::Male ? 5 : -161), 2);
    }

    public function tdee(float $bmr, ActivityLevel $level): float
    {
        return round($bmr * $level->factor(), 2);
    }

    /**
     * @param  float  $pace  0.0 = ritmo mais conservador da faixa, 1.0 = mais agressivo.
     */
    public function estimate(
        Sex $sex,
        float $weightKg,
        int $heightCm,
        int $age,
        ActivityLevel $level,
        Goal $goal,
        float $pace = 0.0,
    ): MetabolicEstimate {
        $pace = max(0.0, min(1.0, $pace));
        $warnings = [];

        $bmr = $this->bmr($sex, $weightKg, $heightCm, $age);
        $tdee = $this->tdee($bmr, $level);

        $raw = match ($goal) {
            Goal::Cut => $tdee - $this->dailyDelta($weightKg, self::CUT_PCT_MIN, self::CUT_PCT_MAX, $pace),
            Goal::Bulk => $tdee + $this->dailyDelta($weightKg, self::BULK_PCT_MIN, self::BULK_PCT_MAX, $pace),
            Goal::Recomp => $tdee - 150,
            Goal::Maintain => $tdee,
        };

        $floor = $sex === Sex::Male ? self::FLOOR_KCAL_MALE : self::FLOOR_KCAL_FEMALE;
        $hitFloor = $raw < $floor;

        if ($hitFloor) {
            $warnings[] = 'target_below_safety_floor';
            $raw = $floor;
        }

        $targetKcal = (int) round($raw);

        [$proteinG, $fatG, $targetKcal, $macroWarnings] =
            $this->fitMacros($weightKg, $targetKcal, $goal);

        $warnings = [...$warnings, ...$macroWarnings];

        $carbKcal = $targetKcal - (($proteinG * 4) + ($fatG * 9));
        $carbG = (int) floor(max(0, $carbKcal) / 4);

        return new MetabolicEstimate(
            bmrKcal: $bmr,
            tdeeKcal: $tdee,
            targetKcal: $targetKcal,
            proteinG: $proteinG,
            carbG: $carbG,
            fatG: $fatG,
            activityFactor: $level->factor(),
            hitSafetyFloor: $hitFloor,
            // Bater no piso, ou nao caber nele, nao e plano para software
            // entregar sozinho.
            requiresProfessionalReview: $hitFloor
                || in_array('goal_not_safely_achievable', $warnings, true),
            warnings: array_values(array_unique($warnings)),
        );
    }

    /**
     * Encaixa proteina e gordura dentro da meta calorica.
     *
     * Existe porque as duas regras do blueprint colidem em corpos grandes com
     * ritmo agressivo: o piso de seguranca segura a meta embaixo, enquanto
     * proteina em g/kg empurra o consumo pra cima. Em 120 kg, proteina a
     * 2,0 g/kg ja sao 960 kcal -- sozinha, quase toda a meta de 1200.
     *
     * Ordem de concessao: corta gordura primeiro (ate 0,5 g/kg), depois proteina
     * (ate 1,2 g/kg). Se ainda nao couber, a meta NAO e falsificada: ela sobe
     * para o minimo viavel e o caso e marcado para revisao profissional. Preferir
     * um plano honesto e inviavel a um plano bonito e mentiroso.
     *
     * @return array{0:int,1:int,2:int,3:list<string>}
     */
    private function fitMacros(float $weightKg, int $targetKcal, Goal $goal): array
    {
        $warnings = [];

        $proteinG = (int) round($weightKg * ($goal === Goal::Cut ? 2.0 : 1.8));
        $fatG = (int) round($weightKg * 0.8);

        $minProteinG = (int) ceil($weightKg * 1.2);
        $minFatG = (int) ceil($weightKg * 0.5);

        if ((($proteinG * 4) + ($fatG * 9)) <= $targetKcal) {
            return [$proteinG, $fatG, $targetKcal, $warnings];
        }

        // 1) Cortar gordura ate o minimo.
        $fatKcalAllowed = $targetKcal - ($proteinG * 4);
        $fatG = (int) floor($fatKcalAllowed / 9);

        if ($fatG >= $minFatG) {
            $warnings[] = 'macros_rebalanced_low_fat';

            return [$proteinG, $fatG, $targetKcal, $warnings];
        }

        // 2) Gordura no minimo, cortar proteina.
        $fatG = $minFatG;
        $proteinKcalAllowed = $targetKcal - ($fatG * 9);
        $proteinG = (int) floor($proteinKcalAllowed / 4);

        if ($proteinG >= $minProteinG) {
            $warnings[] = 'macros_rebalanced_low_fat';
            $warnings[] = 'macros_rebalanced_low_protein';

            return [$proteinG, $fatG, $targetKcal, $warnings];
        }

        // 3) Nao cabe. Subir a meta em vez de mentir nos macros.
        $proteinG = $minProteinG;
        $targetKcal = (int) ceil(($proteinG * 4) + ($fatG * 9));

        $warnings[] = 'goal_not_safely_achievable';
        $warnings[] = 'target_raised_to_minimum_viable';

        return [$proteinG, $fatG, $targetKcal, $warnings];
    }

    private function dailyDelta(float $weightKg, float $pctMin, float $pctMax, float $pace): float
    {
        $pct = $pctMin + (($pctMax - $pctMin) * $pace);

        return $weightKg * $pct * self::KCAL_PER_KG_PER_WEEK_PER_DAY;
    }
}
