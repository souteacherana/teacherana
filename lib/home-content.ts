// Todo o conteúdo editável da home.
// Ainda sem dado (ficam escondidos na página até serem preenchidos):
// mês, data e horário do workshop do mês e o percentual de vagas vendidas da Imersão Rise.

export const navLinks = [
  { label: "Formações", href: "#formacoes" },
  { label: "Workshop do mês", href: "#workshop" },
  { label: "Imersão Rise", href: "#rise" },
  { label: "Sobre", href: "#sobre" },
  { label: "Casos de sucesso", href: "#casos" },
  { label: "FAQ", href: "#faq" },
];

export const links = {
  instagram: "https://www.instagram.com/souteacherana/",
  whatsapp: "https://api.whatsapp.com/send?phone=5567992796191&text=Ol%C3%A1%2C%20quero%20conhecer%20os%20programas%20da%20Teacher%20Ana!",
  vaga: "https://teacherana.com.br/imersaorise2026/",
  workshop: "https://api.whatsapp.com/send?phone=5567992796191&text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20Workshops%20Pr%C3%A1ticos!",
};

export const dores = [
  { n: "01", titulo: "Agenda cheia, faturamento travado", texto: "Você trabalha muitas horas em aulas 1:1 e a renda simplesmente não cresce." },
  { n: "02", titulo: "Alunos só por indicação", texto: "Sem um fluxo previsível de captação, todo mês começa do zero." },
  { n: "03", titulo: "Instagram que não converte", texto: "Você posta com frequência, mas o perfil não vira matrícula." },
  { n: "04", titulo: "Medo de cobrar o que vale", texto: "Preço definido no improviso e baixa percepção de valor do seu ensino." },
];

export const formacoes = [
  { aba: "Turmas", categoria: "Turmas", titulo: "Vivendo Só de Turmas", texto: "Saia do 1:1 e monte turmas lucrativas, organizadas e escaláveis.", href: "#" },
  { aba: "Híbridas", categoria: "Modelo de aula", titulo: "Turmas Híbridas", texto: "O novo modelo de aula particular, com uma oferta mais inteligente.", href: "#" },
  { aba: "Instagram", categoria: "Instagram", titulo: "Descomplica Insta for Teachers", texto: "Transforme seu perfil em canal de atração e venda de alunos.", href: "#" },
  { aba: "Captação", categoria: "Captação", titulo: "Máquina de Alunos", texto: "Demanda previsível para parar de depender de indicação.", href: "#" },
  { aba: "Vendas", categoria: "Vendas", titulo: "Fechando Aluno Todo Dia", texto: "Uma rotina comercial que converte interessados em matrículas.", href: "#" },
  { aba: "High Ticket", categoria: "Posicionamento", titulo: "Professor High Ticket", texto: "Aumente seu ticket e a percepção de valor do seu ensino.", href: "#" },
  { aba: "Infoproduto", categoria: "Produto digital", titulo: "Infoproduto for Teachers", texto: "Do zero à venda do seu primeiro produto digital.", href: "#" },
];

export const workshop = {
  mes: "", // ex.: "Dezembro". Vazio = não aparece.
  titulo: ["Vivendo Só", "de Turmas"],
  texto:
    "Descubra como sair da dependência das aulas particulares e montar turmas que lotam — com mais faturamento e menos horas presas na agenda.",
  infos: [
    // Quando houver data: { rotulo: "Data", valor: "dd/mm" }, { rotulo: "Horário", valor: "00h00" },
    { rotulo: "Formato", valor: "Online e ao vivo" },
  ],
};

export const rise = {
  chamada: "Evento presencial · Alphaville - SP · Espaço Altus",
  texto:
    "Dois dias para sair do improviso e construir a estrutura do seu negócio de ensino: posicionamento, turmas, vendas e Instagram — ao vivo com a Teacher Ana e com quem já fez acontecer.",
  pilares: ["Plano de turmas", "Instagram que vende", "Rotina de vendas", "Networking"],
  vagasVendidas: null as number | null, // em %. null = faixa e barra de lotação não mostram o número.
};

export const numeros = [
  { valor: "+1.200", rotulo: "professores formados no Brasil e no exterior" },
  { valor: "+R$ 3M", rotulo: "em faturamento gerado pelos mentorados Rise" },
  { valor: "4", rotulo: "edições da Imersão Rise" },
  { valor: "4.9★", rotulo: "de satisfação dos alunos" },
];

