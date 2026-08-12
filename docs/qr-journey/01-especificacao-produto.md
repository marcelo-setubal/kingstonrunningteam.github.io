# QR Journey — Especificação de Produto e MVP

> Documento canônico de produto. Versão 1.0 — piloto KaBuM!.
> Decisões técnicas de implementação estão em [02-arquitetura-tecnica.md](02-arquitetura-tecnica.md).
> Recorte e sequenciamento de entrega estão em [03-plano-mvp.md](03-plano-mvp.md).

---

## 1. Visão Geral

**Nome provisório:** QR Journey

**Definição do produto:** plataforma white label para criação, gamificação e mensuração de jornadas presenciais em eventos e espaços físicos, com validação por QR Code dinâmico, operação offline-first e analytics em tempo real.

O QR Journey foi concebido inicialmente para uma ação piloto com o KaBuM!, mas deve nascer com arquitetura preparada para atender diferentes tipos de clientes e cenários:

- Eventos de games e tecnologia
- Feiras e exposições
- Shopping centers
- Convenções
- Ativações de marca
- Experiências de varejo
- Eventos corporativos
- Jornadas gamificadas distribuídas entre diferentes estandes, lojas ou pontos físicos

A plataforma deve permitir que um visitante percorra uma jornada física, valide sua passagem por diferentes estações por meio de QR Codes dinâmicos, acompanhe seu progresso, conclua a jornada e, quando aplicável, resgate um brinde.

O sistema também deve fornecer analytics detalhado para o contratante, sem depender de cadastro do visitante por padrão.

---

## 2. Objetivo do MVP

O primeiro MVP será utilizado em uma ação do KaBuM!. Nesse piloto:

- Haverá uma jornada com múltiplas estações
- Cada estação estará associada a um produto físico ou atração
- A jornada poderá ser realizada em qualquer ordem
- O visitante não precisará se cadastrar
- O visitante utilizará o próprio celular
- Cada estação exibirá um QR Code dinâmico
- O QR Code deverá mudar periodicamente para reduzir fraudes por compartilhamento de fotos
- O visitante acompanhará o progresso da jornada no navegador
- Ao concluir todas as estações, receberá uma confirmação de conclusão e um QR Code exclusivo de resgate
- O resgate deverá ser validado por um operador autenticado
- Após o resgate, o QR Code deverá ser invalidado definitivamente
- Os dados de jornada serão usados para analytics em tempo real sempre que houver conectividade

---

## 3. Conceitos Principais

### 3.1 Cliente

Empresa ou organização contratante do QR Journey. Um cliente pode possuir múltiplos eventos ou campanhas simultâneas.

> **Exemplo:** um grupo de shopping centers pode possuir vários shoppings e diferentes campanhas acontecendo ao mesmo tempo.

Cada evento/campanha deve ser logicamente isolado.

### 3.2 Evento

Unidade principal de execução de uma jornada. Cada evento possui: nome, período de início e término, identidade visual, conteúdo, jornada, estações, pontos de resgate, configurações e analytics próprios.

Para simplificar o produto, no MVP deve ser assumido: **1 evento = 1 jornada**. Caso um cliente necessite de duas jornadas independentes, elas devem ser tratadas como dois eventos separados.

### 3.3 Jornada

Conjunto de estações que o visitante precisa validar.

**No MVP:**

- A ordem é livre
- Não haverá limite técnico explícito de estações
- O produto deve ser arquitetado para comportar jornadas maiores
- Como referência de negócio, uma jornada típica provavelmente terá até aproximadamente 20 estações

**No roadmap:**

- Deve existir possibilidade de jornada com ordem obrigatória
- O cliente poderá futuramente determinar rotas ou sequências específicas

> **Exemplo:** em um shopping, uma campanha pode exigir que o visitante passe por lojas específicas em uma determinada ordem.

### 3.4 Estação

Ponto físico onde o visitante realiza um check-in. Cada estação deve possuir: ID único, nome, descrição, imagem opcional, conteúdo configurável, URL exclusiva, QR Code dinâmico e associação ao evento.

A estação pode ser exibida em tablet, notebook, desktop, TV com navegador, smartphone ou qualquer dispositivo capaz de executar um navegador moderno.

---

## 4. Arquitetura Multi-Tenant

O QR Journey deve nascer como plataforma multi-tenant. Cada cliente deve possuir isolamento lógico de eventos, jornadas, estações, usuários, conteúdo, pontos de resgate e analytics.

