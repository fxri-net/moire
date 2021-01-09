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
 * 云纹物料-元素-下拉框
 */
fxView['material']['elem']['select'] = function() {
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
            // 默认-键值
            'defaultValue': 0
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['default'] = fxBase['base']['lang'](dark['default']);
        if (isBlank(dark['shelf']['data'])) {
            dark['shelf']['data'] = [];
        } else if (!isArray(dark['shelf']['data']) && !isObject(dark['shelf']['data'])) {
            dark['shelf']['data'] = fxBase['text']['explode'](',', dark['shelf']['data']);
        }
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
                'elem': '<select></select>',
                // 属性
                'attr': {
                    'id': dark['id'],
                    'name': dark['field']
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
        dark['elem'].append('<option value="">' + dark['default'] + '</option>');
        $.each(dark['shelf']['data'], function(key, value) {
            dark['elem'].append('<option value="' + key + '"' + (dark['data'] == key ? ' selected' : '') + '>' + value + '</option>');
        });
        // 疏理皮肤
        switch (dark['skin']) {
            case 'search':
                // 搜索
                base['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs6 layui-col-sm3 layui-col-md2'
                });
                dark['wrap'].append(dark['elem']);
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
        // 疏理皮肤
        switch (dark['skin']) {
            case 'view':
                // 视图
                dark['echo'] = dark['require'] == 1 || !isBlank(dark['echo']) ? dark['echo'] : dark['defaultValue'];
                break;
        }
        if (dark['echoSwitch'] == 1 && dark['require'] == 1 && isBlank(dark['echo'])) {
            dark['elem'].parents('[moire-cell]').find('input').trigger('click');
            layer.msg(fxBase['base']['lang'](['please', 'choice', dark['label']]), { 'icon': 5, 'anim': 6 });
            return false;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].val(dark['data']);
        dark['elem'].next().find('input').val(dark['elem'].find('option:selected').html());
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].val('');
    };
    return echo;
};