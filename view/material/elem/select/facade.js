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
fxView['machine']['deployer'](['material', 'elem', 'select', 'main'], function() {
    // 初始化变量
    var base,
        dark,
        tray,
        echo = {};
    // 基础
    echo['base'] = base = {};
    // 数据
    echo['dark'] = dark = {};
    // 托盘
    echo['tray'] = tray = {};
    // 初始化
    echo['init'] = function() {
        // 疏理数据
        fxView['machine']['darker'](dark, arguments[0]);
        base = fxBase['param']['merge'](base, {}, isObject(arguments[1]) ? arguments[1] : {});
        dark = fxBase['param']['merge'](dark, {
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
        // 数据
        echo['data']();
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'init', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 数据
    echo['data'] = function() {
        // 疏理数据
        if (isBlank(dark['shelf']['data'])) {
            dark['shelf']['data'] = {};
        } else if (!isArray(dark['shelf']['data']) && !isObject(dark['shelf']['data'])) {
            dark['shelf']['data'] = fxBase['text']['explode'](',', dark['shelf']['data']);
        }
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'data', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 部署
    echo['deploy'] = function() {
        // 检查初始化
        if (dark['init']) return;
        // 初始化变量
        dark = fxBase['param']['merge'](dark, {
            // 包装盒子
            'wrapBox': {
                // 元素
                'elem': '<div></div>',
                // 属性
                'attr': {
                    // 元素
                    'moire-elem': 'elem',
                    // 类型
                    'moire-type': dark['type'],
                    // 皮肤
                    'moire-skin': dark['skin']
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
        fxView['machine']['caller'](['before'], [dark, base], dark);
        // 疏理包装
        dark['wrap'] = $(dark['wrapBox']['elem']);
        dark['wrap'].attr(dark['wrapBox']['attr']);
        // 疏理元素
        dark['elem'] = $(dark['elemBox']['elem']);
        dark['elem'].attr(dark['elemBox']['attr']);
        dark['elem'].append('<option value="">' + dark['default'] + '</option>');
        $.each(dark['shelf']['data'], function(key, value) {
            dark['elem'].append('<option value="' + key + '">' + value + '</option>');
        });
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'deploy', dark['skin']], [dark, base, echo, tray], dark);
        // 渲染之后
        fxView['machine']['caller'](['after'], [dark, base], dark);
        // 检查初始化
        dark['init'] = !isEmpty($('#' + dark['id']));
    };
    // 完成
    echo['done'] = function() {
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'done', dark['skin']], [dark, base, echo, tray], dark);
        // 渲染完成
        fxView['machine']['caller'](['done'], [dark, base], dark);
    };
    // 输出
    echo['echo'] = function() {
        // 疏理数据
        dark['echo'] = dark['elem'].val();
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'echo', dark['skin']], [dark, base, echo, tray], dark);
        // 校验输出
        if (dark['echoSwitch'] == 1 && dark['require'] == 1 && isBlank(dark['echo'])) {
            dark['elem'].parents('[moire-cell]').find('input').trigger('click');
            layui.layer.msg(fxBase['base']['lang'](['please', 'choice', dark['label']]), { 'icon': 5, 'anim': 6 });
            return false;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].val(dark['data']);
        dark['elem'].next().find('input').val(dark['elem'].find('option:selected').html());
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'reset', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].val('');
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'clean', dark['skin']], [dark, base, echo, tray], dark);
    };
    return echo;
});