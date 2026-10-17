# Auditoria dos 3 layouts (A, C, D): outubro/2026

Método: varredura Playwright em 25 páginas (chooser + A/C/D × 8) em 390 px e 1440 px, axe-core (WCAG 2.2 AA), Lighthouse 12 mobile, teste sob CSP real, checagem de links internos.

| Fase | Antes | Depois |
|---|---|---|
| Lighthouse mobile desempenho (A/C/D home) | 95 / 76 / 88 | 99 / 96 / 100 |
| Lighthouse acessibilidade, boas práticas | 100 / 100 | 100 / 100 |
| Lighthouse SEO (versão final, indexável) | não medido | 100 |
| CLS (home C/D desktop) | 0,09 / 0,11 | 0 / 0 |
| CLS (equipe C/D desktop) | 0,18 / 0,19 | ≤ 0,1 |
| Erros de console, links quebrados, overflow 320–1440 | 0 | 0 |
| Chamadas ao Google Fonts | sim | não (fontes próprias) |
| Política de privacidade e página 404 | ausentes | criadas nos 3 layouts, linkadas no rodapé |
| HSTS, CSP | ausentes | em `vercel.json` e `_headers` |

## Pendências (dependem do dono ou de decisão)
- Textos entre colchetes amarelos: CNPJ, e-mail de privacidade, prazo de retenção, revisão jurídica da política.
- Termos de uso: só necessários se houver venda online. Banner de cookies: só necessário ao instalar GA4/Pixel (hoje o site não cria cookies).
- GitHub Pages não aplica cabeçalhos de segurança; Search Console, GA4, formulário com destino real (hoje abre o WhatsApp) e domínio ficam para o lançamento.
- Não verificado: leitor de tela real, mapa incorporado (bloqueado no ambiente de teste), Lighthouse no domínio publicado.
