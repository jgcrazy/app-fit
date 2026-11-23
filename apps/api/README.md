# app-fit — API

Laravel 13 + PostgreSQL 16 + Redis. Contratos em `/api/v1`.

```bash
docker compose up -d          # na raiz do monorepo
cp .env.example .env && php artisan key:generate
php artisan migrate
php artisan test
```

## Estrutura

```
app/
├── Domain/<Modulo>/{Models,Actions,Enums,Services,DTOs}
├── Http/Controllers/Api/V1/<Modulo>
└── Support/{Enums,Casts,Concerns}
```

Controller valida, chama action, devolve resource. Regra de negócio em
`Actions` (uma classe, um propósito) ou em `Services` puros quando é cálculo
sem efeito colateral.

Antes de mexer no domínio, leia `docs/modelagem.md` (invariantes) e
`docs/adr/`. A arquitetura está em `docs/arquitetura.md`.

## Testes

```bash
php artisan test
vendor/bin/pint --test
```

Os serviços de `Domain/Evolution` são o núcleo de risco do produto: cobrir
caso de borda ali não é opcional.
