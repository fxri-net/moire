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
    if (isNull(dark['api']['import'])) {
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
};