/**
 * 云纹物料-元素-文本
 */
fxView['material']['elem']['text'] = function() {
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
            'data': ''
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
    };
    // 部署
    echo['deploy'] = function() {
        // 疏理包装
        dark['wrap'] = $('<div></div>');
        dark['wrap'].attr({
            'moire-elem': 'elem'
        });
        // 疏理元素
        dark['elem'] = $('<div></div>');
        dark['elem'].attr({
            'id': dark['id']
        });
        dark['elem'].text(dark['data']);
        // 疏理输出
        switch (dark['skin']) {
            case 'table_link':
                // 表格-链接
                dark['templet'] = function(data) {
                    return !isBlank(data[dark['field']]) ?
                        '<a href="' + data[dark['field']] + '" title="' + dark['title'] + '" target="_blank">点击跳转</a>' :
                        '';
                }
                break;
            case 'view':
                // 视图
                dark['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-md6'
                });
                dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
                dark['wrap'].children('[moire-key]').html(dark['title']);
                dark['wrap'].children('[moire-cell]').append(dark['elem']);
                dark['elem'].attr({
                    'class': 'moire-div'
                });
                break;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].text(dark['data']);
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
    };
    return echo;
};