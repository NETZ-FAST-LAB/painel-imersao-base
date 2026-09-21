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
      { id: "pesquisas",   label: "Pesquisas" },
      { id: "referencias", label: "Leituras" },
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

  // ---------------------------------------------------------------- pesquisas
  // Pesquisa externa de consultorias, universidades e institutos, organizada por
  // tema. Dado com url foi conferido na fonte. Dado sem url: buscar pelo nome
  // antes de citar em público. "paraImersao" é a pergunta que a pesquisa devolve
  // para o grupo, não uma resposta.
  pesquisas: {
    intro: "O que consultorias, universidades e institutos já mediram sobre os problemas que costumam aparecer numa imersão. Cada tema termina numa pergunta para o grupo. Dados com link foram conferidos na fonte; os sem link, busque pelo nome antes de citar.",
    itens: [
      { id: "p1", destaque: "84% × 9%",
        titulo: "Execução: por que o que foi decidido não chega ao fim",
        pergunta: "Onde a estratégia se perde entre a decisão e a entrega?",
        tese: "O gargalo da execução raramente é o alinhamento de cima para baixo. É a coordenação entre áreas: as pessoas contam com o próprio chefe, mas não contam com os colegas de outras funções para entregar o que prometeram.",
        dados: [
          { fonte: "Sull, Homkes e Sull · HBR, 2015", url: "https://hbr.org/2015/03/why-strategy-execution-unravelsand-what-to-do-about-it",
            texto: "Em mais de 250 empresas, 84% dos gestores dizem contar com o chefe. Só 9% dizem contar sempre com colegas de outras áreas." },
          { fonte: "Murty, Pierce e outros · HBR, 2022", url: "https://hbr.org/2022/08/how-much-time-and-energy-do-we-waste-toggling-between-applications",
            texto: "Um trabalhador digital alterna entre aplicativos cerca de 1.200 vezes por dia, e perde perto de quatro horas por semana só se reorientando." },
          { fonte: "Gallup · meta-análise Q12", url: "https://www.gallup.com/workplace/236927/employee-engagement-drives-growth.aspx",
            texto: "Equipes no quartil superior de engajamento têm 23% mais lucratividade e 18% mais produtividade." },
          { fonte: "BCG, 2020",
            texto: "Cerca de 30% das transformações atingem o valor que prometeram." },
        ],
        frameworks: "Limite de trabalho em progresso (Lei de Little): menos iniciativas abertas ao mesmo tempo encurtam o tempo de cada entrega. Dono único por iniciativa. Compromisso entre áreas tratado com o mesmo peso de um compromisso com cliente.",
        paraImersao: "Quantas iniciativas estão abertas ao mesmo tempo hoje? Quantas delas têm um único dono, com nome?" },

      { id: "p2", destaque: "70%",
        titulo: "Decidir com velocidade",
        pergunta: "Quanta informação é preciso ter para decidir?",
        tese: "Decisões que podem ser desfeitas não pedem a mesma cautela que as definitivas. Na maior parte dos casos, esperar por certeza quase total custa mais do que errar e corrigir.",
        dados: [
          { fonte: "Jeff Bezos · carta aos acionistas da Amazon, 2016", url: "https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders",
            texto: "A maioria das decisões deveria ser tomada com cerca de 70% da informação desejada. Esperar por 90% costuma significar ser lento demais." },
          { fonte: "Jeff Bezos · mesma carta", url: "https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders",
            texto: "\"Discordar e se comprometer\": quem discorda registra a divergência e, ainda assim, apoia a decisão para que ela ande." },
        ],
        frameworks: "Decisões de mão única (definitivas, pedem cuidado) e de mão dupla (reversíveis, pedem velocidade). Discordar e se comprometer.",
        paraImersao: "Das decisões desta imersão, quais são de mão dupla e podem ser tomadas hoje, mesmo sem certeza?" },

      { id: "p3", destaque: "40% × 60–90%",
        titulo: "Serviço e produto: o limite do sob medida",
        pergunta: "O que fazemos de novo a cada cliente?",
        tese: "Empresas de serviço crescem somando gente, e por isso as margens travam. A saída não é abandonar o serviço: é transformar em oferta pronta as partes que se repetem em quase todo projeto.",
        dados: [
          { fonte: "Mohanbir Sawhney · HBR, 2016", url: "https://hbr.org/2016/09/putting-products-into-services",
            texto: "Consultorias e agências têm dificuldade de passar de 40% de margem bruta ao ganhar escala. Empresas de produto operam entre 60% e 90%." },
          { fonte: "Marc Andreessen, 2007", url: "https://pmarchive.com/guide_to_startups_part4.html",
            texto: "\"A única coisa que importa é chegar ao product/market fit\": estar num bom mercado, com um produto capaz de satisfazê-lo." },
          { fonte: "April Dunford · Obviously Awesome",
            texto: "Diferenciar vem de estreitar o foco, não de somar funcionalidades. O ponto de partida são os melhores clientes que você já tem." },
        ],
        frameworks: "Escada da produtização: serviço, serviço empacotado, produto, assinatura. \"Faça coisas que não escalam\" no começo (Paul Graham), para descobrir o que vale empacotar.",
        paraImersao: "Qual parte do nosso trabalho se repete em quase todo projeto e poderia virar oferta com escopo e preço fixos?" },

      { id: "p4", destaque: "1% → ~11%",
        titulo: "Preço: a alavanca que ninguém mexe",
        pergunta: "Cobramos pelo tempo ou pelo resultado?",
        tese: "Preço é a alavanca de lucro mais forte e a menos gerida. E, quando a tecnologia torna o trabalho mais rápido, cobrar por hora faz a eficiência virar perda de receita.",
        dados: [
          { fonte: "Marn e Rosiello · HBR, 1992", url: "https://hbr.org/1992/09/managing-price-gaining-profit",
            texto: "Numa empresa média, 1% de melhora no preço efetivamente praticado aumenta o lucro operacional em cerca de 11%, mais do que o mesmo ganho em volume ou em custo." },
          { fonte: "Mercado de software",
            texto: "Preço por resultado já é prática: há assistentes de atendimento cobrados por conversa resolvida, e não por usuário." },
        ],
        frameworks: "Preço por valor. Três opções, com a do meio como a mais atraente. Modelo híbrido: uma base fixa mais uma parte variável ligada ao resultado.",
        paraImersao: "Se entregássemos o mesmo trabalho na metade do tempo, ganharíamos mais ou menos?" },

      { id: "p5", destaque: "95 : 5",
        titulo: "Comercial e autoridade",
        pergunta: "Quem está comprando agora, e quem vai comprar depois?",
        tese: "A maior parte do mercado não está comprando neste momento. Isso muda o papel do comercial e do conteúdo: construir memória e confiança com quem vai comprar depois, e não só perseguir quem está pronto hoje.",
        dados: [
          { fonte: "LinkedIn B2B Institute · regra 95:5", url: "https://business.linkedin.com/marketing-solutions/b2b-institute/b2b-research/trends/95-5-rule",
            texto: "Cerca de 95% dos compradores potenciais não estão prontos para comprar hoje. Vão estar no futuro, e sai na frente a marca de que se lembrarem." },
          { fonte: "Edelman e LinkedIn · relatório de thought leadership B2B, 2024",
            texto: "Conteúdo com ponto de vista próprio influencia decisores a convidar para concorrências e a aceitar pagar mais." },
          { fonte: "a16z · Peter Levine",
            texto: "No começo, quem vende é o fundador. Se os fundadores não conseguem vender, um vendedor contratado dificilmente consegue." },
        ],
        frameworks: "Venda conduzida pelos fundadores. Conteúdo pilar reaproveitado em muitos formatos. Perfis pessoais costumam alcançar mais que a página da empresa.",
        paraImersao: "Quem da organização vende, e quanto tempo por semana isso ocupa de fato?" },

      { id: "p6", destaque: "11% → 48%",
        titulo: "Transformação com IA: ferramenta ou redesenho",
        pergunta: "Estamos dando ferramenta às pessoas, ou mudando como o trabalho é feito?",
        tese: "IA não gera valor porque mais gente usa. O ganho individual é real, mas raramente vira vantagem quando a organização em volta continua igual. O gargalo é redesenhar o trabalho, e ele é organizacional, não individual.",
        dados: [
          { fonte: "McKinsey Quarterly · \"Three horizons of AI transformation\", 2026",
            texto: "Só 11% das empresas redesenharam o trabalho com IA no centro, e 48% delas relatam valor real. Entre as que só liberaram ferramenta, 13%." },
          { fonte: "McKinsey Quarterly · mesmo estudo",
            texto: "Redesenhar o fluxo de trabalho aumenta em 5,3 vezes a chance de capturar valor, comparado a só dar acesso à ferramenta." },
          { fonte: "McKinsey Quarterly · mesmo estudo",
            texto: "70% das pessoas se dizem prontas para trabalhar com IA; só 27% dos líderes acham a organização pronta. A prontidão da organização pesa quase o dobro da individual: 48% contra 25%." },
          { fonte: "Nota de leitura",
            texto: "A amostra do estudo acima super-representa empresas avançadas. As razões (5,3 vezes, 70 contra 27) são mais robustas que as proporções como retrato do mercado." },
          { fonte: "MIT NANDA · The GenAI Divide, 2025",
            texto: "Cerca de 95% das iniciativas de IA generativa nas empresas não geraram retorno mensurável." },
          { fonte: "Gartner, 2025",
            texto: "Mais de 40% dos projetos de agentes de IA devem ser cancelados até o fim de 2027." },
          { fonte: "BCG · regra 10-20-70",
            texto: "Cerca de 10% do valor da IA vem dos algoritmos, 20% da tecnologia e dos dados, e 70% das pessoas e dos processos." },
        ],
        frameworks: "Três horizontes: dar acesso a ferramentas, automatizar fluxos de ponta a ponta, reinventar o modelo operacional. A confiança na organização é o fator que pesa nos três.",
        paraImersao: "Em que horizonte estamos? E o que precisaria mudar na forma de trabalhar, e não na ferramenta, para subir um?" },
    ],
  },

  // ---------------------------------------------------------------- leituras
  referencias: {
    intro: "As leituras de origem das pesquisas, com link conferido. Algumas exigem assinatura para ler inteiras. Referência é teto de input: a imersão deve ser quase toda saída.",
    itens: [
      { titulo: "Why Strategy Execution Unravels, and What to Do About It", tipo: "HBR · 2015",
        texto: "Sull, Homkes e Sull. O estudo que mostra que a execução falha na coordenação entre áreas, não no alinhamento.",
        url: "https://hbr.org/2015/03/why-strategy-execution-unravelsand-what-to-do-about-it" },
      { titulo: "Carta aos acionistas de 2016", tipo: "Amazon · 2016",
        texto: "Jeff Bezos. Decidir com 70% da informação, decisões de mão única e de mão dupla, discordar e se comprometer.",
        url: "https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders" },
      { titulo: "How Much Time and Energy Do We Waste Toggling Between Applications?", tipo: "HBR · 2022",
        texto: "O custo invisível de trocar de ferramenta o dia todo.",
        url: "https://hbr.org/2022/08/how-much-time-and-energy-do-we-waste-toggling-between-applications" },
      { titulo: "Putting Products into Services", tipo: "HBR · 2016",
        texto: "Mohanbir Sawhney. Por que empresas de serviço travam na margem e como produtizar.",
        url: "https://hbr.org/2016/09/putting-products-into-services" },
      { titulo: "Managing Price, Gaining Profit", tipo: "HBR · 1992",
        texto: "Marn e Rosiello. O artigo clássico sobre o peso do preço no lucro.",
        url: "https://hbr.org/1992/09/managing-price-gaining-profit" },
      { titulo: "The Only Thing That Matters", tipo: "Ensaio · 2007",
        texto: "Marc Andreessen. A definição de product/market fit.",
        url: "https://pmarchive.com/guide_to_startups_part4.html" },
      { titulo: "The 95-5 Rule", tipo: "LinkedIn B2B Institute",
        texto: "Por que a maior parte do mercado não está comprando agora, e o que isso muda.",
        url: "https://business.linkedin.com/marketing-solutions/b2b-institute/b2b-research/trends/95-5-rule" },
      { titulo: "Employee Engagement Drives Growth", tipo: "Gallup",
        texto: "A relação entre engajamento das equipes e resultado do negócio.",
        url: "https://www.gallup.com/workplace/236927/employee-engagement-drives-growth.aspx" },
    ],
  },
};
