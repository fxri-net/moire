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
 * 云纹物料-元素-开关-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'switch', 'skin', 'deploy'], {
    // 表格
    'table': function(dark, base, echo, tray) {
        // 初始化变量
        dark['templet'] = function(data) {
            // 初始化变量
            tray['field'] = fxBase['text']['explode']('-_', dark['field']);
            tray['data'] = data;
            // 疏理数据
            $.each(tray['field'], function(key, value) {
                if (!isBlank(tray['data'][value])) {
                    tray['data'] = tray['data'][value];
                } else {
                    tray['data'] = '';
                    return false;
                }
            });
            // 疏理数据
            dark['list'].push(data);
            tray['echo'] = '';
            if (!isBlank(dark['shelf']['data'][tray['data']])) {
                tray['echo'] = $('<input>');
                tray['echo'].attr({
                    'type': 'checkbox',
                    'name': dark['field'],
                    'value': data[base['mould']['base']['model']['key']],
                    'lay-skin': 'switch',
                    'lay-text': dark['shelf']['data'],
                    'lay-filter': dark['field'],
                    'checked': tray['data'] == 1 ? 'checked' : null
                });
                tray['echo'].text(dark['shelf']['data'][tray['data']]);
                tray['echo'] = tray['echo'].prop('outerHTML');
            }
            return tray['echo'];
        };
    },
    // 视图
    'view': function(dark, base, echo, tray) {
        // 初始化变量
        base['pack'].append(dark['wrap']);
        dark['wrap'].attr({
            'class': 'layui-col-xs12 layui-col-md6'
        });
        dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
        dark['wrap'].children('[moire-key]').html(dark['label'] + dark['requireMark']);
        dark['wrap'].children('[moire-cell]').append(dark['elem']);
        dark['elem'].attr({
            'class': 'layui-input'
        });
    }
});