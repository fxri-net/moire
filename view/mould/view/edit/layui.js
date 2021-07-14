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
 * 云纹模具-视图-编辑-皮肤
 */
fxView['machine']['deployer'](['mould', 'view', 'edit', 'skin', 'layui'], function() {
    // 初始化变量
    var dark = {
        // 基础
        'base': {},
        // 工具栏
        'toolbar': {
            0: fxBase['base']['template']({
                // 元素
                'elem': 'tool',
                // 类型
                'type': 'view-edit',
                // 单元
                'cell': 'submit,reset,clear'
            }).html(),
            1: fxBase['base']['template']({
                // 元素
                'elem': 'tool',
                // 类型
                'type': 'view-edit',
                // 单元
                'cell': 'close'
            }).html()
        }
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 执行视图
    fxView['machine']['caller'](['mould', 'view', 'view', 'main'], [dark]);
});