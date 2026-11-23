# Especificação de implementação

Contrato de implementação de todos os módulos. Serve de entrada para
desenvolvimento assistido: aponte uma tarefa para a seção do módulo, não para o
documento inteiro.

**Autoridade:** as migrations em `apps/api/database/migrations/` são a verdade
sobre o schema. Este documento especifica comportamento, contratos e regras. Em
divergência, a migration vence e este documento é corrigido.

Leia antes: [`modelagem.md`](modelagem.md) (invariantes), [`linguagem.md`](linguagem.md)
(redação), [`licencas-dados.md`](licencas-dados.md) (bases externas) e `adr/`.

---

## 1. Convenções da API

Base: `/api/v1`. Versionada desde o início — o app móvel fica em dispositivos
que não atualizam quando queremos.

### Autenticação

Sanctum, token em `Authorization: Bearer <token>`. Token de acesso curto
(15 min) + refresh. Logout revoga todos os tokens do dispositivo; logout global
revoga todos.

### Formato de erro

```json
{
  "message": "Dados inválidos.",
  "errors": { "weight_kg": ["O peso deve ser maior que zero."] }
}
```

Códigos usados: `422` validação, `401` sem token ou expirado, `403`
`subscription_required` ou policy, `404`, `409` conflito de estado, `429` rate
limit, `503` dependência indisponível.

Em `403` por assinatura, o corpo traz `"reason": "subscription_required"` para o
app distinguir de falta de permissão.

### Idempotência

Toda rota de escrita que o app pode reenviar aceita `client_uuid` (UUID v4) no
corpo. Comportamento obrigatório:

- primeira chamada → `201` com o recurso criado
- reenvio com o mesmo `client_uuid` → `200` com o **mesmo** recurso, sem criar
  duplicata e sem erro

Implementar com `updateOrCreate` sobre a chave única `(user_id, client_uuid)`.
Nunca com `exists()` antes do insert — corrida em requisições paralelas.

Rotas com essa exigência: `workouts/sessions`, `workouts/sessions/{id}/sets`,
`evolution/measurements`, `habits/water-logs`, `nutrition/meal-logs`.

### Datas e fuso

- Campo `date` (`logged_on`, `performed_on`, `measured_on`): `YYYY-MM-DD`,
  **sempre no fuso do usuário** (`users.timezone`)
- Campo de instante: ISO 8601 com offset (`2026-11-23T19:04:12-03:00`)
- O servidor **nunca** deriva `logged_on` de `now()` em UTC. Deriva do
  `logged_at` recebido convertido para o fuso do usuário, ou aceita `logged_on`
  explícito do app

Helper obrigatório: `App\Support\Concerns\ResolvesUserDay` — recebe usuário +
instante, devolve a data local. Toda action de log usa esse helper.

### Paginação

Cursor, não offset: `?cursor=<token>&per_page=50` (máximo 100). Resposta:

```json
{ "data": [], "meta": { "next_cursor": "...", "per_page": 50 } }
```

### Entitlements

Middleware `entitlement:pro` nas rotas PRO. **Nunca** nas rotas de
`health-profile`, `me/data-export`, `me` (exclusão) nem `auth/*` — o perfil de
saúde é camada de segurança e fica fora do paywall (ADR 0008).

### Resources

Toda resposta passa por um `JsonResource`. Nenhum model serializado direto —
`health_profiles` tem campos criptografados que não podem vazar por acidente.

---

## 2. Invariantes globais

Valem em todo módulo. Violação é bug, não escolha de estilo.

1. **Prescrição ≠ execução.** `workout_day_exercises` é o planejado,
   `workout_set_logs` é o realizado. Nenhum dos dois sobrescreve o outro.
2. **Meta nunca é sobrescrita.** Novo `nutrition_targets` + fechamento do
   anterior via `active_to` e `superseded_by_id`.
