分发与接入
==========

产物只从 `dist` 分支的版本标签交付。主分支只放源码，`dist` 是构建输出目录、不入库；业务项目按标签拉取即可，不再需要携带源码副本与压缩的 `.git` 目录。

## 分发形态

- `dist` 是孤儿分支：只含 `moire.min.js`、`moire.esm.js`、`types/`、`manifest.json`、`LICENSE`、`NOTICE`、`README.md`，不含源码与源码历史。
- 每个正式版本对应一个 `vX.Y.Z` 标签，标签打在分发提交上，按标签拉取即为该版产物。
- `manifest.json` 记录版本、构建时间与每个产物的字节数与 sha256，据此校验完整性。
- 分发分支自带 `.gitattributes`（`* -text`），禁用换行转换，否则检出端 `core.autocrlf=true` 会把 LF 转成 CRLF，产物字节与清单校验和对不上。

## 接入

### git subtree（推荐）

业务仓库内需要真实存在的静态目录时使用，`--prefix` 指向产物要落到的目录：

```sh
git subtree add --prefix public/static/lavender/plugin/moire https://git.fxy.ink:444/fxri/develop/0001.base/moire.git v1.0.0 --squash
```

之后升级只是换标签再拉一次：

```sh
git subtree pull --prefix public/static/lavender/plugin/moire https://git.fxy.ink:444/fxri/develop/0001.base/moire.git v1.0.1 --squash
```

回滚同样换标签，把版本拉回出问题之前的那一版；也可以在业务仓库里 `git revert` 掉上次的 squash 合并提交。

注意事项：

- `--squash` 必须保留：分发分支的演进历史对业务仓库无意义，压缩后业务仓库每个版本只多一条提交。
- 目录内不要手改：下次拉取会整体覆盖，确需临时改动时要接受被覆盖的结果。
- 拉取冲突基本来自本地手改产物，取分发侧内容即可。
- 端点需可达（内网或 VPN）；不可达时改用下面的离线方式。
- 首次接入完成后，业务仓库里原来的源码副本与 `.git.zip` 可以直接删除。

### 其余方式对照

- submodule：业务仓库只留一个指针，clone 与每条 CI 都要 `git submodule update --init`，静态目录未初始化时为空，与当前「目录里必须有文件」的部署方式相冲。
- npm 依赖：产物落在 `node_modules`，业务项目没有打包步骤，仍需复制到静态目录，等于多一次搬运；端点可作依赖源时也可用 `git+https://…git#v1.0.0` 形式锁定版本。

## 校验产物

对照 `manifest.json` 逐项核对 sha256，`path` 是相对分发目录的路径，`types/` 下的声明文件同样登记在内：

```sh
# POSIX
sha256sum moire.min.js moire.esm.js
```

```powershell
# Windows PowerShell
Get-FileHash .\moire.min.js, .\moire.esm.js -Algorithm SHA256
```

## 离线分发

端点不可达或接入环境没有 git 时，从标签导出压缩包，校验口径与在线方式一致：

```sh
git archive --format=zip --prefix=moire/ v1.0.0 -o moire-1.0.0.zip
```

解压后把目录放到原静态路径即可。⚠️ 离线包不随业务仓库版本化，升级与回滚靠人工替换，替换后仍要核对 `manifest.json`。

## 发布流程

维护者一侧的完整顺序：

1. 记录变更：新增 `.changeset/*.md`，条目逐条按 `- 类型：描述` 书写，影响级别按改动量级选择。
2. 门禁：`pnpm verify` 全绿。
3. 升版本与更新日志：`pnpm exec toolkit changelog version`，输出中文分组标题；随后按仓库既有风格人工润色 `CHANGELOG.md`，再执行 `pnpm exec toolkit changelog --history format` 归一，并清理残留的已消费变更集。
4. 出产物：`pnpm release`，按「构建 → 校验清单 → 写入 `dist` 分支 → 打标签」执行。
5. 推送：`git push origin main dist vX.Y.Z`，推送前确认。

⚠️ 发版脚本要求当前在 `main` 分支、工作区干净、同名标签不存在；版本号没升就重跑会被直接拦下。
