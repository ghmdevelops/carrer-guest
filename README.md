# Career Quest

Portfólio interativo em formato de jogo de plataforma 2D. O personagem anda pela fase e,
ao pular e bater por baixo nos blocos, cada etapa da carreira é revelada em um card
moderno. Pelo caminho há moedas para coletar e **bugs para esmagar** — metáfora direta de
uma carreira em QA. Interface bilíngue (PT/EN).

Dois tipos de bloco:

- **`?` dourado** — experiência profissional
- **`+` roxo** — formação acadêmica e certificações

Alguns blocos também cospem um item: **café** (velocidade), **escudo** (absorve um
esbarrão) e um **ovo de dino** que vira montaria.

## Stack

| Camada    | Escolha                                            |
| --------- | -------------------------------------------------- |
| Build     | Vite 8                                              |
| UI        | React 19 + TypeScript 7                             |
| Estilo    | Tailwind CSS v4 (`@tailwindcss/vite`)               |
| Animação  | Motion (`motion/react`) para cards e transições     |
| Física    | Game loop próprio em `requestAnimationFrame`        |
| Sprites   | Pixel art gerado por `box-shadow` (sem imagens)     |
| Áudio     | Web Audio API (sem dependências)                    |
| Fontes    | Fontsource (Press Start 2P + Space Grotesk), local  |

Não há assets binários: cenário, personagem e efeitos são todos CSS/SVG inline, então o
bundle é pequeno e nada depende de CDN externa.

## Comandos

```bash
npm install
npm run dev            # http://localhost:5173
npm run typecheck      # tsc --noEmit
npm run check:sprites  # valida a largura das linhas dos pixel maps
npm run build          # sprites + typecheck + build de produção em dist/
npm run preview        # serve o dist/
```

### Sprites

Personagem, bug e dino são pixel maps em `src/game/sprite.ts` — arrays de strings, um
caractere por pixel, convertidos em `box-shadow`. Para redesenhar, basta editar os
desenhos ASCII e as paletas.

| Sprite | Grade | Tamanho final |
| ------ | ----- | ------------- |
| Jogador | 16 x 18 | 64 x 72 px |
| Bug | 12 x 10 | 48 x 40 px |
| Dino | 18 x 14 | 72 x 56 px |

`npm run check:sprites` garante que todas as linhas de um sprite tenham a mesma largura —
o TypeScript não pega esse erro, já que tudo é `string[]`.

## Como personalizar

Praticamente tudo que é conteúdo vive em **`src/data/career.ts`**:

- `profile` — nome, título, localização e links de contato.
- `timeline` — a lista de etapas da carreira. **Cada item vira um bloco na fase**, na ordem
  do array (cronológica, por data de início). O campo `kind` decide o tipo de bloco:
  `'job'` gera o bloco dourado `?`, `'bonus'` gera o roxo `+`. A fase se ajusta sozinha ao
  tamanho da lista — largura, moedas, inimigos e posição da bandeira são calculados em
  `src/game/level.ts`.
- `skillGroups` — os cards de habilidades da tela final.

Campos `Localized` têm as chaves `pt` e `en`; o toggle de idioma no HUD troca entre elas.

Cada entrada tem um `accent` (cor hex) que colore o brilho do bloco, o card, as partículas
da explosão e as chips de stack.

Textos de interface ficam em `src/i18n/strings.ts`.

## Ajuste de jogabilidade

Todos os números de física estão em `src/game/constants.ts`.

Atenção ao alterar: a altura do pulo precisa vencer `BLOCK_BOTTOM - PLAYER_H`.

- Altura máxima do pulo = `JUMP_VELOCITY² / (2 * GRAVITY)`
- Altura mínima (toque rápido) = `MIN_JUMP_VELOCITY² / (2 * GRAVITY)`

Com os valores atuais: mínima ≈ 120px e máxima ≈ 169px, contra os 104px exigidos pelo
bloco — ou seja, qualquer pulo alcança a caixa, e segurar a tecla só dá folga extra.

### Inimigos

Os bugs patrulham um trecho fixo entre os blocos. Há quatro formas de resolver um bug:

| Forma | Condição |
| ----- | -------- |
| Pisão | cair em cima (`vy < 0` e pés acima de `BUG_H - STOMP_TOLERANCE`) |
| Giro  | estar com `spin > 0` — mata por qualquer direção |
| Dino  | estar montado — o dino come no contato |
| — | esbarrar sem nada disso gera knockback e `INVULN_TIME` de invulnerabilidade |

**Não existe morte nem game over, e isso é intencional.** Este é um portfólio: um
recrutador jamais pode ficar impedido de chegar a um bloco por dificuldade do jogo. Os
bugs criam tensão, não barreira.

### Power-ups

Definidos em `powerUpFor()` dentro de `src/game/level.ts` — é lá que se escolhe qual bloco
solta qual item. A distribuição é determinística, não aleatória, para que a experiência
seja sempre a mesma.

