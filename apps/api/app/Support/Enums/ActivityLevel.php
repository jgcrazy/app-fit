<?php

namespace App\Support\Enums;

enum ActivityLevel: string
{
    case Sedentary = 'sedentary';
    case Light = 'light';
    case Moderate = 'moderate';
    case VeryActive = 'very_active';

    public function factor(): float
    {
        return match ($this) {
            self::Sedentary => 1.200,
            self::Light => 1.375,
            self::Moderate => 1.550,
            self::VeryActive => 1.725,
        };
    }
}
