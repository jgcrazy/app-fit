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
- [ ] Infra / CI

## Checklist

- [ ] Respeita `health_profiles` (alergias, restrições, limitações) onde aplicável
- [ ] Nenhuma meta aplicada sem aceite explícito do usuário
- [ ] Escritas vindas do app carregam `client_uuid`
- [ ] Datas diárias no fuso do usuário, não derivadas de UTC
- [ ] Testes unitários cobrindo casos de borda
- [ ] Migration reversível, ou expand/contract documentado
- [ ] Nenhum dado de base externa sem `cleared_for_production`
- [ ] Documentação / ADR atualizada se houver decisão arquitetural

## Como testar
