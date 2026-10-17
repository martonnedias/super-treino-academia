// Fonte única dos dados do site. Tudo que está marcado "confirmar" veio das capturas
// do Google/Instagram enviadas em 12/10/2026 e precisa ser validado com o proprietário.
// Valores desconhecidos usam o marcador [..] e aparecem destacados em amarelo no site.

export const brand = {
  name: 'Super Treino Academia',
  instagram: 'supertreinoacademia',
  instagramUrl: 'https://www.instagram.com/supertreinoacademia/',
  city: 'Teresina',
  state: 'PI',
  closes: '22:00',
  // Média ponderada das 283 avaliações do Google (160 · 47 · 76).
  rating: '4,7',
  reviews: 283,
};

export const colors = {
  blue: '#1E3FA8',
  yellow: '#FFC400',
  ink: '#0B0B0F',
  orange: '#FF7A1A',
};

const ph = (t) => `<span class="ph">[${t}]</span>`;

// WhatsApp: números do Google Meu Negócio. confirmar:
//  - Parque Jurema aparece com DDD (88) e o mesmo final de Renascença II (99442-7681).
export const units = [
  {
    slug: 'itarare',
    name: 'Itararé',
    num: '01',
    street: 'R. Antônio Neves de Melo, 4636',
    district: 'Parque Ideal',
    cep: '64077-820',
    reference: 'próx. à caixa d’água',
    phone: '(86) 98813-6841',
    waNumber: '5586988136841',
    rating: '4,7',
    reviews: 160,
    category: 'Academia',
    confirm: [],
    sat: '8:00 às 12:00 e a partir das 16:00 ' + ph('fim a confirmar'),
    satStart: '8:00',
    satNote: 'Sábado: 8:00 às 12:00 e a partir das 16:00',
    dance: { days: [1, 3], time: '19:00' }, // índice 0 = Seg ... ter=1, qui=3
    images: {
      a: ['pesos-livres.webp', 'Área de pesos livres com halteres e bancos azuis'],
      c: ['pesos-livres.webp', 'Área de pesos livres com halteres e bancos azuis'],
      d: ['pesos-livres.webp', 'Área de pesos livres com halteres e bancos azuis'],
    },
  },
  {
    slug: 'parque-jurema',
    name: 'Parque Jurema',
    num: '02',
    street: 'R. Des. Antero Resende, 4344',
    district: 'Extrema',
    cep: '64076-380',
    reference: '',
    phone: '(88) 99442-7681',
    waNumber: '5588994427681',
    rating: '4,6',
    reviews: 47,
    category: 'Academia',
    confirm: ['DDD (88) e número igual ao de Renascença II', 'Endereço: Google diz “R. Des. Antero Resende”, Instagram diz “Rua 03”'],
    sat: '16:00 às 19:30',
    satStart: '16:00',
    satNote: 'Sábado: 16:00 às 19:30',
    dance: { days: [0, 2], time: '19:20' },
    images: {
      a: ['esteiras.webp', 'Área de esteiras e bicicletas ao entardecer'],
      c: ['esteiras.webp', 'Área de esteiras e bicicletas ao entardecer'],
      d: ['esteiras.webp', 'Área de esteiras e bicicletas ao entardecer'],
    },
  },
  {
    slug: 'renascenca-ii',
    name: 'Renascença II',
    num: '03',
    street: 'Rua José Almeida Coelho, Qd 43, Casa 32',
    district: 'Conj. Renascença II',
    cep: '64082-578',
    reference: '',
    phone: '(86) 99442-7681',
    waNumber: '5586994427681',
    rating: '4,6',
    reviews: 76,
    category: 'Sala de fitness',
    confirm: ['Número igual ao de Parque Jurema'],
    sat: '16:00 às 19:30',
    satStart: '16:00',
    satNote: 'Sábado: 16:00 às 19:30',
    dance: { days: [0, 2], time: '18:20' },
    images: {
      a: ['funcional.webp', 'Turma de funcional treinando junta'],
      c: ['instrutor.webp', 'Instrutor ajudando um aluno no aparelho'],
      d: ['instrutor.webp', 'Instrutor ajudando um aluno no aparelho'],
    },
  },
];

// Planos vistos no story "planos mensal" de Itararé (~38 semanas): confirmar se estão vigentes.
// Das outras duas unidades não há valores nas capturas: o site mostra estes como referência.
export const plans = [
  { id: 'mensal', name: 'Mensal', months: 1, price: 85, parcels: 1 },
  { id: 'bimestral', name: 'Bimestral', months: 2, price: 150, parcels: 2 },
  { id: 'trimestral', name: 'Trimestral', months: 3, price: 210, parcels: 3 },
  { id: 'semestral', name: 'Semestral', months: 6, price: 420, parcels: 6, best: true },
];

export const faq = [
  { q: 'Como funciona a aula experimental?', a: 'Você escolhe a unidade, toca em agendar e a conversa abre no WhatsApp com a mensagem pronta. A equipe confirma dia e horário com você. [duração e condições da aula experimental a confirmar]' },
  { q: 'Nunca treinei. Posso começar?', a: 'Pode. A sala de musculação e as aulas recebem quem está começando, e os instrutores acompanham você nos primeiros passos.' },
  { q: 'Até que horas a academia funciona?', a: 'As unidades atendem até as 22:00 nos dias úteis. Os horários de abertura, de sábado e de feriados ficam na página de cada unidade. [abertura e domingo a confirmar]' },
  { q: 'Como são as aulas de dança e funcional?', a: 'A linha Energia & Diversão reúne aulas animadas para treinar se divertindo. A grade com dias e horários fica na página da unidade.' },
  { q: 'Quais as formas de pagamento?', a: 'Os planos bimestral, trimestral e semestral podem ser parcelados em até 2x, 3x e 6x. [formas de pagamento, matrícula e fidelidade a confirmar]' },
];

export const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Quem somos. Missão, visão e valores são uma PROPOSTA escrita a partir do que está no PRD
// (clima de família, preço justo, dança, atenção ao aluno). Validar com o proprietário.
export const about = {
  lead: 'Somos uma academia de bairro com três unidades em Teresina. Aqui treinar é simples: espaço de sobra, preço à vista e gente que recebe você pelo nome.',
  draft: 'rascunho: missão, visão e valores a validar com o proprietário',
  mission: 'Tornar o treino acessível e acolhedor para quem vive em Teresina, com preço justo, atenção de verdade e um ambiente onde todo mundo se sente em casa.',
  vision: 'Ser a academia da família em Teresina: a que cada bairro escolhe para começar a treinar e continua por muitos anos. [meta de crescimento a definir]',
  values: [
    { t: 'Acolhimento', d: 'Quem chega pela primeira vez é recebido com atenção. Nas avaliações, os alunos dizem “me sinto em casa”.' },
    { t: 'Preço justo', d: 'Planos e valores à vista, do mensal ao semestral, sem pegadinha.' },
    { t: 'Energia & diversão', d: 'Treinar não precisa ser pesado: aulas de dança com música alta, turma animada e confete.' },
    { t: 'Atenção ao aluno', d: 'Instrutores que acompanham do iniciante ao avançado.' },
    { t: 'Estrutura de sobra', d: 'Salas amplas e aparelhos para treinar o corpo todo.' },
  ],
  proof: 'São 283 avaliações no Google, com notas entre 4,6 e 4,7, e 22,4 mil pessoas que acompanham a academia no Instagram.',
  history: '[história da academia: ano de fundação, nome do proprietário e como tudo começou]',
};
