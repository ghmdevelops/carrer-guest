// ============================================================================
// CONTEÚDO DO PORTFÓLIO.
// A fase do jogo é gerada a partir de `timeline`: cada entrada vira um bloco
// na ordem em que aparece aqui (cronológica, por data de início).
//   kind: 'job'   -> bloco dourado "?"  (experiência profissional)
//   kind: 'bonus' -> bloco roxo "+"     (formação, cursos, certificações)
// ============================================================================

export type Locale = 'pt' | 'en'

export interface Localized {
  pt: string
  en: string
}

export interface LocalizedList {
  pt: string[]
  en: string[]
}

export type EntryKind = 'job' | 'bonus'

export interface TimelineEntry {
  id: string
  kind: EntryKind
  company: string
  badge: string
  accent: string
  period: Localized
  role: Localized
  location: Localized
  summary: Localized
  highlights: LocalizedList
  stack: string[]
}

export interface SkillGroup {
  label: Localized
  items: string[]
}

export interface ProfileLink {
  label: string
  url: string
  icon: string
}

export interface Profile {
  name: string
  title: Localized
  intro: Localized
  /** Explica, na tela inicial, o que e o projeto e por que ele existe. */
  about: {
    what: Localized
    why: Localized
  }
  location: Localized
  links: ProfileLink[]
}

export const profile: Profile = {
  name: 'Gehaime Barros',
  title: {
    pt: 'Lead Quality Engineer · Desenvolvedor Full Stack',
    en: 'Lead Quality Engineer · Full Stack Developer',
  },
  intro: {
    pt: 'Mais de 10 anos entre qualidade e desenvolvimento de software. Lidero times de QA, construo frameworks de automação em Java, Python e JavaScript e desenvolvo soluções full stack — de pipelines CI/CD a aplicações web de ponta a ponta.',
    en: 'Over 10 years across software quality and development. I lead QA teams, build automation frameworks in Java, Python and JavaScript, and ship full stack solutions — from CI/CD pipelines to end-to-end web applications.',
  },
  about: {
    what: {
      pt: 'Um currículo interativo em formato de jogo. Cada bloco desta fase revela uma etapa real da minha trajetória: experiências, formação e certificações.',
      en: 'An interactive résumé shaped like a game. Every block in this stage reveals a real step of my path: roles, education and certifications.',
    },
    why: {
      pt: 'Porque um PDF não mostra como eu penso nem o que sei construir. Este site foi feito do zero em React e TypeScript, com física, sprites e efeitos próprios, sem nenhuma engine de jogo. Ele é o portfólio e a demonstração ao mesmo tempo.',
      en: 'Because a PDF shows neither how I think nor what I can build. This site was built from scratch in React and TypeScript, with custom physics, sprites and effects, and no game engine. It is the portfolio and the proof at once.',
    },
  },
  location: {
    pt: 'São Paulo, Brasil',
    en: 'São Paulo, Brazil',
  },
  links: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/gehaime-barros', icon: 'in' },
    { label: 'E-mail', url: 'mailto:gehaime.barros94@outlook.com', icon: '@' },
  ],
}

