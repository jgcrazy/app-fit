<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('provider', 32);             // revenuecat
            $table->string('provider_user_id')->nullable();
            $table->string('entitlement', 64);          // pro
            $table->string('product_id')->nullable();
            $table->string('store', 32)->nullable();    // app_store | play_store
            $table->string('status', 32);               // active | in_grace | expired | cancelled | refunded

            $table->timestampTz('current_period_started_at')->nullable();
            $table->timestampTz('expires_at')->nullable();
            $table->boolean('auto_renew')->default(true);
            $table->boolean('is_sandbox')->default(false);

            $table->timestampTz('last_synced_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->unique(['provider', 'provider_user_id', 'entitlement'], 'subscriptions_provider_unique');
        });

        // Webhook de billing e at-least-once e chega fora de ordem.
        // Guardar o evento cru permite reprocessar e reconciliar sem adivinhar.
        Schema::create('billing_webhook_events', function (Blueprint $table) {
            $table->id();
            $table->string('provider', 32);
            $table->string('event_id')->unique();
            $table->string('event_type', 64);
            $table->timestampTz('occurred_at')->nullable();
            $table->json('payload');
            $table->timestampTz('processed_at')->nullable();
            $table->text('processing_error')->nullable();
            $table->timestamps();

            $table->index(['provider', 'processed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_webhook_events');
        Schema::dropIfExists('subscriptions');
    }
};
