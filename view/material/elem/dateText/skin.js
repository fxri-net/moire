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
 * 云纹物料-元素-日期文本-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'dateText', 'skin', 'deploy'], {
    // 表格
    'table': function(dark, base, echo, tray) {
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
            return !isBlank(tray['data']) ? tray['data'] : '暂无时间';
        }
    },
    // 视图
    'view': function(dark, base, echo, tray) {
        // 初始化变量
        base['pack'].append(dark['wrap']);
        dark['wrap'].attr({
            'class': 'layui-col-xs12 layui-col-md6'
        });
        dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
        dark['wrap'].children('[moire-key]').html(dark['label']);
        dark['wrap'].children('[moire-cell]').append(dark['elem']);
        dark['elem'].attr({
            'class': 'moire-div'
        });
    }
});