3. **O app sugere, o usuário aceita.** Nada vira meta ativa sem
   `accepted_by_user_at` (ADR 0006).
4. **Todo log do app tem `client_uuid`** com unique por usuário (ADR 0002).
5. **Dia é coluna `date` no fuso do usuário** (ADR 0004).
6. **Licença por registro** em `exercises` e `foods` (ADR 0003).
7. **Fonte externa só com `cleared_for_production = true`.** Hoje apenas
   `own`. `DataSourceGuardTest` protege isso.
8. **`daily_summaries` é cache.** A verdade está nas tabelas de log (ADR 0005).
9. **Campos clínicos criptografados** em nível de aplicação, não consultáveis
   via SQL. Intencional.
10. **Regra de negócio em `Action` ou `Service`**, nunca em controller. Cálculo
    sem efeito colateral em `Service` puro, sem Eloquent.

---

## 3. Módulos

### 3.1 Identity

Autenticação, perfil de saúde e direitos LGPD. **Fora do paywall por completo.**

**Tabelas:** `users`, `health_profiles`, `personal_data_requests`,
`health_data_access_logs`

**Enums:** `Sex`, `Goal`, `ActivityLevel` (já existem em `app/Support/Enums`),
`LimitationCode`, `ConsentVersion`

**Model `HealthProfile`** — casts obrigatórios:

```php
protected function casts(): array
{
    return [
        'allergies' => 'encrypted:array',
        'dietary_restrictions' => 'encrypted:array',
        'physical_limitations' => 'encrypted:array',
        'clinical_notes' => 'encrypted',
        'goal' => Goal::class,
        'activity_level' => ActivityLevel::class,
        'consented_at' => 'datetime',
        'disclaimer_accepted_at' => 'datetime',
    ];
}
```

**Actions:** `RegisterUserAction`, `UpdateHealthProfileAction`,
`RequestDataExportAction`, `RequestAccountDeletionAction`,
`LogHealthDataAccessAction`

**Endpoints**

| Método | Rota | Nota |
| --- | --- | --- |
| POST | `auth/register` | cria usuário; exige `timezone` |
| POST | `auth/login` | devolve access + refresh |
| POST | `auth/refresh` | rotaciona o par |
| POST | `auth/logout` | revoga o dispositivo |
| POST | `auth/logout-all` | revoga todos |
| GET | `health-profile` | registra acesso em `health_data_access_logs` |
| PUT | `health-profile` | idem |
| POST | `me/consent` | grava `consented_at` + `consent_version` |
| POST | `me/data-export` | cria request, dispara job |
| GET | `me/data-export/{request}` | status + URL temporária |
| DELETE | `me` | agenda exclusão |

**Regras**

- `POST auth/register` exige `timezone` válido (lista IANA). Sem fuso não há
  como derivar `logged_on` corretamente.
- Leitura ou escrita de `health_profiles` grava linha em
  `health_data_access_logs`. Sem exceção.
- `consent_version` vem de um enum em código, não string livre: é preciso poder
  provar qual texto o usuário aceitou.
- `POST me/data-export` gera JSON com **todos** os dados do usuário em todas as
  tabelas. Job assíncrono, URL expira em 72 h (`export_expires_at`).
- `DELETE me` não apaga na hora: marca `users.deleted_at`, cria
  `personal_data_requests` tipo `delete`, e um job apaga em cascata após
  carência de 7 dias (permite arrepender-se). O job remove, não anonimiza.
- Exclusão apaga `health_data_access_logs` do próprio usuário por último.

**Testes obrigatórios**

- registro rejeita fuso inválido
- campos clínicos não aparecem em `SELECT *` legível (ciphertext no banco)
- leitura do perfil gera log de acesso
- exportação cobre todas as tabelas com dado do usuário
- exclusão remove em cascata e não deixa órfão
- rotas de perfil de saúde respondem para conta `free` (nunca `403`)

---

### 3.2 Anthropometry

