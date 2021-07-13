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
 * 云纹模具-视图-视图-皮肤
 */
fxView['machine']['deployer'](['mould', 'view', 'view', 'skin', 'layui'], function() {
    // 初始化变量
    var dark = {
        // 基础
        'base': fxBase['param']['merge']({
            // 调试
            'debug': false,
            // 皮肤
            'skin': 'view'
        }, fxView['shelf']['view'])
    };
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (!isSet(dark['base']['api']['elem'])) {
        fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['elem', 'not configured'] }]);
    }
    // 识别类型
    tray['view'] = dark;
    // 疏理基础
    tray['view'] = fxBase['param']['merge'](tray['view'], {
        // 数据
        'data': null,
        // 标题
        'title': null,
        // 窗口
        'window': {
            // 标题
            'title': false
        },
        // 成功回调
        'success': function() {
            fxApp['rank']['parent.layui.table.reload']('moire-table');
            fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
        },
        // 工具栏
        'toolbar': {
            1: fxBase['base']['template']({
                // 元素
                'elem': 'tool',
                // 类型
                'type': 'view-edit',
                // 单元
                'cell': 'close'
            }).html()
        }
    }, tray['view']);
    // 判断顶页面
    if (tray['view']['window']['title'] && self != top) {
        // 替换标题
        $(top.document).find('title').html(fxApp['view']['title'] + ' - ' + top.fxApp['env']['title']);
    }
    // 检查配置
    if (!isFunction(tray['view']['data'])) {
        fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['feature', 'not configured'] }]);
    }
    // 请求数据
    tray['echo'] = {
        // 地址
        'url': dark['base']['api']['elem'],
        // 类型
        'type': 'get',
        // 异步
        'async': false,
        // 数据
        'data': {
            // 数据
            'data': {}
        },
        // 扩展
        'extend': {
            // 提示
            'tips': false
        }
    };
    tray['echo']['data']['data'][dark['base']['model']['key']] = dark['base']['param'][dark['base']['model']['key']];
    tray['echo'] = fxView['store']['deal'](tray['echo']);
    if (tray['echo']['code'] != 200) {
        fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': tray['echo']['message'] }]);
    } else if (tray['echo']['data'].length == 0) {
        fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['data', 'not', 'exists'] }]);
    }
    // 疏理视图
    $('.moire-wapper').append(fxBase['base']['template']({ 'elem': 'view', 'type': 'view' }).html());
    // 疏理按钮
    $.each(tray['view']['toolbar'], function(key, value) {
        $('.moire-view .moire-button').eq(key).append(value);
    });
    // 成功回调
    tray['elem'] = $('.moire-view .moire-table');
    // 疏理标题
    if (isSet(tray['view']['title'])) {
        tray['view']['title'] = fxBase['base']['lang'](tray['view']['title']);
        tray['elem'].before('<div class="moire-thead"><div moire-elem="title">' + tray['view']['title'] + '</div></div>');
    }
    // 疏理数据
    tray['list'] = fxView['cache']['elem']['view'] = {};
    $.each(tray['view']['data'](tray['echo']['data']), function(key, value) {
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
    // 渲染表单
    layui.form.render();
    // 关闭窗口
    $('.moire-button .moire-close').on('click', function() {
        fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
    });
    // 执行图片加载器
    tray['elem'].find('div[moire-cell]').viewer({
        'title': false,
        'zIndex': fxBase['base']['maxZIndex']()
    }).on('show', function() {
        fxApp['rank']['self.layer.index.set'](md5(tray['elem'].attr('class')))
    }).on('hide', function() {
        fxApp['rank']['self.layer.index.destroy'](md5(tray['elem'].attr('class')));
    });
});