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
 * 云纹物料-元素-文本编辑器-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'textarea', 'skin', 'deploy'], {
  // 视图
  view: function (dark, base, echo, tray) {
    // 初始化变量
    base['pack'].append(dark['wrap'])
    dark['wrap'].attr({
      class: 'layui-col-xs12 layui-col-md6',
    })
    dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>')
    dark['wrap'].children('[moire-key]').html(dark['label'] + dark['requireMark'])
    dark['wrap'].children('[moire-cell]').append(dark['elem'])
    dark['elem'].attr({
      class: 'layui-textarea',
    })
  },
})
