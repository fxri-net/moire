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
                'class': dark['id'] + '-elem'
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
                    // 初始化变量
                    tray['field'] = fxBase['text']['explode']('-_', dark['field']);
                    tray['data'] = data;
                    // 疏理数据
                    $.each(tray['field'], function(key, value) {
                        if (!isBlank(tray['data'][value])) {
                            tray['data'] = tray['data'][value];
                        } else {
                            tray['data'] = '';
                            return false;
                        }
                    });
                    // 疏理数据
                    dark['list'].push(data);
                    return !isBlank(dark['shelf']['data'][tray['data']]) ? dark['shelf']['data'][tray['data']] : '';
                };
                break;
            case 'table_link':
                // 表格-链接
                dark['wrapBox']['attr']['moire-elem'] = 'link';
                dark['templet'] = function(data) {
                    // 初始化变量
                    tray['field'] = fxBase['text']['explode']('-_', dark['field']);
                    tray['data'] = data;
                    // 疏理数据
                    $.each(tray['field'], function(key, value) {
                        if (!isBlank(tray['data'][value])) {
                            tray['data'] = tray['data'][value];
                        } else {
                            tray['data'] = '';
                            return false;
                        }
                    });
                    // 疏理数据
                    dark['list'].push(data);
                    tray['echo'] = '';
                    // 疏理链接
                    tray['url'] = fxBase['param']['url']({
                        'type': '1.1',
                        'url': dark['option']['url'],
                        'param': dark['option']['param'](dark['field'], data)
                    });
                    // 疏理元素
                    if (!isBlank(dark['shelf']['data'][tray['data']])) {
                        tray['attr'] = {
                            'fxy-href': tray['url'],
                            'title': dark['title']
                        };
                        tray['echo'] = $('<a><div></div></a>');
                        tray['echo'].attr(tray['attr']);
                        tray['attr'] = {
                            'class': dark['option']['class']
                        };
                        tray['echo'].find('div').attr(tray['attr']).text(dark['shelf']['data'][tray['data']]);
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
    };
    // 完成
    echo['done'] = function() {
        // 渲染完成
        if (isFunction(dark['done'])) {
            dark['done'](dark, base);
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