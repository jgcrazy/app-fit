# ADR 0007 — Deploy e rollback

**Data:** 2026-11-23 · **Status:** aceito

## Contexto

O CI/CD do blueprint terminava o deploy com `curl -f /health || exit 1`. Isso
**falha o job**; não restaura a versão anterior. O container quebrado continua
servindo.

Também faltavam estratégia de migração reversível, backup e restauração testada.

## Decisão

1. **Deploy por troca de tag**, mantendo a imagem anterior disponível
2. **Health gate** após subir; se falhar, re-apontar para a tag anterior e subir
   de novo — rollback automático de verdade
3. **Migrations em expand/contract**: nunca derrubar coluna no mesmo deploy que
   para de usá-la
4. **Backup antes de migrar** em produção, com restauração testada
   periodicamente — backup não testado não é backup
5. Produção exige aprovação manual (`environment: production` com reviewers)

## Expand/contract, na prática

Rollback de container não desfaz `DROP COLUMN`. Portanto:

```
deploy N:   adiciona coluna nova, escreve nas duas
deploy N+1: passa a ler da nova
deploy N+2: para de escrever na antiga
deploy N+3: remove a antiga
```

Chato, e é o único jeito de ter rollback que funciona de fato.

## Consequências

Deploy mais lento e mudança de schema em vários passos. O custo alternativo é
descobrir, no meio de um incidente, que o rollback não existia.
