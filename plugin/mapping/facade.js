/**
 * 云纹物料-元素-映射
 */
fxView['material']['elem']['mapping'] = function() {
    // 初始化变量
    var dark,
        echo = {};
    // 数据
    echo['dark'] = dark = {};
    // 初始化
    echo['init'] = function() {
        // 疏理数据
        fxView['machine']['elem'](dark, arguments[0]);
        dark = fxBase['param']['merge'](dark, {
            // 数据
            'data': '',
            // 默认
            'default': ['add', dark['title']],
            // 插件
            'plugin': {
                // 分组
                'group': {
                    'name': dark['id']
                },
                // 动画时间
                'animation': 150
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
        // 疏理包装
        dark['wrap'] = $('<div></div>');
        dark['wrap'].attr({
            'moire-elem': 'elem'
        });
        // 疏理元素
        dark['elem'] = $('<div><div class="moire-elem-inline"></div></div>');
        dark['elem'].attr({
            'id': dark['id']
        });
        // 疏理输出
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    var echo = [];
                    // 疏理数据
                    if (isBlank(data[dark['field']])) {
                        data[dark['field']] = [];
                    } else if (isJson(data[dark['field']])) {
                        data[dark['field']] = JSON.parse(data[dark['field']]);
                    } else if (!isArray(data[dark['field']]) && !isObject(data[dark['field']])) {
                        data[dark['field']] = fxBase['text']['explode'](',', data[dark['field']]);
                    }
                    // 疏理输出
                    $.each(data[dark['field']], function(key2, value2) {
                        // 初始化变量
                        echo[key2] = [];
                        $.each(dark['shelf']['data'], function(key3, value3) {
                            echo[key2].push(value2[key3]);
                        });
                        echo[key2] = fxBase['text']['implode'](fxBase['base']['lang'](':'), echo[key2]);
                    });
                    echo = fxBase['text']['implode'](fxBase['base']['lang']('|'), echo);
                    return echo;
                };
                break;
            case 'view':
                // 视图
                dark['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-md6'
                });
                dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
                dark['wrap'].children('[moire-key]').html(dark['title'] + dark['requireMark']);
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
                $.each(dark['data'], function(key2, value2) {
                    // 初始化变量
                    var echo = $('<div class="moire-clear"></div>');
                    $.each(dark['shelf']['data'], function(key3, value3) {
                        echo.append('<input type="text" class="layui-input" moire-type="' + key3 + '"' +
                            ' placeholder="' + fxBase['base']['lang'](value3) + '" autocomplete="off">')
                        echo.find('[moire-type=' + key3 + ']')
                            .attr({
                                'disabled': dark['add']['disabled']
                            })
                            .css('width', 'calc((100% - ' + dark['delete']['width'] + ') / ' + Object.keys(dark['shelf']['data']).length + ')')
                            .val(value2[key3]);
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
                        $.each(dark['shelf']['data'], function(key3, value3) {
                            echo.append('<input type="text" class="layui-input" moire-type="' + key3 + '"' +
                                ' placeholder="' + fxBase['base']['lang'](value3) + '" autocomplete="off">')
                            echo.find('[moire-type=' + key3 + ']')
                                .css('width', 'calc((100% - ' + dark['delete']['width'] + ') / ' + Object.keys(dark['shelf']['data']).length + ')');
                        });
                        echo.append(dark['delete']['elem']);
                        dark['elem'].find('.moire-elem-inline').append(echo);
                    });
                    dark['extend'] = new Sortable(dark['elem'].find('.moire-elem-inline')[0], dark['plugin']);
                }
                break;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
        $.each(dark['data'], function(key2, value2) {
            // 初始化变量
            var echo = $('<div></div>');
            $.each(dark['shelf']['data'], function(key3, value3) {
                echo.append('<input type="text" class="layui-input" moire-type="' + key3 + '"' +
                    ' placeholder="' + fxBase['base']['lang'](value3) + '" autocomplete="off">')
                echo.find('[moire-type=' + key3 + ']')
                    .val(value2[key3])
                    .css('width', 'calc((100% - 80px) / ' + Object.keys(dark['shelf']['data']).length + ')');
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