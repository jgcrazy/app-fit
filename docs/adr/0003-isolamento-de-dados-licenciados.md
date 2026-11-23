# ADR 0003 — Isolamento de dados licenciados

**Data:** 2026-11-23 · **Status:** aceito

## Contexto

O plano original era importar Open Food Facts e wger para o banco próprio,
traduzindo e enriquecendo os registros em português.

Os dados do Open Food Facts estão sob ODbL, que é share-alike: usar
publicamente uma versão adaptada do banco implica oferecer esse banco adaptado
também sob ODbL. No wger, a licença dos exercícios varia **por registro**.

O banco traduzido e enriquecido é o diferencial pretendido do produto. Também é
exatamente o que uma licença copyleft pode obrigar a devolver aberto.

## Decisão

1. Dado importado e dado próprio **nunca** compartilham a mesma linha.
   - `foods` — espelho do registro externo, como veio
   - `food_enrichments` — tradução e curadoria próprias, tabela separada
   - `exercises` — campos de importação (`external_id`, `license_code`,
     `license_author`, `source_url`) separados do conteúdo editorial próprio
     (`instructions_pt`, `common_mistakes_pt`, `execution_tips_pt`)
2. Proveniência e licença são rastreadas **por registro**, via `data_sources` +
   colunas de licença na própria linha.
3. Nenhuma importação para produção antes de
   `data_sources.cleared_for_production = true`.

## Por quê

Fronteira limpa entre o que foi importado e o que foi criado é o que permite,
depois, argumentar o que é banco derivado e o que é obra própria. Se tradução e
enriquecimento morarem dentro da tabela do dado importado, essa fronteira
desaparece — e com ela a defesa.

Rastrear licença por linha é obrigatório porque no wger ela varia por exercício.
Uma nota de rodapé no rodapé do app não diz qual exercício pode ser exibido.

## Consequências

Um `join` a mais nas consultas de alimento e exercício. Irrelevante frente ao
risco de ter que abrir a base ou remover conteúdo depois do lançamento.
