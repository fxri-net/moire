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
 * 云纹物料-元素-下拉框-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'select', 'skin', 'deploy'], {
    // 搜索
    'search': function(dark, base, echo, tray) {
        // 初始化变量
        base['pack'].append(dark['wrap']);
        dark['wrap'].attr({
            'class': 'layui-col-xs6 layui-col-sm3 layui-col-md2'
        });
        dark['wrap'].append(dark['elem']);
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
    }
});
fxView['machine']['deployer'](['material', 'elem', 'select', 'skin', 'echo'], {
    // 视图
    'view': function(dark, base, echo, tray) {
        // 初始化变量
        dark['echo'] = dark['require'] == 1 || !isBlank(dark['echo']) ? dark['echo'] : dark['defaultValue'];
    }
});