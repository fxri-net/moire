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
 * 云纹模具-工具-下载-皮肤
 */
fxView['machine']['deployer'](['mould', 'tool', 'download', 'skin', 'layui'], function() {
    // 初始化变量
    var dark = fxBase['param']['merge']({}, fxView['shelf']['view']);
    var tray = {};
    tray[dark['model']['key']] = [];
    // 检查配置
    if (!isSet(dark['api']['download'])) {
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['download', 'feature', 'not configured'] }]);
    }
    window.open(dark['api']['download']);
});