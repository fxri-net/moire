/**
 * 列表示例
 * 装配与渲染分两步，排序、分页与行选择由声明驱动
 */

const moire = window.moire
if (!moire) throw new Error('moire 未加载，请检查 dist/moire.min.js')

const mount = document.querySelector('#app')
if (!(mount instanceof HTMLElement)) throw new Error('缺少挂载节点 #app')

const result = document.querySelector('#result')
if (!(result instanceof HTMLElement)) throw new Error('缺少结果区 #result')

/** 列表声明，列标题缺省取字段名，渲染类型缺省按文本 */
const schema = {
  name: 'score',
  columns: [
    { name: 'id', title: '编号', width: 80 },
    { name: 'name', title: '姓名' },
    {
      name: 'team',
      title: '分组',
      kind: moire.enum.FieldKind.Select,
      choices: [
        { value: 'a', label: '甲组' },
        { value: 'b', label: '乙组' },
      ],
    },
    { name: 'score', title: '得分' },
  ],
  rows: [
    { id: 'u1', name: '林一', team: 'a', score: 92 },
    { id: 'u2', name: '陈二', team: 'b', score: 78 },
    { id: 'u3', name: '张三', team: 'a', score: 85 },
    { id: 'u4', name: '李四', team: 'b', score: 96 },
    { id: 'u5', name: '王五', team: 'a', score: 64 },
  ],
  limit: 3,
  selection: moire.enum.SelectionMode.Multiple,
}

/** 装配：按分数倒序取第二页 */
const assembly = moire.views.list.assemble(schema, {
  page: 2,
  order: [{ name: 'score', direction: moire.enum.OrderDirection.Desc }],
})

/** 渲染：挂载到 #app，返回列表根元素 */
const list = moire.views.list.render(assembly, mount)

/** 行选择通过 data-moire-row 属性标记，与适配层解耦 */
list.addEventListener('change', () => {
  const chosen = [...list.querySelectorAll('[data-moire-row]')].filter((item) => item instanceof HTMLInputElement && item.checked)
  result.textContent = `第 ${String(assembly.page.page)} 页共 ${String(assembly.page.pages)} 页，已选 ${String(chosen.length)} 行`
})