Peso, medidas e fotos de evolução.

**Tabelas:** `body_measurements`

**Actions:** `RecordMeasurementAction`, `ComputeWeightTrendAction`

**Endpoints**

| Método | Rota | Nota |
| --- | --- | --- |
| POST | `evolution/measurements` | idempotente por `client_uuid` |
| GET | `evolution/measurements` | paginado, mais recente primeiro |
| GET | `evolution/overview` | tendência + últimos valores |
| DELETE | `evolution/measurements/{measurement}` | |

**Regras**

- `unique(user_id, measured_on)`: duas medidas no mesmo dia → a segunda
  atualiza a primeira (`updateOrCreate`), não erra.
- `ComputeWeightTrendAction` devolve **média móvel de 7 dias**, nunca pesagem
  isolada. Com menos de 3 pesagens na janela, devolve `null` e o motivo — não
  invente tendência com dado insuficiente.
- Foto é privada: disco não público, URL temporária assinada.
- Gravar medida invalida `daily_summaries` do dia.

**Testes**

- duas medidas no mesmo dia não duplicam
- tendência com menos de 3 pesagens devolve `null` com motivo
- média móvel ignora dias sem pesagem, não os trata como zero

---

### 3.3 Training

Catálogo, programas, execução e recordes. É o núcleo do v1.

**Tabelas:** `data_sources`, `exercises`, `exercise_substitutes`,
`exercise_limitations`, `workout_programs`, `workout_program_days`,
`workout_day_exercises`, `workout_sessions`, `workout_set_logs`,
`personal_records`

**Actions:** `StartWorkoutSessionAction`, `LogWorkoutSetAction`,
`FinishWorkoutSessionAction`, `SubstituteExerciseAction`,
`SyncWorkoutBatchAction`

**Services:** `PersonalRecordCalculator` (puro), `ExerciseFilterService`

**Endpoints**

| Método | Rota | Nota |
| --- | --- | --- |
| GET | `exercises` | filtra por grupo, equipamento e limitação |
| GET | `exercises/{exercise}` | |
| GET | `exercises/{exercise}/substitutes` | `?reason=no_equipment\|joint_limitation` |
| POST | `exercises` | exercício próprio do usuário |
| GET | `workouts/programs` | |
| GET | `workouts/programs/{program}` | com dias e exercícios |
| POST | `workouts/programs` | |
| GET | `workouts/program-days/{day}` | tela de execução |
| POST | `workouts/sessions` | idempotente |
| POST | `workouts/sessions/{session}/sets` | idempotente |
| POST | `workouts/sessions/{session}/finish` | |
| POST | `workouts/sync` | lote da fila offline |
| GET | `workouts/history` | paginado |
| GET | `exercises/{exercise}/progression` | série histórica de carga |

**Regras**

- **Filtro de segurança:** `GET exercises` e `substitutes` **nunca** retornam
  exercício com `exercise_limitations.limitation_code` presente nas
  `physical_limitations` do usuário com severidade `contraindicated`. Severidade
  `caution` retorna com flag `requires_caution: true`.
- `POST workouts/sync` recebe array de operações, cada uma com `client_uuid`.
  Processa em ordem, devolve por item: `created`, `duplicate` ou `failed` com
  motivo. **Falha de um item não aborta o lote.**
- `FinishWorkoutSessionAction` calcula `duration_seconds` a partir de
  `started_at`/`finished_at` recebidos do device, não de `now()` — a sessão pode
  ter sido sincronizada horas depois.
- Ao finalizar, recalcula `personal_records` via `PersonalRecordCalculator`:
  `max_weight`, `estimated_1rm` (Epley), `max_volume`, `max_reps`. Em job, não
  no request.
- Série de aquecimento (`is_warmup = true`) **não** conta para PR nem volume.
- `exercises` sem `is_published` só aparece para o dono (`user_id`).
- Todo exercício importado precisa de `license_code` na linha. Importar sem
  licença é erro de validação, não aviso.

