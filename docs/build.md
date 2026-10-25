# 构建产物

一次构建产出四类文件，全部落在 `dist/`。`dist` 不入库，由发版流程推到 `dist` 孤儿分支，见[分发与接入](./distribution)与[发版流程](./release)。

| 产物              | 形态                                   | 用途                                                         |
| ----------------- | -------------------------------------- | ------------------------------------------------------------ |
| `moire.min.js`    | IIFE，terser 压缩                      | 传统页面直接 `<script>` 引入，自动挂载 `window.moire` 并启动 |
| `moire.esm.js`    | ESM                                    | 现代构建工具引入，挂载与启动由接入方决定                     |
| `types/**/*.d.ts` | 类型声明                               | 编辑器提示与类型检查，入口 `types/entries/esm.d.ts`          |
| `manifest.json`   | 版本、源码提交、构建时间、逐文件校验和 | 接入方与发版流程校验产物完整性与来源                         |

## 构建链

```sh
pnpm install
pnpm build
```

`build` 由四步串成，顺序固定：

| 步骤 | 命令                         | 产出                   | 说明                                                       |
| ---- | ---------------------------- | ---------------------- | ---------------------------------------------------------- |
| 1    | `vite build --mode iife`     | `moire.min.js`         | 入口 `src/entries/index.ts`，会先清空 `dist`               |
| 2    | `vite build --mode esm`      | `moire.esm.js`         | 入口 `src/entries/esm.ts`，不清空输出目录，与上一步共存    |
| 3    | `tsc -p tsconfig.build.json` | `dist/types/**/*.d.ts` | 只出声明、不出 JS，排除 `src/__tests__`                    |
| 4    | `node scripts/manifest.mjs`  | `manifest.json`        | 递归登记 `dist` 下全部文件并写入源码提交，清单自身不入清单 |

两次 Vite 构建共用 `dist` 输出目录，`emptyOutDir` 只在 IIFE 那次开启；单独重跑 ESM 构建不会误删已产出的声明与清单。

### 构建期注入

- 版本号取自 `package.json`，以常量 `__MOIRE_VERSION__` 注入源码，运行时对应 `moire.version`。
- `jquery`、`layui` 声明为外部依赖，不打进产物：IIFE 下映射到全局 `jQuery` / `layui`，ESM 下保持裸导入，由接入方的打包器解析。
- 别名 `@` 指向 `src`，仅构建期生效。

## 清单结构

```json
{
  "name": "moire",
  "version": "1.0.0",
  "commit": "52114e0…",
  "builtAt": "2026-10-25T15:20:02.838Z",
  "files": [{ "path": "moire.min.js", "bytes": 38717, "sha256": "6639a992…" }]
}
```

`path` 相对 `dist`，按字典序排列；`bytes` 与 `sha256` 逐文件登记；`commit` 是构建所用的源码提交，据此可从产物反查源码提交（取不到 git 时为空串）。校验方式见[分发与接入](./distribution)的「校验产物」一节。

> ⚠️ 同一提交重复构建，`commit` 与 `files` 稳定，只有 `builtAt` 每次都会变，因此两次构建的 `manifest.json` 不会逐字节相同；可比对的是 `files` 里的字节数与校验和。发版脚本正是按清单逐项核对，任何清单外的多余文件都会被拒绝。

## 验收命令

`pnpm verify` 是唯一的质量门禁，本地与 CI 共用同一条命令，步骤清单只维护在 `scripts/verify.mjs` 里：依赖安装（`--frozen-lockfile`）→ 类型检查 → 代码规范 → 格式校验 → 单元测试 → 构建产物 → 示例类型 → 文档站构建。任一失败即中止，依赖装不上时后续步骤不再执行。

单元测试固定 `TZ=UTC` 运行，避免本地时区影响时间相关断言；文档站构建同时做站内死链检查，文档改错会让门禁变红。没有文档站构建条件的平台可加 `--skip-docs` 裁剪。

单独排查时可跑其中一步：

```sh
pnpm typecheck      # 类型检查
pnpm lint           # 代码规范
pnpm format:check   # 格式校验
pnpm test           # 单元测试
pnpm check:examples # 示例工程的类型检查，验证声明产物可用
pnpm docs:build     # 文档站构建与死链检查
```

## 文档站

文档站基于 VitePress，源码在 `docs/`，构建产物在 `docs/.vitepress/dist`（不入库）：

```sh
pnpm docs:dev      # 本地预览，热更新
pnpm docs:build    # 产出静态站点
pnpm docs:preview  # 预览构建结果
```

- 站点基础路径由 `VITEPRESS_BASE` 决定，缺省 `/moire/`，对应 GitHub Pages 子路径。
- `SITE_URL` 与 `REPO_URL` 供非 GitHub Pages 的部署场景注入站点地址与编辑回链，缺省为 GitHub 仓库。
- 根目录的 `CHANGELOG.md` 是更新日志真源，`pnpm sync:changelog-doc` 把它同步为 `docs/changelog.md`，不要在文档站里手改该页。
