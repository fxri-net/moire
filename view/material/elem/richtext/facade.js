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
 * 云纹物料-元素-富文本编辑器
 */
fxView['machine']['deployer'](['material', 'elem', 'richtext', 'main'], function() {
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
            'default': ['input', dark['title']],
            // 插件
            'plugin': {
                // 语言
                'lang': fxApp['view']['lang']
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['default'] = fxBase['base']['lang'](dark['default']);
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
                'elem': '<textarea></textarea>',
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
        fxView['machine']['caller'](['before'], [dark, base], dark);
        // 检查元素
        if (dark['init']) {
            // 重置
            return echo['reset']();
        }
        // 疏理包装
        dark['wrap'] = $(dark['wrapBox']['elem']);
        dark['wrap'].attr(dark['wrapBox']['attr']);
        // 疏理元素
        dark['elem'] = $(dark['elemBox']['elem']);
        dark['elem'].attr(dark['elemBox']['attr']);
        dark['elem'].val(dark['data']);
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
        // 识别IE浏览器兼容插件
        if (fxBase['param']['inArray'](fxApp['env']['ie'], [-1, 11])) {
            dark['echo'] = tinymce.get(dark['id']).getContent();
            dark['elem'].val(dark['echo']);
        } else {
            dark['echo'] = dark['elem'].val();
        }
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'echo', dark['skin']], [dark, base, echo, tray], dark);
        // 校验输出
        if (dark['echoSwitch'] == 1 && dark['require'] == 1 && isBlank(dark['echo'])) {
            // 识别IE浏览器兼容插件
            if (fxBase['param']['inArray'](fxApp['env']['ie'], [-1, 11])) {
                tinymce.get(dark['id']).focus();
            } else {
                dark['elem'].trigger('focus');
            }
            layui.layer.msg(fxBase['base']['lang'](['please', 'input', dark['label']]), { 'icon': 5, 'anim': 6 });
            return false;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        $(document).ready(function() {
            // 识别IE浏览器兼容插件
            if (fxBase['param']['inArray'](fxApp['env']['ie'], [-1, 11])) {
                tinymce.get(dark['id']).setContent(dark['data']);
                dark['elem'].val(dark['data']);
            } else {
                dark['elem'].val(dark['data']);
            }
            // 渲染皮肤
            fxView['machine']['caller'](['skins', 'reset', dark['skin']], [dark, base, echo, tray], dark);
        });
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        $(document).ready(function() {
            // 识别IE浏览器兼容插件
            if (fxBase['param']['inArray'](fxApp['env']['ie'], [-1, 11])) {
                tinymce.get(dark['id']).setContent('');
                dark['elem'].val('');
            } else {
                dark['elem'].val('');
            }
            // 渲染皮肤
            fxView['machine']['caller'](['skins', 'clean', dark['skin']], [dark, base, echo, tray], dark);
        });
    };
    return echo;
});