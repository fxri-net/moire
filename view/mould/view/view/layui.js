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
            'skin': 'view',
            // 来源
            'source': true
        }, fxView['shelf']['view'])
    };
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (!isSet(dark['base']['api']['elem'])) {
        return $(document).ready(function() {
            fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['api', 'not configured'] }]);
            fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
        });
    }
    // 疏理基础
    dark = fxBase['param']['merge'](dark, {
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
            0: null,
            1: fxBase['base']['template']({
                // 元素
                'elem': 'tool',
                // 类型
                'type': 'view-edit',
                // 单元
                'cell': 'close'
            }).html()
        }
    }, dark);
    // 判断顶页面
    if (dark['window']['title'] && self != top) {
        // 替换标题
        $(top.document).find('title').html(fxApp['view']['title'] + ' - ' + top.fxApp['env']['title']);
    }
    // 检查配置
    if (!isFunction(dark['data'])) {
        return $(document).ready(function() {
            fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['feature', 'not configured'] }]);
            fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
        });
    }
    // 识别类型
    tray['echo'] = {};
    // 请求元素
    if (dark['base']['source']) {
        // 请求数据
        tray['echo'] = {
            // 地址
            'url': dark['base']['api']['elem'],
            // 类型
            'type': 'get',
            // 异步
            'async': true,
            // 数据
            'data': {
                // 数据
                'data': {}
            },
            // 成功回调
            'success': function(data) {
                tray['echo'] = dark['echo'] = data;
                if (tray['echo']['code'] != 200) {
                    // 请求错误
                    fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': tray['echo']['message'] }]);
                    return fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
                } else if (tray['echo']['data'].length == 0) {
                    // 数据为空
                    fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['data', 'not', 'exists'] }]);
                    return fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
                }
                // 渲染表单
                fxView['machine']['caller'](['cache', 'render', dark['base']['elem']], []);
            }
        };
        tray['echo']['data']['data'][dark['base']['model']['key']] = fxApp['data'][dark['base']['model']['key']];
        fxView['store']['deal'](tray['echo']);
    }
    tray['echo']['data'] = {};
    // 疏理视图
    $('.moire-wapper').append(fxBase['base']['template']({ 'elem': 'view', 'type': 'view' }).html());
    $('.moire-wapper .moire-view').addClass(dark['base']['elem']);
    // 疏理按钮
    $.each(dark['toolbar'], function(key, value) {
        $('.moire-view .moire-button').eq(key).append(value);
    });
    // 成功回调
    tray['elem'] = $('.moire-view .moire-table');
    // 疏理标题
    if (isSet(dark['title'])) {
        dark['title'] = fxBase['base']['lang'](dark['title']);
        tray['elem'].before('<div class="moire-thead"><div moire-elem="title">' + dark['title'] + '</div></div>');
    }
    // 疏理数据
    tray['list'] = fxView['cache']['elem'][dark['base']['elem']] = {};
    // 渲染表单
    fxView['machine']['deployer'](['cache', 'render', dark['base']['elem']], function() {
        tray['elem'].find('[moire-elem=elem]').remove();
        $.each(dark['data'](tray['echo']['data']), function(key, value) {
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
    // 渲染表单
    fxView['machine']['caller'](['cache', 'render', dark['base']['elem']], []);
    // 提交请求
    layui.form.on('submit(moire-submit)', function(data) {
        // 初始化变量
        var elem = $(this);
        try {
            elem.attr('disabled', true);
            // 渲染数据
            tray['data'] = {};
            $.each(tray['list'], function(key, value) {
                // 执行输出
                if (!isSet(value['dark']['echo']) || value['dark']['echoSwitch'] != 1) return true;
                // 疏理输出
                $.each(fxBase['text']['explode']('-_', value['dark']['field']).reverse(), function(key2, value2) {
                    var data = {};
                    data[value2] = value['dark']['echo'];
                    value['dark']['echo'] = data;
                });
                tray['data'] = fxBase['param']['merge'](tray['data'], value['dark']['echo']);
            });
            // 渲染数据
            $.each(tray['data'], function(key, value) {
                // 初始化变量
                if (!isArray(value) && !isObject(value)) return true;
                tray['data'][key] = JSON.stringify(value);
            });
            // 处理数据
            tray['echo'] = fxView['store']['deal']({
                // 地址
                'url': dark['base']['api'][dark['base']['elem']],
                // 异步
                'async': false,
                // 数据
                'data': {
                    // 数据
                    'data': tray['data']
                },
                // 扩展
                'extend': {
                    // 提示
                    'tips': false
                }
            });
            // 处理回调
            if (tray['echo']['code'] == -1) {
                // 系统异常
                tray['echo']['message'] = fxBase['base']['lang'](['system', 'abend']);
            }
            if (tray['echo']['code'] == 200) {
                // 请求成功
                layui.layer.msg(tray['echo']['message'], {
                    'icon': 1,
                    'time': 800
                }, function() {
                    // 执行成功回调
                    dark['success']();
                    elem.attr('disabled', false);
                });
            } else {
                // 处理错误
                if (isObject(tray['echo']['extend']['error'])) {
                    tray['echo']['message'] = [];
                    $.each(tray['echo']['extend']['error']['data'], function(key, value) {
                        key = isSet(tray['list'][key + '-0']) ? fxBase['base']['lang'](tray['list'][key + '-0']['dark']['label']) : key;
                        if (tray['echo']['message'].length > 0) {
                            tray['echo']['message'].push('and2');
                        }
                        // 疏理信息
                        switch (tray['echo']['extend']['error']['name']) {
                            default:
                                // 默认
                                tray['echo']['message'].push(['[', key, ']']);
                                break;
                            case 'exist':
                                // 已存在
                                tray['echo']['message'].push(['[', key, ':', value, ']']);
                                break;
                        }
                    });
                    // 疏理信息
                    switch (tray['echo']['extend']['error']['name']) {
                        default:
                            // 默认
                            tray['echo']['message'] = fxBase['base']['lang']([tray['echo']['message']]);
                            break;
                        case 'exist':
                            // 已存在
                            tray['echo']['message'] = fxBase['base']['lang']([tray['echo']['message'], 'existed']);
                            break;
                        case 'lack':
                            // 缺少
                            tray['echo']['message'] = fxBase['base']['lang'](['cannot be empty', tray['echo']['message']]);
                            break;
                    }
                }
                layui.layer.msg(tray['echo']['message'], {
                    'icon': 2,
                    'time': 2000
                }, function() {
                    elem.attr('disabled', false);
                });
            }
        } catch (err) {
            // 捕获异常
            layui.layer.msg(fxBase['base']['lang'](['system', 'abend']), {
                'icon': 2,
                'time': 2000
            }, function() {
                elem.attr('disabled', false);
            });
        }
        // 没有父页面则直接取消禁用
        if (self == top) {
            elem.attr('disabled', false);
        }
        return false;
    });
    // 提交条件
    $('.moire-view.layui-form .moire-submit').on('click', function() {
        // 渲染数据
        var echo;
        $.each(tray['list'], function(key, value) {
            // 执行输出
            echo = value['echo']();
            if (false === echo) {
                return false;
            }
        });
        return echo;
    });
    // 重置条件
    $('.moire-view.layui-form .moire-reset').on('click', function() {
        // 渲染数据
        $.each(tray['list'], function(key, value) {
            // 执行重置
            value['reset']();
        });
        // 渲染表单
        layui.form.render();
    });
    // 清理条件
    $('.moire-view.layui-form .moire-clean').on('click', function() {
        // 渲染数据
        $.each(tray['list'], function(key, value) {
            // 执行清理
            value['clean']();
        });
        // 渲染表单
        layui.form.render();
    });
    // 关闭窗口
    $('.moire-button .moire-close').on('click', function() {
        fxApp['rank']['self.layer.close'](fxApp['rank']['self.layer.index']);
    });
});