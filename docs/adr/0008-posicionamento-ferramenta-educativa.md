# ADR 0008 — Posicionamento: ferramenta educativa

**Data:** 2026-11-23 · **Status:** aceito

## Contexto

Prescrição de dieta é atividade regulamentada no Brasil. A fronteira entre
"ferramenta de organização e educação" e "prescrição" não é decidida pelo
disclaimer: é decidida pelo que o app efetivamente entrega e por como entrega.

Um app que diz "coma 1.850 kcal e 160 g de proteína hoje", com a autoridade de
uma prescrição, não deixa de ser prescritivo porque há um aviso no rodapé.

## Decisão

O produto se posiciona como **ferramenta educativa e de registro**. Isso é
compromisso de comportamento, com regras verificáveis — não rótulo de marketing.

### O que o app faz

- **Estima e explica.** Todo número vem acompanhado da fórmula e das entradas
  que o geraram. O usuário consegue ver de onde saiu.
- **Sugere e espera aceite.** Nenhuma meta entra em vigor sem
  `nutrition_targets.accepted_by_user_at` (ADR 0006).
- **Registra.** Peso, medida, treino, refeição, hábito. O valor principal é o
  histórico do próprio usuário.
- **Mostra tendência.** Média semanal, nunca pesagem isolada.
- **Encaminha.** Caso sinalizado (`requiresProfessionalReview`) leva a
  orientação de buscar profissional, com destaque, não em letra miúda.

### O que o app não faz

- Não emite plano alimentar individualizado com aparência de prescrição clínica
- Não interpreta medida ou sintoma como diagnóstico
- Não ajusta caloria sozinho (ADR 0006)
- Não promete resultado, prazo ou quantidade de peso perdido
- Não usa imperativo clínico ("você deve", "sua dieta é")

## Consequências no código

1. **Toda saída numérica carrega procedência.** Endpoints de estimativa
   devolvem `formula`, `inputs` e `warnings` junto do resultado — nunca o número
   sozinho. Já implementado em `MetabolicEstimate`.
2. **Redação é regra, não gosto.** Ver [`docs/linguagem.md`](../linguagem.md).
   Revisão de PR checa isso.
3. **Disclaimer versionado.** `health_profiles.disclaimer_accepted_at` +
   `consent_version`: é preciso poder provar qual texto o usuário aceitou e
   quando.
4. **Sinalização é visível.** `requiresProfessionalReview` não pode ser
   silenciado na UI.

## O que isto NÃO resolve

Esta decisão reduz risco; não o elimina, e não substitui parecer jurídico. A
pendência de `docs/revisao-blueprint.md` permanece: um advogado precisa avaliar
a redação real das telas antes do lançamento, principalmente a tela que exibe a
meta calórica.

Também não protege contra o risco de loja: Apple e Google têm política própria
para apps de saúde, e a classificação delas é independente da nossa.