**Testes**

- exercício contraindicado pela limitação do usuário não aparece na listagem
- substituto respeita o mesmo filtro
- reenvio de série com mesmo `client_uuid` não duplica
- lote com um item inválido processa os demais
- aquecimento não gera PR
- `estimated_1rm` com fórmula conhecida (Epley) em valores de referência
- duração vem dos timestamps do device, não do horário do request

---

### 3.4 Evolution

Calculadora metabólica, metas versionadas e check-in semanal. **Módulo de maior
risco ao usuário** — leia [ADR 0006](adr/0006-calculadora-sugere-nao-aplica.md)
antes de tocar.

**Tabelas:** `nutrition_targets`, `check_ins`

**Services (já implementados, puros):** `MetabolicCalculator`,
`CheckInEvaluator`

**Actions a implementar:** `CreateTargetFromEstimateAction`,
`AcceptTargetAction`, `RunWeeklyCheckInAction`

**Endpoints**

| Método | Rota | Nota |
| --- | --- | --- |
| POST | `evolution/calculator/preview` | **não grava nada** |
| GET | `evolution/targets/active` | |
| GET | `evolution/targets` | histórico |
| POST | `evolution/targets` | cria em estado pendente |
| POST | `evolution/targets/{target}/accept` | único caminho para ativar |
| POST | `evolution/check-ins` | gera sugestão |
| POST | `evolution/check-ins/{checkIn}/accept` | aplica a sugestão |

**Resposta de `calculator/preview`** — formato obrigatório, nunca o número sozinho:

```json
{
  "data": {
    "target_kcal": 2180,
    "protein_g": 164,
    "carb_g": 206,
    "fat_g": 66,
    "bmr_kcal": 1780.0,
    "tdee_kcal": 2759.0,
    "activity_factor": 1.55,
    "formula": "mifflin_st_jeor",
    "inputs": { "weight_kg": 82, "height_cm": 180, "age": 30, "sex": "male" },
    "hit_safety_floor": false,
    "requires_professional_review": false,
    "warnings": []
  }
}
```

**Regras**

- `POST evolution/targets` cria com `accepted_by_user_at = null`. Meta pendente
  **não** é meta ativa: `GET targets/active` ignora pendentes.
- `AcceptTargetAction` é transacional: fecha o `active_to` da meta anterior,
  aponta `superseded_by_id`, grava `accepted_by_user_at`. Nunca dois registros
  ativos ao mesmo tempo para o mesmo usuário.
- `RunWeeklyCheckInAction` **só** grava `check_ins` com a sugestão. Não cria nem
  altera `nutrition_targets`. Aplicar exige o endpoint `accept`.
- `requires_professional_review = true` precisa ser devolvido ao app em
  destaque; a UI não pode silenciar.
- `health_profiles.requires_clinical_supervision` ou
  `is_pregnant_or_lactating` → `CheckInEvaluator` devolve `blocked_clinical` e
  nenhuma sugestão numérica.
- Toda string de usuário deste módulo segue [`linguagem.md`](linguagem.md).
  É aqui que o risco de soar prescritivo é maior.

**Testes** — os serviços já têm 20 testes. Acrescentar:

- `preview` não cria linha em `nutrition_targets`
- meta pendente não aparece em `targets/active`
- aceitar meta fecha a anterior e nunca deixa duas ativas
- check-in não altera meta sem `accept`
- usuário com supervisão clínica recebe `blocked_clinical`

---

### 3.5 Habits

Água, sono e hábitos diários. Interações de um toque.

**Tabelas:** `water_logs`, `sleep_logs`, `habits`, `daily_habit_logs`

**Actions:** `LogWaterAction`, `UpsertSleepLogAction`, `ToggleHabitAction`

**Endpoints**

