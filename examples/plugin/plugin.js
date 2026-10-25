/**
 * 插件示例
 * 自定义插件在装配时取依赖能力、订阅通知，启动后注册同样立即生效
 */

const moire = window.moire
if (!moire) throw new Error('moire 未加载，请检查 dist/moire.min.js')

const mount = document.querySelector('#app')
if (!(mount instanceof HTMLElement)) throw new Error('缺少挂载节点 #app')

const installButton = document.querySelector('#install')
if (!(installButton instanceof HTMLButtonElement)) throw new Error('缺少按钮 #install')

const notifyButton = document.querySelector('#notify')
if (!(notifyButton instanceof HTMLButtonElement)) throw new Error('缺少按钮 #notify')

const logBox = document.querySelector('#log')
if (!(logBox instanceof HTMLElement)) throw new Error('缺少日志区 #log')

/** 已捕获的通知条数 */
let total = 0

/**
 * 追加一行日志
 * @param {string} text 日志文本
 */
const log = (text) => {
  logBox.textContent = `${logBox.textContent ?? ''}${text}\n`
}

/**
 * 自定义插件
 * depends 声明依赖，内核按依赖顺序保证字段能力先就绪
 */
const greetPlugin = {
  name: 'greet',
  version: '1.0.0',
  depends: ['fields'],
  /**
   * 装配
   * @param {import('moire').MoireContext} context 插件上下文
   */
  setup(context) {
    // 依赖的插件实例由内核按依赖顺序准备，装配时直接取用
    const fieldsPlugin = /** @type {import('moire').FieldsPlugin | undefined} */ (context.get('fields'))
    if (!fieldsPlugin) throw new Error('缺少字段能力')

    context.subscribe((notice) => {
      total += 1
      log(`[${notice.variant ?? 'notice'}] ${notice.message}`)
    })

    fieldsPlugin.fields.createForm(
      {
        name: 'greet',
        fields: [{ name: 'word', kind: moire.enum.FieldKind.Input, label: '问候语', value: '你好' }],
      },
      mount,
    )
    context.notify({ message: `greet 已装配，内核版本 ${context.version}`, variant: moire.enum.Variant.Notice })
  },
  dispose() {
    log('greet 已卸载')
  },
}

installButton.addEventListener('click', () => {
  if (moire.context.get('greet') !== undefined) {
    log('greet 已在装配中')
    return
  }
  // 启动后注册的插件由内核立即装配
  moire.use(greetPlugin)
})

notifyButton.addEventListener('click', () => {
  moire.context.notify({ message: `第 ${String(total + 1)} 条通知`, variant: moire.enum.Variant.Toast })
})
