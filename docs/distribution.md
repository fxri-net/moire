# 分发与接入

产物只从 `dist` 分支的版本标签交付。主分支只放源码，`dist` 是构建输出目录、不入库；业务项目按标签拉取即可，不再需要携带源码副本与压缩的 `.git` 目录。

## 分发形态

- `dist` 是孤儿分支：只含 `moire.min.js`、`moire.esm.js`、`types/`、`manifest.json`、`LICENSE`、`NOTICE`、`README.md`，不含源码与源码历史。
- 每个正式版本对应一个 `vX.Y.Z` 标签，标签打在分发提交上，按标签拉取即为该版产物。
- `manifest.json` 记录版本、源码提交、构建时间与每个产物的字节数与 sha256，据此校验完整性与来源。
- 分发分支自带 `.gitattributes`（`* -text`），禁用换行转换；否则检出端 `core.autocrlf=true` 会把 LF 转成 CRLF，产物字节与清单校验和对不上。

发版侧的出包与推送顺序见[发版流程](./release)。

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

- `--squash` 必须保留：分发分支的演进历史对业务仓库无意义，压缩后每个版本只多一条提交。
- 目录内不要手改：下次拉取会整体覆盖，确需临时改动时要接受被覆盖的结果。
- 拉取冲突基本来自本地手改产物，取分发侧内容即可。
- 端点需可达（内网或 VPN）；不可达时改用[离线分发](#离线分发)。
- 首次接入完成后，业务仓库里原来的源码副本与 `.git.zip` 可以直接删除。

### 其余方式对照

| 方式             | 形态                            | 取舍                                                                       |
| ---------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `git subtree`    | 产物进入业务仓库的指定目录      | 静态目录里始终有文件，适合无打包步骤的部署                                 |
| `git submodule`  | 业务仓库只留一个指针            | clone 与每条 CI 都要 `git submodule update --init`，静态目录未初始化时为空 |
| npm 依赖         | 产物落在 `node_modules`         | 无打包步骤时仍需复制到静态目录，多一次搬运                                 |
| `git+https` 依赖 | 按标签锁定，落到 `node_modules` | 端点可作依赖源时可用，同样是搬运                                           |

## 校验产物

对照 `manifest.json` 逐项核对 sha256，`path` 是相对分发目录的路径，`types/` 下的声明文件同样登记在内。清单里的 `commit` 是构建所用的源码提交，追查来源或对照修复时按它回主分支查看：

```sh
# POSIX
sha256sum moire.min.js moire.esm.js
```

```powershell
# Windows PowerShell
Get-FileHash .\moire.min.js, .\moire.esm.js -Algorithm SHA256
```

## 回滚

分发侧不改写历史，回滚一律换回旧标签：

```sh
# subtree：把目录拉回出问题之前的那一版
git subtree pull --prefix public/static/lavender/plugin/moire https://git.fxy.ink:444/fxri/develop/0001.base/moire.git v0.4.0 --squash

# 或在业务仓库里撤销上次的 squash 合并提交
git revert <squash-commit>
```

如果坏版本已经部署上线，先回滚产物再排查源码，不要把分发目录当热修现场。

## 离线分发

端点不可达或接入环境没有 git 时，从标签导出压缩包，校验口径与在线方式一致：

```sh
git archive --format=zip --prefix=moire/ v1.0.0 -o moire-1.0.0.zip
```

解压后把目录放到原静态路径即可。

::: warning 离线包不随业务仓库版本化
升级与回滚靠人工替换，替换后仍要核对 `manifest.json`。多个业务共用同一份离线包时，建议在文件名里保留版本号，避免覆盖后无法确认实际部署版本。
:::
