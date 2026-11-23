# CLAUDE.md — Política de desenvolvimento seguro

> Aplicável a todo o repositório. Este documento orienta o Claude Code, mas **não substitui** controles técnicos, revisões humanas ou permissões reais.

## 1. Objetivo e stack

Construir desde o início um produto seguro com React + TypeScript (web), possível React Native (Android/iOS), Laravel (API), PostgreSQL com Row-Level Security (RLS), Cloudflare e assinaturas. Tratar dados pessoais e, quando existirem, dados sensíveis de saúde segundo a LGPD.

## 2. Regras inegociáveis

1. **Negar por padrão.** Autenticação e autorização são verificadas no servidor em cada operação. Não confiar em verificações do React, IDs, roles, preços ou tenant IDs enviados pelo cliente.
2. **Menor privilégio.** Separar identidades e permissões para aplicação, migrações, jobs, suporte, administração, backups e CI/CD.
3. **Não expor segredos.** Nunca inserir credenciais, tokens, chaves privadas, dados reais de clientes ou `.env` em código, logs, commits, prompts ou respostas. Usar secret manager e credenciais temporárias quando possível.
4. **Não enfraquecer proteções para corrigir bugs.** Nunca desativar RLS, CSRF, TLS, validação de certificados, autenticação, políticas de acesso ou verificações de webhook como solução temporária.
5. **Não executar ações destrutivas ou em produção sem aprovação explícita.** Inclui deploy, migrações destrutivas, alterações de DNS/WAF, mudanças de cobrança, exclusão de dados, rotação de credenciais e comandos com impacto operacional.
6. **Testar controles críticos.** Cada recurso sensível precisa de testes de autorização, validação, isolamento e falhas previsíveis antes de ser considerado pronto.
7. **Falhar com segurança.** Erros não concedem permissões; respostas públicas não revelam stack traces, consultas SQL, tokens ou informações internas.
8. **Documentar riscos.** Em mudanças relevantes, registrar ameaças, medidas, testes, riscos residuais e necessidade de aprovação.

## 3. Fluxo obrigatório do Claude Code

Antes de implementar qualquer funcionalidade:
- Identificar dados envolvidos, usuários/atores, limites de confiança e operações privilegiadas.
- Descrever ameaças (incluindo STRIDE quando relevante), autorização e possíveis abusos.
- Definir contratos de API, regras de validação, regras de banco, testes e critérios de aceite.
- Verificar versões e documentação oficiais antes de usar recursos sensíveis ou novos.

Durante a implementação:
- Fazer alterações pequenas e revisáveis; não modificar arquivos não relacionados.
- Usar dependências mantidas, lockfiles, queries parametrizadas e validação server-side.
- Criar testes negativos: sem login, outro usuário, outro tenant, role insuficiente, entrada inválida, repetição e concorrência.
- Evitar registrar PII, dados de saúde, tokens e payloads financeiros completos.

Antes de concluir:
- Executar testes relevantes, análise estática, auditoria de dependências e secret scanning disponíveis.
- Informar comandos executados, resultados, riscos remanescentes e itens não testados.
- Não afirmar que o sistema está seguro ou que testes passaram sem evidência.

## 4. Autenticação e sessões

- Para SPA web própria, preferir Laravel Sanctum com autenticação por sessão/cookies, quando a arquitetura de domínio permitir; configurar cookies `Secure`, `HttpOnly`, `SameSite` e proteção CSRF.
- Para mobile, usar mecanismo apropriado de autenticação com tokens de curta duração e revogação; quando houver OAuth/OIDC, utilizar Authorization Code + PKCE.
- Senhas: Argon2id, parâmetros calibrados, proteção contra credential stuffing e enumeração de contas.
- MFA resistente a phishing (passkeys/WebAuthn) para administradores; exigir reautenticação em ações críticas.
- Rate limiting e monitoramento em login, OTP, recuperação de senha, mudança de e-mail e emissão de tokens.
- Rotacionar sessões após autenticação/elevação de privilégios; implementar logout e revogação.
- Não guardar tokens de sessão em `localStorage` quando houver alternativa mais segura.

## 5. Autorização Laravel e APIs

