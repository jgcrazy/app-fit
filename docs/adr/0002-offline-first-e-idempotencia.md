# ADR 0002 — Offline-first e idempotência

**Data:** 2026-11-23 · **Status:** aceito

## Contexto

O blueprint especifica timer de sessão, log de séries e lembretes, e não diz
nada sobre sincronização. Academia costuma ter sinal ruim — subsolo, parede de
concreto, wifi de visitante. Se a tela de execução depende de rede, o app falha
no momento de maior valor.

## Decisão

A execução de treino é **offline-first**. Toda escrita vinda do app carrega
`client_uuid` (UUID v4 gerado no device), e o servidor faz upsert por
`(user_id, client_uuid)`.

Vale para: `workout_sessions`, `workout_set_logs`, `water_logs`,
`body_measurements`, `meal_logs`.

## Por quê

Fila de sincronização reenvia em falha de rede. Sem chave de idempotência o
retry duplica série — e aí o gráfico de carga do usuário passa a mentir, que
num app de treino é perda de confiança irreversível.

Chave única resolve por construção. "Tentar não duplicar" no lado do servidor
não resolve.

## Implementação

- Device: SQLite criptografado (SQLCipher) + fila de operações pendentes
- Envio em lote, com retry e backoff
- Servidor: `unique(user_id, client_uuid)` no banco, não só validação na aplicação
- `synced_at` registra quando chegou, distinto de `performed_at`, que é quando aconteceu

## Consequências

Mais complexidade no cliente e necessidade de resolver conflito de edição.
Aceito: o custo de não ter isso é o app não servir na academia.