```text
QR Journey
├── Cliente A
│   ├── Evento 1
│   │   ├── Jornada
│   │   ├── Estações
│   │   ├── Pontos de resgate
│   │   └── Analytics
│   └── Evento 2
│
└── Cliente B
    └── Evento 1
```

---

## 5. Perfis de Acesso

### 5.1 Super Admin

Administrador global do QR Journey. Responsável por criar clientes, criar eventos, criar jornadas, configurar white label, realizar setup de eventos, administrar usuários, acessar todos os analytics, administrar estações, administrar pontos de retirada e administrar configurações globais.

No MVP, o Super Admin será responsável pela maior parte do setup.

### 5.2 Administrador do Cliente

Usuário do contratante. Pode visualizar eventos próprios, acessar analytics, criar e editar estações, criar e editar brindes, criar e editar pontos de resgate, consultar dados operacionais permitidos e administrar elementos habilitados para o cliente.

Clientes e eventos continuam sendo inicialmente criados pelo Super Admin.

### 5.3 Operador de Resgate

Usuário responsável pela entrega de brindes. Pode fazer login, acessar interface simplificada de resgate, escanear QR Code do visitante, validar conclusão da jornada e registrar entrega de brinde.

O sistema deverá registrar: operador responsável, ponto de resgate, data, horário e brinde entregue.

---

## 6. White Label

O produto deve ser white label desde o início. Cada evento poderá customizar logo, cores, imagens, textos e copy da experiência.

No MVP, a configuração será realizada pelo Super Admin. O cliente não precisa possuir editor visual completo.

Deve existir discretamente no rodapé: **Powered by QR Journey**. O texto pode futuramente apontar para uma página institucional do produto.

---

## 7. Jornada do Visitante

### 7.1 Entrada

O visitante é impactado por uma comunicação física ou digital — banner, TV, display, totem, comunicação de estande. A comunicação contém um QR Code de entrada.

Ao escanear:

1. O navegador abre a aplicação web
2. O sistema cria um identificador anônimo da sessão
3. O identificador é persistido localmente
4. O visitante recebe uma tela de boas-vindas

### 7.2 Welcome

A tela deve apresentar: identidade visual do evento, nome da jornada, texto curto explicativo, quantidade total de estações, instrução sobre como participar e aviso de que a jornada deve ser concluída no mesmo dispositivo/navegador.

O visitante poderá fechar ou atualizar a página sem perder o progresso. A persistência deve utilizar armazenamento local do navegador. Não utilizar endereço IP como identificador principal.

---

## 8. Identificação Anônima

Por padrão, nenhuma informação pessoal é necessária. O sistema deverá criar um identificador aleatório e anônimo para a sessão.

```text
session_id = UUID aleatório
```

Esse identificador poderá ser persistido usando IndexedDB, LocalStorage ou outra solução equivalente definida na implementação.

O sistema **não** deve depender de nome, e-mail, telefone, CPF ou IP para identificação.

| Ação do visitante | Efeito na jornada |
| --- | --- |
| Atualizar a página | Jornada preservada |
| Fechar e reabrir o navegador | Jornada preservada |
| Limpar os dados do navegador | Jornada pode ser perdida |
| Utilizar outro navegador | Jornada pode ser perdida |
| Trocar de dispositivo | Jornada pode ser perdida |

Essa limitação deve ser explicada no welcome.

---

## 9. Captação Opcional de Leads

Por padrão, nenhum dado pessoal é coletado. Entretanto, o cliente poderá solicitar captação de leads. Quando habilitado:

1. O visitante escaneia o QR inicial
2. Um formulário aparece antes da jornada
3. O visitante preenche os dados solicitados
4. Os dados são enviados ao destino definido pelo cliente
5. A jornada é iniciada

### 9.1 Regra de Privacidade

O QR Journey deve ser projetado para **não armazenar** dados pessoais de leads. Os dados devem ser transmitidos diretamente para um destino definido pelo cliente.

Possíveis destinos futuros: webhook, API, CRM, plataforma de automação, endpoint proprietário do cliente.

Não deve existir uma integração obrigatória no MVP. Cada cliente poderá exigir uma integração específica. A arquitetura deve permitir adaptação por conectores.

---

## 10. QR Code Dinâmico

Cada estação deverá exibir um QR Code dinâmico, para reduzir fraudes por fotografia, compartilhamento via WhatsApp, captura de tela e distribuição do código entre participantes.

