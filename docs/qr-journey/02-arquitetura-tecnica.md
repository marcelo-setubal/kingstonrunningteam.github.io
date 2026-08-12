# QR Journey — Arquitetura Técnica

> Documento de engenharia derivado da [especificação de produto](01-especificacao-produto.md).
> Foco principal: responder a **§51 — Pergunta Técnica Central**, e a partir dela definir
> modelo de dados, protocolo de sincronização, escala e custos.

---

## 1. Restrições que determinam o desenho

Cinco restrições da spec, juntas, eliminam a maior parte das arquiteturas óbvias:

| # | Restrição | Origem | Consequência |
| --- | --- | --- | --- |
| R1 | Visitante sem cadastro, identificado só por UUID local | §8, §37 | O `session_id` **não é uma credencial**. Qualquer um pode gerar quantos quiser. |
| R2 | Check-in tem de funcionar offline | §11.2 | O servidor não participa do check-in. Não há como ele testemunhar a passagem em tempo real. |
| R3 | A conclusão pode acontecer 100% offline e não pode exigir sync antes do resgate | §18 | O dispositivo do visitante precisa **carregar** a prova, não apenas afirmar que concluiu. |
| R4 | Estação também pode estar offline | §11.1 | A estação precisa emitir tokens sozinha → precisa de segredo local ou lote pré-assinado. |
| R5 | O navegador do visitante é hostil | §51 | `IndexedDB` é editável pelo dono do dispositivo. **Nada** que o cliente escreva sozinho pode valer como prova. |

A conclusão que amarra tudo:

> A prova de conclusão precisa ser composta **exclusivamente de dados que só as estações
> poderiam ter produzido**, e precisa viajar dentro do próprio QR de resgate — porque no
> momento do resgate o servidor pode nunca ter visto aquela sessão antes.

O dispositivo do visitante é, portanto, apenas um **carregador de evidências**. Ele não
certifica nada.

---

## 2. Visão geral dos componentes

```text
┌──────────────────────────────────────────────────────────────────┐
│  CDN (assets estáticos, 3 PWAs)                                  │
│    /j   app do visitante      /s   app da estação                │
│    /op  app do operador       /admin  console + briefing         │
└──────────────────────────────────────────────────────────────────┘
                │                  │                    │
       (só sync/analytics)   (só provisioning)    (online obrigatório)
                │                  │                    │
┌──────────────────────────────────────────────────────────────────┐
│  API stateless (edge functions / container)                      │
│   /v1/sync  /v1/redeem  /v1/station/provision  /v1/admin/*       │
└──────────────────────────────────────────────────────────────────┘
        │                    │                       │
   ┌────────┐          ┌──────────┐            ┌───────────┐
   │Postgres│          │ KV/cache │            │ KMS/secret│
   │ (RLS)  │          │ (config) │            │  master   │
   └────────┘          └──────────┘            └───────────┘
        │
   ┌────────┐     ┌──────────────────────┐
   │ Fila   │ ──▶ │ Rollups de analytics │
   └────────┘     └──────────────────────┘
```

Ponto não óbvio e economicamente decisivo: **o check-in não gera tráfego**. O caminho
crítico da experiência (escanear → validar → progredir) roda inteiro no dispositivo. A rede
só é usada para carregar o app uma vez, sincronizar em lote e resgatar. Isso é o que torna
50.000 participantes baratos (ver §7).

---

## 3. Prova de passagem e prova de conclusão

### 3.1 Chaves por estação

Existe um **segredo mestre por evento**, guardado em KMS e nunca exportado. A chave de cada
estação é derivada:

```text
K_station = HKDF-SHA256(master_secret_evento, info = event_id ‖ station_id)
```

Consequências:

- O banco não precisa guardar chave de estação nenhuma — o servidor rederiva quando precisa verificar.
- Comprometer uma estação compromete **apenas aquela estação, naquele evento**.
- Rotacionar = trocar o segredo mestre do evento (invalida tokens antigos; usar só entre eventos).

**Provisionamento.** O app da estação abre a URL exclusiva (§28) **uma vez com internet**, a
equipe digita um código de provisionamento de uso único gerado pelo Super Admin, e o
dispositivo recebe `K_station` + config + assets, guardando tudo localmente. A partir daí
opera offline indefinidamente. O console mostra quantos dispositivos foram provisionados por
estação — mais dispositivos que o esperado é sinal de vazamento.

### 3.2 Token da estação (o QR que rotaciona)

