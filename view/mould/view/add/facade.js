/**
 * 云纹模具-视图-添加
 */
fxView['mould']['view']['add'] = function() {
    // 初始化变量
    var dark = {
        // 基础
        'base': fxBase['param']['merge']({}, fxView['shelf']['view'])
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 执行视图
    fxView['mould']['view']['edit'](dark);
};