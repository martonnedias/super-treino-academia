# Super Treino Academia: site

Site estático das 3 unidades da Super Treino Academia (Teresina-PI), entregue como **protótipo com 3 layouts** para o proprietário escolher:

| Opção | Nome | Ideia |
|---|---|---|
| A | Ingresso de festa | Azul royal e amarelo, ingressos picotados, confete ao tocar no WhatsApp |
| C | Noite | Fundo escuro, fotos em tela cheia, lanterna que segue o mouse, tabela de planos |
| D | Contraste | Preto e branco que ganha cor, números grandes, anel de cursor |

Cada opção tem a **home** e **uma página por unidade** (Itararé, Parque Jurema, Renascença II), com horários, mapa, grade de aulas, planos e WhatsApp com mensagem pronta. Em qualquer página, o seletor "Layout" no canto da tela troca de opção mantendo a mesma página.

## Ver o protótipo

```bash
npm run build      # gera dist/
npx serve dist     # abre em http://localhost:3000
```

A página `dist/index.html` é a tela de escolha. O build precisa só de Node 20 ou mais novo, sem dependências.

## Depois que o cliente escolher

```bash
SITE_URL=https://www.seudominio.com.br npm run build:c   # troque "c" por a ou d
```

Gera em `dist/` **só o layout escolhido na raiz do site**, sem a tela de escolha e sem o seletor, com `robots.txt` liberado, `sitemap.xml` e URL canônica. O protótipo usa `noindex` de propósito, para o Google não indexar três versões duplicadas.

## Onde editar

| O que mudar | Arquivo |
|---|---|
| Endereço, telefone, WhatsApp, notas, horários de sábado, dias de dança | `src/data/site.mjs` |
| Preços dos planos | `src/data/site.mjs` (lista `plans`) |
| Perguntas frequentes | `src/data/site.mjs` (lista `faq`) |
| Fotos | troque os arquivos de `src/img/` mantendo o nome |
| Textos e seções de um layout | `src/tpl/<layout>-home.html` e `src/tpl/<layout>-unit.html` |
| Cores, tipografia e efeitos | `src/css/` (`fx.css` é a camada de efeitos, `fx.js` os scripts) |

Depois de editar, rode `npm run build`. Textos entre colchetes (`[assim]`) aparecem em amarelo no site: são informações que ainda faltam.

## Pendências do cliente ([PREENCHER])

- [ ] WhatsApp correto de cada unidade. Parque Jurema aparece com DDD (88) e o mesmo final 99442-7681 de Renascença II.
- [ ] Endereço da Parque Jurema (Google: "R. Des. Antero Resende, 4344", Instagram: "Rua 03, 4344").
- [ ] Horário de abertura de segunda a sexta e de domingo, e o fim do horário de sábado em Itararé.
- [ ] Planos e valores de Parque Jurema e Renascença II, e se os de Itararé continuam vigentes (R$ 85, 150, 210 e 420).
- [ ] Texto e nome de 3 avaliações reais do Google, com autorização.
- [ ] Grade de funcional e demais aulas por unidade e dia.
- [ ] Logo em alta resolução, códigos de cor da marca e fotos reais (as atuais são provisórias, geradas por IA).
- [ ] CNPJ, domínio e formas de pagamento.

## O que o site já faz

- Mobile first, sem rolagem horizontal de 320 a 1440 px; barra fixa de agendamento no celular e botão flutuante de WhatsApp no computador.
- Eventos de conversão `contact_click` (WhatsApp, ligar, rota) enviados ao `dataLayer`, prontos para GA4/GTM por unidade. Nenhum cookie é criado hoje; ao instalar analytics, adicione aviso de cookies e página de privacidade (LGPD).
- SEO local: título e descrição próprios por unidade, dados estruturados `HealthClub` com o mesmo nome, endereço e telefone do Google Meu Negócio.
- Acessibilidade: link "pular para o conteúdo", foco visível, botões de 44 px, `prefers-reduced-motion` desliga os efeitos de movimento.
- Cabeçalhos de segurança e cache em `vercel.json`.

## Publicar

Vercel: importe o repositório (usa `vercel.json`). Hostinger ou outra hospedagem estática: envie o conteúdo de `dist/`.

## Manutenção mensal

Conferir horários de feriados, preços e a nota do Google; renovar domínio e hospedagem; trocar fotos antigas.
