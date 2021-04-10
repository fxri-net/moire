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
 * 云纹物料-元素-开关
 */
fxView['material']['elem']['switch'] = function() {
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
            'echoSwitch': 1
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        if (isBlank(dark['shelf']['data'])) {
            dark['shelf']['data'] = [];
        } else if (!isArray(dark['shelf']['data']) && !isObject(dark['shelf']['data'])) {
            dark['shelf']['data'] = fxBase['text']['explode'](',', dark['shelf']['data']);
        }
        dark['shelf']['data'] = fxBase['text']['implode']('|', dark['shelf']['data'].reverse());
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
                'elem': '<input>',
                // 属性
                'attr': {
                    'type': 'checkbox',
                    'id': dark['id'],
                    'name': dark['field'],
                    'lay-skin': 'switch',
                    'lay-text': dark['shelf']['data']
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
        dark['elem'].prop('checked', !!parseInt(dark['data']));
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
                    tray['echo'] = '';
                    if (!isBlank(dark['shelf']['data'][tray['data']])) {
                        tray['echo'] = $('<input>');
                        tray['echo'].attr({
                            'type': 'checkbox',
                            'name': dark['field'],
                            'value': data[base['mould']['base']['model']['key']],
                            'lay-skin': 'switch',
                            'lay-text': dark['shelf']['data'],
                            'lay-filter': dark['field'],
                            'checked': tray['data'] == 1 ? 'checked' : null
                        });
                        tray['echo'].text(dark['shelf']['data'][tray['data']]);
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
                dark['wrap'].children('[moire-key]').html(dark['label'] + dark['requireMark']);
                dark['wrap'].children('[moire-cell]').append(dark['elem']);
                dark['elem'].attr({
                    'class': 'layui-input'
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
        dark['echo'] = dark['elem'].prop('checked') ? 1 : 0;
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].prop('checked', !!parseInt(dark['data']));
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].prop('checked', false);
    };
    return echo;
};