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
 * 云纹模具-视图-搜索-皮肤
 */
fxView['machine']['deployer'](['mould', 'view', 'search', 'skin', 'layui'], function() {
    // 初始化变量
    var dark = {
        // 基础
        'base': fxBase['param']['merge']({
            // 调试
            'debug': false,
            // 皮肤
            'skin': 'search'
        }, fxView['shelf']['view']),
        // 数据
        'data': null,
        // 工具栏
        'toolbar': fxBase['base']['template']({
            'elem': 'tool',
            'type': 'view-search',
            'cell': 'submit,reset,clear'
        }).html()
    };
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (!isFunction(dark['data'])) {
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['feature', 'not configured'] }]);
    }
    // 疏理元素
    tray['elem'] = $('.moire-search');
    // 疏理数据
    tray['list'] = fxView['cache']['elem']['search'] = {};
    $.each(dark['data'](dark['base']['param']), function(key, value) {
        // 解析数据
        value['id'] = fxBase['text']['explode'](',', value['id']);
        value['type'] = fxBase['text']['explode'](',', value['type']);
        $.each(value['type'], function(key2, value2) {
            // 校验元素
            if (!isFunction(fxView['machine']['caller'](['material', 'elem', value2, 'main']))) {
                if (dark['base']['debug']) {
                    console.log(fxBase['base']['lang'](['material', 'element', '[', fxApp["view"]["langc"]["prefix"] + value2, ']', 'not2', 'load']));
                }
                return true;
            }
            // 配置基础
            tray['base'] = {};
            tray['base']['cache'] = tray['list'];
            tray['base']['mould'] = dark;
            tray['base']['pack'] = tray['elem'];
            // 配置数据
            tray['data'] = fxBase['param']['merge'](1, {
                'field': key,
                'skin': dark['base']['skin']
            }, value);
            tray['data']['id'] = !isBlank(value['id'][key2]) ? value['id'][key2] : key + '-' + key2;
            tray['data']['type'] = value2;
            // 初始化元素
            tray['list'][tray['data']['id']] = fxView['machine']['caller'](['material', 'elem', value2, 'main'], []);
            tray['list'][tray['data']['id']]['init'](tray['data'], tray['base']);
        })
    });
    // 渲染数据
    $.each(tray['list'], function(key, value) {
        // 执行部署
        value['deploy']();
        // 执行完成
        $(document).ready(function() {
            value['done']();
        });
    });
    // 疏理元素
    tray['elem'].append('<div class="layui-col-xs12 moire-button">' + dark['toolbar'] + '</div>');
    // 渲染表单
    layui.form.render();
    // 重置条件
    $('.moire-search.layui-form .moire-reset').on('click', function() {
        // 渲染数据
        $.each(tray['list'], function(key, value) {
            // 执行重置
            value['reset']();
        });
        // 渲染表单
        layui.form.render();
    });
    // 清理条件
    $('.moire-search.layui-form .moire-clean').on('click', function() {
        // 渲染数据
        $.each(tray['list'], function(key, value) {
            // 执行清理
            value['clean']();
        });
        // 渲染表单
        layui.form.render();
    });
});