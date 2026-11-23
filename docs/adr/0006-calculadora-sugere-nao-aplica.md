# ADR 0006 — A calculadora sugere, não aplica

**Data:** 2026-11-23 · **Status:** aceito

## Contexto

O blueprint previa: após duas semanas de estagnação, o app reduz
automaticamente 100 a 150 kcal/dia para emagrecimento.

Peso corporal oscila por hidratação, ciclo menstrual, conteúdo intestinal e
medicação. Duas semanas não bastam, isoladamente, para justificar redução
calórica automática — e software que decide corte calórico sozinho, sem
profissional no circuito, é risco real ao usuário e responsabilidade para o
produto.

Uma revisão externa recomendou remover os ajustes automáticos. Removê-los por
inteiro, no entanto, esvaziaria o núcleo do produto.

## Decisão

**A matemática fica. O automatismo sai.**

- `MetabolicCalculator` e `CheckInEvaluator` são serviços puros que produzem
  **estimativa** e **sugestão**
- Nenhuma meta entra em vigor sem `nutrition_targets.accepted_by_user_at`
- O cálculo é exibido ao usuário, não escondido
- Linguagem educativa, sem promessa de resultado

### Travas, em ordem de precedência

1. Supervisão clínica, gestação ou lactação → nenhuma sugestão automática
2. Menos de 3 pesagens na semana → não avalia tendência
3. Aderência < 70% → **nunca** corta caloria; o problema é rotina, não dieta
4. Estagnação em 2 check-ins consecutivos com aderência ≥ 75% → sugere ajuste

### Pisos calóricos

1500 kcal (masculino) e 1200 kcal (feminino) são **guardrails de produto** para
impedir meta absurda gerada por software. Não são recomendação clínica. Quem
bate no piso recebe aviso e é marcado para revisão profissional.

## Caso de borda encontrado em teste

As duas regras do blueprint colidem em corpos grandes com ritmo agressivo: o
piso segura a meta embaixo enquanto a proteína em g/kg empurra o consumo para
cima. Em 120 kg, proteína a 2,0 g/kg já são 960 kcal — quase toda a meta de
1200.

Resolução, na ordem: corta gordura até 0,5 g/kg, depois proteína até 1,2 g/kg.
Se ainda não couber, **a meta sobe para o mínimo viável** e o caso é marcado
para revisão profissional. Um plano honesto e inviável é melhor que um plano
bonito e mentiroso.

Coberto por `test_quando_nao_cabe_a_meta_sobe_em_vez_de_mentir`.

## Pendência

Prescrição de dieta é atividade regulamentada no Brasil. A fronteira entre
"ferramenta educativa de registro" e "prescrição" depende da linguagem e do grau
de individualização do que o app entrega. **Exige parecer jurídico antes do
lançamento**, e a redação das telas precisa ser desenhada junto com esse parecer.
