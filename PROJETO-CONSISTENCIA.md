# Projeto Consistência — Documento Mestre e Briefing de Produto

**Versão:** 1.0
**Início do primeiro ciclo:** 12 de agosto de 2026
**Duração padrão dos ciclos:** 4 semanas
**Objetivo:** construir e reativar hábitos sustentáveis de saúde, alimentação, sono e atividade física por meio de acompanhamento visual, gamificação e reforço positivo.

---

## 1. Visão do projeto

Criar uma aplicação web **mobile first**, também responsiva para desktop, que funcione como um sistema pessoal de consistência.

A proposta não é criar uma experiência de dieta radical ou de cobrança constante. O produto deve ajudar a construir hábitos sustentáveis, tornando o progresso:

- visível;
- estimulante;
- simples de registrar;
- fácil de acompanhar;
- adaptável a novos ciclos;
- orientado ao processo, e não apenas ao peso.

A aplicação deve gerar uma sensação semelhante à de manter uma ofensiva no Duolingo: existe prazer em cumprir uma atividade e registrar imediatamente o progresso.

O princípio central é:

> **XP e progresso vêm das ações controláveis. Peso e medidas são consequências acompanhadas ao longo do tempo.**

---

## 2. Filosofia

O sistema deve seguir estes princípios:

1. Consistência acima de perfeição.
2. Sustentabilidade acima de radicalismo.
3. Reforço positivo acima de punição.
4. Progresso deve ser visual.
5. Descanso programado também faz parte do plano.
6. Uma falha isolada não destrói uma sequência de progresso.
7. O sistema deve ser configurável sem alteração de código.
8. Cada ciclo de quatro semanas pode ter regras diferentes.
9. Automatizar registros sempre que possível.
10. Manter registros manuais extremamente simples.

---

## 3. Estrutura dos objetivos

Existem três grupos diferentes de acompanhamento.

### 3.1. Hábitos diários

São objetivos que aparecem todos os dias e podem gerar check, XP e progresso.

#### Alimentação — calorias

Registrar diariamente a alimentação em aplicativo de contagem de calorias.

A meta calórica exata será configurável e definida posteriormente.

Estado possível:
- Concluído
- Não concluído

#### Zero doces industrializados

Durante o período inicial, evitar doces industrializados/fabricados, por exemplo:

- chocolate;
- bombom;
- paçoca;
- doces industrializados semelhantes.

A regra não significa eliminar completamente açúcar ou sobremesas preparadas.

A intenção inicial é retirar especificamente doces industrializados, evitando uma restrição alimentar excessivamente radical.

Estado possível:
- Concluído
- Não concluído

#### Creatina

Registrar o consumo diário de creatina.

Neste primeiro ciclo, não haverá ainda uma meta diária obrigatória de proteína. Esse objetivo poderá ser introduzido em ciclos futuros.

Estado possível:
- Creatina tomada
- Pendente

#### Água

Meta inicial: **3,5 litros por dia**.

O sistema deve permitir alterar essa quantidade futuramente.

Para não criar excesso de microtarefas, a interface pode mostrar o progresso do consumo ao longo do dia, mas o objetivo final deve resultar em um único check diário.

Exemplo visual:

```
2,4 L / 3,5 L
```

#### Sono

O sono será ajustado progressivamente, porque o horário atual de dormir está aproximadamente entre 1h e 2h da manhã, enquanto o horário necessário para acordar fica entre 6h e 6h30.

A mudança não deve ser radical.

**Progressão inicial proposta**

| Semana | Meta de horário para estar na cama |
| --- | --- |
| Semana 1 | 00:30 |
| Semana 2 | 00:15 |
| Semana 3 | 00:00 |
| Semana 4 | 23:45 |

O sistema deve acompanhar separadamente:

- horário de deitar;
- tempo total de sono;
- cumprimento da meta.

Quando possível, os dados devem vir automaticamente do Apple Saúde.

A experiência não deve ser excessivamente binária. Pequenos desvios podem ser representados visualmente como cumprimento parcial, por exemplo:

- meta atingida;
- próximo da meta;
- distante da meta.

---

## 4. Agenda semanal de atividades

Além dos hábitos diários, existe uma segunda camada: atividades programadas por dia da semana.

O usuário deve abrir o aplicativo e saber imediatamente:

> **O que eu preciso fazer hoje?**

Tipos de atividade podem incluir:

- academia;
- caminhada;
- corrida;
- treino em casa;
- atividade livre;
- recuperação;
- descanso.

A agenda precisa ser totalmente configurável.

### 4.1. Semana inicial — 12 a 16 de agosto de 2026

**Quarta-feira — 12/08**
Atividade: caminhada
Status inicial: realizada

**Quinta-feira — 13/08**
Atividade: recuperação
Um treino leve em casa pode ser registrado como atividade adicional, mas não é obrigatório.

