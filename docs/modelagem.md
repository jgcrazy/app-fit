# Modelagem

O schema está em `apps/api/database/migrations/`, comentado linha a linha. Este
documento é o mapa e as invariantes.

## Tabelas por módulo

**Identity** — `users`, `health_profiles`, `personal_data_requests`,
`health_data_access_logs`

**Anthropometry** — `body_measurements`

**Training**
- Catálogo: `data_sources`, `exercises`, `exercise_substitutes`, `exercise_limitations`
- Prescrição: `workout_programs`, `workout_program_days`, `workout_day_exercises`
- Execução: `workout_sessions`, `workout_set_logs`, `personal_records`

**Evolution** — `nutrition_targets`, `check_ins`

**Habits** — `water_logs`, `sleep_logs`, `habits`, `daily_habit_logs`

**Schedule** — `workout_reminder_settings`, `weekly_schedules`, `schedule_items`

**Dashboard** — `daily_summaries`

**Billing** — `subscriptions`, `billing_webhook_events`

**Nutrition (v2)** — `foods`, `food_enrichments`, `food_portions`, `recipes`,
`recipe_ingredients`, `diet_plans`, `diet_plan_meals`, `diet_plan_items`,
`meal_logs`, `shopping_list_items`

## Invariantes

1. **Prescrição ≠ execução.** `workout_day_exercises` é o planejado,
   `workout_set_logs` é o realizado. A tela de aderência vive da comparação dos
   dois; nenhum dos dois sobrescreve o outro.
2. **Macro sempre por 100 g** em `foods`. Porção prática vive em
   `food_portions`. Nunca gravar macro já calculado em `foods`.
3. **`meal_logs` guarda snapshot.** Exceção deliberada à regra acima: a fonte é
   mutável e o histórico precisa ser imutável. ADR 0004.
4. **Meta nunca é sobrescrita.** Nova linha + `active_to`. ADR 0004.
5. **Todo log de app tem `client_uuid`** com unique por usuário. ADR 0002.
6. **Dia é coluna `date` no fuso do usuário**, ao lado do `timestamptz`. ADR 0004.
7. **Licença por registro** em `exercises` e `foods`. ADR 0003.
8. **Limitação física é relação**, não campo texto — precisa ser filtrável por
   índice no catálogo inteiro.
9. **`daily_summaries` é cache.** A verdade está nas tabelas de log. ADR 0005.
10. **Campos clínicos criptografados** em nível de aplicação, por isso `text` e
    não consultáveis via SQL. Intencional.
