# Grupo de Estudos Go

Site do grupo de estudos de Go do **Cesar Gimenes**. Call todo **sábado às 14h** no Discord, gravada pro YouTube. É um site estático (sem build, sem framework): um `index.html` que referencia uns poucos arquivos de CSS/JS. Hospedado no GitHub Pages.

## Estrutura

```
index.html                  # a página (HTML)
assets/vendor/bootstrap.min.css
assets/css/main.css         # estilos da home
assets/css/hell.css         # estilos do easter egg
assets/js/countdown.js      # contagem regressiva
assets/js/hell.js           # o easter egg do ônibus
assets/data/lines.js        # as falas dos balões (driverLines/crowdLines)
audio/highway.mp3           # trilha do easter egg
```

## Atualizar o card da home

Abra o `index.html` e procure pelo bloco `info-card`:

```html
<h2 class="h4 mb-2">Toda semana tem call de Go!</h2>
<p class="mb-0 fs-5 text-secondary">A gente se encontra todo sábado às 14h...</p>
```

O `<h2>` é o título e o `<p>` é a mensagem. Os links (Discord/Telegram/YouTube/GitHub)
ficam logo acima, nos `href` dos botões `btn-brand`. Salvou e deu push, o site atualiza sozinho.

## Adicionar alguém no ônibus

O easter egg (botão 🔥 no canto) mostra um ônibus com os avatares do GitHub do pessoal.
No `index.html`, procure por `bus-seats` e duplique um bloco `seat`, trocando o usuário:

```html
<div class="seat" data-role="crowd">
  <div class="bubble crowd" data-bubble></div>
  <a class="win" href="https://github.com/seu-usuario" target="_blank" rel="noopener" title="@seu-usuario">
    <img loading="lazy" src="https://github.com/seu-usuario.png?size=80" alt="@seu-usuario">
  </a>
</div>
```

O avatar vem automático de `https://github.com/<usuario>.png`. Para entrar, é só abrir um PR.

As falas dos balões ficam em `assets/data/lines.js`: `driverLines` (o motorista sugere)
e `crowdLines` (a galera concorda). Pode adicionar mais à vontade.
