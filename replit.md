# Staticolor — Pintura Eletrostática

## Visão Geral

Projeto Vite + React + TypeScript simples. Landing page para "Staticolor Pintura Eletrostática" em Uberlândia/MG.

## Stack

- **Frontend**: React 19 + Vite 6 + TypeScript
- **Estilo**: Tailwind CSS v4 via `@tailwindcss/vite`, `tw-animate-css`
- **Componentes**: shadcn/ui (new-york style) — accordion, button, form, input, textarea, checkbox, label
- **Animações**: framer-motion
- **Ícones**: lucide-react, react-icons (FaWhatsapp)
- **Carrossel**: embla-carousel-react
- **Formulário**: react-hook-form + @hookform/resolvers + zod
- **Sem backend** — leads via WhatsApp

## Estrutura

```
index.html          # HTML raiz
vite.config.ts      # Config Vite
tsconfig.json       # Config TypeScript
package.json        # Dependências
components.json     # Config shadcn/ui
src/
  main.tsx          # Ponto de entrada
  App.tsx           # Componente raiz (renderiza Home)
  index.css         # CSS global + variáveis de tema
  assets/           # Imagens (hero.png, gallery-*.png)
  pages/
    Home.tsx        # Composição de todas as seções
  components/
    landing/        # Seções da landing page
      Header.tsx, Hero.tsx, About.tsx, Benefits.tsx,
      Services.tsx, Gallery.tsx, Differentials.tsx,
      Process.tsx, Testimonials.tsx, Faq.tsx,
      Contact.tsx, Footer.tsx, WhatsappFloat.tsx
    ui/             # Componentes shadcn/ui
  lib/
    utils.ts        # cn() utilitário Tailwind
  hooks/
    use-mobile.tsx, use-toast.ts
```

## Comandos

- `pnpm dev` — servidor de desenvolvimento (porta 5173)
- `pnpm build` — build de produção (`tsc -b && vite build`)
- `pnpm preview` — preview do build

## Tema

Variáveis CSS em `src/index.css`:

- `--staticolor-primary`: #0A1628 (navy escuro)
- `--staticolor-accent`: #2563EB (azul elétrico)
- `--staticolor-off-white`: #F8F9FA
- `--staticolor-whatsapp`: #25D366
- Fontes: Barlow Condensed (display), Inter (sans)

## Notas

- Fundo branco na Hero e Header, sem imagem de fundo
- Sem scroll horizontal em nenhum dispositivo
- Navegação suave via `window.scrollTo({behavior:'smooth'})`
- Scroll-spy ativo no Header com IntersectionObserver
- Formulário de orçamento envia via WhatsApp (wa.me link)
- Placeholder WhatsApp: 553400000000