// "citacao: true" quando o texto é a fala da própria teacher (aparece entre aspas).
export const casos = [
  {
    resultado: "R$ 26k",
    legenda: "por mês, com 15h de aula por semana",
    texto:
      "Em 1 ano: de 47h pra 15h por semana, de 11k pra 26k de faturamento, de 37 pra 82 alunos. Não trabalhei mais, trabalhei diferente. O problema nunca foi captação, era modelo de negócio.",
    citacao: true,
    nome: "Ana Paula Di Dio",
    cargo: "Teacher & Mentora",
  },
  {
    resultado: "R$ 18k",
    legenda: "por mês com turmas lucrativas",
    texto:
      "Cobrava R$ 45 a hora-aula, com a agenda lotada de segunda a sábado. Com o reposicionamento e a criação de turmas, a hora-aula passou de R$ 160 e o faturamento mensal ultrapassou R$ 18.000, com previsibilidade.",
    citacao: false,
    nome: "Teacher Driely",
    cargo: "Teacher de Idiomas",
  },
  {
    resultado: "R$ 12k",
    legenda: "por mês, com lista de espera",
    texto:
      "Dependia só de indicações ocasionais e não tinha processo de vendas. Com o roteiro comercial consultivo da Rise, converte mais de 70% das reuniões e mantém o faturamento acima de R$ 12.000 mensais.",
    citacao: false,
    nome: "Teacher Juliana",
    cargo: "Professora Particular & Empreendedora",
  },
];

export const sobre = {
  destaque: "Teacher, empresária e estrategista de negócios para professores de idiomas.",
  texto:
    "A Ana ajuda teachers a deixarem de atuar só como professores e construírem um negócio educacional lucrativo, estruturado e com autoridade no digital — com turmas, posicionamento e um Instagram que gera alunos de verdade.",
  numeros: [
    { valor: "2021", rotulo: "início no digital" },
    { valor: "+1.000", rotulo: "professores auxiliados" },
  ],
};

export const motivos = [
  { icone: "acompanhamento", titulo: "Acompanhamento direto", texto: "Proximidade e diagnóstico feitos pela própria Ana — não por um time genérico." },
  { icone: "metodo", titulo: "Método testado em sala", texto: "Estratégias aplicadas por teachers reais, com resultado em turmas e faturamento." },
  { icone: "comunidade", titulo: "Comunidade de teachers", texto: "Troque com professores que estão no mesmo momento que você." },
  { icone: "formato", titulo: "Um formato para cada fase", texto: "Workshops, formações e imersão presencial: comece pelo que faz sentido agora." },
] as const;

export const faq = [
  {
    p: "Para quem são os programas da Teacher Ana?",
    r: "São para professores de inglês e outros idiomas que já atuam com aulas particulares ou que desejam sair do modelo tradicional de escolas para construir seu próprio negócio lucrativo, estruturado e com liberdade de tempo.",
  },
  {
    p: "Eu preciso já faturar alto para entrar nas mentorias?",
    r: "Não! Temos uma esteira completa desenhada para cada momento. Se você está começando a precificar, o Preço Certo é o primeiro passo. Se você já tem alunos e quer acelerar para R$ 10k/mês de forma consistente, a Mentoria Partiu 10k é o programa ideal.",
  },
  {
    p: "O que é a Imersão Rise e onde ela acontece?",
    r: "A Imersão Rise é o nosso grande evento presencial de dois dias (em Alphaville - SP, no Espaço Altus) que reúne professores de todo o país para palestras estratégicas, dinâmicas práticas e networking de altíssimo nível.",
  },
  {
    p: "Como funciona o acompanhamento nas mentorias?",
    r: "Nas mentorias, você conta com diagnósticos individuais, encontros quinzenais ao vivo diretamente com a Teacher Ana, análise de propostas comerciais e acesso à comunidade exclusiva de mentorados.",
  },
  {
    p: "Quais são as formas de pagamento?",
    r: "Você pode pagar à vista via PIX, boleto bancário ou dividir em até 12x no cartão de crédito nas principais bandeiras.",
  },
];

export const rodape = [
  { titulo: "Formações", itens: formacoes.map((f) => ({ label: f.titulo, href: f.href })) },
  {
    titulo: "Eventos",
    itens: [
      { label: "Imersão Rise 2026", href: "#rise" },
      { label: "Workshop do mês", href: "#workshop" },
    ],
  },
  {
    titulo: "Teacher Ana",
    itens: [
      { label: "Sobre", href: "#sobre" },
      { label: "Casos de sucesso", href: "#casos" },
      { label: "Instagram @souteacherana", href: links.instagram },
    ],
  },
  {
    titulo: "Atendimento",
    itens: [
      { label: "WhatsApp", href: links.whatsapp },
      { label: "Perguntas frequentes", href: "#faq" },
    ],
  },
];
