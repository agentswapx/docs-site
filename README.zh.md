# ATXSwap 文档站

[English](./README.md) | [简体中文](./README.zh.md)

ATXSwap 官方文档站，包含产品说明文档以及开发者文档。

## 内容范围

- 产品介绍与使用指南
- 智能合约说明
- 前端 / SDK 开发文档
- API 参考
- 常见问题

## 本地开发

基于 [VitePress](https://vitepress.dev/) 构建。

```bash
# 安装依赖
npm install

# 启动本地开发服务（默认 http://localhost:5173）
npm run docs:dev

# 构建静态站点到 .vitepress/dist
npm run docs:build

# 本地预览构建产物
npm run docs:preview
```

## 目录结构

```
docs-site/
├── .vitepress/
│   └── config.ts        # 站点配置（导航、侧边栏、主题等）
├── index.md             # 首页
├── guide/               # 用户指南
└── dev/                 # 开发文档
```

## 关联仓库

本仓库作为 [`agentswapx/atx`](https://github.com/agentswapx) 主仓库的子模块挂载在根目录 `docs-site/` 下。
