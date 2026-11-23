<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Usado pelo HEALTHCHECK do container e pelo gate de deploy.
 *
 * Checa dependencias de verdade. "O processo subiu" nao e saude: um container
 * que responde 200 sem banco passa no teste e quebra em producao.
 */
class HealthCheckCommand extends Command
{
    protected $signature = 'app:health';

    protected $description = 'Verifica banco e cache; exit 0 se saudavel.';

    public function handle(): int
    {
        $failures = [];

        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $failures[] = 'database: '.$e->getMessage();
        }

        try {
            Cache::store()->put('health:ping', 1, 5);

            if (Cache::store()->get('health:ping') !== 1) {
                $failures[] = 'cache: leitura divergente da escrita';
            }
        } catch (\Throwable $e) {
            $failures[] = 'cache: '.$e->getMessage();
        }

        foreach ($failures as $failure) {
            $this->error($failure);
        }

        if ($failures !== []) {
            return self::FAILURE;
        }

        $this->info('ok');

        return self::SUCCESS;
    }
}