**Sexta-feira — 14/08**
Atividade: atividade física
O tipo específico pode ser escolhido de acordo com as condições do dia.

**Sábado — 15/08**
Atividade: academia

**Domingo — 16/08**
Atividade: recuperação

### 4.2. Regra de continuidade

Como princípio comportamental, evitar acumular longos períodos sem movimento.

Uma atividade perdida não deve gerar sensação de fracasso. O sistema deve incentivar naturalmente a retomada na próxima oportunidade.

---

## 5. Avaliação semanal

Uma vez por semana deve existir um momento especial de revisão.

Esse momento deve parecer um **fechamento de rodada**, e não apenas mais um formulário.

O relatório deve mostrar:

- percentual dos hábitos concluídos;
- percentual das atividades programadas realizadas;
- consistência geral;
- evolução do sono;
- evolução do consumo de água;
- sequência atual;
- XP conquistado;
- evolução do peso;
- comparação com a semana anterior;
- destaques positivos;
- pontos que podem ser ajustados.

### 5.1. Meta de consistência

Objetivo inicial: **90% ou mais** das ações planejadas concluídas.

A consistência é a principal métrica de sucesso.

Exemplo:

> **92% de consistência — Semana concluída com sucesso.**

---

## 6. Peso e medidas

Peso e medidas corporais não devem fazer parte do loop diário de recompensa.

Devem funcionar como indicadores de resultado.

A ideia conceitual é:

> **Os hábitos são o jogo. O peso é o placar da temporada.**

### 6.1. Pesagem

Realizar uma pesagem semanal, preferencialmente:

- no mesmo dia da semana;
- aproximadamente no mesmo horário;
- em condições semelhantes.

A balança disponível possui bioimpedância. Seus valores não precisam ser tratados como medidas clínicas exatas; o sistema deve priorizar tendências ao longo do tempo.

### 6.2. Objetivo inicial

Peso de referência informado no início do projeto: **116 kg**.

Objetivo experimental para o primeiro período, de 12 a 16 de agosto: até aproximadamente **-1 kg**, sem transformar esse resultado em critério de sucesso ou fracasso.

A prioridade permanece sendo atingir aproximadamente 90% de consistência nas ações controláveis.

### 6.3. Medidas corporais

O sistema deve permitir futuramente registrar medidas como:

- cintura;
- quadril;
- outras medidas configuráveis.

Essas medições podem ter periodicidade diferente da pesagem.

---

## 7. Gamificação

A gamificação é uma parte central da experiência.

A referência comportamental é a sensação de progresso e ofensiva do Duolingo, aplicada a hábitos de saúde.

O produto não deve copiar visualmente o Duolingo.

### 7.1. XP

Ações concluídas geram XP.

Exemplos:

- meta de água atingida;
- creatina tomada;
- meta alimentar cumprida;
- dia sem doce industrializado;
- sono dentro da meta;
- atividade programada realizada.

O modelo de pontuação deve ser configurável.

### 7.2. Bônus

Podem existir bônus por:

- concluir todos os hábitos do dia;
- atingir a meta semanal;
- superar 90% de consistência;
- completar uma semana;
- completar um ciclo;
- manter sequências;
- recuperar rapidamente a consistência depois de um dia incompleto.

### 7.3. Sem punição destrutiva

Evitar mecanismos que transformem um único erro em perda desproporcional de progresso.

O produto deve incentivar:

> **retomar rapidamente, não desistir porque a sequência perfeita acabou.**

---

## 8. Barras de progresso

As barras de progresso serão um dos principais elementos visuais.

Devem existir pelo menos:

**Progresso diário** — quanto das tarefas daquele dia já foi concluído.

**Progresso semanal** — percentual de consistência da semana.

**Progresso do ciclo** — avanço dentro das quatro semanas.

**Progresso específico** — quando adequado, métricas como:

- água;
- sono;
- atividades;
- XP.

As barras devem ter animações e responder visualmente à conclusão de tarefas.

---

## 9. Home / Dashboard

A tela inicial deve responder em poucos segundos a quatro perguntas:

1. O que eu preciso fazer hoje?
2. O que já concluí?
3. Quanto falta?
4. Como está meu progresso geral?

Possíveis elementos:

- saudação;
- data;
- atividade programada do dia;
- hábitos diários;
- barra de progresso diária;
- sequência atual;
- XP;
- progresso semanal;
- progresso do ciclo;
- próxima conquista;
- resumo visual de saúde.

A prioridade é evitar sobrecarga de informação.

---

## 10. Experiência de check

Registrar uma ação deve ser prazeroso.

Ao tocar em um hábito concluído, utilizar microinterações como:

- animação do check;
- incremento animado de XP;
- avanço da barra;
- pequenas transições;
- feedback tátil quando suportado;
- mensagens curtas de progresso.

