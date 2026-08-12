# QR Journey

Plataforma white label para criação, gamificação e mensuração de jornadas presenciais em
eventos e espaços físicos — validação por QR Code dinâmico, operação offline-first e
analytics em tempo real. Primeiro piloto: ação KaBuM!.

## Documentos

| Documento | Para quem | Conteúdo |
| --- | --- | --- |
| [01 — Especificação de Produto](01-especificacao-produto.md) | Produto, cliente, comercial | Definição completa do produto e do MVP: conceitos, perfis, jornada do visitante, resgate, analytics, privacidade, modelo comercial, critérios de aceite |
| [02 — Arquitetura Técnica](02-arquitetura-tecnica.md) | Engenharia | Resposta à pergunta técnica central (§51): como validar a passagem offline e provar a conclusão. Modelo de dados, sync, escala, custos, riscos |
| [03 — Plano de Entrega do MVP](03-plano-mvp.md) | Engenharia, gestão | Sprints por ordem de risco, rastreabilidade dos 22 critérios de aceite, decisões pendentes |

## A ideia em um parágrafo

O visitante escaneia um QR de entrada, recebe um identificador anônimo no próprio navegador e
percorre estações físicas em qualquer ordem. Cada estação exibe um QR que muda a cada 15
segundos. Ao completar a jornada, o visitante recebe um QR exclusivo que um operador valida
em um ponto de retirada, e o brinde é entregue. Nada disso exige cadastro, instalação de
aplicativo ou conexão de internet do lado do visitante.

## A decisão técnica que sustenta o produto

A jornada inteira pode acontecer offline, e o resgate não pode exigir sincronização prévia.
Isso significa que o dispositivo do visitante — que é editável pelo próprio dono — precisa
carregar uma **prova de conclusão que ele mesmo não conseguiria fabricar**.

A solução é fazer o QR de resgate carregar as evidências em vez de uma afirmação: cada
estação assina um token com uma chave que só ela e o servidor conhecem, o visitante acumula
esses tokens, e o ponto de resgate reverifica todos eles online. O estado local do navegador
serve à interface; a prova é criptográfica.

Detalhamento em [02 — Arquitetura Técnica §3](02-arquitetura-tecnica.md#3-prova-de-passagem-e-prova-de-conclusão).

## Estado

Especificação e arquitetura. Nenhuma implementação iniciada.
