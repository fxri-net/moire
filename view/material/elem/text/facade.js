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
 * 云纹物料-元素-文本
 */
fxView['machine']['deployer'](['material', 'elem', 'text', 'main'], function() {
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
            'echoSwitch': 0,
            // 选项
            'option': {
                // 地址
                'url': null,
                // 参数
                'param': function(key, data) {
                    // 初始化变量
                    var echo = { 'data': {} };
                    tray['field'] = fxBase['text']['explode']('-_', key);
                    tray['data'] = data;
                    // 疏理数据
                    $.each(tray['field'], function(key2, value2) {
                        if (!isBlank(tray['data'][value2])) {
                            tray['data'] = tray['data'][value2];
                        } else {
                            tray['data'] = '';
                            return false;
                        }
                    });
                    echo['data'][key] = tray['data'];
                    return echo;
                },
                // 类名
                'class': dark['id'] + '-elem',
                // 文本
                'text': ['click', 'jump'],
                // 目标
                'target': '_blank'
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['option']['text'] = fxBase['base']['lang'](dark['option']['text']);
        // 数据
        echo['data']();
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'init', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 数据
    echo['data'] = function() {
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
                'elem': '<div></div>',
                // 属性
                'attr': {
                    'id': dark['id']
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
        dark['echo'] = dark['elem'].text();
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'echo', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].text(dark['data'] + dark['dataSuffix']);
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'reset', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'clean', dark['skin']], [dark, base, echo, tray], dark);
    };
    return echo;
});