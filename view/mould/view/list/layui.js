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
 * 云纹模具-视图-列表-皮肤
 */
fxView['machine']['deployer'](['mould', 'view', 'list', 'skin', 'layui'], function() {
    // 初始化变量
    var dark = {
        // 基础
        'base': fxBase['param']['merge']({
            // 调试
            'debug': false,
            // 皮肤
            'skin': 'table'
        }, fxView['shelf']['view']),
        // 数据
        'data': function(data) {
            // 初始化变量
            data['order'] = !isBlank(data['order']) ? data['order'] : '';
            data['page'] = !isBlank(data['page']) ? data['page'] : 1;
            data['limit'] = !isBlank(data['limit']) ? data['limit'] : 20;
            return data;
        },
        // 搜索
        'search': {},
        // 表格
        'table': {
            // 索引
            'id': 'moire-table',
            // 元素
            'elem': '#moire-table',
            // 标题
            'title': fxApp['view']['title'],
            // 表头
            'cols': [],
            // 异常文本
            'text': {
                'none': fxBase['base']['lang'](['empty', 'data'])
            },
            // 外观
            'even': true,
            // 加载条
            'loading': true,
            // 自动排序
            'autoSort': false,
            // 头部工具栏
            'toolbar': true,
            // 头部工具栏右侧
            'defaultToolbar': ['filter'],
            // 请求条件
            'where': {
                'base': {
                    'token': fxApp['user']['base']['token']
                },
                'data': fxApp['data']
            },
            // 响应分页
            'page': {
                'limits': [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
            },
            // 请求参数
            'request': {
                'pageName': 'base[page]',
                'limitName': 'base[limit]'
            },
            // 响应参数
            'response': {
                'statusName': 'code',
                'statusCode': 200,
                'msgName': 'messages'
            },
            // 解析数据
            'parseData': function(data) {
                // 疏理数据
                fxApp = fxBase['param']['merge'](fxApp, this.where);
                // 替换地址
                var url = fxBase['param']['url']({
                    'type': '1.1',
                    'param': {
                        'base': {
                            'order': this.where.base.order,
                            'page': this.page.curr,
                            'limit': this.page.limit
                        },
                        'data': this.where.data
                    }
                });
                window.history.replaceState(null, null, url);
                // 判断顶页面
                if (self != top) {
                    url = fxBase['param']['url']({
                        'type': '1.1',
                        'window': top,
                        'param': {
                            'data': {
                                'frame': encodeURIComponent(url)
                            }
                        }
                    });
                    top.history.replaceState(null, null, url);
                }
                // 疏理数据
                if (data['extend']['total_page'] > 0 && data['data'].length == 0 && data['extend']['page'] != data['extend']['total_page']) {
                    // 重载表格
                    tray['table'].reload({
                        'page': {
                            'curr': data['extend']['total_page']
                        }
                    }, true);
                }
                data['count'] = data['extend']['total_count'];
                return data;
            },
            // 渲染完成
            'done': function(data, curr, count) {
                // 记录数据
                fxView['cache']['echo']['list'] = data;
                // 渲染数据
                $.each(tray['list'], function(key, value) {
                    // 疏理皮肤
                    switch (value['dark']['skin']) {
                        case 'table':
                            // 表格
                        case 'table_link':
                            // 表格-链接
                            value['base']['pack']['elem'] = $('tbody [data-field=' + value['base']['pack']['field'] + ']');
                            value['base']['pack']['elem'].attr(value['dark']['wrapBox']['attr']);
                            break;
                    }
                    // 执行完成
                    value['done']();
                });
                // 绘制界面
                $(window).trigger('resize');
                // 初始化layui设定
                fxView['layui']['init']({ 'type': 'table' });
                // 更新图片加载器
                $('[lay-id=moire-table] img').viewer('update');
                // 绘制表单
                $('[lay-id=moire-table]').off('resize');
                $('[lay-id=moire-table]').on('resize', function() {
                    // 初始化变量
                    tray['tableMain'] = $('.layui-table-box>.layui-table-header tr,.layui-table-box>.layui-table-body tr');
                    tray['tableLeft'] = $('.layui-table-fixed-l tr');
                    tray['tableRight'] = $('.layui-table-fixed-r tr');
                    // 重置表格
                    $.each(tray['tableMain'], function(key, value) {
                        tray['tableLeft'].eq(key).height($(value).height());
                        tray['tableRight'].eq(key).height($(value).height());
                    });
                });
                $('[lay-id=moire-table]').trigger('resize');
            }
        }
    };
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 疏理视图
    if (!isEmpty(dark['search'])) {
        $('.moire-wapper').append(fxBase['base']['template']({ 'elem': 'view', 'type': 'search' }).html());
    }
    if (!isEmpty(dark['table'])) {
        $('.moire-wapper').append(fxBase['base']['template']({ 'elem': 'view', 'type': 'table' }).html());
    }
    // 执行视图-搜索
    fxView['machine']['caller'](['mould', 'view', 'search', 'main'], [dark['search']]);
    tray['search'] = $('.moire-search');
    tray['height'] = $(window).height() - tray['search'].outerHeight(true);
    // 检查配置
    if (!isSet(dark['base']['api']['list'])) {
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['list', 'not configured'] }]);
    }
    // 执行视图-表格
    // 疏理数据
    tray['list'] = fxView['cache']['elem']['table'] = {};
    $.each(dark['table']['cols'], function(key, value) {
        $.each(value, function(key2, value2) {
            // 疏理属性
            value2['title'] = fxBase['base']['lang'](value2['title']);
            // 疏理模版
            if (isFunction(value2['templet']) || !isObject(value2['extend'])) return true;
            // 解析数据
            value2['extend']['id'] = fxBase['text']['explode'](',', value2['extend']['id']);
            value2['extend']['type'] = fxBase['text']['explode'](',', value2['extend']['type']);
            $.each(value2['extend']['type'], function(key3, value3) {
                // 校验元素
                if (!isFunction(fxView['machine']['caller'](['material', 'elem', value3, 'main']))) {
                    if (dark['base']['debug']) {
                        console.log(fxBase['base']['lang'](['material', 'element', '[', fxApp["view"]["langc"]["prefix"] + value2, ']', 'not2', 'load']));
                    }
                    return true;
                }
                // 配置基础
                tray['base'] = {};
                tray['base']['cache'] = tray['list'];
                tray['base']['mould'] = dark;
                tray['base']['pack'] = value2;
                // 配置数据
                tray['data'] = fxBase['param']['merge'](1, {
                    'field': value2['field'],
                    'title': value2['title'],
                    'skin': dark['base']['skin']
                }, value2['extend']);
                tray['data']['id'] = !isBlank(value2['extend']['id'][key3]) ? value2['extend']['id'][key3] : key + '-' + value2['field'] + '-' + key3;
                tray['data']['type'] = value3;
                // 初始化元素
                tray['list'][tray['data']['id']] = fxView['machine']['caller'](['material', 'elem', value3, 'main'], []);
                tray['list'][tray['data']['id']]['init'](tray['data'], tray['base']);
            })
        })
    });
    // 渲染数据
    $.each(tray['list'], function(key, value) {
        // 执行部署
        value['deploy']();
        // 设置模板
        value['base']['pack']['templet'] = value['dark']['templet'];
    });
    // 绘制界面
    $(window).on('resize', function() {
        // 初始化变量
        tray['fixed'] = $('.layui-table-fixed');
        tray['view'] = $('.layui-table-view');
        // 适配高度
        if ($(window).height() < 600) {
            // tray['search'].css('display', 'none');
            // tray['height'] = $(window).height();
            tray['height'] = $(window).height() - tray['search'].outerHeight(true);
        } else {
            // tray['search'].css('display', '');
            tray['height'] = $(window).height() - tray['search'].outerHeight(true);
        }
        // 重置表格
        if (isSet(tray['table'])) {
            tray['view'].css('height', tray['height']);
            tray['table'].config.height = tray['height'];
            tray['table'].resize();
        }
        // 适配宽度
        if ($(window).width() < 800) {
            tray['fixed'].css('display', 'none');
        } else {
            tray['fixed'].css('display', '');
        }
    });
    // 判断顶页面
    if (self != top) {
        // 替换标题
        $(top.document).find('title').html(fxApp['view']['title'] + ' - ' + top.fxApp['env']['title']);
    }
    // 疏理数据
    fxApp['base'] = dark['data'](fxApp['base']);
    // 疏理表格
    dark['table'] = fxBase['param']['merge'](dark['table'], {
        // 地址
        'url': dark['base']['api']['list'],
        // 高度
        'height': tray['height'],
        // 请求条件
        'where': {
            'base': {
                'order': fxApp['base']['order']
            }
        },
        // 响应分页
        'page': {
            'curr': fxApp['base']['page'],
            'limit': fxApp['base']['limit']
        }
    });
    // 绘制表格
    tray['table'] = layui.table.render(dark['table']);
    // 提交请求
    layui.form.on('submit(moire-submit)', function(data) {
        // 渲染数据
        tray['data'] = {};
        $.each(fxView['cache']['elem']['search'], function(key, value) {
            // 执行输出
            value['echo']();
            if (!isSet(value['dark']['echo']) || value['dark']['echoSwitch'] != 1) return true;
            // 疏理输出
            tray['data'][value['dark']['field']] = value['dark']['echo'];
        });
        // 渲染数据
        $.each(tray['data'], function(key, value) {
            // 初始化变量
            if (!isArray(value) && !isObject(value)) return true;
            tray['data'][key] = JSON.stringify(value);
        });
        // 重载表格
        tray['table'].reload({
            'where': {
                'base': {
                    'order': fxApp['base']['order']
                },
                'data': tray['data']
            }
        }, true);
        return false;
    });
    // 监听触发事件
    fxBase['dom']['trigger']();
    // 监听排序操作
    layui.table.on('sort(moire-table)', function(event) {
        // 初始化变量
        var param = fxApp['base']['order'];
        // 移除重复排序
        param = fxBase['text']['explode'](',', param);
        $.each(param, function(key, value) {
            if (value.indexOf(event.field) == 0) {
                param.splice(key, 1);
                return false;
            }
        });
        if (isSet(event.type)) {
            param.unshift(event.field + ' ' + event.type);
        }
        param = param.join(',');
        fxApp['base']['order'] = param;
        // 处理数据
        tray['table'].reload({
            'where': {
                'base': {
                    'order': param
                }
            }
        }, true);
    });
    // 监听开关操作
    layui.form.on('switch', function(event) {
        // 初始化变量
        var echo = {
            // 数据
            'data': {}
        };
        echo['data'][dark['base']['model']['key']] = this.value;
        // 疏理多级
        echo['echo'] = event['elem']['checked'] ? 1 : 0;
        $.each(fxBase['text']['explode']('-_', event['elem']['name']).reverse(), function(key, value) {
            var data = {};
            data[value] = echo['echo'];
            echo['echo'] = data;
        });
        echo['data'] = fxBase['param']['merge'](echo['data'], echo['echo']);
        // 处理数据
        fxView['store']['deal']({
            // 地址
            'url': dark['base']['api']['edit'],
            // 数据
            'data': {
                // 基础
                'base': {
                    // 严格
                    'strict': 0
                },
                // 数据
                'data': echo['data']
            },
            // 扩展
            'extend': {
                // 元素
                'elem': event.othis
            }
        });
    });
    // 监听编辑操作
    layui.table.on('edit(moire-table)', function(event) {
        // 处理数据
        var echo = {
            // 数据
            'data': {}
        };
        echo['data'][dark['base']['model']['key']] = event.data[dark['base']['model']['key']];
        echo['elem'] = $(event.tr).parents('.layui-table-view').find('.layui-table-header');
        // 疏理多级
        echo['echo'] = event.value;
        $.each(fxBase['text']['explode']('-_', event.field).reverse(), function(key, value) {
            var data = {};
            data[value] = echo['echo'];
            echo['echo'] = data;
        });
        echo['data'] = fxBase['param']['merge'](echo['data'], echo['echo']);
        // 处理数据
        tray['echo'] = fxView['store']['deal']({
            // 地址
            'url': dark['base']['api']['edit'],
            // 异步
            'async': false,
            // 数据
            'data': {
                // 基础
                'base': {
                    // 严格
                    'strict': 0
                },
                // 数据
                'data': echo['data']
            },
            // 扩展
            'extend': {
                // 元素
                'elem': $(this).parent(),
                // 提示
                'tips': false
            }
        });
        try {
            // 处理回调
            if (tray['echo']['code'] == -1) {
                // 系统异常
                tray['echo']['message'] = fxBase['base']['lang'](['system', 'abend']);
            }
            if (tray['echo']['code'] == 200) {
                // 请求成功
                layui.layer.tips(tray['echo']['message'], $(this).parent(), {
                    'time': 800,
                    'tips': fxBase['math']['rand'](1, 4),
                    'tipsMore': true
                });
            } else {
                // 处理错误
                if (isObject(tray['echo']['extend']['error'])) {
                    tray['echo']['message'] = [];
                    $.each(tray['echo']['extend']['error']['data'], function(key, value) {
                        if (echo['elem'].find('th[data-field=' + key + ']').length > 0) {
                            key = echo['elem'].find('th[data-field=' + key + ']').find('span:first').html();
                        } else {
                            key = echo['elem'].find('th[data-field=' + event.field + ']').find('span:first').html();
                        }
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
                $.toast({
                    'text': tray['echo']['message'],
                    'icon': 'error',
                    'hideAfter': 2000,
                    'position': 'top-right',
                    'stack': 3
                });
                echo['data'][event.field] = event.tr.find('[data-field=' + event.field + '] .layui-table-cell').html();
            }
        } catch (err) {
            // 捕获异常
            $.toast({
                'text': fxBase['base']['lang'](['system', 'abend']),
                'icon': 'error',
                'hideAfter': 2000,
                'position': 'top-right',
                'stack': 3
            });
            echo['data'][event.field] = event.tr.find('[data-field=' + event.field + '] .layui-table-cell').html();
        }
        // 更新缓存
        function update() {
            event.update(echo['data']);
        }
        setTimeout(update, 30);
    });
    // 监听头工具事件
    layui.table.on('toolbar(moire-table)', function(event) {
        var data = layui.table.checkStatus(event.config.id)['data'];
        // 执行事件
        switch (event.event) {
            case 'add':
                // 新增
            case 'upload':
                // 上传
                tray['param'] = {
                    // 元素
                    'elem': event.event,
                    // 参数
                    'param': data,
                    // 副标题
                    'subtitle': event.event
                };
                fxView['machine']['caller'](['mould', 'tool', 'window', 'main'], [tray['param']]);
                break;
            case 'delete':
                // 删除
                tray['param'] = {
                    // 事件
                    'event': event,
                    // 参数
                    'param': data,
                    // 表格
                    'table': tray['table']
                };
                fxView['machine']['caller'](['mould', 'tool', event.event, 'main'], [tray['param']]);
                break;
            case 'import':
                // 导入
            case 'export':
                // 导出
            case 'download':
                // 下载
                tray['param'] = {
                    // 参数
                    'param': data
                };
                fxView['machine']['caller'](['mould', 'tool', event.event, 'main'], [tray['param']]);
                break;
        }
    });
    // 监听行工具事件
    layui.table.on('tool(moire-table)', function(event) {
        // 执行事件
        switch (event.event) {
            case 'cell':
                // 细胞
                // 编辑框
                switch ($(this).attr('data-edit')) {
                    case 'text':
                        $(this).children('.layui-table-edit').css('text-align', $(this).attr('align'));
                        break;
                }
                break;
            case 'media_video':
                // 查看
                layui.layer.open({
                    'type': 1,
                    'title': fxy_lang(['view', ' - ', fxyCore.data.site.title]),
                    'content': fxy_mould({
                        'elem': '.merl-mould-form',
                        'type': '[merl-type=view]'
                    }).prop('outerHTML'),
                    'area': ['90%', '90%'],
                    'shadeClose': true,
                    'maxmin': true,
                    'resize': false,
                    'scrollbar': false,
                    'success': function(layero, index) {
                        var elem = layero.find('.merl-stage tbody'),
                            thumb = new Image(),
                            list = {
                                'id': event.data.id,
                                'name': '<a data-href="' + event.data.extend.url + '">' + event.data.extend.name + '</a>',
                                'thumb': '<img src="' + event.data.extend.thumb + '" title="' + event.data.extend.name + '">',
                                'device,id': event.data.device_id,
                                'device,name': event.data.device_name,
                                'type': fxyCore.data.site.notes.index[event.data.index] + ' - ' + fxyCore.data.site.notes.param[event.data.pilot],
                                'time_dur': fcf_ftime(event.data.extend.time_dur, '1.2'),
                                'content': event.data.extend.content,
                                'status': fxyCore.data.site.notes.status[event.data.status],
                                'sort': event.data.sort,
                                'dateline': event.data.dateline,
                            };
                        thumb.src = event.data.extend.thumb;
                        $.each(list, function(i, value) {
                            elem.append('<tr><td>' + fxy_lang(dso_split(i)) + '</td><td><span>' + value + '</span></td></tr>');
                        });
                        elem.find('img,a').on('click', function() {
                            var content,
                                cace = {};
                            if (thumb.width == 0 && thumb.height == 0) {
                                cace.width = layero.width() / $(document).width() * 100;
                                cace.height = layero.height() / $(document).height() * 100;
                            } else {
                                cace.ratio1 = layero.width() / thumb.width;
                                cace.ratio2 = layero.height() / thumb.height;
                                cace.ratio3 = (cace.ratio1 < cace.ratio2 ? cace.ratio1 : cace.ratio2);
                                cace.width = thumb.width * cace.ratio3 / $(document).width() * 100;
                                cace.height = thumb.height * cace.ratio3 / $(document).height() * 100;
                            }
                            cace.tag = $(this).prop('tagName').toLowerCase();
                            cace.conf = {
                                'title': false,
                                'area': [cace.width + '%', cace.height + '%'],
                                'closeBtn': false,
                                'shadeClose': true,
                                'resize': false,
                                'scrollbar': false
                            };
                            cace.index = event.data.index;
                            cace.url = event.data.extend.url;
                            if (cace.tag == 'img') {
                                cace.index = '3';
                                cace.url = thumb.src;
                            }
                            cace.index = String(cace.index);
                            switch (cace.index) {
                                case '1':
                                    content = $(this).attr('data-href');
                                    content = fxy_mould({
                                        'elem': '.merl-mould-media',
                                        'type': '[merl-type=video]'
                                    }).prop('outerHTML');
                                    cace.conf = fmo_merge(cace.conf, {
                                        'type': 1,
                                        'content': content,
                                        'success': function(layero, index) {
                                            var playPromise;
                                            layero.find('video').attr({
                                                'src': cace.url,
                                                'poster': event.data.extend.thumb,
                                                'controls': 'controls'
                                            }).on('dblclick', function() {
                                                if (this.paused) {
                                                    playPromise = this.play();
                                                    if (playPromise) {
                                                        playPromise.then(function() {
                                                            // 音频加载成功
                                                        }).catch(function(e) {
                                                            // 音频加载失败
                                                        });
                                                    }
                                                } else {
                                                    this.pause();
                                                }
                                            });
                                            // 注册拖拽事件
                                            fxy_drag({
                                                'elem': layero,
                                                'wall': true
                                            });
                                        }
                                    });
                                    break;
                                case '3':
                                    content = fxy_mould({
                                        'elem': '.merl-mould-media',
                                        'type': '[merl-type=image]'
                                    }).prop('outerHTML');
                                    cace.conf = fmo_merge(cace.conf, {
                                        'type': 1,
                                        'content': content,
                                        'success': function(layero, index) {
                                            layero.find('img').attr({
                                                'src': cace.url,
                                                'title': event.data.extend.name
                                            });
                                            // 注册拖拽事件
                                            fxy_drag({
                                                'elem': layero,
                                                'wall': true
                                            });
                                        }
                                    });
                                    if (thumb.width == 0 && thumb.height == 0) {
                                        layui.layer.msg(fxy_lang(['image', 'load', 'fail']), {
                                            'icon': 2,
                                            'time': 800
                                        });
                                        return;
                                    }
                                    break;
                            }
                            // 界面弹出
                            layui.layer.open(cace.conf);
                        });
                    }
                });
                break;
            case 'view':
                // 视图
            case 'edit':
                // 编辑
                tray['param'] = {
                    // 元素
                    'elem': event.event,
                    // 参数
                    'param': event.data,
                    // 副标题
                    'subtitle': event.event
                };
                fxView['machine']['caller'](['mould', 'tool', 'window', 'main'], [tray['param']]);
                break;
            case 'delete':
                // 删除
                tray['param'] = {
                    // 事件
                    'event': event,
                    // 参数
                    'param': event.data,
                    // 表格
                    'table': tray['table']
                };
                fxView['machine']['caller'](['mould', 'tool', event.event, 'main'], [tray['param']]);
                break;
            case 'link':
                // 链接

                console.log(this);
                console.log(event);
                break;

                // // 替换地址
                // var url = fxBase['param']['url']({
                //     'type': '1.1',
                //     'param': {
                //         'base': {
                //             'order': this.where.base.order,
                //             'page': this.page.curr,
                //             'limit': this.page.limit
                //         },
                //         'data': this.where.data
                //     }
                // });
                // window.history.replaceState(null, null, url);
                // // 判断顶页面
                // if (self != top) {
                //     url = fxBase['param']['url']({
                //         'type': '1.1',
                //         'window': top,
                //         'param': {
                //             'data': {
                //                 'frame': encodeURIComponent(url)
                //             }
                //         }
                //     });
                //     top.history.replaceState(null, null, url);
                // }


                // var tray = {};
                // tray['echo'] = '';
                // // 疏理链接
                // tray['link'] = fxBase['param']['url']({
                //     'type': '1.1',
                //     'url': dark['option']['link'],
                //     'param': dark['option']['param'](data[dark['field']])
                // });
                // // 疏理元素
                // if (!isBlank(dark['shelf']['data'][data[dark['field']]])) {
                //     tray['echo'] = $('<a></a>');
                //     tray['echo'].attr({
                //         'href': tray['link'],
                //         'title': dark['title'],
                //         'style': 'display: block;width: 100%;height: 100%'
                //     });
                //     tray['echo'].text(dark['shelf']['data'][data[dark['field']]]);
                //     tray['echo'] = tray['echo'].prop('outerHTML');
                // }


                // tray['param'] = {
                //     // 元素
                //     'elem': event.event,
                //     // 参数
                //     'param': event.data,
                //     // 副标题
                //     'subtitle': event.event
                // };
                // fxView['machine']['caller'](['mould', 'tool', 'window', 'main'], [tray['param']]);
                // break;
        }
    });
});