- Aplicar Policies/Gates e checagens de ownership/tenant em cada endpoint e serviço; proteger contra IDOR/BOLA e BFLA.
- Validar dados com Form Requests e listas explícitas de campos permitidos; proteger contra mass assignment.
- Usar queries parametrizadas; prevenir SQL injection, SSRF, path traversal, upload malicioso e open redirect.
- Configurar CORS estritamente; CORS não substitui autenticação nem autorização.
- Limitar corpo da requisição, paginação, consultas caras e tentativas por IP/conta/ação.
- Autorizar novamente jobs, exportações, downloads e rotinas assíncronas; URLs assinadas devem expirar.
- Versionar APIs e documentar erros sem revelar informações internas.

## 6. PostgreSQL e RLS

- Banco acessível apenas por rede privada/hosts autorizados, com TLS quando aplicável.
- Separar roles de runtime, migração, manutenção e backup. A role runtime **não** pode ser `SUPERUSER`, ter `BYPASSRLS` ou ser proprietária das tabelas protegidas.
- Habilitar RLS nas tabelas multi-tenant ou por usuário e avaliar `FORCE ROW LEVEL SECURITY`.
- Criar políticas explícitas `USING` e `WITH CHECK` para operações permitidas; políticas devem negar quando o contexto de identidade estiver ausente.
- Definir contexto autenticado de usuário/tenant exclusivamente no backend confiável, preferencialmente com `SET LOCAL` dentro de transação; revisar pooling, reutilização de conexões e jobs.
- **Importante:** variáveis customizadas de sessão do PostgreSQL não são, sozinhas, uma fronteira de segurança; impedir SQL arbitrário e SQL injection, limitar a role e testar o modelo de ameaça.
- Validar integridade também com `FOREIGN KEY`, `UNIQUE`, `CHECK`, `NOT NULL` e constraints compostas que impeçam relações entre tenants.
- Revisar views, funções `SECURITY DEFINER`, triggers, procedimentos e acessos privilegiados para evitar bypass.
- Testar SELECT/INSERT/UPDATE/DELETE entre usuários e tenants, inclusive acesso indireto, paginação e exportações.
- Backups criptografados, retenção definida, cópias isoladas e restauração periódica testada.
- Se usar Supabase com acesso direto do cliente, adotar políticas compatíveis com claims JWT verificadas e roles do Supabase; **não** aplicar cegamente o modelo de contexto do Laravel.

## 7. React web e React Native

- TypeScript em modo estrito; evitar `dangerouslySetInnerHTML`; sanitizar HTML não confiável quando necessário.
- Adotar CSP progressivamente testada, HSTS, `X-Content-Type-Options`, `Referrer-Policy` e proteção contra framing.
- Nunca embutir segredos em `VITE_*`, bundles JavaScript, APK/IPA ou arquivos públicos.
- Evitar PII em URLs, cache, analytics, erros e notificações.
- Mobile: guardar credenciais em Keychain/Keystore, validar TLS, proteger deep links e minimizar permissões.
- Verificar compras/assinaturas de lojas no servidor; nunca confiar apenas no estado do app.
- Usar OWASP MASVS como referência para segurança mobile.

## 8. Pagamentos e assinaturas

- O backend calcula valores, moeda, descontos, planos e titularidade; o frontend nunca é fonte de verdade financeira.
- Preferir checkout hospedado/tokenizado; não armazenar CVV nem dados completos de cartão.
- Verificar assinatura/autenticidade de webhooks conforme documentação oficial de cada provedor, usando payload bruto quando exigido.
- Processar eventos com idempotência, transações, locks/constraints e estados explícitos.
- Tratar webhooks duplicados, atrasados, fora de ordem, falhas, estornos, chargebacks e cancelamentos.
- Não liberar benefícios com base apenas no redirecionamento de sucesso do checkout.
- Reconciliar periodicamente pagamentos e assinaturas com o provedor; auditar mudanças de plano, preços e acesso.
- Para compras móveis, avaliar e cumprir regras vigentes da Apple App Store e Google Play sobre billing e assinaturas.

## 9. Cloudflare e infraestrutura