O sistema deve transmitir a sensação:

> **"Eu fiz. Meu progresso acabou de avançar."**

---

## 11. Direção visual

### 11.1. Referência estética

A direção desejada é **Nike Sports / Nike Training**, entendida como inspiração de linguagem visual esportiva premium — sem copiar identidade, logos, elementos proprietários ou telas específicas da Nike.

Características:

- esportivo;
- premium;
- energético;
- moderno;
- minimalista;
- alto contraste;
- tipografia forte;
- uso inteligente de espaço;
- cores vibrantes;
- sensação de velocidade e movimento;
- fotografia ou grafismos esportivos quando fizer sentido.

A interface não deve parecer um aplicativo médico, uma planilha ou um painel administrativo genérico.

Ela deve parecer um produto esportivo premium voltado a performance pessoal.

### 11.2. Movimento

Evitar uma experiência excessivamente estática.

Utilizar:

- barras animadas;
- números incrementais;
- transições suaves;
- cards responsivos;
- microinterações;
- estados visuais de conclusão;
- celebrações discretas;
- efeitos de progresso;
- mudanças visuais conforme a semana avança.

Animações devem reforçar significado, não servir apenas como decoração.

---

## 12. Mobile first

O produto deve ser projetado primeiro para celular.

Motivo: o sistema precisa estar disponível exatamente no momento em que uma atividade é realizada.

Prioridades mobile:

- interação com uma mão;
- poucos toques;
- botões grandes;
- informações essenciais acima da dobra;
- check extremamente rápido;
- excelente legibilidade;
- navegação simples;
- sensação próxima de aplicativo nativo.

Depois, a mesma aplicação deve funcionar muito bem em desktop com layout responsivo.

---

## 13. Painel de configuração

Esta funcionalidade é **obrigatória**.

Nenhuma meta principal deve ficar permanentemente hardcoded.

O usuário precisa conseguir configurar novos ciclos sem alterar código.

### 13.1. Configurações do ciclo

Permitir definir:

- data inicial;
- data final;
- duração;
- nome do ciclo;
- objetivo geral;
- meta de consistência;
- hábitos ativos;
- metas dos hábitos;
- agenda semanal;
- frequência de pesagem;
- medidas acompanhadas;
- regras de XP;
- metas de sono;
- meta de água;
- meta calórica.

### 13.2. Agenda

Permitir escolher qualquer dia e configurar:

- academia;
- caminhada;
- corrida;
- treino em casa;
- recuperação;
- descanso;
- atividade personalizada.

Também deve ser possível editar excepcionalmente apenas um dia sem necessariamente alterar toda a programação futura.

### 13.3. Hábitos

O painel deve permitir:

- criar hábito;
- editar hábito;
- pausar hábito;
- excluir/desativar hábito;
- escolher frequência;
- escolher unidade;
- definir meta;
- definir XP;
- definir se o registro é manual ou automático.

Isso permitirá, por exemplo, adicionar futuramente uma meta de proteína sem alterar a aplicação.

---

## 14. Integrações

### 14.1. Apple Saúde / HealthKit

Investigar integração com o ecossistema Apple Saúde, respeitando permissões, limitações técnicas, privacidade e arquitetura exigida pela Apple.

Dados de interesse:

- peso;
- sono;
- passos;
- exercícios;
- calorias de atividade;
- frequência de atividade;
- eventualmente outros dados úteis.

O usuário deverá conceder explicitamente todas as permissões necessárias.

**Importante:** como HealthKit possui restrições de plataforma e acesso, a implementação deve validar tecnicamente quais dados podem ser obtidos diretamente por uma aplicação web e quando será necessária uma camada/app nativo iOS ou outro mecanismo autorizado de sincronização.

Não presumir que uma aplicação web pura terá acesso direto a todos os dados.

### 14.2. Balança

Se os dados da balança já estiverem sincronizados com Apple Saúde, priorizar essa fonte em vez de criar uma integração separada, quando tecnicamente possível.

### 14.3. Registros manuais

Tudo que não puder ser automatizado precisa ter registro manual extremamente simples.

Ideal: **um ou dois toques**.

---

## 15. Arquitetura conceitual dos dados

Separar claramente:

**Plano** — o que deveria acontecer.

**Execução** — o que realmente aconteceu.

**Resultado** — consequências observadas.

Exemplo:

```
Plano:     academia sábado.
Execução:  academia realizada.
Resultado: dados de atividade + impacto acumulado na evolução.
```

Essa separação é importante para relatórios e mudanças futuras de programação.

---

## 16. Ciclos

A unidade principal de planejamento é um ciclo de aproximadamente quatro semanas.

Ao final de cada ciclo:

1. analisar resultados;
2. avaliar consistência;
3. identificar hábitos fáceis/difíceis;
4. revisar metas;
5. adicionar ou retirar objetivos;
6. criar o ciclo seguinte.

