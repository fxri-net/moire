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
 * 云纹物料-元素-下拉框选取-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'selected', 'skin', 'deploy'], {
    // 表格
    'table': function(dark, base, echo, tray) {
        // 初始化变量
        dark['templet'] = function(data) {
            // 初始化变量
            tray['data'] = fxBase['data']['fieldParse'](data, dark['field']);
            // 疏理数据
            dark['list'].push(data);
            return !isBlank(dark['shelf']['data'][tray['data']]) ? dark['shelf']['data'][tray['data']] : '';
        };
    },
    // 表格-链接
    'table_link': function(dark, base, echo, tray) {
        // 初始化变量
        dark['wrapBox']['attr']['moire-elem'] = 'link';
        dark['templet'] = function(data) {
            // 初始化变量
            tray['data'] = fxBase['data']['fieldParse'](data, dark['field']);
            // 疏理数据
            dark['list'].push(data);
            tray['echo'] = '';
            // 疏理链接
            tray['url'] = fxBase['param']['url']({
                'type': '1.1',
                'url': dark['option']['url'],
                'param': dark['option']['param'](dark['field'], data)
            });
            // 疏理元素
            if (!isBlank(dark['shelf']['data'][tray['data']])) {
                tray['attr'] = {
                    'fxy-href': tray['url'],
                    'title': dark['title']
                };
                tray['echo'] = $('<a><div></div></a>');
                tray['echo'].attr(tray['attr']);
                tray['attr'] = {
                    'class': dark['option']['class']
                };
                tray['echo'].find('div').attr(tray['attr']).text(dark['shelf']['data'][tray['data']]);
                tray['echo'] = tray['echo'].prop('outerHTML');
            }
            return tray['echo'];
        };
    },
    // 视图
    'view': function(dark, base, echo, tray) {
        // 初始化变量
        base['pack'].append(dark['wrap']);
        dark['wrap'].attr({
            'class': 'layui-col-xs12 layui-col-md6'
        });
        dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
        dark['wrap'].children('[moire-key]').html(dark['label']);
        dark['wrap'].children('[moire-cell]').append(dark['elem']);
        dark['elem'].attr({
            'class': 'moire-div'
        });
    }
});