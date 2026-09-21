/* Painel de imersão: conteúdo.
   É o ÚNICO arquivo que precisa ser editado. Tudo o que está aqui é exemplo:
   troque pelos dados da sua imersão e mantenha a estrutura.

   Regras rápidas
   - Os ids (d1, d2, i1...) precisam ser únicos. Decisões começam com "d", ideias com "i".
   - Se renomear ou remover um id depois de a imersão começar, o que foi marcado
     naquele item se perde. Adicionar itens novos é sempre seguro.
   - Cores aceitam qualquer valor CSS, inclusive os tokens de estilo.css:
     var(--acento), var(--azul), var(--ambar), var(--roxo), var(--coral), var(--verde). */

window.PAINEL = {

  // ---------------------------------------------------------------- configuração
  config: {
    nome: "Imersão 2026",                       // título grande; a última palavra ganha a cor de acento
    kicker: "Imersão · 3 dias",                 // linha pequena acima do título
    subtitulo: "Este painel é para decidir, não para acumular mais informação.",
    rodape: "Teste da imersão: sair com poucas linhas, cada uma com dono e data. Sair com muitas ideias e nenhuma linha é o sinal de que não funcionou.",
    confidencial: true,                         // mostra o selo "interno" no topo
    chaveArmazenamento: "painel-imersao-2026",  // troque a cada imersão, senão o estado de uma vaza na outra
    corAcento: null,                            // ex.: "#ffb347". null usa a cor de estilo.css
  },

  // Quem pode ser dono de uma decisão. O "—" serve para "ainda sem dono".
  participantes: ["Pessoa A", "Pessoa B", "Pessoa C", "Pessoa D", "—"],

  // ---------------------------------------------------------------- menu
  // Dois níveis: grupo e aba. Os ids das abas são fixos (são as views do motor);
  // os labels e a ordem são livres. Remova a aba que não for usar.
  grupos: [
    { id: "imersao", label: "Imersão", abas: [
      { id: "fechamento", label: "Fechamento" },
      { id: "cronograma", label: "Cronograma" },
      { id: "decisoes",   label: "Decisões" },
      { id: "parking",    label: "Parking lot" },
    ]},
    { id: "analise", label: "Análise", abas: [
      { id: "sintese", label: "Síntese" },
      { id: "ideias",  label: "Ideias em triagem" },
    ]},
    { id: "referencias", label: "Referências", abas: [
      { id: "referencias", label: "Referências" },
    ]},
  ],

  // ---------------------------------------------------------------- decisões
  // O coração do painel. Cada decisão tem uma pergunta de fechamento: se a
  // pergunta não tem resposta, a decisão não está fechada.
  decisoesIntro: "As decisões que a imersão precisa fechar. Cada uma sai com status, dono, prazo e o próximo passo concreto. A âncora é a que destrava as outras.",
  decisoes: [
    { id: "d1", ancora: true,
      titulo: "A prioridade do próximo ciclo",
      resumo: "Escolher uma frente para concentrar esforço, e dizer por escrito o que fica de fora.",
      pergunta: "Qual frente sai da imersão como prioridade, com dono e meta?",
      aFechar: ["Escolher uma, não três", "Definir a meta em número", "Registrar o que fica de fora, e até quando"] },
    { id: "d2",
      titulo: "Quem cuida de cada frente",
      resumo: "Frente sem dono é frente que ninguém cobra. O dono não faz tudo: responde por ela.",
      pergunta: "Cada frente ativa tem uma pessoa responsável, com nome?",
      aFechar: ["Listar as frentes ativas", "Um nome por frente", "Combinar o que o dono pode decidir sozinho"] },
    { id: "d3",
      titulo: "Como o grupo acompanha depois",
      resumo: "O que a imersão decide precisa de um ritual que mantenha vivo nas semanas seguintes.",
      pergunta: "Quando, como e com que duração o grupo se reencontra para conferir o que foi decidido?",
      aFechar: ["Frequência e duração", "Onde fica o registro", "Quem puxa o encontro"] },
    { id: "d4",
      titulo: "O que deixa de ser feito",
      resumo: "Toda prioridade nova precisa tirar espaço de alguma coisa. Se nada sai, a prioridade não é real.",
      pergunta: "O que para, o que hiberna com data de revisão, e o que continua?",
      aFechar: ["Lista do que para", "Lista do que hiberna, com data", "Conferir que a capacidade fecha"] },
  ],

  // ---------------------------------------------------------------- cronograma
  cronograma: {
    intro: "A agenda da imersão, bloco a bloco. Cada bloco diz o objetivo e com o que o grupo sai dele.",
    tags: {
      abertura:   { cor: "var(--roxo)",   label: "Abertura" },
      trabalho:   { cor: "var(--azul)",   label: "Trabalho" },
      decisao:    { cor: "var(--acento)", label: "Decisão" },
      externo:    { cor: "var(--dim)",    label: "Externo" },
      fechamento: { cor: "var(--coral)",  label: "Fechamento" },
    },
    blocos: [
      { dia: "Dia 1", turno: "Manhã", bloco: "Check-in", tag: "abertura",
        objetivo: "Chegar juntos. Cada pessoa diz como chega e o que espera levar da imersão.",
        pauta: ["Rodada de check-in", "Relembrar o objetivo da imersão", "Combinar os acordos do encontro"],
        saida: "Expectativas ditas em voz alta e anotadas." },
      { dia: "Dia 1", turno: "Tarde", bloco: "Diagnóstico", tag: "trabalho",
        objetivo: "Olhar para o que aconteceu desde a última imersão, com dado e não com sensação.",
        pauta: ["O que foi feito", "O que ficou pelo caminho, e por quê", "O que se repete"],
        saida: "Uma lista curta dos padrões que o grupo reconhece.",
        links: [{ label: "ver a síntese", aba: "sintese" }] },
      { dia: "Dia 2", turno: "Manhã", bloco: "Decisões", tag: "decisao",
        objetivo: "Fechar as decisões da aba Decisões, começando pela âncora.",
        pauta: ["Decisão âncora primeiro", "Uma decisão por vez, até a pergunta de fechamento ter resposta"],
        saida: "Cada decisão com status, dono e prazo.",
        links: [{ label: "abrir as decisões", aba: "decisoes" }] },
      { dia: "Dia 2", turno: "Tarde", bloco: "Triagem de ideias", tag: "trabalho",
        objetivo: "Passar pelas ideias acumuladas e decidir o destino de cada uma.",
        pauta: ["Ressuscitar, fundir ou arquivar", "O que é citado e não decidido vai para o parking lot"],
        saida: "Nenhuma ideia sem destino.",
        links: [{ label: "abrir as ideias", aba: "ideias" }] },
      { dia: "Dia 3", turno: "Manhã", bloco: "Fechamento", tag: "fechamento",
        objetivo: "Consolidar o que saiu, o que ficou aberto e o compromisso de cada pessoa.",
        pauta: ["Rodada de compromissos", "Exportar o resumo para a ata"],
        saida: "O resumo exportado e o próximo encontro marcado.",
        nota: "Use Dados, Exportar resumo, para gerar o texto da ata." },
    ],
    fiosTitulo: "Os fios que a imersão precisa amarrar",
    fios: [
      "A prioridade do próximo ciclo, e o que fica de fora dela.",
      "Um dono para cada frente ativa.",
      "O ritual de acompanhamento, com data marcada.",
    ],
  },

  // ---------------------------------------------------------------- ideias
  // Iniciativas que apareceram e perderam força. "Perdeu força" é hipótese, não
  // veredicto: a triagem obriga a decidir de propósito.
  ideias: {
    intro: "Iniciativas que surgiram e perderam força. Decidam o destino de cada uma: ressuscitar, fundir com outra, ou arquivar. Clicar de novo desmarca.",
    itens: [
      { id: "i1", nome: "Ideia de exemplo 1", fonte: "quem trouxe · quando", potencial: "alto",
        desc: "Descreva a ideia em duas linhas: o que é e por que apareceu." },
      { id: "i2", nome: "Ideia de exemplo 2", fonte: "quem trouxe · quando", potencial: "medio",
        desc: "O potencial (alto, medio, baixo) é a leitura de quem preparou o painel, não a decisão do grupo." },
      { id: "i3", nome: "Ideia de exemplo 3", fonte: "quem trouxe · quando", potencial: "baixo",
        desc: "Arquivar também é decisão. Arquivar de propósito libera atenção." },
    ],
  },

  // ---------------------------------------------------------------- parking lot
  parking: {
    intro: "Assuntos citados e não endereçados. Não são decisões: são coisas a puxar quando fizer sentido, para não morrerem na conversa.",
    itens: [
      { titulo: "Assunto de exemplo", categoria: "Tema", origem: "em que momento foi citado",
        texto: "O que foi dito, em uma ou duas frases. Quando o assunto for retomado, ele sai daqui e vira decisão ou tarefa." },
      { titulo: "Outro assunto de exemplo", categoria: "Tema", origem: "em que momento foi citado", status: "em teste",
        texto: "O status é opcional: use para o que já começou a ser experimentado." },
    ],
  },

  // ---------------------------------------------------------------- fechamento
  fechamento: {
    titulo: "Fechamento",
    intro: "O retrato do fim da imersão. Preencha no último bloco, com o grupo junto.",
    conquistas: [
      { titulo: "Exemplo de decisão fechada", estado: "fechada", texto: "O que foi decidido, em uma frase, com o número quando houver." },
    ],
    falta: [
      { titulo: "Exemplo de ponto em aberto", texto: "O que não fechou e o que falta para fechar." },
    ],
    compromissos: [
      { pessoa: "Pessoa A", texto: "O que esta pessoa se compromete a entregar, e até quando." },
      { pessoa: "Pessoa B", texto: "O que esta pessoa se compromete a entregar, e até quando." },
    ],
    proximos: [
      "Próximo passo de exemplo, com dono e data.",
    ],
  },

  // ---------------------------------------------------------------- síntese
  // Uma leitura cruzada, feita antes da imersão, do que os materiais dizem juntos.
  sintese: {
    titulo: "A tese em uma frase: escreva aqui o diagnóstico que os materiais dizem juntos.",
    tese: [
      "Um parágrafo explicando a tese. A síntese não resume cada documento: diz o que eles mostram quando lidos juntos, e o que nenhum diz sozinho.",
    ],
    padroes: [
      { titulo: "Padrão de exemplo", texto: "Algo que aparece em mais de um lugar e ninguém nomeou. Nomear o padrão é o que permite decidir sobre ele." },
    ],
    alavancas: [
      { titulo: "Decisão de alavancagem de exemplo", texto: "Por que ela destrava as outras.", pronto: "O critério objetivo que diz que ela foi tomada." },
    ],
    sacrificio: {
      parar: ["O que deve parar de vez."],
      hibernar: ["O que pode esperar, com a data em que volta à pauta."],
    },
    ordem: "A sequência recomendada, elo a elo, em que cada passo depende do anterior.",
  },

  // ---------------------------------------------------------------- referências
  referencias: {
    intro: "Material de apoio. Referência é teto de input: a imersão deve ser quase toda saída.",
    itens: [
      { titulo: "Referência de exemplo", tipo: "Documento", texto: "Por que este material importa para a imersão, em uma frase.", url: "" },
    ],
  },
};