| Item | Efeito |
| ---- | ------ |
| Café | `COFFEE_SPEED_MULT` por `COFFEE_DURATION` segundos |
| Escudo | absorve um esbarrão e some |
| Ovo de dino | montaria permanente: `MOUNTED_JUMP_MULT`, `MOUNTED_SPEED_MULT` e come bugs |

Montado, a hitbox cresce de `PLAYER_H` para `MOUNTED_H`. Atenção ao mexer nesses números:
o pulo mínimo montado ainda precisa vencer `BLOCK_BOTTOM - MOUNTED_H`.

### Giro

Apertar pulo uma segunda vez no ar dispara o giro: mata bugs por qualquer lado e planeia a
queda em `SPIN_FALL_SPEED`. Um giro por pulo — `spinUsed` só zera ao tocar o chão ou o topo
de um bloco. Visualmente é um `rotateY` sem perspectiva, que em pixel art lê como giro.

## Controles

| Ação  | Teclado                | Touch                   |
| ----- | ---------------------- | ----------------------- |
| Andar | `A` / `D` ou setas     | botões `<` e `>`        |
| Pular | `Espaço`, `W` ou `↑`   | botão redondo à direita |
| Giro no ar | `Espaço` de novo durante o pulo | tocar o botão de pulo de novo |
| Esmagar bug | pular e cair em cima | idem |
| Fechar card | `Esc`, `Enter` ou `Espaço` | botão `X` / fora do card |

### Celular e tablet

Os controles na tela aparecem via `@media (pointer: coarse), (max-width: 767px)` — por
dispositivo de entrada, não só por largura, senão um tablet de 800px ficaria sem controle
nenhum. O hook `useCoarsePointer` em `src/game/useInput.ts` espelha esse mesmo critério
para a tela inicial mostrar os botões em vez das teclas.

A `.stage` usa `touch-action: manipulation`, **não** `none`. Com `none`, a rolagem por
toque seria bloqueada em todos os elementos filhos — incluindo a tela inicial e os cards
de experiência, que ficariam impossíveis de ler no celular. As telas sobrepostas ainda
recebem a classe `.scroll-overlay` (`touch-action: pan-y`) para deixar a intenção
explícita.

## Estrutura

```
src/
  data/career.ts        conteúdo (edite aqui)
  i18n/                 strings + contexto de idioma
  game/
    constants.ts        física, dimensões e parâmetros de game feel
    level.ts            gera blocos, moedas, inimigos e power-ups da timeline
    sprite.ts           frames de pixel art (player, bug, dino) -> box-shadow
    audio.ts            efeitos sonoros via Web Audio
    useInput.ts         teclado + touch
    useGameEngine.ts    loop, gravidade, colisões, inimigos, câmera, shake
  components/           cenário, HUD, partículas, telas e cards
```

O loop escreve direto no DOM (`style.transform` e as CSS vars `--cam`, `--shake-x`,
`--shake-y`) em vez de usar estado do React, então rodar a 60fps não dispara re-render. O
React só re-renderiza em eventos discretos: bloco descoberto, moeda coletada, bug esmagado,
fim de fase.

As partículas vivem em `ParticleLayer`, que mantém o próprio estado e expõe uma API
imperativa por ref. Assim a poeira de corrida (4x por segundo) não re-renderiza a árvore
inteira do jogo.

## Deploy

Build estático puro: `npm run build` gera `dist/`. O `base: './'` no `vite.config.ts` usa
caminhos relativos, então o site funciona em qualquer subdiretório sem configuração extra.

### Netlify

O `netlify.toml` na raiz já define tudo — comando, pasta publicada, versão do Node e
headers de cache. Basta conectar o repositório em **Add new site → Import an existing
project** e aceitar as configurações detectadas.

Dois detalhes que fazem esse deploy funcionar:

1. **O `.npmrc` não é versionado.** Ele aponta para o Artifactory corporativo, que os
   servidores da Netlify não alcançam. Está no `.gitignore`.
2. **O `package-lock.json` aponta para `registry.npmjs.org`.** Foi gerado atrás do
   Artifactory, então as URLs precisaram ser reescritas. Os hashes de `integrity`
   continuam válidos, porque o Artifactory apenas revende os mesmos tarballs.

Na rede corporativa isso continua funcionando: o npm tem `replace-registry-host=npmjs` por
padrão, ou seja, troca sozinho as URLs do npmjs.org pelo registry configurado.

**Nunca rode `npm install` e comite o lockfile resultante** sem reescrever as URLs de
volta — isso republica os endereços do Artifactory e quebra o build da Netlify.

### Outras hospedagens

`dist/` é estático puro, então Vercel, GitHub Pages, S3 ou qualquer servidor de arquivos
servem. Só o `netlify.toml` é específico.
