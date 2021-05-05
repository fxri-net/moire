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
 * 云纹模具-工具-下载
 */
fxView['machine']['deployer'](['mould', 'tool', 'download', 'main'], function() {
    // 初始化变量
    var dark = [
        // 参数
        null,
        // 皮肤
        'layui'
    ];
    dark = fxBase['param']['merge'](dark, arguments);
    // 执行插件
    if (!isFunction(fxView['machine']['caller'](['mould', 'tool', 'download', 'skin', dark[1]]))) {
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': [dark[1], 'plugin', 'not loaded'] }]);
    }
    fxView['machine']['caller'](['mould', 'tool', 'download', 'skin', dark[1]], dark);
});