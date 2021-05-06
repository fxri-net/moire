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
 * 云纹物料-元素-表格
 */
fxView['machine']['deployer'](['material', 'elem', 'table', 'main'], function() {
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
            'default': ['add', dark['title']],
            // 插件
            'plugin': {
                // 分组
                'group': {
                    'name': dark['id']
                },
                // 动画时间
                'animation': 150,
                // 过滤元素
                'filter': '.moire-delete'
            },
            // 新增
            'add': {
                // 开关
                'switch': true,
                // 禁用
                'disabled': 'disabled'
            },
            // 删除
            'delete': {
                // 开关
                'switch': true,
                // 元素
                'elem': '',
                // 宽度
                'width': '0px',
                // 文本
                'text': ['delete']
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['default'] = fxBase['base']['lang'](dark['default']);
        dark['delete']['text'] = fxBase['base']['lang'](dark['delete']['text']);
        if (isBlank(dark['data'])) {
            dark['data'] = [];
        } else if (isJson(dark['data'])) {
            dark['data'] = JSON.parse(dark['data']);
        } else if (!isArray(dark['data']) && !isObject(dark['data'])) {
            dark['data'] = fxBase['text']['explode'](',', dark['data']);
        }
        if (isBlank(dark['shelf']['data'])) {
            dark['shelf']['data'] = [];
        } else if (!isArray(dark['shelf']['data']) && !isObject(dark['shelf']['data'])) {
            dark['shelf']['data'] = fxBase['text']['explode'](',', dark['shelf']['data']);
        }
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'init', dark['skin']], [dark, base, echo, tray], dark);
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
                'elem': '<div><div class="moire-elem-inline"></div></div>',
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
        if (!dark['add']['switch'] && !dark['delete']['switch']) return true;
        // 初始化变量
        dark['echo'] = [];
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'echo', dark['skin']], [dark, base, echo, tray], dark);
        // 校验输出
        if (dark['echoSwitch'] == 1 && dark['require'] == 1 && isEmpty(dark['echo'])) {
            layui.layer.msg(fxBase['base']['lang'](['please', 'add', dark['label']]), { 'icon': 5, 'anim': 6 });
            return false;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
        $.each(dark['data'], function(key, value) {
            // 初始化变量
            var echo = $('<div class="moire-clear"></div>');
            $.each(dark['shelf']['data'], function(key2, value2) {
                // 疏理数据
                if (true === value2['self'] && dark['skin'] == 'view_row') {
                    tray['value'] = value;
                } else if (true === value2['self']) {
                    tray['value'] = {};
                    tray['value'][value2['field']] = value[value2['field']];
                } else {
                    tray['value'] = value[value2['field']];
                }
                if (!isString(tray['value'])) {
                    tray['value'] = JSON.stringify(tray['value']);
                }
                // 设置数据
                echo.append('<input type="text" class="layui-input" moire-type="' + value2['field'] + '"' +
                    ' placeholder="' + fxBase['base']['lang'](value2['title']) + '" autocomplete="off">')
                echo.find('[moire-type=' + value2['field'] + ']')
                    .attr({
                        'disabled': dark['add']['disabled'],
                        'style': value2['style']
                    })
                    .css('width', value2['width'])
                    .val(tray['value']);
            });
            echo.append(dark['delete']['elem']);
            dark['elem'].find('.moire-elem-inline').append(echo);
        });
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'reset', dark['skin']], [dark, base, echo, tray], dark);
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
        // 渲染皮肤
        fxView['machine']['caller'](['skins', 'clean', dark['skin']], [dark, base, echo, tray], dark);
    };
    return echo;
});