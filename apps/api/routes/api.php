<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API v1
|--------------------------------------------------------------------------
|
| Contratos em docs/arquitetura.md. A API e versionada desde o dia 1: o app
| movel fica em dispositivos que nao atualizam quando queremos, entao quebrar
| contrato sem versao nova nao e opcao.
|
*/

// Gate de saude usado pelo deploy. Checa dependencias, nao so "o PHP subiu".
Route::get('/health', function () {
    $checks = [];

    try {
        DB::connection()->getPdo();
        $checks['database'] = 'ok';
    } catch (Throwable $e) {
        $checks['database'] = 'fail';
    }

    try {
        Cache::store()->put('health:ping', 1, 5);
        $checks['cache'] = Cache::store()->get('health:ping') === 1 ? 'ok' : 'fail';
    } catch (Throwable $e) {
        $checks['cache'] = 'fail';
    }

    $healthy = ! in_array('fail', $checks, true);

    return response()->json([
        'status' => $healthy ? 'ok' : 'degraded',
        'checks' => $checks,
        'version' => config('app.version'),
    ], $healthy ? 200 : 503);
})->name('health');

Route::prefix('v1')->name('api.v1.')->group(function () {
    // --- Publico ---
    // Route::post('auth/register', ...);
    // Route::post('auth/login', ...);

    Route::middleware('auth:sanctum')->group(function () {
        // --- Identity / Perfil de saude (sempre fora do paywall) ---
        // Route::get('health-profile', ...);
        // Route::put('health-profile', ...);
        // Route::post('me/data-export', ...);
        // Route::delete('me', ...);

        // --- Painel diario ---
        // Route::get('dashboard/today', ...);

        // --- Treino ---
        // Route::get('exercises', ...);
        // Route::get('exercises/{exercise}/substitutes', ...);
        // Route::get('workouts/programs', ...);
        // Route::post('workouts/sessions', ...);          // idempotente por client_uuid
        // Route::post('workouts/sessions/{session}/sets', ...);
        // Route::post('workouts/sessions/{session}/finish', ...);

        // --- Evolucao ---
        // Route::post('evolution/calculator/preview', ...); // so estima, nao grava
        // Route::get('evolution/targets/active', ...);
        // Route::post('evolution/targets/{target}/accept', ...); // aceite explicito
        // Route::post('evolution/measurements', ...);
        // Route::post('evolution/check-ins', ...);

        // --- Habitos ---
        // Route::post('habits/water-logs', ...);
        // Route::put('habits/sleep-logs', ...);

        // --- Agenda ---
        // Route::get('schedule/week', ...);
        // Route::post('schedule/items/{item}/reschedule', ...);
    });
});

// Webhooks: fora do auth de usuario, com verificacao de assinatura propria.
// Route::post('webhooks/revenuecat', ...);
