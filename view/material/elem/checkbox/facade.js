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
 * 云纹物料-元素-复选框
 */
fxView['material']['elem']['checkbox'] = function() {
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
        dark['shelf']['data'] = fxBase['text']['implode']('|', dark['shelf']['data'].reverse());
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
            'type': 'checkbox',
            'id': dark['id'],
            'name': dark['field'],
            'title': dark['title']
        });
        dark['elem'].prop('checked', !!parseInt(dark['data']));
        // 疏理皮肤
        switch (dark['skin']) {
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
                break;
        }
    };
    // 输出
    echo['echo'] = function() {
        // 疏理数据
        dark['echo'] = dark['elem'].prop('checked') ? 1 : 0;
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].prop('checked', !!parseInt(dark['data']));
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].prop('checked', false);
    };
    return echo;
};