export const timeline: TimelineEntry[] = [
  {
    id: 'pgu',
    kind: 'job',
    company: 'Procuradoria Geral da União',
    badge: '1UP',
    accent: '#22d3ee',
    period: { pt: '02/2015 – 09/2016', en: 'Feb 2015 – Sep 2016' },
    role: { pt: 'Analista de Suporte Técnico', en: 'Technical Support Analyst' },
    location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
    summary: {
      pt: 'O primeiro checkpoint: suporte técnico, infraestrutura e o gosto por consertar o que estava quebrado.',
      en: 'The first checkpoint: technical support, infrastructure and the taste for fixing what was broken.',
    },
    highlights: {
      pt: [
        'Otimizei sistemas, com aumento de 15% em eficiência.',
        'Reduzi downtime em 15% com manutenção preventiva.',
        'Atendimento via Help Desk, resolvendo 90% das solicitações no primeiro contato.',
      ],
      en: [
        'Optimized systems, increasing efficiency by 15%.',
        'Cut downtime by 15% through preventive maintenance.',
        'Help Desk support, solving 90% of requests on first contact.',
      ],
    },
    stack: ['Help Desk', 'Suporte Técnico', 'Infraestrutura'],
  },
  {
    id: 'cognizant',
    kind: 'job',
    company: 'Cognizant',
    badge: 'QA',
    accent: '#a78bfa',
    period: { pt: '01/2016 – 12/2017', en: 'Jan 2016 – Dec 2017' },
    role: { pt: 'Quality Engineer', en: 'Quality Engineer' },
    location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
    summary: {
      pt: 'Entrada no mundo de QA: os primeiros scripts de automação, ainda em VBScript.',
      en: 'Entering the QA world: the first automation scripts, still in VBScript.',
    },
    highlights: {
      pt: [
        'Desenvolvi scripts VBScript para testes web e desktop (QTP).',
        'Implementei testes baseados em dados utilizando planilhas Excel.',
        'Gerenciei casos de teste via Quality Center.',
      ],
      en: [
        'Built VBScript scripts for web and desktop testing (QTP).',
        'Implemented data-driven testing using Excel spreadsheets.',
        'Managed test cases through Quality Center.',
      ],
    },
    stack: ['VBScript', 'QTP', 'Quality Center', 'Excel'],
  },
  {
    id: 'infosys',
    kind: 'job',
    company: 'Infosys',
    badge: 'AUTO',
    accent: '#f472b6',
    period: { pt: '06/2017 – 12/2018', en: 'Jun 2017 – Dec 2018' },
    role: { pt: 'Quality Engineer', en: 'Quality Engineer' },
    location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
    summary: {
      pt: 'Level up técnico: Java, Selenium e os primeiros frameworks de automação integrados a CI/CD.',
      en: 'Technical level up: Java, Selenium and the first automation frameworks wired into CI/CD.',
    },
    highlights: {
      pt: [
        'Automatizei testes web com Java e Selenium.',
        'Desenvolvi e mantive frameworks de automação.',
        'Integrei testes a pipelines CI/CD com Jenkins.',
        'Gerei relatórios detalhados de resultados de testes.',
      ],
      en: [
        'Automated web testing with Java and Selenium.',
        'Built and maintained automation frameworks.',
        'Wired tests into CI/CD pipelines with Jenkins.',
        'Produced detailed test result reports.',
      ],
    },
    stack: ['Java', 'Selenium', 'Jenkins', 'CI/CD'],
  },
  {
    id: 'keeggo',
    kind: 'job',
    company: 'Keeggo',
    badge: 'API',
    accent: '#fbbf24',
    period: { pt: '01/2019 – 12/2019', en: 'Jan 2019 – Dec 2019' },
    role: { pt: 'Quality Engineer', en: 'Quality Engineer' },
    location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
    summary: {
      pt: 'Consultoria em campo: frameworks de automação sob medida para Banco BV e Carrefour.',
      en: 'Consulting in the field: tailored automation frameworks for Banco BV and Carrefour.',
    },
    highlights: {
      pt: [
        'Banco BV: automatizei testes com RSpec e Cucumber, ampliando a cobertura de APIs.',
        'Carrefour: desenvolvi frameworks em Python (pytest, Selenium, Robot Framework), reduzindo defeitos pós-release em 25%.',
        'Gerenciei pipelines CI/CD no Jenkins para entrega contínua.',
        'Criação e manutenção de scripts de testes automatizados, assegurando consistência e qualidade.',
      ],
      en: [
        'Banco BV: automated testing with RSpec and Cucumber, expanding API coverage.',
        'Carrefour: built Python frameworks (pytest, Selenium, Robot Framework), cutting post-release defects by 25%.',
        'Managed CI/CD pipelines on Jenkins for continuous delivery.',
        'Created and maintained automated test scripts, ensuring consistency and quality.',
      ],
    },
    stack: ['Python', 'pytest', 'Robot Framework', 'RSpec', 'Cucumber', 'Selenium', 'Jenkins'],
  },
  {
    id: 'f1rst',
    kind: 'job',
    company: 'F1RST Tecnologia',
    badge: 'LEAD',
    accent: '#34d399',
    period: { pt: '03/2020 – Atual', en: 'Mar 2020 – Present' },
    role: {
      pt: 'Lead Quality Engineer · Líder de Qualidade e Automação',
      en: 'Lead Quality Engineer · QA & Automation Lead',
    },
    location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
    summary: {
      pt: 'A fase atual: liderança de um time de 12 pessoas e projetos críticos de pagamento rodando em produção.',
      en: 'The current stage: leading a team of 12 and critical payment projects running in production.',
    },
    highlights: {
      pt: [
        'Coordeno 12 profissionais de QA, garantindo qualidade end-to-end no ciclo de desenvolvimento.',
        'Implementei automação de testes E2E e de API, elevando a cobertura em 40% e reduzindo defeitos em produção.',
        'Desenvolvi ferramentas internas para otimizar processos de QA e integração contínua (Jenkins).',
        'Entreguei projetos críticos: FGTS, PIX Parcelado, CPI, Consignado e operações 24x7.',
        'Promovo inovação e melhoria contínua através de rituais regulares com o time.',
      ],
      en: [
        'Lead 12 QA professionals, ensuring end-to-end quality across the development cycle.',
        'Implemented E2E and API test automation, raising coverage by 40% and cutting production defects.',
        'Built internal tooling to streamline QA processes and continuous integration (Jenkins).',
        'Delivered critical projects: FGTS, PIX Parcelado, CPI, Consignado and 24x7 operations.',
        'Drive innovation and continuous improvement through regular team rituals.',
      ],
    },
    stack: ['Java', 'Python', 'Selenium', 'Appium', 'Postman', 'Jenkins', 'CI/CD'],
  },
  {
    id: 'anhembi',
    kind: 'bonus',
    company: 'Universidade Anhembi Morumbi',
    badge: 'BSC',
    accent: '#818cf8',
    period: { pt: '01/2021 – 07/2024', en: 'Jan 2021 – Jul 2024' },
    role: { pt: 'Bacharelado em Ciência da Computação', en: "Bachelor's in Computer Science" },
    location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
    summary: {
      pt: 'Graduação cursada em paralelo à liderança do time de QA.',
      en: 'Degree earned while leading the QA team full time.',
    },
    highlights: {
      pt: [
        'Foco em desenvolvimento de software, algoritmos e estruturas de dados.',
        'Inteligência artificial e sistemas distribuídos.',
        'Projetos práticos de aplicações, análise de dados e sistemas de automação.',
      ],
      en: [
        'Focus on software development, algorithms and data structures.',
        'Artificial intelligence and distributed systems.',
        'Hands-on projects in applications, data analysis and automation systems.',
      ],
    },
    stack: ['Algoritmos', 'Estruturas de Dados', 'IA', 'Sistemas Distribuídos'],
  },
  {
    id: 'igti',
    kind: 'bonus',
    company: 'IGTI',
    badge: 'FULL',
    accent: '#c084fc',
    period: { pt: '01/2022 – 11/2024', en: 'Jan 2022 – Nov 2024' },
    role: { pt: 'Tecnólogo em Desenvolvimento Full Stack', en: 'Full Stack Development Degree' },
    location: { pt: 'São Paulo, SP', en: 'São Paulo, Brazil' },
    summary: {
      pt: 'Bootcamp full stack: a ponte entre QA e desenvolvimento de produto.',
      en: 'Full stack bootcamp: the bridge between QA and product development.',
    },
    highlights: {
      pt: [
        'Front-end com HTML, CSS, JavaScript e React.',
        'Back-end com Node.js, Express e APIs RESTful.',
        'Bancos de dados MongoDB e SQL.',
        'Aplicações web completas, da concepção à implementação.',
      ],
      en: [
        'Front-end with HTML, CSS, JavaScript and React.',
        'Back-end with Node.js, Express and RESTful APIs.',
        'MongoDB and SQL databases.',
        'Complete web applications, from concept to deployment.',
      ],
    },
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Scrum'],
  },
  {
    id: 'certificacoes',
    kind: 'bonus',
    company: 'Certificações',
    badge: 'CERT',
    accent: '#2dd4bf',
    period: { pt: '2024', en: '2024' },
    role: { pt: 'Cursos e especializações', en: 'Courses and specializations' },
    location: { pt: 'Udemy e Santander', en: 'Udemy and Santander' },
    summary: {
      pt: 'Sete formações concluídas em 2024, entre técnica, liderança e qualidade.',
      en: 'Seven certifications completed in 2024, across tech, leadership and quality.',
    },
    highlights: {
      pt: [
        'Gestão da Qualidade e Metodologia Lean Six Sigma — Santander.',
        'Desenvolvimento Web Completo — Udemy.',
        'Python para Data Science e Machine Learning — Udemy.',
        'Desenvolvimento de Aplicativos Móveis com React Native — Udemy.',
        'Liderança e Gestão de Equipes — Udemy.',
        'Gestão de Tempo e Produtividade — Udemy.',
        'Gestão de Mudanças Organizacionais — Udemy.',
      ],
      en: [
        'Quality Management and Lean Six Sigma — Santander.',
        'Complete Web Development — Udemy.',
        'Python for Data Science and Machine Learning — Udemy.',
        'Mobile App Development with React Native — Udemy.',
        'Leadership and Team Management — Udemy.',
        'Time Management and Productivity — Udemy.',
        'Organizational Change Management — Udemy.',
      ],
    },
    stack: ['Lean Six Sigma', 'Data Science', 'React Native', 'Liderança'],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    label: { pt: 'Linguagens', en: 'Languages' },
    items: ['Java', 'Python', 'JavaScript', 'C#', 'VBScript'],
  },
  {
    label: { pt: 'Automação & Testes', en: 'Automation & Testing' },
    items: ['Selenium', 'Appium', 'pytest', 'Robot Framework', 'Cucumber', 'Postman'],
  },
  {
    label: { pt: 'DevOps & Infra', en: 'DevOps & Infra' },
    items: ['Jenkins', 'Docker', 'Git', 'CI/CD', 'SOA e Microservices'],
  },
  {
    label: { pt: 'Banco de Dados', en: 'Databases' },
    items: ['MySQL', 'MongoDB', 'SQL'],
  },
  {
    label: { pt: 'Metodologias', en: 'Methodologies' },
    items: ['Scrum', 'Kanban', 'Lean Software', 'DevOps'],
  },
  {
    label: { pt: 'Idiomas', en: 'Spoken languages' },
    items: ['Português (nativo)', 'Inglês (fluente)', 'Espanhol (intermediário)'],
  },
]
