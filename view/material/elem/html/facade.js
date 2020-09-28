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
 * 云纹物料-元素-超文本
 */
fxView['material']['elem']['html'] = function() {
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
        dark['elem'].html(dark['data']);
        // 疏理皮肤
        switch (dark['skin']) {
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
        dark['elem'].html(dark['data']);
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
    };
    return echo;
};