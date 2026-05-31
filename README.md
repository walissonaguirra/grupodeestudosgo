# 🐹 Grupo de Estudos Go

Site do grupo de estudos de Go do **Cesar Gimenes**. Calls todo **sábado às 14h** no Discord,
ao vivo e gravadas pro YouTube. Feito em [Hugo](https://gohugo.io) e hospedado no GitHub Pages.

## O que tem aqui
- ⏱️ **Timer** com contagem regressiva pra próxima call (fuso `America/Sao_Paulo`, com estado "ao vivo" no sábado das 14h às 17h).
- 🎠 **Carrossel** de calls — próxima em destaque + arquivo das anteriores com link do vídeo.
- 🤖 **Reset automático**: todo sábado 17h uma GitHub Action cria o post "Tema a definir" da semana seguinte.
- 🔥 **Easter egg** infernal (clica no botão no canto… ou não 😈).

## Quero apresentar numa call
1. Edite o post default da próxima call em `content/calls/<data>-tema-a-definir.md` (ou crie um novo).
2. Preencha o front matter:
   ```yaml
   title: "Meu tema incrível"
   presenter: "seu-usuario-github"   # vira seu avatar no card
   repo: "https://github.com/.../material"
   status: "scheduled"
   ```
3. Abra um **Pull Request**. Depois da call, edite de novo pra adicionar `youtube: "<link>"` e `status: "done"`.

## Rodar localmente
```bash
hugo server -D        # http://localhost:1313
hugo --minify         # build de produção em ./public
```

## Configuração
| Onde | O quê |
|------|-------|
| `hugo.toml` → `[params]` | links de Discord/Telegram/YouTube/GitHub |
| `data/members.yaml` | `driver` (Cesar) e `passengers` do ônibus 🚌, + falas dos balões |
| `static/audio/highway.mp3` | música do easter egg (veja `static/audio/README.md` — não embarcamos o oficial por direitos autorais) |

## Publicar no GitHub Pages
1. Crie o repositório `grupodeestudosgo` no GitHub e dê push da branch `main`.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. O workflow `.github/workflows/deploy.yml` builda e publica a cada push em `main`.
   O `baseURL` é resolvido automaticamente — não precisa editar o `hugo.toml` pra apontar pra sua conta.

## O ônibus pro inferno 🚌🔥
Piada interna: o Cesar é o "motorista do ônibus pro inferno" porque vive sugerindo solução de
baixo nível (WebAssembly, Assembly, kernel…) — e no fim **todo mundo embarca**. Clicar no botão 🔥
escurece o site progressivamente, toca a música, traz o ônibus com os avatares do GitHub (motorista
= `driver`, passageiros = `passengers`), solta brasas, faz a borda pulsar no ritmo e mostra os balões
de fala. `Esc` ou o botão 🧯 apagam o inferno.
