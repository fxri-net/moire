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
        // 事件
        'event': {},
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
                // 执行事件
                fxView['machine']['caller'](['event', 'success'], [layero, index, dark], dark);
            },
            // 销毁回调
            'end': function() {
                // 销毁索引
                fxApp['rank']['self.layer.index.destroy'](dark['index']);
                // 执行事件
                fxView['machine']['caller'](['event', 'end'], [dark], dark);
            }
        },
        // 窗口
        'window': window
    }, fxView['shelf']['view']);
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (!isSet(dark['page'][dark['elem']])) {
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': [dark['elem'], 'window', 'feature', 'not configured'] }]);
    }
    // 疏理链接
    tray['url'] = fxBase['param']['url']({
        'type': '1.2',
        'url': dark['page'][dark['elem']],
        'param': fxBase['param']['url']({
            'type': '2.1',
            'url': dark['page'][dark['elem']],
            'param': dark['param']
        })
    });
    // 打开弹窗
    dark['option'] = fxBase['param']['merge']({
        // 标题
        'title': fxBase['base']['lang']([fxApp['view']['name'], dark['subtitle']]),
        // 内容
        'content': tray['url'],
    }, dark['option']);
    dark['index'] = dark['window'].layui.layer.open(dark['option']);
    dark['index'] = fxBase['text']['implode']('-', [dark['index'], fxApp['rank']['self.code'], 'layui']);
    // 配置索引
    fxApp['rank']['self.layer.index.set'](dark['index']);
});