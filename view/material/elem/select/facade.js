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
        $.each(dark['shelf']['data'], function(key, value) {
            dark['elem'].append('<option value="' + key + '"' + (dark['data'] == key ? ' selected' : '') + '>' + value + '</option>');
        });
        // 疏理皮肤
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
                dark['wrap'].children('[moire-key]').html(dark['label'] + dark['requireMark']);
                dark['wrap'].children('[moire-cell]').append(dark['elem']);
                dark['elem'].attr({
                    'lay-verify': dark['requireText']
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
        dark['echo'] = dark['elem'].val();
        // 疏理皮肤
        switch (dark['skin']) {
            case 'view':
                // 视图
                dark['echo'] = !isBlank(dark['echo']) ? dark['echo'] : dark['default_value'];
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