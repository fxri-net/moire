/**
 * 云纹物料-元素-隐藏字段
 */
fxView['material']['elem']['hidden'] = function() {
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
        if (isArray(dark['data'])) {
            dark['data'] = fxBase['text']['implode'](',', dark['data']);
        } else if (isObject(dark['data'])) {
            dark['data'] = fxBase['text']['implode'](',', Object.values(dark['data']));
        }
    };
    // 部署
    echo['deploy'] = function() {
        // 疏理元素
        dark['elem'] = $('<input>');
        dark['elem'].attr({
            'type': 'hidden',
            'id': dark['id'],
            'name': dark['field']
        });
        dark['elem'].val(dark['data']);
        // 疏理输出
        switch (dark['skin']) {
            case 'search':
                // 搜索
                dark['elem'].attr({
                    'lay-verify': dark['requireText']
                });
                dark['pack'].append(dark['elem']);
                break;
            case 'view':
                // 视图
                dark['elem'].attr({
                    'lay-verify': dark['requireText']
                });
                dark['pack'].append(dark['elem']);
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