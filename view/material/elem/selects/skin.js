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
 * 云纹物料-元素-多选下拉框-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'selects', 'skin', 'deploy'], {
    // 搜索
    'search': function(dark, base, echo, tray) {
        // 初始化变量
        base['pack'].append(dark['wrap']);
        dark['wrap'].attr({
            'class': 'layui-col-xs6 layui-col-sm3 layui-col-md2'
        });
        dark['wrap'].append(dark['elem']);
        dark['elem'].attr({
            'xm-select': dark['field'],
            'xm-select-height': '36px',
            'xm-select-search': '',
            'xm-select-search-type': 'dl'
        });
        fxView['layui']['init']({ 'type': 'select', 'id': dark['field'], 'plugin': dark['plugin'] });
        layui.formSelects.value(dark['field'], dark['data']);
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
            'xm-select': dark['field'],
            'xm-select-height': '36px',
            'xm-select-search': '',
            'xm-select-search-type': 'dl'
        });
        fxView['layui']['init']({ 'type': 'select', 'id': dark['field'], 'plugin': dark['plugin'] });
        layui.formSelects.value(dark['field'], dark['data']);
    }
});
fxView['machine']['deployer'](['material', 'elem', 'selects', 'skin', 'echo'], {
    // 视图
    'view': function(dark, base, echo, tray) {
        // 初始化变量
        dark['echo'] = dark['require'] == 1 || !isBlank(dark['echo']) ? dark['echo'] : dark['defaultValue'];
    }
});