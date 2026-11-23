<?php

namespace App\Support\Enums;

enum Goal: string
{
    case Cut = 'cut';
    case Bulk = 'bulk';
    case Recomp = 'recomp';
    case Maintain = 'maintain';
}
