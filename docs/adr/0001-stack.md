# ADR 0001 — Stack

**Data:** 2026-11-23 · **Status:** aceito

## Contexto

O blueprint oferecia duas opções: TypeScript ponta a ponta (Expo + Node/Fastify)
ou Flutter + FastAPI. Uma revisão externa sugeriu uma terceira: Flutter +
Laravel. O projeto é conduzido por um desenvolvedor só, com experiência em PHP,
Laravel e React.

## Decisão

**Laravel 13 (API) + PostgreSQL 16 + Redis + Expo/React Native (TypeScript).**

## Por quê

Flutter é hoje o framework cross-platform mais usado — cerca de 46% do mercado
contra 35% do React Native, e à frente também em estrelas no GitHub. Isso foi
considerado e **não** decidiu a escolha.

O critério aqui não é popularidade: é tempo até a primeira versão funcionando e
custo de manter sozinho depois. Flutter exigiria aprender Dart, outro ecossistema
de pacotes e outro modelo de estado — custo que só se paga quando a UI é o
produto. Este app é formulário, lista, timer e gráfico; a dificuldade está na
regra de negócio.

Laravel pelo mesmo motivo, com reforço próprio: filas, auth, testes e webhooks
maduros de fábrica, que é exatamente o que um projeto solo não quer construir.

Ponto decisivo a favor do Expo: **atualização OTA** (EAS Update) permite
corrigir bug em produção sem passar por revisão de loja. Para quem mantém o app
sozinho, é a diferença entre consertar hoje e consertar em três dias. Flutter
não tem equivalente sancionado.

## Consequências

Perde-se o compartilhamento de tipos ponta a ponta que a opção TypeScript
oferecia.

**Mitigação:** gerar OpenAPI a partir do Laravel (Scramble) e consumir com
`openapi-typescript` no app. Recupera a maior parte do benefício sem trocar de
ecossistema de backend.

Começar direto na New Architecture do React Native: ela é obrigatória a partir
do 0.82 e não pode mais ser desativada. Ignorar tutorial anterior a isso.
