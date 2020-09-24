/**
 * 云纹物料-元素-日期
 */
fxView['material']['elem']['date'] = function() {
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
            'default': ['choice', dark['title']],
            // 插件
            'plugin': {
                // 类型
                'type': 'datetime'
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['default'] = fxBase['base']['lang'](dark['default']);
    };
    // 部署
    echo['deploy'] = function() {
        // 疏理包装
        dark['wrap'] = $('<div></div>');
        dark['wrap'].attr({
            'moire-elem': 'elem'
        });
        // 疏理元素
        dark['elem'] = $('<input>');
        dark['elem'].attr({
            'type': 'text',
            'id': dark['id'],
            'name': dark['field'],
            'placeholder': dark['default'],
            'autocomplete': 'off'
        });
        dark['elem'].val(dark['data']);
        // 疏理输出
        switch (dark['skin']) {
            case 'search':
                // 搜索
                dark['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-sm6 layui-col-md4'
                });
                dark['wrap'].append(dark['elem']);
                dark['elem'].attr({
                    'class': 'layui-input',
                    'lay-verify': dark['requireText']
                });
                // 疏理配置
                dark['plugin']['elem'] = dark['elem'][0];
                layui.laydate.render(dark['plugin']);
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
                    'class': 'layui-input',
                    'lay-verify': dark['requireText']
                });
                // 疏理配置
                dark['plugin']['elem'] = dark['elem'][0];
                dark['plugin'] = layui.laydate.render(dark['plugin']);
                // 离开事件
                dark['elem'].on('blur', function() {
                    // 疏理日期
                    var tray = {};
                    tray['value'] = $(this).val();
                    // 解析格式
                    tray['regexp'] = '[^A-Za-z]+';
                    tray['format'] = fxBase['text']['explode'](tray['regexp'], dark['plugin'].config.format, 'regular');
                    tray['regexp'] = '[A-Za-z]+';
                    tray['format_separator'] = fxBase['text']['explode'](tray['regexp'], dark['plugin'].config.format, 'regular').slice(1, -1);
                    // 解析时间
                    tray['regexp'] = '[^0-9]+';
                    tray['value'] = fxBase['text']['explode'](tray['regexp'], tray['value'], 'regular').slice(0, tray['format'].length);
                    // 填充时间
                    $.each(tray['format'], function(key2, value2) {
                        tray['value'][key2] = fxBase['text']['strPad'](!isBlank(tray['value'][key2]) ? tray['value'][key2] : '0', value2.length, 0, 0);
                    });
                    $.each(tray['format_separator'], function(key2, value2) {
                        tray['value'][key2] = tray['value'][key2] + value2;
                    });
                    // 组装时间
                    tray['value'] = fxBase['text']['implode']('', tray['value']);
                    $(this).val(tray['value']);
                });
                break;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].val(dark['data']);
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].val('');
    };
    return echo;
};