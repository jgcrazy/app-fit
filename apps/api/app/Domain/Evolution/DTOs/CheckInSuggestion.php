<?php

namespace App\Domain\Evolution\DTOs;

final readonly class CheckInSuggestion
{
    public function __construct(
        public string $verdict,
        public int $suggestedKcalDelta,
        public string $rationaleKey,
        public bool $requiresProfessionalReview = false,
    ) {}
}
