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
        // 副标题
        'subtitle': null,
        // 选项
        'option': {
            // 类型
            'type': 2,
            // 皮肤
            'skin': 'moire-view',
            // 宽高
            'area': ['100%', '100%'],
            // 最大最小化
            'maxmin': false,
            // 是否允许浏览器出现滚动条
            'scrollbar': false,
            // 层叠顺序
            'zIndex': fxBase['base']['maxZIndex']()
        }
    }, fxView['shelf']['view']);
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (!isSet(dark['page'][dark['elem']])) {
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
    // 疏理数据
    if (!isBlank(dark['param'][dark['model']['key']])) {
        dark['data'] = '&data[' + dark['model']['key'] + ']=' + dark['param'][dark['model']['key']];
    } else {
        dark['data'] = '';
    }
    // 打开弹窗
    dark['option'] = fxBase['param']['merge']({
        // 标题
        'title': fxBase['base']['lang']([fxApp['view']['name'], dark['subtitle']]),
        // 内容
        'content': dark['page'][dark['elem']] + dark['data'],
    }, dark['option']);
    layui.layer.open(dark['option']);
};