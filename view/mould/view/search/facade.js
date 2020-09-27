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
 * 云纹模具-视图-搜索
 */
fxView['mould']['view']['search'] = function() {
    // 初始化变量
    var dark = {
        // 基础
        'base': fxBase['param']['merge']({
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
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
    // 疏理元素
    tray['elem'] = $('.moire-search');
    // 疏理数据
    tray['list'] = fxView['deploy']['cache']['search'] = {};
    $.each(dark['data'](dark['base']['param']), function(key, value) {
        // 解析数据
        value['id'] = fxBase['text']['explode'](',', value['id']);
        value['type'] = fxBase['text']['explode'](',', value['type']);
        $.each(value['type'], function(key2, value2) {
            // 校验元素
            if (!isFunction(fxView['material']['elem'][value2])) return true;
            // 配置数据
            tray['data'] = fxBase['param']['merge'](1, {
                'field': key,
                'skin': dark['base']['skin']
            }, value);
            tray['data']['mould'] = dark;
            tray['data']['pack'] = tray['elem'];
            tray['data']['id'] = !isBlank(value['id'][key2]) ? value['id'][key2] : key + '-' + key2;
            tray['data']['type'] = value2;
            tray['list'][tray['data']['id']] = fxView['material']['elem'][value2]();
            tray['list'][tray['data']['id']]['init'](tray['data']);
        })
    });
    // 渲染数据
    $.each(tray['list'], function(key, value) {
        // 执行部署
        value['deploy']();
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
};