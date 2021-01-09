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
 * 云纹模具-工具-窗口
 */
fxView['mould']['tool']['window'] = function() {
    // 初始化变量
    var dark = fxBase['param']['merge']({
        // 皮肤
        'skin': 'moire-view',
        // 副标题
        'subtitle': null
    }, fxView['shelf']['view']);
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (isNull(dark['page'][dark['elem']])) {
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
    // 疏理数据
    if (!isBlank(dark['param'][dark['model']['key']])) {
        dark['data'] = '&data[' + dark['model']['key'] + ']=' + dark['param'][dark['model']['key']];
    } else {
        dark['data'] = '';
    }
    // 打开弹窗
    layui.layer.open({
        'type': 2,
        'title': fxBase['base']['lang']([fxApp['view']['name'], dark['subtitle']]),
        'content': dark['page'][dark['elem']] + dark['data'],
        'skin': dark['skin'],
        'area': ['100%', '100%'],
        'maxmin': false,
        'scrollbar': false,
        'zIndex': fxBase['base']['maxZIndex']()
    });
};