- TLS validado ponta a ponta (por exemplo, Full strict quando aplicável); nunca usar modo que dispense validação da origem.
- Proteger a origem contra acesso direto sempre que possível (firewall, Tunnel ou controles equivalentes).
- WAF, DDoS, rate limiting e bot protection complementam, mas não substituem, validação/autorização do Laravel.
- Proteger conta Cloudflare com MFA; tokens de API de escopo mínimo, sem expor Global API Key.
- Restringir SSH, evitar login root, atualizar SO/PHP/Laravel e manter serviços internos não públicos.
- Separar dev/staging/prod, dados, contas, credenciais e infraestrutura.
- Centralizar logs, monitorar disponibilidade, autenticação, eventos financeiros e erros; configurar alertas.
- Ter runbooks de incidente, rollback, recuperação de backups e rotação de segredos.

## 10. LGPD e dados sensíveis

- Mapear categorias de dados, finalidades, bases legais, operadores, transferências e prazos de retenção.
- Dados de saúde são sensíveis; aplicar controles reforçados e avaliar a base legal adequada (não presumir que consentimento é sempre a única base).
- Minimizar coleta; criptografar dados sensíveis quando apropriado, separar chaves e controlar acessos internos.
- Prever atendimento a direitos dos titulares, exclusão quando cabível, retenção legal e trilhas de auditoria.
- Não copiar dados reais de produção para desenvolvimento; usar dados sintéticos ou devidamente desidentificados.
- Documentar plano de resposta e comunicação de incidentes conforme obrigações aplicáveis.

## 11. CI/CD e supply chain

- Proteger branches, exigir revisão de mudanças críticas e impedir push direto para produção.
- Executar testes, lint, análise estática, SAST, auditoria de dependências, secret scanning e verificações de migrações.
- Fixar versões e lockfiles; revisar dependências, ações de CI e permissões de workflows.
- Preferir identidades temporárias/OIDC no deploy; nunca expor segredos em logs de pipelines.
- Manter inventário/SBOM quando viável, artefatos rastreáveis e rollback ensaiado.
- Bloquear publicação por falhas críticas sem mitigação documentada e aprovação responsável.

## 12. Matriz mínima de testes de segurança

Para cada recurso sensível, testar:
- Usuário anônimo; sessão expirada; credenciais revogadas.
- Usuário A tentando ler, criar, editar ou apagar dados do usuário B.
- Tenant A tentando acessar recursos do tenant B.
- Usuário comum chamando rota administrativa ou financeira.
- ID manipulado, payload com campos extras, entradas inválidas e limites excedidos.
- Repetição e concorrência de requisições; duplicação de webhooks.
- Falhas de rede, timeout, rollback e reprocessamento seguro.
- Vazamento por logs, erros, exportações, cache e URLs.
- Backups e restauração em ambiente isolado.

## 13. Critérios de aceite para produção

Não aprovar lançamento sem:
- Testes automatizados de autenticação, autorização e isolamento passando.
- Fluxos financeiros testados para duplicidade, fraude de payload, concorrência e reconciliação.
- Nenhum segredo no repositório/build; permissões de runtime mínimas.
- RLS e roles revisadas; banco e serviços internos não expostos.
- Backup com restauração comprovada e plano de incidentes definido.
- Avaliação de privacidade/LGPD e documentação de dados sensíveis.
- Monitoramento, alertas e procedimento de rollback.
- Revisão de vulnerabilidades e riscos residuais documentados.

## 14. Formato obrigatório de resposta para tarefas de desenvolvimento

Ao propor ou concluir uma mudança, apresentar:
1. **Objetivo e superfície de ataque.**
2. **Arquivos/componentes afetados.**
3. **Modelo de autorização e dados envolvidos.**
4. **Riscos e mitigação.**
5. **Testes positivos e negativos.**
6. **Resultado da validação (executado / não executado).**
7. **Ações que exigem aprovação humana.**

## 15. Referências normativas

- OWASP ASVS 5.0: https://owasp.org/www-project-application-security-verification-standard/
- OWASP API Security Top 10: https://owasp.org/API-Security/
- OWASP MASVS: https://mas.owasp.org/MASVS/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- PostgreSQL RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Laravel Security: https://laravel.com/docs
- Cloudflare Developers: https://developers.cloudflare.com/
- ANPD: https://www.gov.br/anpd/pt-br

> **Prioridade:** proteção de dados e dinheiro > disponibilidade > conveniência de implementação. Na dúvida, parar, documentar o risco e pedir aprovação antes de executar uma ação irreversível.