### 10.1 Tempo de Rotação

Padrão inicial: **15 segundos**. A arquitetura pode permitir configuração futura do intervalo, ainda que isso não seja obrigatoriamente exposto ao cliente no MVP.

### 10.2 Token

O QR Code deverá carregar um token verificável. Idealmente, o token deve ser temporário, assinado criptograficamente, vinculado à estação, vinculado ao evento e verificável mesmo quando o visitante estiver offline.

O token pode conter conceitualmente:

```text
event_id
station_id
issued_at
expires_at
nonce
signature
```

A implementação exata fica a cargo da arquitetura técnica.

---

## 11. Operação Offline-First

O sistema deve ser desenhado como offline-first. Isso é requisito central, especialmente para grandes eventos.

### 11.1 Estação Offline

O dispositivo da estação deve continuar exibindo QR Codes mesmo sem internet. A aplicação deve possuir os recursos necessários localmente para continuar operando.

Possível implementação: PWA, Service Worker, cache de assets, geração local de token quando aplicável.

### 11.2 Visitante Offline

O visitante poderá continuar realizando check-ins sem conexão. As validações devem ser armazenadas localmente. Quando a conexão retornar, os dados devem ser sincronizados automaticamente.

### 11.3 Analytics e Offline

Check-ins offline não aparecerão imediatamente no dashboard. Eles passam a integrar o analytics quando forem sincronizados. Portanto:

> Analytics = tempo real quando houver conectividade + sincronização posterior de eventos offline.

---

## 12. Duração da Jornada

A jornada permanece válida durante todo o período do evento. Não deve ocorrer reset automático à meia-noite.

> **Exemplo:** um visitante de uma feira de cinco dias poderá fazer 2 estações na quinta, 3 na sexta e finalizar no sábado. A sessão permanece válida até o encerramento do evento.

Uma jornada não concluída será considerada abandonada apenas após o encerramento do evento.

---

## 13. Progresso da Jornada

Durante a experiência o visitante deverá visualizar o total de estações, a quantidade concluída, a quantidade restante e a identificação visual das estações concluídas.

```text
Jornada Gamer

6 de 10 estações concluídas

✓ Estação 1
✓ Estação 2
✓ Estação 3
✓ Estação 4
✓ Estação 5
✓ Estação 6

Faltam 4
```

No MVP não é necessário mapa, GPS, navegação ou orientação de localização.

---

## 14. Ordem das Estações

**MVP:** ordem livre. O visitante pode realizar as estações na sequência que desejar.

**Roadmap:** criar opção de ordem obrigatória, rotas, sequências e dependências entre estações.

---

## 15. Conclusão da Jornada

A jornada é concluída quando todas as estações obrigatórias forem validadas. A tela deverá apresentar animação, mensagem de parabéns, identidade visual do evento, informação de conclusão e QR Code exclusivo de resgate.

```text
Parabéns!

Você concluiu a Jornada Gamer.

Dirija-se a um ponto de retirada para resgatar seu brinde.
```

---

## 16. Tempo da Jornada

O tempo deve começar a ser contado quando o visitante efetivamente iniciar a jornada. O tempo **não** deve incluir welcome, leitura de instruções ou formulário opcional de lead.

- **Início:** `start_journey`
- **Fim:** última estação validada

O tempo será calculado apenas para jornadas concluídas.

---

## 17. Resgate de Brinde

Após concluir a jornada, o visitante recebe um QR Code exclusivo de resgate. Esse QR deve representar uma jornada concluída, ser único, ser verificável pelo operador e tornar-se inválido após o primeiro resgate.

---

## 18. Validação Offline da Conclusão

A jornada poderá ser concluída totalmente offline. Não deve ser obrigatório forçar uma sincronização antes de liberar o resgate.

O dispositivo do visitante deve conseguir gerar uma comprovação segura de conclusão. O dispositivo online do operador deverá ser capaz de validar essa comprovação. A arquitetura deve utilizar mecanismos criptográficos adequados para evitar falsificação.

---

## 19. Pontos de Resgate

Um evento poderá possuir múltiplos pontos de retirada.

> **Exemplo em uma feira:** Stand NVIDIA, Stand KaBuM!, Área central, Lounge VIP.

Cada operador deve estar associado a um ponto de retirada.

---

## 20. Requisito de Internet no Resgate