| Método | Rota | Nota |
| --- | --- | --- |
| POST | `habits/water-logs` | `delta_ml`, idempotente |
| GET | `habits/water-logs?date=` | total do dia |
| PUT | `habits/sleep-logs` | upsert por `(user_id, logged_on)` |
| GET | `habits` | |
| POST | `habits` | |
| PATCH | `habits/{habit}/toggle?date=` | |
| DELETE | `habits/{habit}` | arquiva, não apaga histórico |

**Regras**

- `delta_ml` aceita negativo: é assim que o usuário desfaz um toque errado. O
  total do dia nunca fica negativo — o clamp é na leitura, e o log negativo é
  preservado para auditoria.
- `DELETE habits/{habit}` marca `is_archived`. Apagar perderia
  `daily_habit_logs` históricos e quebraria o gráfico de constância.
- Toda escrita invalida `daily_summaries` do dia correspondente.

**Testes**

- `delta_ml` negativo reduz o total; total não fica negativo
- reenvio com mesmo `client_uuid` não soma duas vezes
- hábito arquivado não aparece na lista mas o histórico permanece
- log às 23h local cai no dia local, não no seguinte

---

### 3.6 Schedule

Agenda semanal, lembretes e o motor de reorganização.

**Tabelas:** `workout_reminder_settings`, `weekly_schedules`, `schedule_items`

**Service:** `RescheduleEngine` (puro — a parte mais testável e mais arriscada)

**Actions:** `GenerateWeeklyScheduleAction`, `RescheduleItemAction`,
`UpdateReminderSettingsAction`

**Endpoints**

| Método | Rota | Nota |
| --- | --- | --- |
| GET | `schedule/week?week_starting_on=` | |
| POST | `schedule/week/generate` | |
| POST | `schedule/items/{item}/reschedule` | `strategy` obrigatório |
| GET | `schedule/workout-reminders` | |
| PUT | `schedule/workout-reminders` | |

**Estratégias:** `push_next_day`, `express_version`, `swap_rest_day`,
`skip_without_guilt`

**Guardrails — nenhum é opcional**

1. Nunca agendar dois treinos completos de força no mesmo dia.
2. Nunca colocar o mesmo grupo muscular principal em dias consecutivos ao
   deslocar.
3. Nunca agendar em dia marcado em `weekly_schedules.blocked_weekdays` sem
   confirmação explícita no request (`"confirm_blocked": true`).
4. Reagendar implica devolver ao app os horários de notificação local
   atualizados.
5. **Nunca reduzir caloria do dia seguinte como punição** por treino perdido.
   Não existe dívida calórica no produto.

`express_version` reduz a sessão para 20–25 min mantendo os exercícios
compostos (`exercises.is_compound = true`), cortando acessórios pela ordem
inversa de `position`.

**Testes** — este service precisa de cobertura adversarial:

- `push_next_day` em semana cheia não cria dois treinos de força no mesmo dia
- `swap_rest_day` não coloca o mesmo grupo muscular em dias seguidos
- dia bloqueado sem `confirm_blocked` é recusado com `409`
- `express_version` preserva todos os compostos
- `skip_without_guilt` não altera nenhuma meta nem cria dívida
- reagendamento devolve os horários de notificação recalculados

---

### 3.7 Dashboard

O endpoint agregador da Home. Ver [ADR 0005](adr/0005-dashboard-e-performance.md).

**Tabelas:** `daily_summaries`

**Actions/Jobs:** `RecalculateDailySummaryJob` (idempotente),
`BuildTodayPayloadAction`

**Endpoints**

| Método | Rota |
| --- | --- |
| GET | `dashboard/today?date=YYYY-MM-DD` |

**Regras**

- `BuildTodayPayloadAction` lê `daily_summaries` + o `schedule_items` do dia.
  **Não agrega nada em tempo de request.**
- `RecalculateDailySummaryJob` é disparado por evento de escrita em: água, sono,
  hábito, medida, sessão de treino, refeição. Chave `(user_id, summary_on)`,
  idempotente, `ShouldBeUnique`.
