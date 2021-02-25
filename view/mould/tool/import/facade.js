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
 * 云纹模具-工具-导入
 */
fxView['mould']['tool']['import'] = function() {
    // 初始化变量
    var dark = fxBase['param']['merge']({}, fxView['shelf']['view']);
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    tray[dark['model']['key']] = [];
    // 检查配置
    if (!isSet(dark['api']['import'])) {
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
};