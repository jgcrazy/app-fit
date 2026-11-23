# Revisão do blueprint original

**Data:** 2026-11-23

Registro do que foi mantido, mudado e descartado do documento "Blueprint
Técnico e de Produto", e do porquê. Serve para que uma decisão não seja
refeita por esquecimento.

## Avaliação

Visão de produto forte, execução frágil. O documento define *regras*, não só
telas — o que é raro e vale muito. Os problemas estão concentrados em dados,
licenciamento e segurança clínica.

## O que foi mantido

- **Painel diário `Hoje`** como núcleo de UX. Melhor decisão do documento:
  une treino, alimentação e evolução numa experiência contínua.
- **Reorganização sem culpa.** Diferencial prático e difícil de copiar.
  Nenhum dia perdido gera punição calórica ou dívida acumulada.
- **Perfil de saúde fora do paywall.** Segurança não depende de pagamento.
- **Arquitetura modular por domínio.**
- **Separação staging / produção** desde o início.
- **A matemática metabólica** (Mifflin-St Jeor, faixas de macro, trava de
  aderência). É conservadora e defensável.

## O que mudou

| Área | Decisão |
|---|---|
| Ajuste calórico automático | Removido o automatismo, mantida a matemática — [ADR 0006](adr/0006-calculadora-sugere-nao-aplica.md) |
| Escopo do v1 | Reduzido; nutrição foi para v2 — [roadmap](roadmap.md) |
| Bases externas | Auditadas; TACO e TheMealDB descartadas — [licenças](licencas-dados.md) |
| Stack | Laravel + Expo/RN, não Node nem Flutter — [ADR 0001](adr/0001-stack.md) |
| Rollback | Health check não é rollback; deploy por troca de tag — [ADR 0007](adr/0007-deploy-e-rollback.md) |
| `nutrition_targets` | Versionada, nunca sobrescrita — [ADR 0004](adr/0004-metas-versionadas-snapshot-e-fuso.md) |
| Logs do app | `client_uuid` obrigatório para idempotência — [ADR 0002](adr/0002-offline-first-e-idempotencia.md) |
| Dados importados | Isolados do conteúdo próprio — [ADR 0003](adr/0003-isolamento-de-dados-licenciados.md) |

## O que faltava no blueprint

Pontos que não estavam no documento e viram incêndio em produção:

1. **Sincronização offline.** Havia timer e log de séries, nenhuma palavra sobre
   sincronismo. Academia tem sinal ruim. → ADR 0002
2. **Idempotência.** Retry de rede duplicando série faz o gráfico de carga
   mentir. → ADR 0002
3. **Performance do `/dashboard/today`.** Oito tabelas na tela mais acessada.
   → ADR 0005
4. **Fuso horário na fronteira do "dia".** Registro das 23h caindo no dia
   seguinte. → ADR 0004
5. **Snapshot nutricional.** Base colaborativa corrige registros e reescreve o
   passado do usuário. → ADR 0004
6. **Reconciliação de assinatura.** Webhook é at-least-once e chega fora de
   ordem; evento cru precisa ser guardado para reprocessar.
7. **Regulamentação profissional.** Prescrição de dieta é atividade
   regulamentada no Brasil. Risco maior que licença de API e ausente do
   documento. Exige parecer jurídico. → ADR 0006
8. **LGPD operacional.** Exportação e exclusão de conta como endpoints do v1,
   criptografia em nível de campo, log de acesso a dado de saúde.

## Pendências antes do lançamento

- [ ] Parecer jurídico sobre a redação real das telas vs. prescrição regulamentada
      (posicionamento definido em [ADR 0008](adr/0008-posicionamento-ferramenta-educativa.md);
      o parecer continua necessário, principalmente na tela que exibe a meta calórica)
- [ ] Escolher a fonte de alimentos naturais que substitui a TACO — ver
      [licenças](licencas-dados.md). Bloqueia o início da v2, não o v1.
- [ ] Confirmar termos de uso das tabelas de composição da POF/IBGE
- [ ] Auditoria de licença por registro dos exercícios importados
- [ ] Jornada do usuário e protótipos de tela
- [ ] Modelo de monetização com projeção de aquisição, churn e conversão
- [ ] Matriz de segurança e privacidade
- [ ] Critérios de publicação nas lojas (política de saúde de Apple e Google)
