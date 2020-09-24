/**
 * 云纹物料-元素-下拉框选取
 */
fxView['material']['elem']['selected'] = function() {
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
        dark['elem'] = $('<div></div>');
        dark['elem'].attr({
            'id': dark['id']
        });
        dark['elem'].html(!isBlank(dark['shelf']['data'][dark['data']]) ? dark['shelf']['data'][dark['data']] : '');
        // 疏理输出
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    return !isBlank(dark['shelf']['data'][data[dark['field']]]) ?
                        dark['shelf']['data'][data[dark['field']]] :
                        '';
                };
                break;
            case 'table_link':
                // 表格-链接
                // 获取参数
                dark['param'] = fxBase['dom']['url']({
                    'type': '2.1'
                });
                dark['param']['base']['token'] = fxApp['user']['base']['token'];
                dark['param']['base']['page'] = 1;
                dark['param']['base']['limit'] = -1;
                // 配置地址
                dark['url'] = fxBase['dom']['url']({
                    'type': '1.1',
                    'url': dark['base']['api']['export'],
                    'param': dark['param']
                });
                dark['templet'] = function(data) {
                    return !isBlank(dark['shelf']['data'][data[dark['field']]]) ?
                        '<a href="' + dark['url'] + '" title="' + dark['title'] + '">' +
                        dark['shelf']['data'][data[dark['field']]] + '</a>' :
                        '';
                };
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
        dark['elem'].html(!isBlank(dark['shelf']['data'][dark['data']]) ? dark['shelf']['data'][dark['data']] : '');
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
    };
    return echo;
};