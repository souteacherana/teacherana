// Todo o conteúdo editável da home. Itens entre [colchetes] são provisórios.

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
  whatsapp: "#", // TODO: link do WhatsApp da equipe
  vaga: "#rise", // TODO: link do checkout da Imersão Rise
  workshop: "#", // TODO: link de inscrição do workshop do mês
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
  mes: "[MÊS]",
  titulo: ["Vivendo Só", "de Turmas"],
  texto:
    "Descubra como sair da dependência das aulas particulares e montar turmas que lotam — com mais faturamento e menos horas presas na agenda.",
  infos: [
    { rotulo: "Data", valor: "[dd/mm]" },
    { rotulo: "Horário", valor: "[00h00]" },
    { rotulo: "Formato", valor: "Online e ao vivo" },
  ],
};

export const rise = {
  chamada: "Evento presencial · [DATA] · [CIDADE]",
  texto:
    "Dois dias para sair do improviso e construir a estrutura do seu negócio de ensino: posicionamento, turmas, vendas e Instagram — ao vivo com a Teacher Ana e com quem já fez acontecer.",
  pilares: ["Plano de turmas", "Instagram que vende", "Rotina de vendas", "Networking"],
  vagasVendidas: 85, // em %
};

export const numeros = [
  { valor: "+[000]", rotulo: "teachers formados" },
  { valor: "[00]", rotulo: "turmas abertas por alunas" },
  { valor: "[000]k", rotulo: "teachers acompanham no Instagram" },
  { valor: "[0]", rotulo: "edições da Imersão Rise" },
];

const casoModelo = {
  resultado: "[R$ 00k]",
  legenda: "[por mês com turmas]",
  texto: "[Depoimento da teacher — 2 a 3 linhas contando o antes e o depois de aplicar o método.]",
  nome: "[Nome da teacher]",
  cargo: "Professora de [idioma] · [cidade]",
};
export const casos = [casoModelo, casoModelo, casoModelo];

export const sobre = {
  destaque: "Teacher, empresária e estrategista de negócios para professores de idiomas.",
  texto:
    "A Ana ajuda teachers a deixarem de atuar só como professores e construírem um negócio educacional lucrativo, estruturado e com autoridade no digital — com turmas, posicionamento e um Instagram que gera alunos de verdade.",
  numeros: [
    { valor: "[00] anos", rotulo: "ensinando idiomas" },
    { valor: "+[000]", rotulo: "teachers impactados" },
    { valor: "[000]k", rotulo: "seguidores no Instagram" },
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
    p: "Para quem são os produtos da Teacher Ana?",
    r: "Para professores de idiomas que querem sair do improviso e crescer como negócio: formar turmas, atrair alunos pelo Instagram e vender com previsibilidade.",
  },
  { p: "Preciso ter muitos seguidores para começar?", r: "[Resposta]" },
  { p: "Os workshops são ao vivo? Ficam gravados?", r: "[Resposta]" },
  { p: "Funciona para professores de outros idiomas além do inglês?", r: "[Resposta]" },
  { p: "Por qual formação devo começar?", r: "[Resposta]" },
  { p: "Como funciona a Imersão Rise?", r: "[Resposta]" },
  { p: "Quanto tempo tenho de acesso aos conteúdos?", r: "[Resposta]" },
  { p: "Quais são as formas de pagamento?", r: "[Resposta]" },
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
