# Arquitetura

## Visão geral

```
┌──────────────┐        ┌──────────────┐
│  Expo / RN   │        │  Web (futuro)│
└──────┬───────┘        └──────┬───────┘
       │  HTTPS / Sanctum token │
       └───────────┬────────────┘
                   ▼
          ┌────────────────┐
          │  Laravel API   │  /api/v1
          │  app/Domain/*  │
          └───┬────────┬───┘
              │        │
      ┌───────▼──┐  ┌──▼─────┐
      │ Postgres │  │ Redis  │  cache + filas
      └──────────┘  └────────┘
```

## Backend: domínio em módulos

```
app/
├── Domain/
│   ├── Identity/       users, health_profiles, LGPD
│   ├── Anthropometry/  peso, medidas, fotos
│   ├── Training/       exercícios, programas, sessões, PRs
│   ├── Evolution/      calculadora metabólica, check-in, metas
│   ├── Habits/         água, sono, hábitos
│   ├── Schedule/       agenda semanal, lembretes, reorganização
│   ├── Nutrition/      alimentos, receitas, diário (v2)
│   └── Billing/        assinaturas, webhooks
├── Http/
│   ├── Controllers/Api/V1/...
│   ├── Requests/
│   └── Resources/
└── Support/            Enums, Casts, Concerns
```

Cada módulo tem `Models/`, `Actions/` e `Enums/`. Regra de negócio vive em
`Actions` (uma classe, um propósito: `FinishWorkoutSessionAction`) ou em
`Services` puros quando é cálculo sem efeito colateral
(`MetabolicCalculator`, `CheckInEvaluator`).

Controller só faz: validar → chamar action → devolver resource. Se tem `if` de
negócio no controller, está no lugar errado.

### Por que serviços puros para o cálculo

`MetabolicCalculator` e `CheckInEvaluator` não conhecem Eloquent, request nem
banco. São as regras que mais vão mudar e as que têm mais risco de causar dano
real ao usuário. Sem dependência de infraestrutura elas são testáveis em
microssegundos, e quando a fórmula mudar o teste é o único lugar que quebra.

## Sincronização offline

A tela de execução de treino **precisa** funcionar sem rede — academia tem
sinal ruim, e é o momento de maior valor do app.

```
device: SQLite (criptografado) → fila de operações → POST em lote
servidor: upsert por (user_id, client_uuid)
```

O device gera `client_uuid` (UUID v4) antes de enviar. O servidor faz upsert
por essa chave. Reenvio é seguro por construção; não existe "tentar não
duplicar", existe chave única.

Ver [ADR 0002](adr/0002-offline-first-e-idempotencia.md).

## Painel diário

`GET /api/v1/dashboard/today` é a rota mais acessada do app e agrega oito
tabelas. Em vez de agregar sob demanda, mantemos `daily_summaries`, atualizada
por listener nos eventos de log e recalculável sob demanda.

Ver [ADR 0005](adr/0005-dashboard-e-performance.md).

## Segurança

### App
- Token em `expo-secure-store` (Keychain / Keystore). **Nunca** AsyncStorage.
- Cache local com SQLCipher — contém dado de saúde.
- `expo-local-authentication` para bloqueio biométrico nas telas de saúde.
- Scrub de PII antes de qualquer envio para observabilidade.

### API
- Sanctum, token curto + refresh, revogação de todos os dispositivos no logout.
- Campos clínicos de `health_profiles` com cast `encrypted` — criptografia de
  campo, não só de disco. Dump vazado continua ilegível.
- `health_data_access_logs` registra leitura de dado de saúde.
- Rate limit por usuário nas rotas de escrita de log.

### LGPD
Dado de saúde é **dado pessoal sensível**: regime mais rígido que dado comum.
Exportação e exclusão de conta são endpoints do v1, não backlog.
