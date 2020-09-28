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
            'data': '',
            // 选项
            'option': {
                // 地址
                'url': null,
                // 文本
                'text': '点击跳转',
                // 样式
                'style': 'display: block;width: 100%;height: 100%',
                // 目标
                'target': '_blank'
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['option']['text'] = fxBase['base']['lang'](dark['option']['text']);
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
        // 疏理皮肤
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    return !isBlank(data[dark['field']]) ? data[dark['field']] : '';
                }
                break;
            case 'table_link':
                // 表格-链接
                dark['templet'] = function(data) {
                    var tray = {};
                    tray['echo'] = '';
                    // 疏理链接
                    if (!isBlank(dark['option']['url'])) {
                        tray['href'] = 'fxy-href';
                        tray['url'] = fxBase['param']['url']({
                            'type': '1.2',
                            'url': dark['option']['url'],
                            'param': dark['option']['param'](dark['field'], data)
                        });
                    } else {
                        tray['href'] = 'href';
                        tray['url'] = data[dark['field']];
                    }
                    // 疏理元素
                    if (!isBlank(tray['url'])) {
                        tray['attr'] = {
                            'title': dark['title'],
                            'style': dark['option']['style'],
                            'target': dark['option']['target']
                        };
                        tray['attr'][tray['href']] = tray['url'];
                        tray['echo'] = $('<a></a>');
                        tray['echo'].attr(tray['attr']);
                        tray['echo'].text(dark['option']['text']);
                        tray['echo'] = tray['echo'].prop('outerHTML');
                    }
                    return tray['echo'];
                }
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
        dark['elem'].text(dark['data']);
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
    };
    return echo;
};