A estação calcula, a cada 15 s, sem rede:

```text
slot  = floor((agora - inicio_do_evento) / 15)          // uint16 → cobre 11 dias
tag   = HMAC-SHA256(K_station, event_id ‖ station_id ‖ slot)[0..7]   // 8 bytes

payload = event_id(4) ‖ station_idx(1) ‖ slot(2) ‖ tag(8)   = 15 bytes
```

O QR exibido codifica uma **URL curta com o payload no fragmento**:

```text
https://j.qrjy.co/s#<base45(payload)>      20 + 23 = 43 caracteres
```

Codificado com segmentos mistos (byte para o prefixo, alfanumérico para o payload — base45 usa
exatamente o alfabeto alfanumérico do QR, é para isso que ele existe), isso dá ~312 bits e cabe
em um QR **versão 3–4 (29×29 a 33×33)**. Vale notar que o `#` e as minúsculas do domínio
impedem o símbolo inteiro de ser alfanumérico; daí a segmentação mista, que qualquer encoder
open source decente faz sozinho.

Três decisões dentro dessa linha:

- **Fragmento (`#`), não query string.** O fragmento nunca é enviado ao servidor: não entra em
  log de acesso, não entra em cache de CDN, e — o que mais importa — a página é servida pelo
  Service Worker a partir do cache, então **o scan funciona com o visitante offline**.
- **base45**, não base64. QR codifica alfanumérico a 5,5 bits/caractere e byte a 8; base45 rende
  ~8,6 bits por byte útil contra ~10,6 do base64url, e evita o risco de mangling UTF-8 que o
  modo byte cru sofre em scanners web. É a mesma escolha do certificado COVID europeu, pelo
  mesmo motivo.
- **QR pequeno importa.** ~30×30 módulos escaneia à distância e em ângulo ruim; um QR dessa
  ordem é lido em fração de segundo, e é isso que torna a janela de 15 s praticável. Vale
  contratar um domínio curto só para essa URL: cada caractere economizado aqui vira alcance de
  leitura.

Custo de CPU: um HMAC a cada 15 s. Web Crypto faz isso nativamente. Um tablet de entrada roda
isso por dias.

### 3.3 Check-in (offline, no dispositivo do visitante)

O visitante escaneia com a câmera nativa → abre `/s#payload` → o Service Worker serve o app do
visitante → o app:

1. Decodifica o payload e confere `event_id`.
2. Confere frescor: `|slot_do_token − slot_local|` ≤ 2 (30 s de tolerância, ver §3.7 sobre relógio).
3. Grava em IndexedDB o **payload cru**, não um booleano "visitou".
4. Atualiza o progresso na tela e enfileira para sync.

O passo 3 é o ponto inteiro. O estado local é cache de UI; a evidência é o token opaco que só a
estação poderia ter emitido. Se o visitante editar o IndexedDB e marcar 20 estações como
concluídas, ele consegue enganar a própria tela de progresso — e **falha no resgate**, porque
não tem os tags.

### 3.4 QR de resgate (a prova de conclusão)

Ao completar todas as estações obrigatórias, o app monta:

```text
session_id(16) ‖ event_id(4) ‖ n(1) ‖ { station_idx(1) ‖ slot(2) ‖ tag(8) } × n
```

Esse QR é lido pelo scanner **dentro do app do operador**, não pela câmera nativa — logo não
precisa ser uma URL, e vai como base45 puro em modo alfanumérico, que é o modo mais denso do QR:

| Estações | Bytes | base45 | Versão do QR (ECC M) |
| --- | --- | --- | --- |
| 10 | 131 | 197 ch. | v8 (49×49) |
| 20 | 241 | 362 ch. | v11 (61×61) |
| 40 | 461 | 692 ch. | v17 (85×85) |
| 60 | 681 | 1022 ch. | v21 (101×101) |

Confortável até ~40 estações na tela de um celular. A jornada típica de 20 (§3.3 da spec) cabe
com folga, em um QR de 61×61. Para jornadas maiores existe uma alavanca simples: truncar o tag
para 6 bytes leva 20 estações a 201 bytes (v10) e 60 estações a v19, mantendo a probabilidade de
forja em 2⁻⁴⁸ por tentativa — irrelevante sob rate limiting. **Limite honesto: acima de ~60
estações o QR fica denso demais para tela de celular com brilho e sujeira reais, e a jornada
precisa exigir sync antes do resgate.**

### 3.5 Validação no ponto de resgate (online)

