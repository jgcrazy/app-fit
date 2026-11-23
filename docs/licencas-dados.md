# Licenciamento das bases externas

> **Regra:** nenhuma base externa é importada para produção antes de
> `data_sources.cleared_for_production = true`. Esse campo só é marcado por
> decisão humana registrada, com data e nota de revisão.

"Dado gratuito" não é "dado liberado". Gratuito no ponto de acesso diz respeito
ao custo da requisição, não ao direito de armazenar, traduzir, modificar e
comercializar. Levantamento feito em 2026-11-23; **nenhum item abaixo substitui
parecer jurídico**.

## Situação por fonte

| Fonte | Licença | Uso comercial | Share-alike | Status |
|---|---|---|---|---|
| Open Food Facts | ODbL 1.0 (dados) / CC-BY-SA (imagens) | sim, com condições | **sim** | ⚠️ exige isolamento |
| wger | CC variável **por registro** | depende do registro | depende | ⚠️ exige licença por linha |
| TACO (NEPA/Unicamp) | não há licença aberta explícita | **indefinido** | — | ⛔ **descartada por decisão de produto** |
| POF/IBGE | produção estatística oficial | a confirmar | — | 🔎 candidata a substituir a TACO |
| TheMealDB | chave de teste para dev/pessoal; produção exige chave de supporter | sim, com atribuição | não | ⛔ descartado por escopo |
| Conteúdo próprio | proprietário | sim | não | ✅ preferencial |

## Open Food Facts — risco estrutural

Os dados estão sob ODbL, que é **share-alike**: usar publicamente uma versão
adaptada do banco, ou obras produzidas a partir dele, implica oferecer esse
banco adaptado também sob ODbL. Uso comercial é permitido desde que a fonte
seja atribuída e as melhorias ao banco sejam compartilhadas. Imagens de produto
são CC Attribution-ShareAlike.

O problema para este projeto: o plano original era importar, **traduzir e
enriquecer** os registros em português. Esse banco enriquecido é justamente o
diferencial do produto — e é exatamente o que o ODbL pode obrigar a devolver
aberto.

**Mitigação arquitetural (já no schema):** o dado importado vive em `foods`,
como veio. A tradução e a curadoria próprias vivem em `food_enrichments`,
tabela separada, referenciando o registro. Fronteira limpa é o que permite
argumentar depois o que é banco derivado e o que é obra própria. Ver
[ADR 0003](adr/0003-isolamento-de-dados-licenciados.md).

**Obrigações operacionais:** atribuição visível em toda tela que exibe dado do
OFF — não só numa página "sobre".

## wger — licença por registro

Código é AGPL-3.0-or-later; dados de exercícios e ingredientes são Creative
Commons **conforme cada entrada**; documentação é CC-BY-SA-4.0.

O AGPL só se aplica a quem usa o *código* do wger. Não é o caso aqui — usamos
apenas dados. O que importa é o "conforme cada entrada": a licença varia por
exercício, então `exercises` carrega `license_code`, `license_author` e
`source_url` por linha. Onde o registro for CC-BY-SA, nossas traduções de
`instructions_pt` daquele exercício herdam share-alike.

Nota: a base nutricional do próprio wger vem do Open Food Facts. As duas fontes
não são independentes nessa parte.

## TACO — descartada

**Decisão de produto (2026-11-23): a TACO não será usada.** Não foi localizada
licença pública explícita de redistribuição comercial, e a opção foi não
depender de uma autorização que pode não vir — em vez de construir em cima dela
e esperar.

`data_sources` mantém o registro com `cleared_for_production = false` e nota da
decisão, para que ninguém reabra a questão por esquecimento.

### Consequência: há um buraco a preencher

A TACO era a melhor fonte conhecida de **alimentos naturais brasileiros** —
arroz cozido, feijão carioca, farinha de mandioca. O Open Food Facts é forte em
**produto embalado com código de barras** e fraco justamente nesse terreno.
Descartar a TACO não resolve a base de alimentos: estreita as saídas a duas.

| Caminho | A favor | Contra |
|---|---|---|
| **POF/IBGE** | produção estatística oficial, situação de redistribuição mais confortável | menos itens que a TACO, precisa de curadoria e tradução de nomenclatura |
| **Base própria curada** | sem amarra de licença, vira ativo defensável do produto | esforço editorial real: centenas de itens a cadastrar e revisar |

Recomendação: **POF/IBGE como semente + curadoria própria por cima**, com a
tabela própria crescendo a partir do que os usuários mais buscam. Nutrição é v2
([roadmap](roadmap.md)), então há tempo — mas a decisão precisa de um
substituto escolhido antes de a v2 começar, não durante.

Próximo passo concreto: confirmar os termos de uso das tabelas de composição de
alimentos da POF/IBGE antes de assumir que estão liberadas. "Dado de governo"
não é automaticamente "dado livre para uso comercial".

## TheMealDB — descartado

A chave pública "1" é compartilhada e destinada a desenvolvimento, teste e uso
pessoal, não a tráfego de produção; cargas comerciais devem usar a chave de
supporter (£10, vitalícia), com atribuição das receitas e imagens exibidas.

O custo é irrelevante; o motivo do descarte é escopo: são receitas
internacionais. Para um app brasileiro, receita é conteúdo editorial, e
conteúdo editorial próprio é o que se consegue defender. Receitas serão
próprias, modularizadas por meta calórica.

## Mídia de execução guiada

Vídeo e imagem de execução **não** vêm de fonte de origem desconhecida. Ou é
produção própria, ou é licenciado com contrato. Essa é a categoria de maior
risco de reclamação e a mais caótica nos datasets abertos.

## Revisão

Revisar a cada versão importada das fontes e sempre que a licença upstream
mudar. Registrar em `data_sources.review_notes` com data.
