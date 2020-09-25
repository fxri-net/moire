/**
 * 云纹模具-工具-下载
 */
fxView['mould']['tool']['download'] = function() {
    // 初始化变量
    var dark = fxBase['param']['merge']({}, fxView['shelf']['view']);
    var tray = {};
    tray[dark['model']['key']] = [];
    // 检查配置
    if (isNull(dark['api']['download'])) {
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
    window.open(dark['api']['download']);
};