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
                // 样式
                'style': 'display: block;width: 100%;height: 100%'
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
        // 疏理皮肤
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    return !isBlank(dark['shelf']['data'][data[dark['field']]]) ? dark['shelf']['data'][data[dark['field']]] : '';
                };
                break;
            case 'table_link':
                // 表格-链接
                dark['templet'] = function(data) {
                    var tray = {};
                    tray['echo'] = '';
                    // 疏理链接
                    tray['url'] = fxBase['param']['url']({
                        'type': '1.1',
                        'url': dark['option']['url'],
                        'param': dark['option']['param'](dark['field'], data)
                    });
                    // 疏理元素
                    if (!isBlank(dark['shelf']['data'][data[dark['field']]])) {
                        tray['echo'] = $('<a></a>');
                        tray['echo'].attr({
                            'fxy-href': tray['url'],
                            'title': dark['title'],
                            'style': dark['option']['style']
                        });
                        tray['echo'].text(dark['shelf']['data'][data[dark['field']]]);
                        tray['echo'] = tray['echo'].prop('outerHTML');
                    }
                    return tray['echo'];
                };
                break;
            case 'view':
                // 视图
                dark['pack'].append(dark['wrap']);
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
        // 疏理视图
        if (isFunction(dark['view'])) {
            dark['view'](dark);
        }
    };
    // 输出
    echo['echo'] = function() {
        // 疏理数据
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