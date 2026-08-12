# QR Journey — Plano de Entrega do MVP

> Sequenciamento derivado das prioridades técnicas (§49) e rastreado contra os
> 22 critérios de aceite (§48) da [especificação](01-especificacao-produto.md).
> Decisões de desenho em [02-arquitetura-tecnica.md](02-arquitetura-tecnica.md).

---

## 1. Princípio de sequenciamento

A ordem não é por tela nem por perfil de usuário — é por **risco**. O núcleo criptográfico
(§3 da arquitetura) é a única parte do sistema que, se estiver errada, invalida tudo que for
construído em cima e só se descobre em campo, no dia do evento, com o cliente olhando.
Por isso ele vem primeiro e sozinho, antes de qualquer interface.

O segundo critério é o **caminho de demonstração**: ao fim do sprint 3 já deve existir uma
jornada real percorrível de ponta a ponta, ainda que sem admin, sem branding e sem dashboard.
Isso permite testar em campo cedo, que é onde o offline realmente se prova.

---

## 2. Sprints

### Sprint 1 — Núcleo criptográfico (sem UI)

Biblioteca isolada, com testes, sem nenhuma tela.

- Derivação `HKDF` de chave por estação; segredo mestre em KMS
- Emissão de token de estação (HMAC truncado, slot de 15 s)
- Codificação/decodificação base45 e empacotamento do QR de resgate
- Verificação server-side: tag, janela do evento, cobertura de estações obrigatórias
- `walk_fingerprint`
- Testes de propriedade obrigatórios: **tag forjado rejeitado; tag de outra estação rejeitado;
  tag de outro evento rejeitado; slot fora da janela rejeitado; cobertura incompleta rejeitada;
  segundo resgate da mesma sessão rejeitado sob concorrência**

*Critérios cobertos:* base para 5, 13, 14, 15.

### Sprint 2 — App da estação

- Provisionamento com código de uso único e captura de offset de relógio
- Rotação de QR a 15 s, 100% offline após provisionar
- Layout kiosk, tela cheia, resistente a navegação acidental
- URL exclusiva por estação
- Service Worker com cache de assets

*Critérios cobertos:* 4, 5, 21. *Parcial:* 3.

### Sprint 3 — PWA do visitante

- Sessão anônima (UUID) persistida em IndexedDB
- Welcome com identidade do evento, total de estações e o aviso de mesmo-dispositivo
- Check-in offline gravando o payload cru; tolerância de frescor de ±2 slots
- Tela de progresso (concluídas / restantes / lista)
- Conclusão + geração do QR de resgate
- `journey_started` separado de `journey_opened` para o cálculo de tempo

*Critérios cobertos:* 6, 7, 8, 9, 11, 12, 13, 22.

> **Marco de campo.** Ao fim deste sprint, percorrer uma jornada real de ponta a ponta com os
> dispositivos em modo avião. É o teste que mais informa o resto do projeto.

### Sprint 4 — Operador e resgate

- Login de operador vinculado a ponto de resgate
- Scanner in-app e verificação online
- As três respostas de §21 + o aviso de duplicata
- Registro do brinde entregue, com operador, ponto, data e hora
- Uso único garantido por unique constraint

*Critérios cobertos:* 14, 15, 16, 17.

### Sprint 5 — Sync, rollups e dashboard

- `POST /v1/sync` idempotente, com Background Sync e fallback por retry
- Reverificação de tags no sync
- Fila e consumidor de rollups
- Dashboard com os KPIs de §24.1 e os filtros de §25
- Exportação CSV e XLSX

*Critérios cobertos:* 10, 18, 19.

### Sprint 6 — Admin, white label, briefing e PDF

- Console do Super Admin: cliente, evento, estações, brindes, pontos, usuários
- Administrador do cliente com escopo reduzido
- Branding por evento (logo, cores, textos) aplicado às três PWAs
- Rodapé *Powered by QR Journey*
- Formulário de briefing + galeria de uploads, com publicação manual (§27.1)
- Relatório PDF renderizado dos agregados, não screenshot
- Captação opcional de leads via proxy de passagem, com o texto de política de não retenção
  no briefing e no aviso ao visitante

*Critérios cobertos:* 1, 2, 3, 19 (PDF), 20.

### Sprint 7 — Endurecimento para o piloto KaBuM!

- Teste de carga no perfil de §32
- Rate limiting, observabilidade, alertas
- Runbook de operação e roteiro de treinamento do operador
- Ensaio geral com hardware real, incluindo queda de internet proposital

---

## 3. Rastreabilidade dos critérios de aceite

