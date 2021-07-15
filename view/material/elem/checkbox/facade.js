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
 * 云纹物料-元素-复选框
 */
fxView['machine']['deployer'](['material', 'elem', 'checkbox', 'main'], function() {
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
        // 检查初始化
        if (dark['init']) return;
        // 疏理数据
        fxView['machine']['darker'](dark, arguments[0]);
        base = fxBase['param']['merge'](base, {}, isObject(arguments[1]) ? arguments[1] : {});
        dark = fxBase['param']['merge'](dark, {
            // 输出-开关
            'echoSwitch': 1
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        // 数据
        echo['data']();
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'init', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 数据
    echo['data'] = function() {
        // 疏理数据
        dark['shelf']['data'] = JSON.parse(JSON.stringify(dark['shelf']['dataRaw']));
        if (isBlank(dark['shelf']['data'])) {
            dark['shelf']['data'] = [];
        } else if (!isArray(dark['shelf']['data']) && !isObject(dark['shelf']['data'])) {
            dark['shelf']['data'] = fxBase['text']['explode'](',', dark['shelf']['data']);
        }
        dark['shelf']['data'] = fxBase['text']['implode']('|', dark['shelf']['data'].reverse());
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'data', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 部署
    echo['deploy'] = function() {
        // 检查元素
        if (dark['init']) {
            // 重置
            return echo['reset']();
        }
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
                'elem': '<input>',
                // 属性
                'attr': {
                    'type': 'checkbox',
                    'id': dark['id'],
                    'name': dark['field'],
                    'title': dark['title']
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
        dark['elem'].prop('checked', !!parseInt(dark['data']));
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'deploy', dark['skin']], [dark, base, echo, tray], dark);
        // 渲染之后
        fxView['machine']['caller'](['after'], [dark, base], dark);
        // 检查初始化
        dark['init'] = !isEmpty($('#' + dark['id']));
    };
    // 完成
    echo['done'] = function() {
        // 检查初始化
        if (dark['init']) return;
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'done', dark['skin']], [dark, base, echo, tray], dark);
        // 渲染完成
        fxView['machine']['caller'](['done'], [dark, base], dark);
    };
    // 输出
    echo['echo'] = function() {
        // 检查初始化
        if (!dark['init']) return;
        // 疏理数据
        dark['echo'] = dark['elem'].prop('checked') ? 1 : 0;
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'echo', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 重置
    echo['reset'] = function() {
        // 检查初始化
        if (!dark['init']) return;
        // 疏理数据
        dark['elem'].prop('checked', !!parseInt(dark['data']));
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'reset', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 清理
    echo['clean'] = function() {
        // 检查初始化
        if (!dark['init']) return;
        // 疏理数据
        dark['elem'].prop('checked', false);
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'clean', dark['skin']], [dark, base, echo, tray], dark);
    };
    return echo;
});