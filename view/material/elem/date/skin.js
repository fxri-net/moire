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
 * 云纹物料-元素-日期-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'date', 'skin', 'deploy'], {
    // 搜索
    'search': function(dark, base, echo, tray) {
        // 初始化变量
        base['pack'].append(dark['wrap']);
        dark['wrap'].attr({
            'class': 'layui-col-xs12 layui-col-sm6 layui-col-md4'
        });
        dark['wrap'].append(dark['elem']);
        dark['elem'].attr({
            'class': 'layui-input'
        });
        // 疏理配置
        dark['plugin']['elem'] = dark['elem'][0];
        layui.laydate.render(dark['plugin']);
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
        // 疏理配置
        dark['plugin']['elem'] = dark['elem'][0];
        dark['plugin'] = layui.laydate.render(dark['plugin']);
        // 离开事件
        dark['elem'].on('blur', function() {
            // 疏理日期
            tray['value'] = $(this).val();
            // 解析格式
            tray['regexp'] = '[^A-Za-z]+';
            tray['format'] = fxBase['text']['explode'](tray['regexp'], dark['plugin'].config.format, 'regular');
            tray['regexp'] = '[A-Za-z]+';
            tray['format_separator'] = fxBase['text']['explode'](tray['regexp'], dark['plugin'].config.format, 'regular').slice(1, -1);
            // 解析时间
            tray['regexp'] = '[^0-9]+';
            tray['value'] = fxBase['text']['explode'](tray['regexp'], tray['value'], 'regular').slice(0, tray['format'].length);
            // 填充时间
            $.each(tray['format'], function(key, value) {
                tray['value'][key] = fxBase['text']['strPad'](!isBlank(tray['value'][key]) ? tray['value'][key] : '0', value.length, 0, 0);
            });
            $.each(tray['format_separator'], function(key, value) {
                tray['value'][key] = tray['value'][key] + value;
            });
            // 组装时间
            tray['value'] = fxBase['text']['implode']('', tray['value']);
            $(this).val(tray['value']);
        });
    }
});