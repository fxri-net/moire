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
 * 云纹模具-工具-删除
 */
fxView['mould']['tool']['delete'] = function() {
    // 初始化变量
    var dark = fxBase['param']['merge']({}, fxView['shelf']['view']);
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    tray[dark['model']['key']] = [];
    // 检查配置
    if (isNull(dark['api']['delete'])) {
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
    // 疏理数据
    tray['reload'] = true;
    if (isObject(dark['param'])) {
        tray['reload'] = false;
    }
    if (!isArray(dark['param'])) {
        dark['param'] = [dark['param']];
    }
    // 校验控制
    if (isEmpty(dark['param'])) {
        return fxView['mould']['tool']['message']({ 'text': ['please', 'choice', 'data'] });
    }
    // 提取数据
    $.each(dark['param'], function(key, value) {
        if (isNumeric(value) || isString(value)) {
            tray[dark['model']['key']].push(value);
        } else if (isObject(value) && !isNull(value[dark['model']['key']])) {
            tray[dark['model']['key']].push(value[dark['model']['key']]);
        }
    });
    // 删除确认
    layui.layer.confirm('是否确认删除？', { 'icon': 0, 'title': null, 'closeBtn': 0 }, function(index) {
        // 处理数据
        tray['echo'] = {
            'url': dark['api']['delete'],
            'async': false,
            'data': {
                'data': {}
            }
        };
        tray['echo']['data']['data'][dark['model']['key']] = tray[dark['model']['key']];
        tray['echo'] = fxView['store']['deal'](tray['echo']);
        if (tray['echo']['code'] == 200 && tray['reload']) {
            dark['table'].reload();
        } else if (tray['echo']['code'] == 200) {
            dark['event'].del();
        }
        // 关闭弹窗
        layui.layer.close(index);
    });
};