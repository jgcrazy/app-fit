Closes #

<!-- Todo PR fecha (ou referencia, com "Refs #N") uma issue. O CI barra PR sem issue. -->

## O que muda

<!-- Uma frase. -->

## Módulo

- [ ] Identity / Perfil de Saúde
- [ ] Training
- [ ] Evolution (calculadora / check-in)
- [ ] Habits
- [ ] Schedule
- [ ] Dashboard
- [ ] Nutrition
- [ ] Billing
- [ ] Design system / UI
- [ ] Infra / CI

## Superfície de ataque e dados

<!-- Dados pessoais/saúde, autorização, riscos (CLAUDE.md da raiz). "Nenhuma" se só apresentação. -->

## Checklist

- [ ] Respeita `health_profiles` (alergias, restrições, limitações) onde aplicável
- [ ] Nenhuma meta aplicada sem aceite explícito do usuário
- [ ] Escritas vindas do app carregam `client_uuid`
- [ ] Datas diárias no fuso do usuário, não derivadas de UTC
- [ ] Testes unitários cobrindo casos de borda
- [ ] Migration reversível, ou expand/contract documentado
- [ ] Nenhum dado de base externa sem `cleared_for_production`
- [ ] Strings de usuário seguem `docs/linguagem.md` (sem prescrição, sem promessa de resultado)
- [ ] Telas só com tokens semânticos do Ensign (`npm run ds:ci` verde)
- [ ] Commits em Conventional Commits citando a issue
- [ ] Documentação / ADR atualizada se houver decisão arquitetural

## Como testar

<!-- Comandos rodados e resultado. Diga também o que NÃO foi testado. -->
