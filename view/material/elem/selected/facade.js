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
 * 云纹物料-元素-下拉框选取
 */
fxView['material']['elem']['selected'] = function() {
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
            'echoSwitch': 0,
            // 选项
            'option': {
                // 地址
                'url': null,
                // 参数
                'param': function(key, data) {
                    var echo = { 'data': {} };
                    echo['data'][key] = data[key];
                    return echo;
                },
                // 类名
                'class': dark['id'] + '-elem',
                // 样式
                'style': 'display: block;width: 100%;height: 100%'
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
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
                'elem': '<div></div>',
                // 属性
                'attr': {
                    'id': dark['id']
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
        dark['elem'].html(!isBlank(dark['shelf']['data'][dark['data']]) ? dark['shelf']['data'][dark['data']] : '');
        // 疏理皮肤
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    return !isBlank(dark['shelf']['data'][data[dark['field']]]) ? dark['shelf']['data'][data[dark['field']]] : '';
                };
                break;
            case 'table_link':
                // 表格-链接
                dark['templet'] = function(data) {
                    tray['echo'] = '';
                    // 疏理链接
                    tray['url'] = fxBase['param']['url']({
                        'type': '1.1',
                        'url': dark['option']['url'],
                        'param': dark['option']['param'](dark['field'], data)
                    });
                    // 疏理元素
                    if (!isBlank(dark['shelf']['data'][data[dark['field']]])) {
                        tray['attr'] = {
                            'fxy-href': tray['url'],
                            'class': dark['option']['class'],
                            'title': dark['title'],
                            'style': dark['option']['style']
                        };
                        tray['echo'] = $('<a></a>');
                        tray['echo'].attr(tray['attr']);
                        tray['echo'].text(dark['shelf']['data'][data[dark['field']]]);
                        tray['echo'] = tray['echo'].prop('outerHTML');
                    }
                    return tray['echo'];
                };
                break;
            case 'view':
                // 视图
                base['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-md6'
                });
                dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
                dark['wrap'].children('[moire-key]').html(dark['label']);
                dark['wrap'].children('[moire-cell]').append(dark['elem']);
                dark['elem'].attr({
                    'class': 'moire-div'
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
        dark['echo'] = dark['data'];
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].html(!isBlank(dark['shelf']['data'][dark['data']]) ? dark['shelf']['data'][dark['data']] : '');
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
    };
    return echo;
};