O operador escaneia. O servidor, que é o único que pode rederivar as chaves:

1. Rederiva `K_station` de cada estação citada e **reverifica cada tag**. Um tag inválido invalida tudo.
2. Confere que todo `slot` cai dentro da janela do evento.
3. Confere que o conjunto de estações cobre todas as obrigatórias da jornada.
4. `INSERT` na tabela `redemption` com **unique(event_id, session_id)** — a atomicidade do banco é o que garante uso único (§17), não um flag no cliente.
5. Faz upsert dos check-ins que ainda não tinham sincronizado, para o analytics não perder a jornada.

Respostas mapeadas direto na interface de §21:

| Resultado | Tela do operador |
| --- | --- |
| Tags válidos, cobertura completa, insert OK | `Jornada concluída / Resgate autorizado` |
| Tag inválido, slot fora da janela ou cobertura incompleta | `Jornada inválida ou incompleta` |
| Violação da unique constraint | `Brinde já resgatado` |
| Fingerprint duplicado (§3.6) | `Possível duplicata — confirmar?` |

Nada disso depende de a sessão ter sido vista antes. É exatamente o requisito de §18.

### 3.6 O que isso resolve, o que não resolve, e o controle que fecha a lacuna

| Ataque | Status |
| --- | --- |
| Editar IndexedDB para forjar progresso | **Bloqueado.** Sem `K_station`, não há como produzir tag. |
| Reusar um token antigo do próprio visitante | **Irrelevante.** O slot prova que ele esteve lá naquele instante. |
| Fotografar o QR e mandar no WhatsApp | **Mitigado.** A janela de 15 s limita o alcance útil. |
| Uma pessoa percorre tudo e reparte os 20 tokens com amigos | **Não bloqueado pela criptografia.** Ver abaixo. |
| Resgatar duas vezes o mesmo QR | **Bloqueado.** Unique constraint. |
| Gerar `session_id` novo para resgatar de novo | **Mitigado** pelo fingerprint abaixo. |

O ataque de compartilhamento em massa é o limite estrutural: um token é um bearer token, e não
há como amarrá-lo à identidade de alguém que, por definição de produto (R1), não tem
identidade. Mas ele deixa uma assinatura estatística barata de detectar:

```text
walk_fingerprint = SHA256( pares (station_idx, slot) ordenados )
```

Duas sessões só colidem no fingerprint se escanearam **todas** as estações exatamente nos
mesmos slots de 15 s — isto é, se vieram da mesma caminhada física. Dois amigos andando juntos
de verdade raramente batem os 20 slots. Um lote repassado por mensageria bate todos.

A política é configuração por evento — `permitir` / `avisar` / `bloquear`. **Decidido para o
piloto KaBuM!: `avisar`.** O operador vê o alerta e decide, o que preserva o caso legítimo do
casal que andou lado a lado. O raciocínio: dos dois erros possíveis, entregar um brinde a mais
é barato, e recusar um cliente legítimo na frente da fila é caro. O operador enxerga se são
duas pessoas ali paradas — contexto que o sistema não tem.

Na interface do operador (§21), a duplicata é uma quarta resposta, com saída explícita:

```text
⚠  Possível duplicata
   Esta jornada tem o mesmo percurso de um resgate já feito.
   [ Entregar mesmo assim ]   [ Recusar ]
```

Ambas as saídas são registradas — `redemption.duplicate_flag` e a escolha do operador —
para que o analytics mostre o volume real de duplicatas e permita endurecer a política em
eventos futuros com base em dado, não em suposição.

Complementarmente, no sync, um `(station, slot)` reivindicado por um número anômalo de sessões
distintas é sinalizado no analytics como suspeita de vazamento daquela estação. **Decidido para
o piloto: limiar de 25 sessões distintas por slot**, configurável por estação e alterável
durante o evento.

O limiar é apenas um alerta operacional — não recusa check-in, não bloqueia jornada, não afeta
resgate:

```text
⚠  Estação 7 · 14h32
   312 sessões usaram o mesmo slot de 15 segundos.
   Provável vazamento — verificar a estação.
```

O valor exato é pouco sensível porque as duas distribuições não se sobrepõem: uma fila cheia
produz de 5 a 15 sessões por slot, e um código distribuído por mensageria produz centenas.
Qualquer limiar entre 15 e 40 detecta os mesmos eventos. A configurabilidade por estação
importa porque uma TV grande num corredor tem pico legítimo muito maior que um tablet num
balcão.

