# AGENTS.md

Notas de ambiente e convenções para quem (ou o que) for trabalhar neste repositório.

## Ambiente

- Node v25.6.1, npm 11.9.0 (Windows / PowerShell).
- Headless do Chrome/Edge está **bloqueado por política da máquina**
  (`Headless mode is disallowed by the system admin`). Não dá para tirar screenshot nem
  rodar testes de browser automatizados localmente — a verificação visual é manual.

## Registry npm (importante)

O `~/.npmrc` do usuário aponta para o Artifactory corporativo e contém um `_authToken`
**expirado**, o que faz qualquer `npm install` falhar com `E401`.

O registry público (`registry.npmjs.org`) está **bloqueado pelo proxy** (`E403`).

O Artifactory aceita **leitura anônima**. Por isso existe um `.npmrc` na raiz deste projeto
que zera o token herdado:

```ini
registry=http://artifactory.santanderbr.corp/artifactory/api/npm/npm-all/
//artifactory.santanderbr.corp/artifactory/api/npm/npm-all/:_authToken=
strict-ssl=false
```

Não remova esse arquivo sem antes renovar o token global — e não edite o `~/.npmrc` do
usuário sem pedir.

**Esse `.npmrc` está no `.gitignore` de propósito.** Se ele for versionado, o build da
Netlify quebra, porque os servidores dela não alcançam o Artifactory.

### Lockfile e deploy

O `package-lock.json` versionado aponta para `https://registry.npmjs.org/`, não para o
Artifactory. Isso é obrigatório para a Netlify conseguir instalar.

Como o npm usa `replace-registry-host=npmjs` por padrão, ele troca sozinho essas URLs pelo
registry configurado — então o install local continua passando pelo Artifactory
normalmente.

**Cuidado:** um `npm install` aqui reescreve o lockfile com URLs do Artifactory. Se isso
acontecer, reverta antes de comitar, trocando
`http://artifactory.santanderbr.corp/artifactory/api/npm/npm-all/` por
`https://registry.npmjs.org/`. Os hashes de `integrity` não mudam — é o mesmo tarball.

## Comandos de verificação

```bash
npm run typecheck      # tsc --noEmit
npm run check:sprites  # valida a largura das linhas dos pixel maps
npm run build          # sprites + typecheck + build de produção
npm run dev            # servidor local em :5173
```

Não há ESLint configurado; `check:sprites` + `typecheck` + `build` são o portão de
qualidade.

### Por que existe o check:sprites

Os sprites em `src/game/sprite.ts` são arrays de strings, um caractere por pixel. Uma
coluna a mais ou a menos numa linha deforma o desenho inteiro e **o TypeScript não tem
como perceber** — o tipo continua `string[]`. O script compara a largura de todas as
linhas de cada sprite e falha apontando a linha errada. Ele roda antes do `tsc` no build.

### Matemática que precisa continuar válida

Ao mexer em altura de sprite ou em física, confira que o pulo mínimo ainda alcança a base
do bloco, a pé e montado:

- a pé: `MIN_JUMP_VELOCITY² / (2·GRAVITY)` >= `BLOCK_BOTTOM − PLAYER_H`
- montado: `(MIN_JUMP_VELOCITY·MOUNTED_JUMP_MULT)² / (2·GRAVITY)` >= `BLOCK_BOTTOM − MOUNTED_H`

Valores atuais: 120.3 >= 96 (margem 24.3) e 161.9 >= 64 (margem 97.9).

## Dependências

Versões são **fixadas exatamente** (sem `^`/`~`) e escolhidas com pelo menos 7 dias de
publicação. Para conferir a data de uma versão antes de adicionar:

```powershell
npm view <pacote> time --json | ConvertFrom-Json
```

## Convenções de código

- TypeScript estrito (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`).
- Sem enums e sem parameter properties (`erasableSyntaxOnly`).
- Estado de alta frequência (posição do player, câmera) **não** passa por estado do React:
  o game loop escreve direto em `style.transform` e na CSS var `--cam`. Só eventos
  discretos usam `useState`.
- Conteúdo textual nunca é hardcoded em componentes: vai para `src/data/career.ts`
  (dados) ou `src/i18n/strings.ts` (interface), sempre com as chaves `pt` e `en`.
- Arquivos em UTF-8 sem BOM; acentuação em português é esperada e funciona.
