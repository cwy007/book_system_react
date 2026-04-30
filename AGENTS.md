# AGENTS.md

图书管理系统前端 (Book Management System) — React 19 + TypeScript + Vite + antd。

## 命令

- `npm run dev` — 启动 Vite 开发服务器（默认 5173），依赖代理转发到后端 `http://localhost:3000`。
- `npm run build` — `tsc -b && vite build`，TS 类型检查必须通过。
- `npm run lint` — ESLint 校验。
- `npm run preview` — 预览生产构建。

## 架构

- 入口 [src/main.tsx](src/main.tsx) 用 `RouterProvider` 挂载 [src/router/index.tsx](src/router/index.tsx) 中的 `createBrowserRouter`。
- 页面在 [src/pages/](src/pages/)，每个页面一个 `.tsx`，新增页面后必须在 router 中注册。
- 接口层统一在 [src/interfaces/index.ts](src/interfaces/index.ts)，封装 `fetch` 与 `BASE_URL = "/api"`。**不要**在组件里直接 `fetch`；新增接口在此文件导出函数。
- API 走 Vite 代理：[vite.config.ts](vite.config.ts) 中 `/api` → `http://localhost:3000`，并 rewrite 去掉 `/api` 前缀。所以前端写 `/api/user/login`，后端实际收到 `/user/login`。
- 后端接口约定：`POST /user/register`、`POST /user/login`，body `{ username, password }`，返回同结构 JSON。

## 约定

- UI 组件统一用 [antd](https://ant.design/components/overview-cn)（v6）；不要引入其它 UI 库。表单用 `Form` + `Form.Item` 的 rules 校验，反馈用 `message`。
- 导航跳转用 `react-router-dom` 的 `useNavigate` / `<Link>`，不要使用 `window.location`。
- 样式优先 **CSS Modules**（`*.module.css`，参考 [src/pages/Login.module.css](src/pages/Login.module.css)）；多个相关页面可共用一个 module 文件。全局样式只放在 [src/index.css](src/index.css) / [src/App.css](src/App.css)。
- 类型：接口请求/响应类型在 [src/interfaces/index.ts](src/interfaces/index.ts) 中以 `interface` 导出（如 `UserPayload`），页面内部表单的扩展类型在页面本地定义。
- 中文文案：UI 文案与提示信息使用简体中文。

## 常见坑

- 改了 [vite.config.ts](vite.config.ts) 的 proxy 必须重启 `npm run dev`。
- `npm run build` 会跑 `tsc -b`，未使用的 import / 变量会让构建失败，提交前先跑一次 build 或 lint。
- `Form.Item` 的 `name` 必须与 `onFinish(values)` 字段一致；新增字段记得同步类型定义。