O histórico dos ciclos anteriores deve permanecer disponível.

---

## 17. Primeiro ciclo — intenção

O primeiro ciclo não busca otimizar todas as dimensões da saúde simultaneamente.

Ele busca **reativar hábitos**.

Prioridades:

- voltar a registrar alimentação;
- reduzir doces industrializados;
- consumir creatina diariamente;
- atingir meta de hidratação;
- reorganizar progressivamente o sono;
- voltar à atividade física consistente;
- acompanhar peso sem obsessão;
- construir uma rotina sustentável.

Uma meta de proteína poderá ser introduzida posteriormente.

---

## 18. Recompensas

O sistema deve permitir criar recompensas pessoais associadas a marcos.

Exemplos de gatilhos:

- semana acima de 90%;
- determinado número de dias consistentes;
- conclusão de um ciclo;
- conquista específica;
- marco de XP.

As recompensas não precisam necessariamente ser alimentares.

O usuário poderá definir suas próprias recompensas.

---

## 19. Relatório do ciclo

Ao final das quatro semanas, gerar uma visão consolidada com:

- consistência média;
- hábitos mais consistentes;
- hábitos mais difíceis;
- atividades realizadas;
- evolução do sono;
- evolução da hidratação;
- peso inicial;
- peso final;
- tendência do peso;
- medidas iniciais/finais quando disponíveis;
- XP total;
- melhores sequências;
- evolução semana a semana;
- principais conquistas.

Também apresentar insights simples para ajudar na criação do próximo ciclo.

---

## 20. Tom da aplicação

A comunicação deve ser:

- energética;
- positiva;
- adulta;
- esportiva;
- objetiva;
- motivadora sem ser infantil;
- não punitiva.

Evitar mensagens que provoquem culpa.

Preferir:

> **"Amanhã é uma nova oportunidade de avançar."**

em vez de:

> **"Você perdeu sua sequência."**

---

## 21. Critérios de aceitação do MVP

O primeiro MVP deve permitir que o usuário:

- configure um ciclo;
- configure hábitos diários;
- configure atividades por dia;
- visualize o plano do dia;
- marque hábitos como concluídos;
- marque atividades como concluídas;
- acompanhe água;
- acompanhe sono;
- registre peso;
- veja XP;
- veja progresso diário;
- veja progresso semanal;
- veja progresso do ciclo;
- consulte histórico;
- altere metas sem alterar código;
- visualize relatório semanal;
- utilize perfeitamente pelo celular;
- utilize também pelo desktop.

A integração com Apple Saúde pode ser implementada em etapa separada caso existam dependências de arquitetura nativa.

---

## 22. Prioridades de desenvolvimento

**Fase 1 — Experiência principal**

- modelo de ciclos;
- hábitos configuráveis;
- agenda;
- checks;
- dashboard;
- XP;
- barras de progresso;
- pesagem;
- relatório semanal;
- mobile first.

**Fase 2 — Automação**

- investigação/integração Apple Saúde;
- importação de sono;
- importação de peso;
- importação de atividade;
- redução de registros manuais.

**Fase 3 — Evolução**

- conquistas;
- recompensas;
- relatórios avançados;
- comparação entre ciclos;
- novos hábitos;
- insights;
- refinamento da gamificação.

---

## 23. Instrução para desenvolvimento

Desenvolver este produto como uma **experiência de performance pessoal e construção de consistência**, e não como simples habit tracker.

Antes de implementar decisões não especificadas:

1. priorizar simplicidade;
2. priorizar mobile;
3. priorizar configurabilidade;
4. priorizar feedback visual;
5. evitar punição;
6. evitar excesso de registros manuais;
7. preservar histórico;
8. separar plano, execução e resultado;
9. não hardcodar regras que deverão mudar em ciclos futuros.

Quando houver uma escolha entre mais funcionalidades e uma experiência mais fluida, priorizar a experiência mais fluida.

---

## 24. Princípio norteador

> **O objetivo do sistema não é criar quatro semanas perfeitas. É tornar mais fácil continuar na quinta semana.**

---

## Notas para revisões futuras

Este documento deve funcionar como a **fonte da verdade** do projeto.

A cada ciclo de quatro semanas, atualizar principalmente:

- metas;
- hábitos;
- agenda;
- métricas;
- aprendizados;
- recompensas;
- regras de gamificação, quando necessário.

Manter o histórico das versões para acompanhar a evolução do sistema e da estratégia pessoal.

---

## Histórico de versões

| Versão | Data | Alterações |
| --- | --- | --- |
| 1.0 | 12/08/2026 | Documento inicial. Definição do primeiro ciclo (12/08 a 08/09/2026), hábitos, agenda, gamificação, direção visual e critérios do MVP. |
