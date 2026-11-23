<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * LGPD no v1, nao depois.
     *
     * Portabilidade e eliminacao sao direitos do titular. Implementar exclusao
     * com o dado ja espalhado por quinze tabelas e muito pior do que nascer com
     * ela. Dado de saude e dado pessoal SENSIVEL -- regime mais rigido.
     */
    public function up(): void
    {
        Schema::create('personal_data_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 32);        // export | delete
            $table->string('status', 32)->default('pending');
            $table->timestampTz('requested_at');
            $table->timestampTz('completed_at')->nullable();
            $table->string('export_path')->nullable();
            $table->timestampTz('export_expires_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type', 'status']);
        });

        Schema::create('health_data_access_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('accessed_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('resource', 64);
            $table->string('action', 32);
            $table->string('ip_address', 45)->nullable();
            $table->timestampTz('accessed_at');

            $table->index(['user_id', 'accessed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_data_access_logs');
        Schema::dropIfExists('personal_data_requests');
    }
};
