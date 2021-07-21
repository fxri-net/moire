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
 * 云纹模具-工具-窗口-皮肤
 */
fxView['machine']['deployer'](['mould', 'tool', 'window', 'skin', 'layui'], function() {
    // 初始化变量
    var dark = fxBase['param']['merge']({
        // 副标题
        'subtitle': null,
        // 选项
        'option': {
            // 类型
            'type': 2,
            // 皮肤
            'skin': 'moire-window',
            // 宽高
            'area': ['70%', '70%'],
            // 遮罩
            'shade': false,
            // 最大最小化
            'maxmin': true,
            // 是否允许浏览器出现滚动条
            'scrollbar': false,
            // 层叠顺序
            'zIndex': fxBase['base']['maxZIndex'](),
            // 成功回调
            'success': function(layero, index) {
                // 窗口最大化
                layui.layer.full(index);
                // 配置数据
                fxView['machine']['deployer'](['rank'], {
                    // 起源-窗口
                    'parent.window': window,
                    // 本身-弹窗-索引
                    'self.layer.index': dark['index']
                }, $(layero[0]).find('iframe').prop('contentWindow').fxApp);
            },
            // 销毁回调
            'end': function() {
                // 销毁索引
                fxApp['rank']['self.layer.index.destroy'](dark['index']);
            }
        }
    }, fxView['shelf']['view']);
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (!isSet(dark['page'][dark['elem']])) {
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['feature', 'not configured'] }]);
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
    dark['index'] = layui.layer.open(dark['option']);
    dark['index'] = fxBase['text']['implode']('-', [dark['index'], fxApp['rank']['self.code'], 'layui']);
    // 配置索引
    fxApp['rank']['self.layer.index.set'](dark['index']);
});