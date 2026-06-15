# Mental Graphs

> Um framework conceitual para modelar estados mentais humanos como padrões dinâmicos de ativação em um grafo semântico.

## Visão Geral

Mental Graphs é um projeto de pesquisa que busca representar a psique humana como uma rede dinâmica de conceitos interconectados.

A hipótese central é que pensamentos, emoções, crenças e comportamentos emergem da ativação simultânea de subconjuntos de um grafo conceitual.

Em vez de modelar a mente através de regras fixas ou categorias psicológicas estáticas, o sistema trata cada conceito como um nó dotado de propriedades quantitativas capazes de influenciar outros conceitos através de conexões ponderadas.

No ambito da probabilidade, o grafo se expande considerando o peso de rotas semanticas. Os nós tem probabilidades de se propagarem a partir de peso entre tokens dentro do caminho percorrido pelo grafo.

---

## Hipótese Fundamental

Um estado mental pode ser descrito como:

* Um subconjunto ativo de conceitos.
* Relações causais entre esses conceitos.
* Intensidades variáveis de ativação.
* Propagação temporal de influência.
* Competição e reforço entre ideias.

Em termos formais:

Estado Mental = Subgrafo Ativo(G,t)

t tem a instancia do tempo, logo, G pode ser alterado considerado as caracteristicas de t¹ que levam ao G em t².

G em t¹ -> G em t2

Onde:

* G = Grafo conceitual completo.
* t = instante temporal.

O mapa de Conceitos Ativos se divide em dois ou mais receptaculos de atenção. Conceitualmente, podemos pensar em dois mapas de grafos ativos , onde um seria o grafo de memoria do self e o subgrafo de memoria de trabalho.

---

## Objetivos

### Curto Prazo

* Criar um editor visual de grafos conceituais.
* Permitir atribuição manual de pesos e relações.
* Simular propagação de ativação entre conceitos.
* Gerar visualizações dinâmicas.

### Médio Prazo

* Detectar padrões recorrentes.
* Identificar ciclos cognitivos.
* Simular cenários hipotéticos.

### Longo Prazo

* Construir um modelo preditivo de comportamento humano.
* Auxiliar na geração de insights psicológicos.
* Servir como interface colaborativa humano-IA para exploração cognitiva.

---

## Estrutura de um Conceito

Cada nó do grafo possui propriedades próprias. Essas propriedades, dentro do modelo preditivo do sistema, será capaz de induzir a propagação do grafo. Será um nó decisório, um conjunto de nós que juntos consegue calcular a probabilidade do proxímo conceita a ser conectado. Porém os itens desse super nó ainda está em desenvolvimento(algorítimo).

### Exemplo

Conceito: "Fracasso"

| Propriedade        | Valor |
| ------------------ | ----- |
| Valência           | -0.8  |
| Horizonte Temporal | Longo |
| Peso Causal        | 0.7   |
| Propagação         | 0.6   |
| Persistência       | 0.9   |

---

## Modelo de Ativação

Cada conceito possui:

### Ativação

Representa sua relevância instantânea.

Valor:

0.0 → Inativo

1.0 → Máxima ativação

---

### Valência

Carga emocional associada.

Intervalo:

-1 → Extremamente negativa

+1 → Extremamente positiva

---

### Peso Causal

Capacidade de influenciar outros conceitos.

---

### Horizonte Temporal

Tempo predominante de impacto.

Exemplos:

* Imediato
* Curto prazo
* Médio prazo
* Longo prazo

---

## Propagação de Ativação

Quando um conceito é ativado, parte de sua energia é distribuída para conceitos conectados.

Exemplo:

Medo → Falha Profissional → Rejeição Social

A ativação pode:

* Amplificar-se
* Atenuar-se
* Formar ciclos
* Produzir estados emergentes

---

## Arquitetura Conceitual

```text
Usuário
    │
    ▼
Editor de Conceitos
    │
    ▼
Grafo Conceitual
    │
    ├── Nós
    ├── Conexões
    └── Pesos
    │
    ▼
Motor de Simulação
    │
    ▼
Análise de Estados Mentais
    │
    ▼
Geração de Insights
```

## Papel da IA

A IA não define o significado dos conceitos.

O significado é fornecido pelo ser humano.

A IA atua como:

* Exploradora do espaço conceitual.
* Simuladora de cenários.
* Detectora de padrões.
* Geradora de hipóteses.

---

## Casos de Uso

### Psicologia

Mapeamento de estruturas cognitivas.

### Coaching

Visualização de bloqueios e objetivos.

### Pesquisa

Modelagem computacional de comportamento humano.

### Educação

Representação do processo de aprendizagem.

---

## Exemplo de Estado Mental

```text
Ansiedade
   │
   ├── Medo de fracassar
   │       │
   │       └── Rejeição social
   │
   └── Incerteza financeira
```

Subgrafo ativo identificado:

* Ansiedade
* Medo de fracassar
* Rejeição social
* Incerteza financeira

---

## Roadmap

### Fase 1

* Editor visual
* Persistência local
* Simulação básica

### Fase 2

* Métricas de rede
* Análise temporal
* Histórico de estados

### Fase 3

* Assistente IA
* Predição comportamental
* Simulações avançadas

---

## Status do Projeto

🚧 Em desenvolvimento conceitual.



*Front-End
*Back-End
*Banco de Grafos
*Super nó
*Alimentação de conceitos ativos 

Atualmente o foco está na definição formal do modelo de representação mental e das regras de propagação entre conceitos.

---

## Licença

A definir.
