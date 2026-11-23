# ADR 0005 — Painel diário e performance

**Data:** 2026-11-23 · **Status:** aceito

## Contexto

`GET /api/v1/dashboard/today` é o endpoint agregador da tela inicial. Ele
precisa de: resumo calórico e proteico, tendência de peso, treino do dia,
refeições, água, sono e hábitos. São oito tabelas.

É também a rota que todo usuário chama primeiro, toda vez que abre o app.

## Decisão

Manter a tabela `daily_summaries`, com um registro por usuário por dia,
atualizada por listener nos eventos de log e recalculável sob demanda via job.

O endpoint lê `daily_summaries` + o item de agenda do dia. Não agrega nada em
tempo de request.

## Por quê

Agregar oito tabelas sob demanda faz da Home a rota mais lenta do app. Como é a
primeira tela, é também a primeira impressão de performance — e a que define se
o usuário acha o app "rápido" ou "travado".

Pré-agregar é barato: a escrita é esparsa (dezenas de eventos por usuário por
dia) e a leitura é constante.

## Implementação

- `RecalculateDailySummary` como job idempotente, com chave `(user_id, summary_on)`
- Disparado por evento de escrita: log de água, refeição, série, medida, hábito
- `recalculated_at` permite detectar resumo obsoleto
- Comando de reconciliação para recalcular um intervalo, usado após correção de dados

## Consequências

Dado derivado pode divergir. Mitigado pela idempotência do job e pelo comando de
reconciliação. A fonte da verdade continua sendo as tabelas de log — nunca o
resumo.