**Após o primeiro dia do piloto**, substituir a regra absoluta por uma proporcional — sugestão:
acima de 8× a mediana de ocupação de slot daquela estação — que se autoajusta a cada tipo de
estação em vez de impor um número único a todas.

Juntos, o fingerprint e o limiar entregam o "antifraude moderado" de §39 sem custo de latência
no caminho crítico.

### 3.7 Relógio

Há dois relógios não confiáveis. O da **estação** define o `slot` gravado no token; se estiver
adiantado, todos os tokens daquela estação carregam slots deslocados. Mitigação: no
provisionamento o dispositivo grava o offset contra o relógio do servidor e o aplica; a
verificação no resgate só exige que o slot caia na janela do evento, que tem folga de dias.
O do **visitante** só afeta a checagem de frescor local — que é conveniência de UX, não
fronteira de segurança, e por isso usa tolerância de ±2 slots.

---

## 4. Modelo de dados

Multi-tenant por `tenant_id` em todas as tabelas, com Row Level Security no Postgres — o
isolamento vive no banco, não na camada de aplicação, para que um bug de query não vaze dados
entre clientes.

```sql
tenant(id, nome, criado_em)
app_user(id, tenant_id, email, hash_senha, papel, redemption_point_id)
    -- papel ∈ SUPER_ADMIN | CLIENT_ADMIN | OPERATOR

event(id, tenant_id, nome, inicio_em, fim_em, status, config_jsonb)
    -- status ∈ DRAFT | READY | ACTIVE | FINISHED | ARCHIVED   (§44)
branding(event_id, logo_url, cores_jsonb, textos_jsonb)
journey(id, event_id, nome, ordem_obrigatoria bool default false)

station(id, event_id, idx smallint, nome, descricao, imagem_url,
        conteudo_jsonb, obrigatoria bool default true)
    -- unique(event_id, idx); idx é o que entra no token (1 byte)
station_device(id, station_id, provisionado_em, ultimo_visto_em)

anon_session(id uuid, event_id, status, criada_em, iniciada_em,
             concluida_em, walk_fingerprint)
    -- status ∈ CREATED | STARTED | IN_PROGRESS | COMPLETED | REDEEMED | EXPIRED  (§43)
station_checkin(session_id, station_id, slot, tag bytea, registrado_em,
                origem)  -- origem ∈ SYNC | REDEMPTION
    -- PK(session_id, station_id) → idempotência natural do sync

reward(id, event_id, nome, imagem_url)
redemption_point(id, event_id, nome)
redemption(id, event_id, session_id, reward_id, operator_id,
           redemption_point_id, criado_em, status,
           duplicate_flag bool, operator_decision)
    -- unique(event_id, session_id)  ← garantia de uso único
    -- status ∈ AVAILABLE | REDEEMED | INVALID | EXPIRED   (§45)
    -- operator_decision ∈ NONE | DELIVERED_ANYWAY | REFUSED   (política 'avisar', §3.6)

client_briefing(id, tenant_id, payload_jsonb, anexos_jsonb, status, enviado_em)
integration(id, tenant_id, event_id, tipo, config_jsonb)
analytics_rollup(event_id, dimensao, chave, janela, valor)
```

Notas de desenho:

- `station.idx` (smallint) existe para caber em 1 byte no token; o `id` é UUID para o resto do sistema.
- `station_checkin` tem chave primária composta que **é** a chave de idempotência do sync: reenviar o mesmo lote não duplica nada.
- `tempo_de_jornada = concluida_em − iniciada_em`, com `iniciada_em` gravado no evento `journey_started` (§16) — nunca no `journey_opened`.
- Não existe tabela de leads. Proposital (§9.1, e ver §6 abaixo).

---

## 5. Sincronização e analytics

**Protocolo.** `POST /v1/sync` com o lote de payloads crus pendentes; resposta traz o tempo do
servidor (para correção de offset) e a lista do que foi aceito. Reenvio é seguro por
construção. O disparo usa Background Sync onde existe, e `online` + retry com backoff onde não
existe (Safari/iOS).

**Verificação no sync.** Os tags são reverificados também aqui, não só no resgate — assim o
analytics não é envenenável por um cliente que poste check-ins inventados.

**Rollups.** Escrever direto de `station_checkin` para as agregações do dashboard não escala em
pico. O sync empurra para uma fila; um consumidor atualiza `analytics_rollup` por janela
(minuto/hora/dia × dimensão). O dashboard lê só agregados — latência plana
independentemente do tamanho do evento. Todos os KPIs de §24.1 saem dessas dimensões:

| Dimensão do rollup | KPIs que atende |
| --- | --- |
| `sessions_by_status` | iniciaram, concluíram, não concluíram, taxa de conclusão |
| `checkins_by_station` | total, mais/menos visitadas, visitas por estação |
| `completion_time_hist` | tempo por jornada, médio, distribuição |
| `activity_by_hour` / `by_day` | horários, pico, evolução, dia de maior movimento |
| `redemptions_by_reward` / `by_point` | brindes entregues, mais entregues, resgates por ponto |

**Exportações (§26).** CSV e XLSX saem dos rollups mais um dump de check-ins anonimizados. O PDF
é renderizado no servidor a partir dos **mesmos agregados** — com os filtros aplicados, período,
e a identidade visual do evento — nunca por screenshot, conforme §26.1.

---

## 6. Leads sem persistência

§9.1 exige não armazenar dados de lead. A API funciona como **proxy de passagem**: recebe,
encaminha ao destino do cliente (o navegador não pode postar direto por causa de CORS e de
credenciais do cliente), responde, e não escreve nada em disco. Isso implica desligar, nesse
endpoint especificamente: log de corpo de requisição, captura de payload no APM e fila de
retentativa persistente.

**Decidido: retentativa apenas em memória, com TTL curto, sem nada em disco.** Se o destino do
cliente voltar dentro dessa janela, o lead segue; se não voltar, o lead se perde. A jornada
nunca é bloqueada por essa falha.

O desenho recupera a maior parte das quedas curtas — que são a maioria — sem que o QR Journey
deixe de ser um canal de passagem. Essa distinção é o ponto: enquanto a plataforma apenas
repassa, o dado é do cliente e a responsabilidade de LGPD é do cliente. Bastaria uma fila
persistente de dez minutos para o QR Journey passar a tratar dado pessoal e herdar obrigações
de segurança, retenção e resposta a titular que hoje não tem.

**Consequência comercial, decidida junto:** a perda de lead na indisponibilidade do destino é
apresentada ao cliente na proposta, como política do produto — não como incidente. O texto
precisa constar do contrato e do briefing (§27), em linha com:

> Não retemos dados pessoais de leads. Se o seu sistema de destino estiver indisponível no
> momento do envio, aquele lead é perdido. Essa é uma decisão de privacidade do produto: nada
> de dado pessoal fica armazenado na plataforma.

Vale posicionar como diferencial, não como ressalva: para o cliente, um fornecedor que não
acumula base de dado pessoal é um fornecedor a menos na sua superfície de risco. O que a
política exige em contrapartida é que o cliente mantenha o endpoint de destino saudável — e
convém que a proposta diga isso com todas as letras.

---

## 7. Escala e custo

Recalculando §32 a partir de onde o tráfego realmente está — 50.000 participantes, 20 estações,
5.000 simultâneos:

| Caminho | Volume | Onde bate |
| --- | --- | --- |
| Carga inicial do app | 50.000 × ~300 KB, uma vez | CDN |
| Check-in | 1.000.000 | **Nenhum servidor.** 100% local. |
| Sync | ~50.000 lotes pequenos | API + banco |
| Resgate | ≤ 50.000 | API + banco |
| Pico de concorrência | 5.000 × 1 sync/min ≈ **83 rps** | API |

83 rps de escritas pequenas e idempotentes é carga modesta para uma instância de Postgres
gerenciado e uma camada stateless. A escala do produto é confortável **porque o offline-first
tirou o caminho crítico da rede** — o requisito mais caro da spec é também o que a torna barata.

### 7.1 Stack decidida

**Cloudflare + Neon Postgres.**

| Camada | Escolha | Papel |
| --- | --- | --- |
| Assets das 4 PWAs | Cloudflare Pages | CDN, distribuição global |
| API stateless | Cloudflare Workers | `/v1/sync`, `/v1/redeem`, provisionamento, admin |
| Banco | Neon Postgres com RLS | Isolamento multi-tenant no banco, não na aplicação |
| Config de evento | Workers KV | Leitura de borda, sem tocar o banco |
| Rollups de analytics | Cloudflare Queues | Processamento assíncrono |
| Segredo mestre | Workers Secrets | Custódia; migrável para KMS dedicado se um cliente exigir |
| QR | biblioteca open source no cliente | Sem custo unitário (§34) |

