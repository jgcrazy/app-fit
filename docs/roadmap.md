# Roadmap

O blueprint original colocava praticamente todos os módulos no v1.0. Foi
reduzido: o objetivo do v1 é descobrir se as pessoas pagam, com o menor
conjunto de funcionalidades que já entrega valor diário.

## v1 — validação

1. **Perfil de saúde + auth + LGPD**
   Cadastro, autenticação, perfil de segurança (alergias, restrições,
   limitações), consentimento versionado, exportação e exclusão de conta.
   É a camada de segurança de todo o resto e fica fora do paywall.

2. **Treino**
   Catálogo em PT-BR, programas, execução guiada, substituição por
   equipamento/limitação, log de séries e cargas, PRs.
   **Offline-first desde o primeiro commit.**

3. **Peso, medidas e tendência**
   Registro, média semanal, gráfico de evolução.

4. **`Hoje` enxuto**
   Treino do dia + peso + água. Sem nutrição ainda.

5. **Assinatura**
   RevenueCat, entitlements no backend, reconciliação por webhook.

## v2 — nutrição

Alimentos, receitas próprias, combinações por meta, diário alimentar, lista de
compras.

**Nutrição ficou em último de propósito.** É o módulo com todo o risco de
licenciamento (ver [`licencas-dados.md`](licencas-dados.md)), o maior esforço
de dados, **e** o terreno onde os incumbentes já ganharam. O diferencial deste
produto está em treino + evolução: reorganização sem culpa e execução guiada em
português. Lançar pelo lado forte permite validar pagamento antes de enfrentar
a base de alimentos — e se a resposta sobre as licenças vier ruim, isso é
descoberto com o app já no ar, não com ele todo construído em cima.

## v3

Planejamento semanal avançado e motor de reorganização completo, hábitos e
sono, miniaulas, desafios, integração com Apple Health / Health Connect.

## Fora de escopo por decisão

- Metas agressivas de perda de peso — proibidas por produto, não por falta de tempo
- Ajuste calórico automático sem aceite do usuário — ver [ADR 0006](adr/0006-calculadora-sugere-nao-aplica.md)
- Vídeos de execução de origem desconhecida
