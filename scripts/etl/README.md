# ETL — importação de bases externas

> **Nenhum script aqui roda contra produção antes de
> `data_sources.cleared_for_production = true` para a fonte correspondente.**
> Ver [`../../docs/licencas-dados.md`](../../docs/licencas-dados.md).

## Requisitos de todo importador

1. **Idempotente.** Rodar duas vezes não duplica registro. Chave:
   `(data_source_id, external_id)`.
2. **Grava proveniência por registro.** `license_code`, `license_author`,
   `source_url` e `source_version` em cada linha. No wger a licença varia por
   exercício — não existe licença "da base".
3. **Não escreve em tabela de conteúdo próprio.** Dado importado vai para
   `foods` / `exercises`; tradução e curadoria vão para `food_enrichments` e os
   campos `*_pt`, em operação separada. Ver ADR 0003.
4. **Registra a versão importada** em `data_sources.review_notes`.
5. **Dados brutos baixados ficam em `data/`**, que é gitignored. Base externa
   não entra no repositório.

## Status das fontes

| Fonte | Script | Status |
|---|---|---|
| wger (exercícios) | — | aguardando auditoria de licença por registro |
| Open Food Facts | — | aguardando decisão sobre isolamento ODbL |
| TACO | — | **descartada** por decisão de produto (ADR 0008 / licencas-dados.md) |
| POF/IBGE | — | candidata a substituir a TACO; confirmar termos de uso |
