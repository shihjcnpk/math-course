# Cloudflare Pages 部署说明

## 推荐配置

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Deploy command: `npx wrangler deploy`
- Root directory: 留空
- Node.js version: 使用 Cloudflare 默认版本即可

## 单页应用刷新

本项目是 React 单页应用。用户直接打开 `/lectures/4` 或刷新页面时，Cloudflare 需要把请求回退到 `index.html`，再由前端路由接管。

当前 Cloudflare 新建项目会使用 Workers 静态资源流程，部署命令为 `npx wrangler deploy`。本项目通过 `wrangler.jsonc` 配置静态资源目录和 SPA 回退：

```jsonc
{
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

不要再使用 `_redirects`，否则 Wrangler 可能会检测到重定向循环。

## 首次部署方式

### 方式 A：直传 `dist`，最快

1. 本地运行 `npm run build`。
2. 进入 Cloudflare 控制台。
3. 进入 `Workers & Pages`。
4. 选择 `Pages`。
5. 选择 `Upload assets` 或 `Direct Upload`。
6. 上传 `dist` 文件夹。

这种方式适合先上线测试，但每次修改后需要重新上传。

### 方式 B：GitHub 自动部署，长期推荐

1. 在 GitHub 新建一个空仓库。
2. 把本项目推送到该仓库。
3. 在 Cloudflare Pages 选择 `Connect to Git`。
4. 选择 GitHub 仓库。
5. 按上面的推荐配置填写构建命令和输出目录。
6. 确认 Deploy command 为 `npx wrangler deploy`。

以后每次提交到 GitHub，Cloudflare Pages 会自动重新部署。
