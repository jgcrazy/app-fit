# ADR 0004 — Metas versionadas, snapshot nutricional e fuso do usuário

**Data:** 2026-11-23 · **Status:** aceito

Três decisões de modelagem que precisam valer desde a primeira migration,
porque retrofitar qualquer uma delas exige reescrever histórico.

## 1. Metas versionadas

`nutrition_targets` nunca é sobrescrita. Cada check-in cria uma linha nova e
fecha a anterior via `active_to` / `superseded_by_id`, guardando junto as
entradas do cálculo (peso, idade, fator de atividade, fórmula).

**Por quê:** sobrescrever perde a capacidade de mostrar evolução e de auditar o
que foi recomendado, quando e com base em qual peso. Num app de saúde,
auditoria não é opcional.

## 2. Snapshot nutricional no diário

`meal_logs` referencia `food_id` **e** persiste o cálculo nutricional do momento
do registro (`kcal`, `protein_g`, `carb_g`, `fat_g`,
`snapshot_source_version`).

**Por quê:** o Open Food Facts é colaborativo e corrige registros
retroativamente. Se o diário só referenciasse o alimento, a correção de um
registro reescreveria o passado do usuário — ele abriria o histórico de março e
veria números diferentes dos que viu em março.

Referência **mais** snapshot: o histórico fica estável e a tela de detalhe
continua apontando para o alimento atual.

Isto contraria a intuição usual de "nunca duplicar dado derivado". A duplicação
é deliberada: a fonte é mutável e o histórico precisa ser imutável.

## 3. Dia no fuso do usuário

Toda agregação diária usa uma coluna `date` explícita (`logged_on`,
`performed_on`, `measured_on`, `summary_on`) calculada no fuso do usuário
(`users.timezone`), junto de um `timestamptz` com o instante exato.

**Por quê:** água, refeição, treino e hábito são todos "do dia". Derivar o dia
de UTC no servidor faz o registro das 23h aparecer no dia seguinte — bug
clássico, reportado como "o app perdeu meu treino".
