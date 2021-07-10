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
 * 云纹模具-视图-新增
 */
fxView['machine']['deployer'](['mould', 'view', 'add', 'main'], function() {
    // 初始化变量
    var dark = [
        // 参数
        null,
        // 皮肤
        'layui'
    ];
    dark = fxBase['param']['merge'](dark, arguments);
    // 检查皮肤
    if (!isFunction(fxView['machine']['caller'](['mould', 'view', 'add', 'skin', dark[1]]))) {
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': [dark[1], 'plugin', 'not loaded'] }]);
    }
    // 渲染之前
    fxView['machine']['caller'](['before'], dark, dark[0]);
    // 执行皮肤
    fxView['machine']['caller'](['mould', 'view', 'add', 'skin', dark[1]], dark);
    // 渲染之后
    fxView['machine']['caller'](['after'], dark, dark[0]);
});