云纹框架 V1.0
===============

> 运行环境要求主流浏览器
> 不兼容 IE

## 基础信息

- 可以接入任意 JS 项目，内置诸多实用方法，是一款轻量级 JS 开发辅助框架。
- 全部能力收敛到单一全局对象 `window.moire`，不再散落多个全局命名空间。

## 基础部署

```
// 加载框架，产物已内置全部能力
<script type="text/javascript" src="./moire/moire.min.js"></script>
```

```
<script type="text/javascript">
  // 枚举、工具函数、国际化、请求、字段、视图与工具能力都在同一实例上
  moire.utils.isString('a')
  const list = moire.views.list.assemble({ columns: [{ name: 'name', title: '名称' }] })
  moire.views.list.render(list, document.querySelector('#app'))
</script>
```

现代构建工具可改用 ESM 产物，挂载与启动交由接入方决定：

```
import { moire } from 'moire'

moire.start()
```

## 可选依赖

界面增强按需探测，缺失时自动降级，不阻断核心能力：

```
Layui v2.6.4及以上
Jquery v1.9及以上
LayX v2.5.4及以上
Sortable v1.10.2及以上
TinyMCE
```

## 打包

```
pnpm build
```

产物全部输出到 `dist`：

| 产物              | 形态                       | 用途                                 |
| ----------------- | -------------------------- | ------------------------------------ |
| `moire.min.js`    | IIFE，terser 压缩          | `script` 直接引入，自动挂载并启动    |
| `moire.esm.js`    | ESM                        | 现代构建引入，挂载与启动由接入方决定 |
| `types/**/*.d.ts` | 类型声明                   | 编辑器提示与类型检查                 |
| `manifest.json`   | 版本、构建时间、产物校验和 | 校验产物完整性                       |

## 示例

`examples` 下提供三个可直接打开的最小示例，均只依赖 `dist/moire.min.js`，不要求界面库：

- `examples/form/index.html`：声明式建表、规则校验与回显
- `examples/list/index.html`：列表装配（排序、分页、选择）与渲染
- `examples/plugin/index.html`：自定义插件，演示依赖注入与通知订阅

```
pnpm check:examples
```

单独对示例做一次类型检查，确认 `dist` 中的声明产物可用。

## 迁移

从旧版本升级请参阅 [迁移对照](docs/migration.md)，其中逐条列出全局命名空间、部署器与访问器、合并模式码、其余数字码与属性前缀的对应关系及已知差异。

## 验收

```
pnpm verify
```

依次执行类型检查、代码检查、格式检查、单测与构建，与 CI 同源。

## 项目开发

请参阅 [云纹框架](https://gitee.com/fxri/moire)。

## 版权信息

作者：唐启云 <tqy@fxri.net>

出品：方弦研究所

版权：Copyright © 2017-2026 唐启云. All rights reserved.

网站：[方弦研究信息网](https://www.fxri.net)

协议：[Apache License 2.0](./LICENSE)

商标："方弦®"为第42类注册商标（注册号89648411），本开源许可不授予商标使用权，详见 [TRADEMARK.md](./TRADEMARK.md)

> 方弦研究所为唐启云个人项目品牌与出品方，非独立法人实体；本软件著作权归唐启云所有。

本项目包含的第三方源码和二进制文件之版权信息另行标注。
