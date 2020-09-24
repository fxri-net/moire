/**
 * 云纹物料-元素-下拉框
 */
fxView['material']['elem']['select'] = function() {
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
            // 默认
            'default_value': 0
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['default'] = fxBase['base']['lang'](dark['default']);
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
        dark['elem'] = $('<select></select>');
        dark['elem'].attr({
            'id': dark['id'],
            'name': dark['field']
        });
        dark['elem'].append('<option value="">' + dark['default'] + '</option>');
        $.each(dark['shelf']['data'], function(key2, value2) {
            dark['elem'].append('<option value="' + key2 + '"' + (dark['data'] == key2 ? ' selected' : '') + '>' + value2 + '</option>');
        });
        // 疏理输出
        switch (dark['skin']) {
            case 'search':
                // 搜索
                dark['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs6 layui-col-sm3 layui-col-md2'
                });
                dark['wrap'].append(dark['elem']);
                dark['elem'].attr({
                    'lay-verify': dark['requireText']
                });
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
                    'lay-verify': dark['requireText']
                });
                break;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].val(dark['data']);
        dark['elem'].next().find('input').val(dark['elem'].find('option:selected').html());
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].val('');
    };
    return echo;
};