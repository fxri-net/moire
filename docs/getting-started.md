# 快速上手

## 引入产物

构建产物只有两类运行时文件，按项目形态二选一。

### 传统页面

IIFE 产物加载即挂载 `window.moire` 并自动启动，无需额外调用：

```html
<script src="./moire/moire.min.js"></script>
```

### 现代构建

ESM 产物只导出实例，不写全局、不自动启动，何时挂载与启动由接入方决定：

```js
import { moire } from 'moire'

moire.start()
```

> ⚠️ 两种入口共用同一份装配逻辑，差异只在「是否写全局」与「是否自动启动」。同一页面不要重复引入两份产物。

## 第一个字段表单

字段按 `FormSchema` 声明，`kind` 取自 `moire.enum.FieldKind`：

```js
const schema = {
  fields: [
    { name: 'account', kind: moire.enum.FieldKind.Input, label: '账号', required: true },
    { name: 'password', kind: moire.enum.FieldKind.Password, label: '口令', required: true },
    {
      name: 'role',
      kind: moire.enum.FieldKind.Select,
      label: '角色',
      option: {
        choices: [
          { value: 'admin', label: '管理员' },
          { value: 'user', label: '普通用户' },
        ],
      },
    },
  ],
}

const form = moire.fields.createForm(schema, document.querySelector('#form'))

// 整表回显并校验，未通过项逐条提示，返回值可直接用于提交判断
const { valid, values, issues } = form.echo()
```

- 目标元素给定时，字段会挂进该容器；不给时只返回实例，由业务侧自行插入。
- `echo()` 只读取并校验，不提交请求；提交动作由业务侧发起。
- `reset()` 写回声明里的初始值，`clean()` 清空控件，两者都不触发校验。

字段、规则与渲染器的完整契约见[字段能力](./api/fields)与[声明契约](./api/schema)。

## 第一个列表

列表的 `assemble` 是纯函数：归一列、按排序子句排序、按页码切片，不产生 DOM；`render` 才做 DOM 组装与适配层增强：

```js
const list = moire.views.list.assemble(
  {
    columns: [
      { name: 'id', title: '编号', width: 80 },
      { name: 'name', title: '名称' },
      {
        name: 'state',
        title: '状态',
        choices: [
          { value: 'on', label: '启用' },
          { value: 'off', label: '停用' },
        ],
      },
    ],
    rows,
    limit: 20,
    selection: moire.enum.SelectionMode.Multiple,
  },
  { page: 1, order: [{ name: 'id', direction: moire.enum.OrderDirection.Desc }] },
)

moire.views.list.render(list, document.querySelector('#list'))
```

装配结果里的 `page` 已把页码钳制在合法区间，空数据固定为第 1 页，渲染时不必再兜底。

## 订阅通知

插件与工具发出的提示都经内核通知通道，业务侧可以订阅后接入自己的消息中心：

```js
const off = moire.context.subscribe(({ message, variant, target }) => {
  console.log(variant, message, target)
})

// 退订
off()
```

## 使用工具能力

工具能力把常见的页面动作收敛成结构化结果，`outcome` 区分完成、失败、取消与跳过：

```js
const result = await moire.tools.run({
  action: moire.enum.ToolAction.Delete,
  url: '/api/user/delete',
  rows: selectedRows,
  key: 'id',
})

if (result.outcome === moire.enum.ToolOutcome.Done) {
  // 删除成功后由接入方决定如何刷新
}
```

> ⚠️ 删除动作以 POST 方式提交主键集合，`keys` 优先于 `rows`，两者都为空时直接返回 `Skipped`。默认实例未注入 `reload` 回调，删除成功后不会自动刷新列表，需要业务侧在 `Done` 分支里自行刷新；若想由框架回调，可按[工具能力](./api/tools)自建插件并注入 `reload`。

## 运行示例

仓库内提供三个可直接打开的最小示例，均只依赖 `dist/moire.min.js`，不要求界面库：

- `examples/form/index.html`：声明式建表、规则校验与回显
- `examples/list/index.html`：列表装配（排序、分页、选择）与渲染
- `examples/plugin/index.html`：自定义插件，演示依赖注入与通知订阅

```sh
# 先构建产物
pnpm build

# 再对示例做一次类型检查，确认 dist 中的声明产物可用
pnpm check:examples
```

## 下一步

- 想了解框架如何分层：[架构设计](./architecture)
- 想查函数签名与选项：[API 总览](./api/)
- 想启用 layui 界面增强：[layui 适配](./adapters/layui)
- 从旧版本升级：[迁移指南](./migration)