- Resumo ausente → calcula sob demanda **e** enfileira o job. Nunca devolver
  zeros silenciosamente.
- Comando `php artisan summaries:recalculate {user?} {--from=} {--to=}` para
  reconciliação após correção de dados.

**Testes**

- `today` não executa mais de 3 queries (teste de contagem de query)
- escrita de água invalida e recalcula o resumo do dia
- job rodado duas vezes produz o mesmo resultado
- resumo ausente é calculado em vez de devolver zeros

---

### 3.8 Billing

Assinatura via RevenueCat. Entitlement decidido no backend, nunca no app.

**Tabelas:** `subscriptions`, `billing_webhook_events`

**Actions:** `HandleRevenueCatWebhookAction`, `SyncSubscriptionAction`

**Middleware:** `EnsureEntitlement`

**Endpoints**

| Método | Rota | Nota |
| --- | --- | --- |
| GET | `me/subscription` | estado atual |
| POST | `webhooks/revenuecat` | fora do `auth:sanctum` |

**Regras**

- Webhook grava **primeiro** em `billing_webhook_events` (payload cru,
  `event_id` unique), **depois** processa. Reprocessar é reler a tabela, não
  pedir reenvio ao provedor.
- `event_id` duplicado → `200` sem reprocessar. Webhook é at-least-once.
- Evento fora de ordem: comparar `occurred_at` com
  `subscriptions.last_synced_at` e descartar o mais antigo. Chegada tardia de
  `EXPIRATION` não pode derrubar uma renovação já registrada.
- Verificar assinatura do webhook (`REVENUECAT_WEBHOOK_SECRET`). Sem
  verificação, qualquer um concede PRO a si mesmo.
- `is_sandbox = true` nunca concede entitlement em produção.
- Job diário de reconciliação: para assinaturas `active` com `expires_at`
  passado, consultar a API do provedor. Webhook perdido é cenário normal.
- `EnsureEntitlement` responde `403` com `"reason": "subscription_required"`.

**Testes**

- webhook com assinatura inválida é rejeitado
- `event_id` repetido não reprocessa
- `EXPIRATION` antigo não derruba renovação mais recente
- sandbox não concede PRO em produção
- rota PRO responde `403 subscription_required` para conta `free`
- rotas de perfil de saúde respondem `200` para conta `free`

---

### 3.9 Nutrition — v2

**Não implementar ainda.** Schema existe; a fonte de alimentos está pendente.
Ver [`licencas-dados.md`](licencas-dados.md) e
[ADR 0003](adr/0003-isolamento-de-dados-licenciados.md).

**Tabelas:** `foods`, `food_enrichments`, `food_portions`, `recipes`,
`recipe_ingredients`, `diet_plans`, `diet_plan_meals`, `diet_plan_items`,
`meal_logs`, `shopping_list_items`

**Bloqueio:** nenhum importador roda antes de
`data_sources.cleared_for_production = true` para a fonte. Hoje só `own` está
liberado. `DataSourceGuardTest` falha se isso mudar sem decisão registrada.

**Quando destravar, as regras já decididas:**

- Dado importado em `foods`; tradução e curadoria em `food_enrichments`. Nunca
  na mesma linha (ODbL é share-alike).
- `meal_logs` grava **snapshot** de `kcal`, `protein_g`, `carb_g`, `fat_g` no
  momento do registro, além de referenciar `food_id` (ADR 0004).
- Macro em `foods` sempre por 100 g. Porção prática em `food_portions`.
- Sugestão de combinação **nunca** retorna alimento ou receita com alérgeno
  presente em `health_profiles.allergies`. É filtro de segurança, com teste
  dedicado.
- Atribuição da fonte visível em toda tela que exibe o dado.

---

## 4. Ordem de implementação

Uma entrega por PR, na ordem. Cada uma é testável e deixa o app utilizável.