O ponto de resgate é o único componente onde conexão com internet deve ser considerada requisito operacional obrigatório.

**Motivo:** validar conclusão, verificar se o QR já foi utilizado, evitar resgate duplicado, registrar entrega e sincronizar analytics.

---

## 21. Interface do Operador

A interface deve ser extremamente simples.

1. Operador faz login
2. Abre scanner
3. Escaneia QR do visitante
4. Sistema valida
5. Exibe uma das respostas:

```text
Jornada concluída
Resgate autorizado
```

```text
Jornada inválida ou incompleta
```

```text
Brinde já resgatado
```

Após validação, o operador entrega o brinde, seleciona qual brinde foi entregue e confirma a entrega.

---

## 22. Brindes

O sistema **não** controlará estoque no MVP. O cliente poderá possuir um brinde, vários brindes ou brindes diferentes por ponto de retirada.

A decisão de qual brinde entregar poderá ser operacional.

> **Exemplo:** o visitante chega ao balcão e escolhe entre três opções físicas.

O sistema precisa apenas registrar qual brinde foi entregue.

---

## 23. Registro do Resgate

Cada resgate deverá registrar:

```text
redemption_id
event_id
anonymous_session_id
reward_id
operator_id
redemption_point_id
timestamp
```

Após confirmação: `redemption_status = redeemed`. A mesma conclusão não poderá ser resgatada novamente.

---

## 24. Analytics

O cliente deve possuir dashboard de analytics em tempo real. Os dados devem ser anônimos.

### 24.1 KPIs Principais

**Participação** — pessoas que iniciaram a jornada; pessoas que concluíram; pessoas que não concluíram; taxa de conclusão.

**Estações** — total de check-ins; estações mais visitadas; estações menos visitadas; quantidade de visitas por estação.

**Tempo** — tempo de conclusão de cada jornada concluída; tempo médio de conclusão; distribuição dos tempos quando aplicável.

**Horários** — participações por horário; horário de pico; evolução ao longo do dia.

**Dias** — participações por dia; conclusões por dia; dia com maior movimento.

**Brindes** — quantidade de brindes entregues; brindes mais entregues; distribuição por tipo de brinde.

**Pontos de Resgate** — quantidade de resgates por ponto; ponto que mais entregou brindes.

---

## 25. Filtros do Analytics

O dashboard deve permitir filtros por evento, data, dia, intervalo de horário, estação, ponto de resgate e tipo de brinde.

---

## 26. Exportações

O cliente poderá exportar dados em CSV, XLSX e PDF.

### 26.1 PDF

O PDF não deve ser apenas screenshot da tela. Deve ser um relatório formatado contendo KPIs, gráficos, período, filtros selecionados, identidade visual do evento e informações principais da campanha.

---

## 27. Formulário de Briefing / Onboarding

O MVP deve possuir uma interface de briefing, para permitir que o cliente envie todas as informações necessárias para o setup.

Campos podem incluir: nome do evento, cliente, data inicial, data final, local, logo, cores, imagens, textos, copy, lista de estações, produtos, brindes, pontos de retirada, usuários e observações.

Os uploads devem ficar disponíveis em uma galeria para o Super Admin.

### 27.1 Regra Importante

O envio do briefing **não** publica o evento automaticamente.

```text
Cliente envia briefing
        ↓
Super Admin recebe
        ↓
Super Admin revisa
        ↓
Super Admin configura
        ↓
Super Admin publica
```

---

## 28. Dispositivos das Estações

Cada estação terá uma URL exclusiva:

```text
https://qrjourney.com/e/event-id/station/station-id
```

Ao abrir essa URL, o dispositivo deve exibir identidade visual, informações da estação, conteúdo e QR Code dinâmico.

---

## 29. Modo Kiosk

A experiência da estação deve ser otimizada para tela cheia, kiosk mode, operação contínua e para evitar navegação acidental.

A aplicação não precisa necessariamente controlar o modo kiosk do sistema operacional, mas deve possuir interface adequada para isso.

---

## 30. Hardware

Hardware faz parte da solução comercial. Podem ser utilizados tablets, notebooks, desktops, TVs e smartphones. A plataforma deve ser independente de sistema operacional.

**Requisito:** navegador moderno.

---

## 31. Locação de Equipamentos

A locação de equipamentos será comercializada separadamente da licença do QR Journey. Possíveis itens: tablets, suportes, totens, monitores e outros dispositivos.

---

## 32. Escala de Referência

