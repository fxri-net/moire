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
 * 云纹物料-元素-表格-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'table', 'skin', 'deploy'], {
    // 表格
    'table': function(dark, base, echo, tray) {
        // 初始化变量
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
            tray['echo'] = [];
            // 疏理数据
            if (isBlank(tray['data'])) {
                tray['data'] = [];
            } else if (isJson(tray['data'])) {
                tray['data'] = JSON.parse(tray['data']);
            } else if (!isArray(tray['data']) && !isObject(tray['data'])) {
                tray['data'] = fxBase['text']['explode'](',', tray['data']);
            }
            // 疏理输出
            $.each(tray['data'], function(key, value) {
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
    },
    // 表格-行
    'table_row': function(dark, base, echo, tray) {
        // 初始化变量
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
            tray['echo'] = [];
            // 疏理数据
            if (isBlank(tray['data'])) {
                tray['data'] = [];
            } else if (isJson(tray['data'])) {
                tray['data'] = JSON.parse(tray['data']);
            } else if (!isArray(tray['data']) && !isObject(tray['data'])) {
                tray['data'] = fxBase['text']['explode'](',', tray['data']);
            }
            // 疏理输出
            $.each(tray['data'], function(key, value) {
                // 初始化变量
                tray['echo'].push(value);
            });
            tray['echo'] = fxBase['text']['implode'](fxBase['base']['lang']('|'), tray['echo']);
            return tray['echo'];
        };
    },
    // 视图
    'view': function(dark, base, echo, tray) {
        // 初始化变量
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
                    'shadeClose': true,
                    'success': function(layero, index) {
                        // 配置索引
                        tray['layer.index'] = fxBase['text']['implode']('-', [$(layero[0]).attr('times'), fxApp['rank']['self.code'], 'layui']);
                        fxApp['rank']['self.layer.index.set'](tray['layer.index']);
                    },
                    'end': function() {
                        // 销毁索引
                        fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    }
                };
                // 删除确认
                layui.layer.confirm(echo['message'], echo['config'], function(index) {
                    // 移除元素
                    echo['elem'].remove();
                    // 销毁索引
                    fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    // 关闭窗口
                    layui.layer.close(index);
                });
            });
        }
        // 疏理新增
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
        // 疏理新增
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
    },
    // 视图-行
    'view_row': function(dark, base, echo, tray) {
        // 初始化变量
        fxView["material"]["elem"]["table"]["skin"]["deploy"]["view"](dark, base, echo, tray);
    }
});
fxView['machine']['deployer'](['material', 'elem', 'table', 'skin', 'echo'], {
    // 视图
    'view': function(dark, base, echo, tray) {
        // 初始化变量
        $(dark['plugin']['echo'].el).children().each(function(key, value) {
            dark['echo'][key] = {};
            $(value).children('input').each(function(key2, value2) {
                if (true === dark['shelf']['data'][key2]['self']) {
                    tray['value'] = $(value2).val();
                    if (!isJson(tray['value'])) {
                        tray['value'] = '{}';
                    }
                    tray['value'] = JSON.parse(tray['value']);
                    dark['echo'][key] = fxBase['param']['merge'](dark['echo'][key], tray['value']);
                } else {
                    dark['echo'][key][$(value2).attr('moire-type')] = $(value2).val();
                }
            });
        });
    },
    // 视图-行
    'view_row': function(dark, base, echo, tray) {
        // 初始化变量
        $(dark['plugin']['echo'].el).children().each(function(key, value) {
            $(value).children('input').each(function(key2, value2) {
                dark['echo'].push($(value2).val());
            });
        });
    }
});