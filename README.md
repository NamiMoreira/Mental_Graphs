Autora-Naomi Bruna Moreira
Data_Criação-26/05/2026
Descrição-Ferramenta de auxilio para a obtenção de insights
Objetivo-Transformação de conceitos humanos em embeddings e possível alimentação de LLMs

Fluxo de trabalho
=>imput de token => imput conexão com outros imputs => imput de arestas => imput de peso 
Contextos
Malha gráfica com conexões de relações . 
Um Token se conecta a outro por meio de arestas.
A tabela Relação será composta por um ID_TOKEN_1 ,ID_TOKEN_2, e em seguida as Arestas
A criação de arestas entre a relação de um Token será produzida pelo usuário.

O calculo do Peso deve ser difinido em probabilidades de existencia dos relacionamentos.
1.Igual => Exatamente 0
2.A para B => Exatamente 1
3.B para A => Exatamente 2
Condições específicas fracionam esses valores.


|RELAÇÂO Carro/Pessoa|
    
    
                 
          |Token_B | Token_B  |Possui |Transporta |Fala    |Conversam  |Igual
          |Carro   | Pessoa   |   0   |    1      |  0,32  |  0,81     |  0,0009
          |Pessoa  | Carro    |   1   |    0,75   | 0,79   |  0,79     |  0
          |Gato    | Cachorro | 0,12  |   1       |  0     |  0        | 0,5        
