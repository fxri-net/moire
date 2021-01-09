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
 * 云纹物料-元素-映射
 */
fxView['material']['elem']['mapping'] = function() {
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
            // 添加
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
                'elem': '<div><div class="moire-elem-inline"></div></div>',
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
        // 疏理皮肤
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    tray['echo'] = [];
                    // 疏理数据
                    if (isBlank(data[dark['field']])) {
                        data[dark['field']] = [];
                    } else if (isJson(data[dark['field']])) {
                        data[dark['field']] = JSON.parse(data[dark['field']]);
                    } else if (!isArray(data[dark['field']]) && !isObject(data[dark['field']])) {
                        data[dark['field']] = fxBase['text']['explode'](',', data[dark['field']]);
                    }
                    // 疏理输出
                    $.each(data[dark['field']], function(key, value) {
                        // 初始化变量
                        tray['echo'][key] = [];
                        $.each(dark['shelf']['data'], function(key2, value2) {
                            tray['echo'][key].push(value[value2['field']]);
                        });
                        tray['echo'][key] = fxBase['text']['implode'](fxBase['base']['lang'](':'), tray['echo'][key]);
                    });
                    tray['echo'] = fxBase['text']['implode'](fxBase['base']['lang']('|'), tray['echo']);
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
                    'class': 'moire-div'
                });
                dark['elem'].find('.moire-elem-inline').attr({
                    'name': dark['field']
                });
                // 疏理删除
                if (dark['delete']['switch']) {
                    dark['delete']['elem'] = '<button class="layui-btn layui-btn-sm layui-btn-danger moire-bg-red-light moire-delete" type="button">' +
                        dark['delete']['text'] + '</button>';
                    dark['delete']['width'] = '80px';
                    // 点击事件
                    dark['elem'].parents('div[moire-cell]').on('click', '.moire-delete', function() {
                        // 初始化变量
                        var echo = {};
                        echo['elem'] = $(this).parents('.moire-elem-inline>div');
                        echo['message'] = fxBase['base']['lang'](['是否删除', '[', dark['title'], ']', '选项', '[', (echo['elem'].index() + 1), ']', '？']);
                        echo['config'] = {
                            'title': null,
                            'icon': 0,
                            'closeBtn': 0,
                            'shadeClose': true
                        };
                        // 删除确认
                        layui.layer.confirm(echo['message'], echo['config'], function(index) {
                            echo['elem'].remove();
                            // 关闭弹窗
                            layui.layer.close(index);
                        });
                    });
                }
                // 疏理添加
                if (dark['add']['switch']) {
                    dark['add']['disabled'] = null;
                }
                // 疏理货架
                tray['width'] = [dark['delete']['width']];
                tray['count'] = 0;
                $.each(dark['shelf']['data'], function(key, value) {
                    if (!isBlank(value['width'])) {
                        tray['width'].push(value['width']);
                    } else {
                        tray['count']++;
                    }
                });
                tray['width'] = fxBase['text']['implode'](' - ', tray['width']);
                $.each(dark['shelf']['data'], function(key, value) {
                    if (isBlank(value['width'])) {
                        value['width'] = 'calc((100% - ' + tray['width'] + ') / ' + tray['count'] + ')';
                    }
                });
                $.each(dark['data'], function(key, value) {
                    // 初始化变量
                    var echo = $('<div class="moire-clear"></div>');
                    $.each(dark['shelf']['data'], function(key2, value2) {
                        echo.append('<input type="text" class="layui-input" moire-type="' + value2['field'] + '"' +
                            ' placeholder="' + fxBase['base']['lang'](value2['title']) + '" autocomplete="off">')
                        echo.find('[moire-type=' + value2['field'] + ']')
                            .attr({
                                'disabled': dark['add']['disabled'],
                                'style': value2['style']
                            })
                            .css('width', value2['width'])
                            .val(value[value2['field']]);
                    });
                    echo.append(dark['delete']['elem']);
                    dark['elem'].find('.moire-elem-inline').append(echo);
                });
                // 疏理添加
                if (dark['add']['switch']) {
                    dark['elem'].append('<div class="moire-elem-operate">' +
                        '<button type="button" class="layui-btn moire-operate" id="' + dark['id'] + '">' +
                        fxBase['base']['lang'](dark['default']) +
                        '</button></div>');
                    // 点击事件
                    dark['elem'].parents('div[moire-cell]').on('click', '.moire-operate', function() {
                        // 初始化变量
                        var echo = $('<div class="moire-clear"></div>');
                        $.each(dark['shelf']['data'], function(key, value) {
                            echo.append('<input type="text" class="layui-input" moire-type="' + value['field'] + '"' +
                                ' placeholder="' + fxBase['base']['lang'](value['title']) + '" autocomplete="off">')
                            echo.find('[moire-type=' + value['field'] + ']')
                                .attr({
                                    'style': value['style']
                                })
                                .css('width', value['width']);
                        });
                        echo.append(dark['delete']['elem']);
                        dark['elem'].find('.moire-elem-inline').append(echo);
                    });
                    dark['plugin']['echo'] = new Sortable(dark['elem'].find('.moire-elem-inline')[0], dark['plugin']);
                }
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
        if (!dark['add']['switch'] && !dark['delete']['switch']) return true;
        dark['echo'] = [];
        $(dark['plugin']['echo'].el).children().each(function(key, value) {
            dark['echo'][key] = {};
            $(value).children('input').each(function(key2, value2) {
                dark['echo'][key][$(value2).attr('moire-type')] = $(value2).val();
            });
        })
        if (dark['echoSwitch'] == 1 && dark['require'] == 1 && isEmpty(dark['echo'])) {
            layer.msg(fxBase['base']['lang'](['please', 'add', dark['label']]), { 'icon': 5, 'anim': 6 });
            return false;
        }
        dark['echo'] = JSON.stringify(dark['echo']);
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
        $.each(dark['data'], function(key, value) {
            // 初始化变量
            var echo = $('<div class="moire-clear"></div>');
            $.each(dark['shelf']['data'], function(key2, value2) {
                echo.append('<input type="text" class="layui-input" moire-type="' + value2['field'] + '"' +
                    ' placeholder="' + fxBase['base']['lang'](value2['title']) + '" autocomplete="off">')
                echo.find('[moire-type=' + value2['field'] + ']')
                    .attr({
                        'disabled': dark['add']['disabled'],
                        'style': value2['style']
                    })
                    .css('width', value2['width'])
                    .val(value[value2['field']]);
            });
            echo.append(dark['delete']['elem']);
            dark['elem'].find('.moire-elem-inline').append(echo);
        });
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
    };
    return echo;
};