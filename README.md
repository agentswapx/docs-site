# ATXSwap Docs Site

[English](./README.md) | [简体中文](./README.zh.md)

The official documentation site for ATXSwap, covering both product guides and developer documentation.

## Scope

- Product introduction and usage guides
- Smart contract documentation
- Frontend / SDK developer docs
- API reference
- FAQ

## Local Development

Built with [VitePress](https://vitepress.dev/).

```bash
# Install dependencies
npm install

# Start the local dev server (default http://localhost:5173)
npm run docs:dev

# Build the static site into .vitepress/dist
npm run docs:build

# Preview the production build locally
npm run docs:preview
```

## Project Structure

```
docs-site/
├── .vitepress/
│   └── config.ts        # Site config (nav, sidebar, theme, etc.)
├── index.md             # Home page
├── guide/               # User guide
└── dev/                 # Developer docs
```

## Related Repositories

This repository is mounted as a submodule at `docs-site/` of the main [`agentswapx/atx`](https://github.com/agentswapx) repository.