| # | PR | Módulo | Depende de |
| --- | --- | --- | --- |
| 1 | Auth com Sanctum + refresh | Identity | — |
| 2 | Perfil de saúde com campos criptografados + log de acesso | Identity | 1 |
| 3 | Exportação e exclusão de conta (LGPD) | Identity | 2 |
| 4 | Catálogo de exercícios + filtro por limitação | Training | 2 |
| 5 | Programas e dias de treino | Training | 4 |
| 6 | Execução: sessão, séries, finalizar | Training | 5 |
| 7 | Sync em lote + idempotência | Training | 6 |
| 8 | Recordes e progressão de carga | Training | 6 |
| 9 | Medidas e tendência de peso | Anthropometry | 2 |
| 10 | Calculadora: preview e metas pendentes | Evolution | 2 |
| 11 | Aceite de meta e versionamento | Evolution | 10 |
| 12 | Check-in semanal | Evolution | 11, 9 |
| 13 | Água, sono e hábitos | Habits | 2 |
| 14 | `daily_summaries` + job de recálculo | Dashboard | 6, 9, 13 |
| 15 | `GET dashboard/today` | Dashboard | 14 |
| 16 | Lembretes e agenda semanal | Schedule | 5 |
| 17 | Motor de reorganização | Schedule | 16 |
| 18 | Assinatura e webhook | Billing | 2 |
| 19 | Middleware de entitlement nas rotas PRO | Billing | 18 |

PRs 1 a 15 fecham o v1 funcional. 16 e 17 podem ir para a v1.1 se o prazo
apertar — a agenda é diferencial, mas o app já serve sem ela. 18 e 19 precisam
estar prontos antes de qualquer publicação em loja.

### Mobile, em paralelo

Depois do PR 2, o app pode começar: login, perfil de saúde, e a tela de
execução de treino com a fila offline. A tela de execução é a mais importante
do produto e a mais difícil — comece por ela, não por último.

---

## 5. Definition of done

Um PR não fecha sem:

- [ ] Testes unitários cobrindo os casos de borda listados na seção do módulo
- [ ] Teste de integração do fluxo completo, com PostgreSQL real
- [ ] `vendor/bin/pint --test` limpo
- [ ] Migration reversível, ou expand/contract documentado no PR
- [ ] Nenhuma regra de negócio em controller
- [ ] Resposta via `JsonResource`, nenhum model serializado direto
- [ ] Rota de escrita reenviável aceita e respeita `client_uuid`
- [ ] Data diária derivada do fuso do usuário
- [ ] Strings de usuário conferidas contra [`linguagem.md`](linguagem.md)
- [ ] Rotas de perfil de saúde continuam fora do paywall
- [ ] ADR novo se houve decisão arquitetural

### Teste de integração exigido no PR 15

Fluxo completo, ponta a ponta, em um único teste:

criar usuário → preencher perfil de saúde → gerar estimativa → aceitar meta →
criar programa → registrar sessão com séries → registrar água → registrar peso
→ `GET dashboard/today` reflete tudo → rota PRO responde `403` para conta
`free`.

É esse teste que impede regressão silenciosa entre módulos.

---

## 6. O que não está especificado aqui

De propósito, por depender de decisão externa:

- **Redação final das telas** — pendente de parecer jurídico
  (ADR 0008). Implementar com as regras de `linguagem.md` e revisar depois.
- **Fonte de alimentos** — pendente (seção 3.9).
- **Tokens do design system** — placeholder em
  `apps/mobile/src/shared/theme/tokens.js`.
- **Conteúdo editorial dos exercícios** — `instructions_pt`,
  `common_mistakes_pt`, `execution_tips_pt` são produção própria, não
  importação. Trabalho editorial, não de engenharia.
- **Mídia de execução guiada** — produção própria ou licenciada com contrato.
  Nunca de fonte desconhecida.
