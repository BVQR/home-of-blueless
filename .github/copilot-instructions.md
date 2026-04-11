# Copilot Instructions for BL-blog

## Commands

```bash
pnpm dev       # dev server at localhost:4321
pnpm build     # production build to ./dist/
pnpm preview   # preview production build
pnpm astro check  # type-check all .astro files
```

No test suite or linter is configured.

## Architecture

This is an **Astro 6** personal blog site (Chinese language, `lang="zh-CN"`). Pages are organized into three top-level sections: `/blog`, `/gallery`, `/application`.

```
src/
  layouts/Layout.astro      # Single shared layout: HTML shell, global reset, Chinese font stack
  pages/
    index.astro             # Landing page
    blog.astro              # Blog section index (4 categories)
    gallery.astro           # Gallery section index
    application.astro       # Application section
    blog/{fogging,exploreing,creating,thinking}.astro  # Individual blog category pages
    gallery/{photos,furry}.astro                       # Gallery sub-pages
```

`Layout.astro` accepts an optional `title` prop and a `slot="head"` for per-page `<link>` tags (Google Fonts, etc.). It provides the global box-sizing reset and Chinese system font stack.

## Key Conventions

### Self-contained pages
Each `.astro` file is fully self-contained: all CSS lives in that file's `<style>` block and all JavaScript lives in its `<script>` block. There are no shared CSS utility classes or external JS modules.

### Entry animation pattern
Every page follows the same reveal flow:
1. A full-screen entry overlay (either a diagonal color sweep or a fade) animates out on load.
2. Content elements start hidden with `opacity: 0; transform: translateY(...)`.
3. Inline `<script>` calls `setTimeout` to add the `.visible` class to each element in sequence, triggering CSS transitions.

The pattern looks like:
```astro
<div class="reveal-item" id="foo">...</div>

<style>
  .reveal-item { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ..., transform 0.7s ...; }
  .reveal-item.visible { opacity: 1; transform: none; }
</style>

<script>
  setTimeout(() => document.getElementById('foo')?.classList.add('visible'), 300);
</script>
```

### Per-page color theming
Each page defines its own CSS custom properties in `:root` within its `<style>` block. Background "orbs" (blurred radial-gradient circles) use these variables and are animated with `float1/float2/float3` keyframes.

### Google Fonts via `slot="head"`
Fonts are loaded per-page via the layout's named slot:
```astro
<Layout title="Page Title">
  <link slot="head" rel="preconnect" href="https://fonts.googleapis.com" />
  <link slot="head" rel="stylesheet" href="..." />
  ...
</Layout>
```
- Landing page uses **Playfair Display** (serif, for English slogans).
- Section/article pages use **Noto Sans SC** (for Chinese body text).

### Responsive breakpoint
All responsive overrides target `@media (max-width: 560px)`.

### Note on a filename typo
`src/pages/blog/exploreing.astro` (and its route `/blog/exploreing`) contains a typo — keep it consistent rather than renaming, as changing it would break existing links.
