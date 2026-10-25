/**
 * 表单示例
 * 声明式建表、规则校验与取值回显
 */

const moire = window.moire
if (!moire) throw new Error('moire 未加载，请检查 dist/moire.min.js')

const mount = document.querySelector('#app')
if (!(mount instanceof HTMLElement)) throw new Error('缺少挂载节点 #app')

const echoButton = document.querySelector('#echo')
if (!(echoButton instanceof HTMLButtonElement)) throw new Error('缺少按钮 #echo')

const result = document.querySelector('#result')
if (!(result instanceof HTMLElement)) throw new Error('缺少结果区 #result')

/** 表单声明，字段类型与规则类型全部取自具名枚举 */
const schema = {
  name: 'profile',
  fields: [
    {
      name: 'nickname',
      kind: moire.enum.FieldKind.Input,
      label: '昵称',
      placeholder: '2 到 12 个字符',
      required: true,
      rules: [{ kind: moire.enum.RuleKind.Length, min: 2, max: 12 }],
    },
    {
      name: 'role',
      kind: moire.enum.FieldKind.Select,
      label: '角色',
      value: 'viewer',
      option: {
        choices: [
          { value: 'admin', label: '管理员' },
          { value: 'viewer', label: '访客' },
        ],
      },
    },
    {
      name: 'enabled',
      kind: moire.enum.FieldKind.Switch,
      label: '启用',
      value: true,
    },
    {
      name: 'bio',
      kind: moire.enum.FieldKind.Textarea,
      label: '简介',
      placeholder: '一段自我介绍',
    },
  ],
}

/** 表单实例，建表即挂到 #app */
const form = moire.fields.createForm(schema, mount)

echoButton.addEventListener('click', () => {
  const echoed = form.echo()
  if (echoed.valid) {
    result.textContent = JSON.stringify(echoed.values, null, 2)
    return
  }
  result.textContent = echoed.issues.map((issue) => `${issue.name}：${issue.message}`).join('\n')
})
