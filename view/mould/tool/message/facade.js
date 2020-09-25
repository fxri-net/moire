/**
 * 云纹模具-工具-消息
 */
fxView['mould']['tool']['message'] = function() {
    // 初始化变量
    var dark = {
        // 内容
        'text': '',
        // 图标
        'icon': 'info',
        // 自动关闭
        'hideAfter': 1500,
        // 位置
        'position': 'bottom-left',
        // 消息栈
        'stack': 1
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    dark['text'] = fxBase['base']['lang'](dark['text']);
    top.window.$.toast(dark);
};