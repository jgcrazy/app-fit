Pílula de status para o ciclo de vida de pedidos e registros. Quatro tons, cada
um com fundo tingido, texto em contraste medido e **sempre um rótulo em texto**.

## Os quatro tons

| Tom | Rótulo padrão | Cobre |
| --- | --- | --- |
| `active` | Ativo | Ativo, Concluído, Entregue, Pago |
| `pending` | Pendente | Pendente, Em análise, Aguardando, Em rota |
| `canceled` | Cancelado | Cancelado, Recusado, Estornado, Falhou |
| `neutral` | Rascunho | Rascunho, Arquivado, Inativo |

Quatro tons, não um por estado do seu domínio. Um quinto status sem token é um
status que a UI não sabe pintar — mapeie-o em um dos quatro.

## Cor nunca carrega o estado

O rótulo em texto é obrigatório, e o ponto (`dot`) é reforço. Em tabela densa
passe `dot={false}` e deixe só o texto: a coluna já diz que aquilo é status.

Os pares foram medidos: todo `status-*-fg` passa 4,5:1 sobre o seu próprio
`status-*-bg` nos dois temas.

## O consumidor fornece

O mapeamento do seu enum para um dos quatro tons, e o rótulo em pt-BR. Mantenha
esse mapa num único lugar — não espalhe `match` de status por componente.

## Erros comuns

- Inventar um quinto tom com um verde ou laranja fora do sistema.
- Usar `feedback-*` em vez de `status-*`: feedback é para banner e mensagem,
  status é para registro.
- Pílula sem rótulo, só com a cor.
- Caixa alta digitada ("CANCELADO"). O estilo já é `label-sm`; se quiser caixa
  alta, é CSS.