| # | Critério (§48) | Sprint |
| --- | --- | --- |
| 1 | Super Admin cria cliente e evento | 6 |
| 2 | Evento recebe identidade visual | 6 |
| 3 | Super Admin cria estações | 2 / 6 |
| 4 | Cada estação com URL própria | 2 |
| 5 | Cada estação gera QR dinâmico | 1 / 2 |
| 6 | Visitante inicia jornada anônima | 3 |
| 7 | Visitante faz check-in | 3 |
| 8 | Progresso sobrevive a refresh/fechamento | 3 |
| 9 | Jornada continua offline | 3 |
| 10 | Check-ins offline sincronizam depois | 5 |
| 11 | Jornada atravessa múltiplos dias | 3 |
| 12 | Visitante vê o progresso | 3 |
| 13 | Conclusão gera QR exclusivo | 1 / 3 |
| 14 | Operador valida o QR | 1 / 4 |
| 15 | Mesmo QR não resgata duas vezes | 1 / 4 |
| 16 | Operador registra o brinde | 4 |
| 17 | Registro de operador, ponto, data e hora | 4 |
| 18 | Dashboard exibe analytics | 5 |
| 19 | Exportação de dados | 5 (CSV/XLSX) / 6 (PDF) |
| 20 | Cliente envia briefing | 6 |
| 21 | Funciona em dispositivos comuns | 2 / 3 |
| 22 | Nenhum dado pessoal obrigatório | 3 |

Todos os 22 critérios estão cobertos.

---

## 4. Decisões de produto

### 4.1 Decidido

**Duplicata de caminhada: `avisar`** (arquitetura §3.6). Quando o percurso de uma jornada
coincide com o de um resgate já feito, o operador vê o alerta e decide entre entregar mesmo
assim ou recusar. Não bloqueia automaticamente.

Razão: dos dois erros possíveis, entregar um brinde a mais é barato e recusar um cliente
legítimo na frente da fila é caro — e o operador tem contexto que o sistema não tem. As duas
saídas são registradas, para que a política possa ser endurecida em eventos futuros com base
no volume real de duplicatas.

Implica: quarta resposta na interface do operador (Sprint 4) e as colunas `duplicate_flag` e
`operator_decision` em `redemption`.

**Limiar de sessões por slot: 25**, configurável por estação e alterável durante o evento
(arquitetura §3.6). Dispara apenas um alerta operacional no dashboard — não recusa check-in nem
afeta resgate.

Razão: uma fila cheia produz de 5 a 15 sessões no mesmo slot e um código vazado produz centenas,
então qualquer limiar entre 15 e 40 detecta os mesmos eventos. A configurabilidade por estação
cobre a diferença entre uma TV num corredor e um tablet num balcão.

Revisão programada: após o primeiro dia do piloto, trocar por regra proporcional — acima de 8× a
mediana de ocupação de slot daquela estação.

**Stack: Cloudflare (Pages, Workers, KV, Queues) + Neon Postgres** (arquitetura §7.1).

Razão decisiva: Workers expõe a mesma Web Crypto API do navegador, então a biblioteca
criptográfica roda com código idêntico na estação, no visitante e no verificador — eliminando a
divergência entre implementações, que é o defeito que não aparece em teste e aparece no evento.
Neon em vez de D1 porque o isolamento multi-tenant depende de Row Level Security.

Custo até o evento: zero. Nenhuma contratação é necessária para os Sprints 1 a 3.

**Falha no envio de lead: retentativa em memória com TTL curto, nada em disco** (arquitetura §6).
Se o destino do cliente não voltar dentro da janela, o lead se perde — e isso é apresentado ao
cliente na proposta como política do produto, não como incidente.

Razão: uma fila persistente de dez minutos bastaria para o QR Journey passar de canal de
passagem a tratador de dado pessoal, herdando obrigações de LGPD que hoje não tem. Posicionar
como diferencial — um fornecedor que não acumula base de dado pessoal é um fornecedor a menos na
superfície de risco do cliente.

Implica: texto de política no contrato e no formulário de briefing (Sprint 6).

### 4.2 Pendente

Nenhum destes bloqueia os Sprints 1 a 4:

1. **Domínio curto** para a URL das estações — cada caractere economizado vira alcance de leitura
   do QR. Previsto para registro na sexta-feira; não bloqueia nada. Desenvolvimento e teste de
   campo usam o subdomínio gratuito `*.pages.dev`, que produz um QR perfeitamente escaneável
   (~54 caracteres, versão 5). O prefixo da URL é **configuração por evento, nunca literal no
   código** — trocar o domínio depois é mudar um valor, não reconstruir nada.
2. **Repositório de implementação.** Este repo é um site estático no GitHub Pages e não comporta
   API, banco nem cofre de chaves. Sugestão: documentação permanece aqui, código vai para um
   monorepo novo com os três PWAs, a API e a biblioteca criptográfica compartilhada — sendo o
   compartilhamento dessa biblioteca a garantia de que emissor e verificador usam o mesmo código.
   Único item que precisa de resposta antes de escrever a primeira linha de código.
3. **Dados do piloto KaBuM!** — número de estações, duração, pontos de retirada, brindes,
   operadores, dispositivos de estação e se haverá captação de lead.

---

## 5. Fora deste plano

Todo o §47 da especificação permanece em roadmap. Dois itens merecem atenção especial por serem
frequentemente confundidos com escopo de MVP:

- **Ordem obrigatória de estações** — muda o modelo de validação (a prova passa a precisar
  carregar ordem, não só cobertura) e por isso não é ajuste de configuração; é trabalho de
  arquitetura.
- **Monitoramento online/offline das estações** — muito pedido em operação de evento, mas exige
  canal persistente com dispositivos que, por desenho, operam offline. Merece um desenho próprio.
