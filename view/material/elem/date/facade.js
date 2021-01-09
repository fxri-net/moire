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
 * 云纹物料-元素-日期
 */
fxView['material']['elem']['date'] = function() {
    // 初始化变量
    var base,
        dark,
        echo = {},
        tray = {};
    // 基础
    echo['base'] = base = {};
    // 数据
    echo['dark'] = dark = {};
    // 初始化
    echo['init'] = function() {
        // 疏理数据
        fxView['machine']['elem'](dark, arguments[0]);
        base = fxBase['param']['merge'](base, {}, isObject(arguments[1]) ? arguments[1] : {});
        dark = fxBase['param']['merge'](dark, {
            // 数据
            'data': '',
            // 输出-开关
            'echoSwitch': 1,
            // 默认
            'default': ['choice', dark['title']],
            // 插件
            'plugin': {
                // 类型
                'type': 'datetime'
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['default'] = fxBase['base']['lang'](dark['default']);
    };
    // 部署
    echo['deploy'] = function() {
        // 初始化变量
        dark = fxBase['param']['merge'](dark, {
            // 包装盒子
            'wrapBox': {
                // 元素
                'elem': '<div></div>',
                // 属性
                'attr': {
                    'moire-elem': 'elem'
                }
            },
            // 元素盒子
            'elemBox': {
                // 元素
                'elem': '<input>',
                // 属性
                'attr': {
                    'type': 'text',
                    'id': dark['id'],
                    'name': dark['field'],
                    'placeholder': dark['default'],
                    'autocomplete': 'off'
                }
            }
        }, dark);
        // 渲染之前
        if (isFunction(dark['before'])) {
            dark['before'](dark, base);
        }
        // 疏理包装
        dark['wrap'] = $(dark['wrapBox']['elem']);
        dark['wrap'].attr(dark['wrapBox']['attr']);
        // 疏理元素
        dark['elem'] = $(dark['elemBox']['elem']);
        dark['elem'].attr(dark['elemBox']['attr']);
        dark['elem'].val(dark['data']);
        // 疏理皮肤
        switch (dark['skin']) {
            case 'search':
                // 搜索
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
                break;
            case 'view':
                // 视图
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
                break;
        }
        // 渲染之后
        if (isFunction(dark['after'])) {
            dark['after'](dark, base);
        }
        // 渲染完成
        if (isFunction(dark['done'])) {
            $(document).ready(function() {
                dark['done'](dark, base);
            });
        }
    };
    // 输出
    echo['echo'] = function() {
        // 疏理数据
        dark['echo'] = dark['elem'].val();
        if (dark['echoSwitch'] == 1 && dark['require'] == 1 && isBlank(dark['echo'])) {
            dark['elem'].trigger('focus');
            layer.msg(fxBase['base']['lang'](['please', 'input', dark['label']]), { 'icon': 5, 'anim': 6 });
            return false;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].val(dark['data']);
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].val('');
    };
    return echo;
};