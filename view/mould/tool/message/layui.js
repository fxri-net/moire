// +----------------------------------------------------------------------
// | Name 云纹框架
// +----------------------------------------------------------------------
// | Author 唐启云 <tqy@fxri.net>
// +----------------------------------------------------------------------
// | Copyright Copyright © 2017-2099 方弦研究所. All rights reserved.
// +----------------------------------------------------------------------
// | Link https://www.fxri.net
// +----------------------------------------------------------------------

/**
 * 云纹模具-工具-消息-皮肤
 */
fxView['machine']['deployer'](['mould', 'tool', 'message', 'skin', 'layui'], function () {
  // 初始化变量
  var dark = {
    // 内容
    text: '',
    // 图标
    icon: 'info',
    // 自动关闭
    hideAfter: 1500,
    // 位置
    position: 'bottom-left',
    // 消息栈
    stack: 1,
    // 窗口
    window: top,
  }
  dark = fxBase['param']['merge'](dark, arguments[0])
  dark['text'] = fxBase['base']['lang'](dark['text'])
  dark['window'].$.toast(dark)
})