A arquitetura deverá ser pensada desde o MVP para suportar como referência:

```text
50.000 participantes por evento
5.000 usuários simultâneos
```

Esses números são referência arquitetural e não representam necessariamente limites comerciais.

---

## 33. Estratégia de Infraestrutura

Não assumir que hospedagem compartilhada será suficiente para grandes eventos. A arquitetura deve permitir migração ou utilização de infraestrutura escalável.

Possíveis elementos: frontend em CDN, backend stateless, banco escalável, cache, filas, processamento assíncrono, observabilidade e rate limiting.

A escolha de tecnologias deverá equilibrar baixo custo, simplicidade, escalabilidade, resiliência e segurança.

---

## 34. Geração de QR Code

A geração dos QR Codes deve ser realizada pela própria aplicação. Não utilizar obrigatoriamente APIs pagas de QR Code. A geração pode utilizar bibliotecas open source.

Portanto: **não deve existir custo unitário por QR Code.**

---

## 35. Modelo de Custos

O sistema deve permitir acompanhar custos de infraestrutura.

- **Fixos** — domínio; infraestrutura mínima; serviços básicos
- **Variáveis** — banco de dados; requisições; processamento; CDN; tráfego; armazenamento; observabilidade
- **Opcionais** — integrações; e-mail; SMS; serviços externos

---

## 36. Modelo Comercial

O QR Journey será comercializado por evento. A precificação exata será definida posteriormente. A intenção é trabalhar com faixas baseadas no porte do evento:

```text
Small
Medium
Large
Enterprise
```

Possíveis critérios: participantes esperados, número de estações, duração do evento, volume de acessos, complexidade, suporte e hardware.

A locação de equipamentos será cobrada separadamente.

---

## 37. Privacidade e LGPD

O sistema deve ser concebido com princípios de **Privacy by Design**.

Por padrão: sem cadastro, sem nome, sem e-mail, sem telefone, sem CPF, sem necessidade de identificar a pessoa.

Analytics devem usar apenas identificadores anônimos.

Quando houver captação de leads: deve existir informação clara ao visitante; os dados devem ser enviados diretamente ao destino do cliente; o QR Journey não deve persistir esses dados.

---

## 38. Segurança

O sistema deve utilizar HTTPS, tokens assinados, proteção contra replay, validação de eventos, validação de estações, expiração de tokens, controle de acesso, logs, rate limiting, proteção contra manipulação de QR e proteção contra resgate duplicado.

---

## 39. Antifraude do MVP

O nível de antifraude inicial pode ser moderado.

**Principal mecanismo:** QR Code dinâmico com rotação de aproximadamente 15 segundos. Isso reduz compartilhamento de foto, prints e envio via mensageria.

O resgate possui uma camada adicional: QR exclusivo de conclusão, validação online e uso único.

---

## 40. PWA

A aplicação do visitante deve preferencialmente ser construída como PWA, para funcionar no navegador, não exigir instalação, cachear assets, funcionar offline, persistir jornada e sincronizar posteriormente.

---

## 41. Eventos de Analytics

Sugestão de eventos internos:

```text
journey_opened
journey_started
station_scanned
station_validated
station_rejected
journey_completed
redemption_generated
redemption_scanned
reward_redeemed
sync_completed
```

Cada evento deve registrar apenas informações necessárias.

---

## 42. Modelo de Dados Conceitual

Entidades principais:

```text
Tenant
User
Event
Journey
Station
AnonymousSession
StationCheckin
Reward
RedemptionPoint
Redemption
Branding
ClientBriefing
AnalyticsEvent
Integration
```

---

## 43. Estados da Sessão

```text
CREATED
STARTED
IN_PROGRESS
COMPLETED
REDEEMED
EXPIRED
```

---

## 44. Estados do Evento

```text
DRAFT
READY
ACTIVE
FINISHED
ARCHIVED
```

---

## 45. Estados do Resgate

```text
AVAILABLE
REDEEMED
INVALID
EXPIRED
```

---

## 46. MVP — Dentro do Escopo

Multi-tenant; Super Admin; Administrador do cliente; Operador de resgate; Eventos; Jornada; Estações; URL exclusiva por estação; QR Code dinâmico; Rotação de 15 segundos; Identificação anônima; Persistência local; Offline-first; Check-ins offline; Sincronização posterior; Progresso da jornada; Conclusão; QR de resgate; Validação de resgate; Uso único do QR; Múltiplos pontos de resgate; Registro de brindes; White label; Analytics em tempo real; Exportação CSV; Exportação XLSX; Relatório PDF; Briefing do cliente; Modo kiosk; Funcionamento multiplataforma; Captação opcional de leads; Arquitetura de integração externa.

