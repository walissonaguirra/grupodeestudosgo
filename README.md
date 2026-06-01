# Grupo de Estudos Go

Site do grupo de estudos de Go do **Cesar Gimenes**. Call todo **sábado às 14h** no Discord, gravada pro YouTube. Feito em [Hugo](https://gohugo.io), hospedado no GitHub Pages.

## Atualizar o card da home

Edite o `hugo.toml`, em `[params]`:

```toml
[params]
  cardTitle = "Toda semana tem call de Go!"
  cardText  = "A gente se encontra todo sábado às 14h no Discord..."
```

`cardTitle` é o título e `cardText` é a mensagem. Salvou e deu push, o site atualiza sozinho.
Os links (Discord/Telegram/YouTube/GitHub) também ficam no `[params]`.

## Adicionar alguém no ônibus

O easter egg mostra um ônibus com os avatares do GitHub do pessoal. Edite `data/members.yaml`:

```yaml
driver: crgimenes          # o motorista (Cesar)
passengers:                # quem aparece nas janelas (em ordem)
  - FreyreCorona
  - walissonaguirra
  - seu-usuario-aqui       # adicione seu @ do GitHub
```

O avatar vem automático de `https://github.com/<usuario>.png`. Para entrar, é só abrir um PR adicionando seu usuário em `passengers`.

As 'falas dos balões também ficam nesse arquivo: `driverLines` e `crowdLines` (a galera concordando). Pode adicionar mais à vontade.

