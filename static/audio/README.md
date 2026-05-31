# Áudio do easter egg 🔥

Coloque aqui um arquivo chamado **`highway.mp3`** para tocar quando o "modo inferno" liga.

> ⚠️ Direitos autorais: *Highway to Hell* (AC/DC) é uma música protegida. Não embarcamos o
> arquivo oficial no repositório. Use um arquivo que você tenha direito de usar (uma versão
> própria, um cover livre, um trecho royalty-free, etc.).

## Como funciona
- O player aponta para `static/audio/highway.mp3` (vira `/audio/highway.mp3` no site).
- Se o arquivo **existir**, a borda do site pulsa no ritmo **real** da música (Web Audio API).
- Se **não existir**, tudo funciona igual, só que a pulsação usa uma batida sintética de fallback
  e nenhum som toca (sem erro no console).
