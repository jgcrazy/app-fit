# Regras de redação

Decorre do [ADR 0008](adr/0008-posicionamento-ferramenta-educativa.md). Isto não
é preferência de estilo: é o que mantém o produto do lado educativo da linha.

Vale para toda string visível ao usuário — tela, push, e-mail, loja.

## Nunca escrever

| Não | Por quê | Em vez disso |
|---|---|---|
| "Sua dieta" / "seu plano alimentar" | linguagem de prescrição | "sua estimativa", "seu registro" |
| "Você deve comer 1.850 kcal" | imperativo clínico | "a estimativa para seu objetivo é ~1.850 kcal" |
| "Você vai perder 4 kg em 30 dias" | promessa de resultado | "nesse ritmo, a projeção é de ~0,5 kg/semana" |
| "Dieta recomendada para você" | individualização prescritiva | "sugestão baseada nos seus dados" |
| "Isso indica/significa que você tem…" | diagnóstico | "converse com um profissional sobre isso" |
| "Perca peso rápido", "queime gordura" | promessa + apelo a meta extrema | "acompanhe sua constância" |
| "Aprovado por nutricionistas" | alegação de autoridade sem lastro | nada |

## Sempre

- **Número vem com origem.** "Mifflin-St Jeor, com seu peso de 82 kg e nível
  moderado" ao lado do valor, não em tela separada.
- **Faixa, não ponto, quando a estimativa é imprecisa.** "entre 1,6 e 2,2 g/kg".
- **Sugestão em voz de sugestão.** "Uma opção é…", "você pode…".
- **Encaminhamento em destaque** quando `requiresProfessionalReview` é `true`.
- **Dia perdido sem culpa.** Nunca "você falhou", "você está atrasado", "sua
  dívida calórica". O produto não pune. Ver blueprint, princípio de aderência.

## Tom

Educativo e adulto. O usuário consegue entender o raciocínio se a gente
explicar. Nem paternalista ("não se preocupe!") nem técnico demais ("seu GET
estimado via MSJ ajustado por FA").

## Verificação

Item do checklist de PR. Quando houver string de usuário na mudança, quem
revisa lê esta página. Vale também para texto de push e descrição de loja.
