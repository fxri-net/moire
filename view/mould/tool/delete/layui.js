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
 * 云纹模具-工具-删除-皮肤
 */
fxView['machine']['deployer'](['mould', 'tool', 'delete', 'skin', 'layui'], function () {
  // 初始化变量
  var dark = fxBase['param']['merge']({}, fxView['shelf']['view'])
  var tray = {}
  dark = fxBase['param']['merge'](dark, arguments[0])
  tray[dark['model']['key']] = []
  // 检查配置
  if (!isSet(dark['api']['delete'])) {
    return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ text: ['delete', 'feature', 'not configured'] }])
  }
  // 疏理数据
  tray['reload'] = true
  if (isObject(dark['param'])) {
    tray['reload'] = false
  }
  if (!isArray(dark['param'])) {
    dark['param'] = [dark['param']]
  }
  // 校验控制
  if (isEmpty(dark['param'])) {
    return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ text: ['please', 'choice', 'data'] }])
  }
  // 提取数据
  $.each(dark['param'], function (key, value) {
    if (isNumeric(value) || isString(value)) {
      tray[dark['model']['key']].push(value)
    } else if (isObject(value) && isSet(value[dark['model']['key']])) {
      tray[dark['model']['key']].push(value[dark['model']['key']])
    }
  })
  // 删除确认
  layui.layer.confirm(
    '是否确认删除？',
    {
      icon: 0,
      title: null,
      closeBtn: 0,
      success: function (layero, index) {
        // 配置索引
        tray['layer.index'] = fxBase['text']['implode']('-', [$(layero[0]).attr('times'), fxApp['rank']['self.code'], 'layui'])
        fxApp['rank']['self.layer.index.set'](tray['layer.index'])
      },
      end: function () {
        // 销毁索引
        fxApp['rank']['self.layer.index.destroy'](tray['layer.index'])
      },
    },
    function (index) {
      // 处理数据
      tray['echo'] = {
        // 地址
        url: dark['api']['delete'],
        // 异步
        async: false,
        // 数据
        data: {
          // 数据
          data: {},
        },
      }
      tray['echo']['data']['data'][dark['model']['key']] = tray[dark['model']['key']]
      tray['echo'] = fxView['store']['deal'](tray['echo'])
      if (tray['echo']['code'] == 200 && tray['reload']) {
        dark['table'].reload()
      } else if (tray['echo']['code'] == 200) {
        dark['event'].del()
      }
      // 销毁索引
      fxApp['rank']['self.layer.index.destroy'](tray['layer.index'])
      // 关闭窗口
      layui.layer.close(index)
    },
  )
})
