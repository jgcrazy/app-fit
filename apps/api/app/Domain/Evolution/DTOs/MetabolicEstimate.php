<?php

namespace App\Domain\Evolution\DTOs;

/**
 * Resultado do calculo metabolico.
 *
 * E uma ESTIMATIVA EDUCATIVA, nao prescricao. Nada aqui entra em vigor sem
 * aceite explicito do usuario (nutrition_targets.accepted_by_user_at).
 */
final readonly class MetabolicEstimate
{
    public function __construct(
        public float $bmrKcal,
        public float $tdeeKcal,
        public int $targetKcal,
        public int $proteinG,
        public int $carbG,
        public int $fatG,
        public float $activityFactor,
        public bool $hitSafetyFloor,
        public bool $requiresProfessionalReview = false,
        /** @var list<string> */
        public array $warnings = [],
    ) {}

    public function kcalFromMacros(): int
    {
        return ($this->proteinG * 4) + ($this->carbG * 4) + ($this->fatG * 9);
    }
}