---

## 47. Fora do MVP / Roadmap

**Jornada** — ordem obrigatória; rotas; dependência entre estações; mapa; navegação; geolocalização.

**Estações** — monitoramento online/offline; controle remoto; desativação remota; troca de conteúdo em tempo real.

**Cliente** — editor completo de white label; auto-publicação; gestão avançada de eventos.

**Integrações** — conectores nativos para CRMs; HubSpot; Salesforce; RD Station; outros.

**Analytics** — relatórios avançados; comparação entre eventos; benchmark histórico; heatmaps; funis avançados.

**Comercial** — planos automáticos; billing; cobrança online; gestão de franquias/licenças.

---

## 48. Critérios de Aceite do MVP

O MVP poderá ser considerado funcional quando:

| # | Critério |
| --- | --- |
| 1 | O Super Admin conseguir criar um cliente e um evento |
| 2 | O evento puder receber identidade visual |
| 3 | O Super Admin puder criar estações |
| 4 | Cada estação possuir URL própria |
| 5 | Cada estação gerar QR Code dinâmico |
| 6 | O visitante conseguir iniciar uma jornada anônima |
| 7 | O visitante conseguir fazer check-in em estações |
| 8 | O progresso permanecer ao atualizar ou fechar o navegador |
| 9 | O visitante conseguir continuar a jornada offline |
| 10 | Check-ins offline sincronizarem posteriormente |
| 11 | A jornada puder atravessar múltiplos dias |
| 12 | O visitante visualizar o progresso |
| 13 | A conclusão gerar QR exclusivo |
| 14 | O operador conseguir validar o QR |
| 15 | O mesmo QR não puder ser resgatado duas vezes |
| 16 | O operador registrar o brinde entregue |
| 17 | O sistema registrar operador, ponto, data e hora |
| 18 | O dashboard exibir analytics |
| 19 | Os dados puderem ser exportados |
| 20 | O cliente conseguir enviar briefing |
| 21 | O sistema funcionar em dispositivos comuns via navegador |
| 22 | Nenhum dado pessoal ser obrigatório para participar |

---

## 49. Prioridades Técnicas

1. Confiabilidade da jornada
2. Operação offline
3. Antifraude suficiente para o contexto
4. Experiência extremamente simples para o visitante
5. Analytics confiável
6. White label
7. Escalabilidade

---

## 50. Princípios de Produto

**Zero friction** — o visitante não deve precisar instalar aplicativo.

**Anonymous by default** — participação sem cadastro.

**Offline-first** — a experiência deve continuar funcionando mesmo com internet ruim.

**White label** — o cliente deve sentir que a experiência pertence à sua marca.

**Measurable** — toda interação relevante deve gerar dados úteis.

**Simple operation** — operadores precisam aprender a utilizar a ferramenta rapidamente.

**Scalable** — a mesma plataforma deve servir tanto para uma loja com dezenas de participantes quanto para eventos com dezenas de milhares.

---

## 51. Pergunta Técnica Central para Implementação

A implementação deve priorizar uma arquitetura que permita:

> Validar de maneira segura e offline a passagem do visitante pelas estações e gerar uma prova de conclusão que possa posteriormente ser validada online no ponto de resgate.

Essa é uma das decisões técnicas mais importantes do produto. A solução deve evitar confiar apenas em dados facilmente manipuláveis no navegador. Tokens, assinaturas digitais e mecanismos de prevenção de replay devem ser considerados.

→ **Resposta de engenharia:** [02-arquitetura-tecnica.md § 3 — Prova de passagem e prova de conclusão](02-arquitetura-tecnica.md#3-prova-de-passagem-e-prova-de-conclusão).

---

## 52. Resultado Esperado

O produto final deve permitir que uma empresa transforme um espaço físico em uma jornada gamificada mensurável.

O QR Journey não deve ser entendido simplesmente como um sistema de QR Codes. Ele deve ser entendido como uma **plataforma de jornadas presenciais gamificadas, mensuração de comportamento e analytics para eventos e espaços físicos**.

O QR Code é apenas o mecanismo de interação entre o mundo físico e a jornada digital.
