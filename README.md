# app-fit

Ecossistema de treino, nutrição e evolução física. Monorepo.

```
apps/api/      Laravel 13 + PostgreSQL  — API REST /api/v1
apps/mobile/   Expo / React Native (TypeScript) — Android e iOS
scripts/etl/   Importadores idempotentes de bases externas
docs/          Arquitetura, modelagem, roadmap e ADRs
```

## Stack

| Camada | Escolha |
|---|---|
| API | Laravel 13 (PHP 8.3), Sanctum |
| Banco | PostgreSQL 16 |
| Cache / filas | Redis |
| Mobile | Expo SDK 56+ / React Native (New Architecture), TypeScript |
| UI | Expo Router + NativeWind + Reanimated |
| Assinaturas | RevenueCat (Play Billing + StoreKit) |
| Deploy | Docker + GitHub Actions + GHCR |

O porquê de cada escolha está em [`docs/adr/0001-stack.md`](docs/adr/0001-stack.md).

## Subindo o ambiente local

```bash
docker compose up -d                    # postgres + redis
cd apps/api
cp .env.example .env && php artisan key:generate
php artisan migrate
php artisan test
```

Mobile:

```bash
cd apps/mobile
npm install
npx expo start
```

## Antes de escrever código, leia

1. [`docs/revisao-blueprint.md`](docs/revisao-blueprint.md) — o que mudou em relação ao blueprint original e por quê
2. [`docs/licencas-dados.md`](docs/licencas-dados.md) — **nenhuma base externa entra em produção sem passar por aqui**
3. [`docs/roadmap.md`](docs/roadmap.md) — escopo do v1

## Regras não negociáveis do código

- **O app sugere, o usuário aceita.** Nenhuma meta calórica entra em vigor sem `nutrition_targets.accepted_by_user_at`.
- **Perfil de saúde nunca atrás de paywall.** Alergias, restrições e limitações são filtro de segurança.
- **Prescrição ≠ execução.** `workout_day_exercises` é o planejado, `workout_set_logs` é o realizado. Nunca sobrescreva um com o outro.
- **Todo log vindo do app carrega `client_uuid`.** Sem chave de idempotência o retry da fila offline duplica registro.
- **Data é no fuso do usuário.** Use `logged_on` / `performed_on`, nunca derive o dia de UTC no servidor.
- **Dado importado não se mistura com dado próprio na mesma linha.** Ver ADR 0003.

## Governança

- `main` — produção, protegida, só recebe PR de `develop` ou `hotfix/*` com CI verde
- `develop` — integração, deploy automático em staging
- `feat/<modulo>-<descricao>` / `fix/<modulo>-<descricao>`

Commits em [Conventional Commits](https://www.conventionalcommits.org/).
