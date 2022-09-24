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
 * 云纹物料-元素-文本-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'text', 'skin', 'deploy'], {
    // 表格
    'table': function(dark, base, echo, tray) {
        // 初始化变量
        dark['templet'] = function(data) {
            // 初始化变量
            tray['data'] = fxBase['data']['fieldParse'](data, dark['field']);
            // 疏理数据
            dark['list'].push(data);
            return !isBlank(tray['data']) ? tray['data'] + dark['dataSuffix'] : '';
        }
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
            if (!isBlank(dark['option']['url'])) {
                tray['href'] = 'fxy-href';
                tray['url'] = fxBase['param']['url']({
                    'type': '1.2',
                    'url': dark['option']['url'],
                    'param': dark['option']['param'](dark['field'], data)
                });
            } else {
                tray['href'] = 'href';
                tray['url'] = tray['data'];
            }
            // 疏理元素
            if (!isBlank(tray['url'])) {
                tray['attr'] = {
                    'title': dark['title'],
                    'target': dark['option']['target']
                };
                tray['attr'][tray['href']] = tray['url'];
                tray['echo'] = $('<a><div></div></a>');
                tray['echo'].attr(tray['attr']);
                tray['attr'] = {
                    'class': dark['option']['class'],
                };
                tray['echo'].find('div').attr(tray['attr']).text(dark['option']['text']);
                tray['echo'] = tray['echo'].prop('outerHTML');
            }
            return tray['echo'];
        }
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