**A razão técnica que decidiu a escolha:** Workers expõe a **mesma Web Crypto API do navegador**.
HKDF e HMAC-SHA256 rodam com código idêntico no dispositivo da estação, no celular do visitante
e no servidor que verifica. Como §9 já estabelece que emissor e verificador precisam compartilhar
a biblioteca criptográfica, uma runtime que compartilha também a *API* elimina uma classe inteira
de bug — a divergência sutil entre a implementação do cliente e a do servidor, que é exatamente o
tipo de defeito que não aparece em teste e aparece no dia do evento.

Neon em vez de D1 porque o isolamento multi-tenant depende de Row Level Security, que é Postgres,
e porque o driver HTTP serverless da Neon conversa com Workers sem exigir pooler.

**Custo até o evento: zero.** Sprints 1 a 3 não tocam infraestrutura — o núcleo criptográfico é
biblioteca pura e os PWAs são estáticos. Os planos gratuitos cobrem desenvolvimento e testes com
dezenas de pessoas. Para o evento real, plano pago — não pelo volume (83 rps é pouco), mas pelos
limites de proteção e pelo suporte.

**Ressalva conhecida:** Workers não é Node, então bibliotecas que dependem de binários nativos
não rodam. Isso atinge a geração de PDF e XLSX do Sprint 6. Encaminhamento: usar bibliotecas
puramente JS (`pdf-lib`, SheetJS), que atendem ao relatório formatado de §26.1 sem headless
browser. Se o PDF exigir renderização mais rica, isolar essa função em um container à parte —
é a única peça do sistema que justificaria sair da runtime de borda.

**Escape hatch:** nada disso é irreversível. A API é stateless e o banco é Postgres padrão;
trocar de provedor é reescrever a camada de deploy, não a arquitetura.

**Ordem de grandeza de custo** (evento de 5 dias, 50 mil participantes): dezenas de dólares em
infraestrutura variável, mais o custo fixo de domínio e observabilidade. O gargalo comercial é
suporte e hardware, não nuvem. Números firmes exigem escolher o provedor — não vale fingir
precisão antes disso.

---

## 8. Riscos e questões em aberto

| # | Questão | Impacto | Encaminhamento sugerido |
| --- | --- | --- | --- |
| Q1 | Vazamento de `K_station` de um dispositivo de estação com acesso ao console | Permite cunhar tokens infinitos daquela estação | Aceitável para "moderado" (§39): dispositivos são supervisionados. Endurecimento futuro: lote de tokens pré-assinados, sem segredo de cunhagem no dispositivo. |
| Q2 | Compartilhamento em massa de tokens | Resgates indevidos | **Resolvido no desenho** (§3.6): fingerprint de caminhada em modo `avisar` + alerta de slot anômalo em 25 sessões. Reavaliar o limiar após o dia 1. |
| Q3 | Limpeza de dados do navegador perde a jornada | Frustração do visitante | Já previsto em §8; garantir que o aviso no welcome seja explícito. Sem solução sem cadastro. |
| Q4 | iOS sem Background Sync | Sync atrasa | Retry no `online` + sync forçado ao abrir o app. Não afeta o resgate, que carrega a prova. |
| Q5 | Jornadas acima de ~60 estações | QR de resgate denso demais | Fora do MVP. Se surgir, exigir sync antes do resgate para esses eventos. |
| Q6 | Perda de lead se o destino do cliente cair | Comercial | Decisão de produto pendente (§6 acima). |
| Q7 | Relógio da estação muito fora | Slots deslocados | Offset no provisionamento + janela do evento com folga (§3.7). |

---

## 9. Ordem de implementação recomendada

Segue as prioridades técnicas de §49 — confiabilidade e offline antes de tudo:

1. **Núcleo criptográfico primeiro.** Derivação de chave, emissão de token, verificação, empacotamento base45 e o QR de resgate. É o item de maior risco e o que trava todo o resto; deve nascer com testes de propriedade (token forjado, slot fora da janela, cobertura incompleta, resgate duplo).
2. **Estação offline** — provisionamento, rotação, kiosk.
3. **PWA do visitante** — sessão anônima, check-in offline, progresso, conclusão.
4. **Operador + resgate** — o primeiro caminho realmente online.
5. **Sync + rollups + dashboard.**
6. **Admin, white label, briefing, exportações.**

O detalhamento por sprint e o mapeamento contra os 22 critérios de aceite estão em
[03-plano-mvp.md](03-plano-mvp.md).
