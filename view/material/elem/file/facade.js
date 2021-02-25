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
 * 云纹物料-元素-文件
 */
fxView['material']['elem']['file'] = function() {
    // 初始化变量
    var base,
        dark,
        echo = {},
        tray = {};
    // 基础
    echo['base'] = base = {};
    // 数据
    echo['dark'] = dark = {};
    // 初始化
    echo['init'] = function() {
        // 疏理数据
        fxView['machine']['elem'](dark, arguments[0]);
        base = fxBase['param']['merge'](base, {}, isObject(arguments[1]) ? arguments[1] : {});
        dark = fxBase['param']['merge'](dark, {
            // 输出-开关
            'echoSwitch': 1,
            // 默认
            'default': ['upload', dark['title']],
            // 替代
            'alt': '',
            // 选项
            'option': {
                // 类型
                'type': null
            },
            // 上传
            'upload': {
                // 地址
                'url': null,
                // 开关
                'switch': true
            },
            // 删除
            'delete': {
                // 地址
                'url': null,
                // 开关
                'switch': true,
                // 元素
                'elem': '',
                // 文本
                'text': ['delete']
            }
        }, dark);
        // 疏理数据
        dark['title'] = fxBase['base']['lang'](dark['title']);
        dark['default'] = fxBase['base']['lang'](dark['default']);
        dark['delete']['text'] = fxBase['base']['lang'](dark['delete']['text']);
        if (isBlank(dark['data'])) {
            dark['data'] = [];
        } else if (!isArray(dark['data']) && !isObject(dark['data'])) {
            dark['data'] = fxBase['text']['explode'](',', dark['data']);
        }
    };
    // 部署
    echo['deploy'] = function() {
        // 初始化变量
        dark = fxBase['param']['merge'](dark, {
            // 包装盒子
            'wrapBox': {
                // 元素
                'elem': '<div></div>',
                // 属性
                'attr': {
                    // 元素
                    'moire-elem': 'elem',
                    // 类型
                    'moire-type': dark['type'],
                    // 皮肤
                    'moire-skin': dark['skin']
                }
            },
            // 元素盒子
            'elemBox': {
                // 元素
                'elem': '<div><div class="moire-elem-inline"></div></div>',
                // 属性
                'attr': {
                    'id': dark['id']
                }
            }
        }, dark);
        // 渲染之前
        if (isFunction(dark['before'])) {
            dark['before'](dark, base);
        }
        // 疏理包装
        dark['wrap'] = $(dark['wrapBox']['elem']);
        dark['wrap'].attr(dark['wrapBox']['attr']);
        // 疏理元素
        dark['elem'] = $(dark['elemBox']['elem']);
        dark['elem'].attr(dark['elemBox']['attr']);
        dark['elem'].val(dark['data']);
        // 疏理皮肤
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    dark['list'].push(data);
                    tray['echo'] = '';
                    // 疏理数据
                    switch (dark['option']['type']) {
                        default:
                            // 默认
                        case 'video':
                            // 视频
                        case 'image':
                            // 图片
                            if (!isBlank(data[dark['field']])) {
                                tray['echo'] = $('<img>');
                                tray['echo'].attr({
                                    'src': data[dark['field']],
                                    'title': dark['title'],
                                    'style': 'width: 100%;height: 100%'
                                });
                                tray['echo'] = tray['echo'].prop('outerHTML');
                            }
                            break;
                    }
                    return tray['echo'];
                };
                break;
            case 'view':
                // 视图
                base['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-md6'
                });
                dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
                dark['wrap'].children('[moire-key]').html(dark['label'] + dark['requireMark']);
                dark['wrap'].children('[moire-cell]').append(dark['elem']);
                dark['elem'].attr({
                    'class': 'moire-div'
                });
                // 疏理删除
                if (dark['delete']['switch']) {
                    dark['delete']['elem'] = '<button class="layui-btn layui-btn-sm layui-btn-danger moire-bg-red-light moire-delete" type="button">' +
                        dark['delete']['text'] + '</button>';
                    // 点击事件
                    dark['elem'].parents('div[moire-cell]').on('click', '.moire-delete', function() {
                        // 初始化变量
                        var echo = {};
                        echo['elem'] = $(this).parents('.moire-elem-inline>div');
                        echo['message'] = fxBase['base']['lang'](['是否删除', '[', dark['title'], ']', '项目', '[', (echo['elem'].index() + 1), ']', '？']);
                        echo['config'] = {
                            'title': null,
                            'icon': 0,
                            'closeBtn': 0,
                            'shadeClose': true
                        };
                        // 删除确认
                        layui.layer.confirm(echo['message'], echo['config'], function(index) {
                            // 疏理隐藏图片值
                            echo['data'] = fxBase['text']['explode'](',', $('input[name=' + dark['field'] + ']').val());
                            // 移除图片
                            dark['elem'].find('.moire-elem-inline').masonry('destroy', echo['elem']);
                            echo['data'].splice(echo['elem'].index(), 1);
                            $('input[name=' + dark['field'] + ']').val(fxBase['text']['implode'](',', echo['data']));
                            echo['elem'].remove();
                            // 执行瀑布流
                            dark['elem'].find('.moire-elem-inline').trigger('resize');
                            // 关闭弹窗
                            layui.layer.close(index);
                        });
                    });
                }
                // 输出子项
                $.each(dark['data'], function(key, value) {
                    switch (dark['option']['type']) {
                        default:
                            // 默认
                        case 'video':
                            // 视频
                            dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value + '" target="_blank">点击链接</a>' +
                                dark['delete']['elem'] + '</div>');
                            break;
                        case 'image':
                            // 图片
                            dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value + '"' + dark['alt'] + '>' +
                                dark['delete']['elem'] + '</div>');
                            break;
                    }
                });
                // 疏理上传
                if (dark['upload']['switch']) {
                    dark['elem'].append('<div class="moire-elem-operate">' +
                        '<button type="button" class="layui-btn moire-operate">' +
                        '<i class="layui-icon">&#xe67c;</i>' + fxBase['base']['lang'](dark['default']) +
                        '</button>' +
                        '<input type="hidden" class="moire-operate-hidden"></div>');
                    // 疏理分支
                    dark['elem'].find('.moire-operate').on('click', function() {
                        layui.layer.prompt({
                            'title': '地址',
                            'btn': ['保存', '本地上传'],
                            'btn2': function(index, layero) {
                                // 本地上传
                                dark['elem'].find('.moire-operate-hidden').trigger('click');
                            },
                            'shadeClose': true
                        }, function(value, index, elem) {
                            // 外链地址
                            success({
                                'code': 200,
                                'message': fxBase['base']['lang'](['save', 'success']),
                                'data': [value]
                            });
                            layui.layer.close(index);
                        });
                    });
                    // 疏理配置
                    dark['upload'] = fxBase['param']['merge'](dark['upload'], {
                        // 元素
                        'elem': dark['elem'].find('.moire-operate-hidden'),
                        // 数据
                        'data': {
                            'base': JSON.stringify({
                                'token': fxApp['user']['base']['token'],
                                'format': 'json'
                            })
                        },
                        // 选择回调
                        'choose': choose,
                        // 上传进度
                        'before': before,
                        // 成功回调
                        'done': success,
                        // 异常回调
                        'error': error
                    }, dark['upload']);
                    // 选择回调
                    function choose(data) {
                        // console.log(data);
                    }
                    // 上传进度
                    function before(data) {
                        // 弹出进度
                        fxApp['rank']['file.load'] = layui.layer.load(2);
                    }
                    // 成功回调
                    function success(data, index, upload) {
                        // 初始化变量
                        var echo = {};
                        // 移除文件缓存
                        dark['elem'].find('.moire-elem-operate input').val('');
                        // 关闭进度
                        layui.layer.close(fxApp['rank']['file.load']);
                        // 疏理隐藏图片值
                        echo['data'] = fxBase['text']['explode'](',', $('input[name=' + dark['field'] + ']').val());
                        if (data['code'] == -1) {
                            // 系统异常
                            data['message'] = fxBase['base']['lang'](['system', 'abend']);
                        }
                        if (data['code'] == 200) {
                            // 输出子项
                            $.each(data['data'], function(key, value) {
                                echo['data'].push(value);
                                switch (dark['option']['type']) {
                                    default:
                                        // 默认
                                    case 'video':
                                        // 视频
                                        dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value + '" target="_blank">点击链接</a>' +
                                            dark['delete']['elem'] + '</div>');
                                        break;
                                    case 'image':
                                        // 图片
                                        dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value + '"' + dark['alt'] + '>' +
                                            dark['delete']['elem'] + '</div>');
                                        break;
                                }
                            });
                            // 疏理隐藏图片值
                            echo['list'] = [];
                            $.each(echo['data'], function(key, value) {
                                if (isBlank(value)) return true;
                                echo['list'].push(value);
                            });
                            $('input[name=' + dark['field'] + ']').val(fxBase['text']['implode'](',', echo['list']));
                            // 请求成功
                            layui.layer.msg(data['message'], {
                                'icon': 1,
                                'time': 800
                            });
                            // 执行瀑布流
                            dark['elem'].find('.moire-elem-inline').masonry('appended', dark['elem'].find('.moire-elem-inline>div:last'));
                            dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
                                dark['elem'].find('.moire-elem-inline').trigger('resize');
                            });
                        } else {
                            layui.layer.msg(data['message'], {
                                'icon': 2,
                                'time': 2000
                            });
                        }
                        // 更新图片加载器
                        dark['elem'].parents('div[moire-cell]').viewer('update');
                    }
                    // 异常回调
                    function error(index, upload) {
                        // 关闭进度
                        layui.layer.close(fxApp['rank']['file.load']);
                    }
                    // 绘制上传
                    layui.upload.render(dark['upload']);
                }
                // 执行瀑布流
                dark['elem'].find('.moire-elem-inline').on('resize', function() {
                    // 文件容器
                    dark['elem'].find('.moire-elem-inline').masonry({
                        'itemSelector': 'div'
                    });
                });
                dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
                    dark['elem'].find('.moire-elem-inline').trigger('resize');
                });
                dark['elem'].find('.moire-elem-inline').trigger('resize');
                break;
            case 'view_alioss':
                // 视图-阿里oss
                base['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-md6'
                });
                dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
                dark['wrap'].children('[moire-key]').html(dark['label'] + dark['requireMark']);
                dark['wrap'].children('[moire-cell]').append(dark['elem']);
                dark['elem'].attr({
                    'class': 'moire-div'
                });
                // 疏理删除
                if (dark['delete']['switch']) {
                    dark['delete']['elem'] = '<button class="layui-btn layui-btn-sm layui-btn-danger moire-bg-red-light moire-delete" type="button">' +
                        dark['delete']['text'] + '</button>';
                    // 点击事件
                    dark['elem'].parents('div[moire-cell]').on('click', '.moire-delete', function() {
                        // 初始化变量
                        var echo = {};
                        echo['elem'] = $(this).parents('.moire-elem-inline>div');
                        echo['message'] = fxBase['base']['lang'](['是否删除', '[', dark['title'], ']', '项目', '[', (echo['elem'].index() + 1), ']', '？']);
                        echo['config'] = {
                            'title': null,
                            'icon': 0,
                            'closeBtn': 0,
                            'shadeClose': true
                        };
                        // 删除确认
                        layui.layer.confirm(echo['message'], echo['config'], function(index) {
                            // 疏理隐藏图片值
                            echo['data'] = fxBase['text']['explode'](',', $('input[name=' + dark['field'] + ']').val());
                            // 移除图片
                            dark['elem'].find('.moire-elem-inline').masonry('destroy', echo['elem']);
                            echo['data'].splice(echo['elem'].index(), 1);
                            $('input[name=' + dark['field'] + ']').val(fxBase['text']['implode'](',', echo['data']));
                            echo['elem'].remove();
                            // 执行瀑布流
                            dark['elem'].find('.moire-elem-inline').trigger('resize');
                            // 关闭弹窗
                            layui.layer.close(index);
                        });
                    });
                }
                // 输出子项
                $.each(dark['data'], function(key, value) {
                    switch (dark['option']['type']) {
                        default:
                            // 默认
                        case 'video':
                            // 视频
                            dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value + '" target="_blank">点击链接</a>' +
                                dark['delete']['elem'] + '</div>');
                            break;
                        case 'image':
                            // 图片
                            dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value + '"' + dark['alt'] + '>' +
                                dark['delete']['elem'] + '</div>');
                            break;
                    }
                });
                // 疏理上传
                if (dark['upload']['switch']) {
                    dark['elem'].append('<div class="moire-elem-operate">' +
                        '<button type="button" class="layui-btn moire-operate">' +
                        '<i class="layui-icon">&#xe67c;</i>' + fxBase['base']['lang'](dark['default']) +
                        '</button>' +
                        '<input type="hidden" class="moire-operate-hidden"></div>');
                    // 疏理分支
                    dark['elem'].find('.moire-operate').on('click', function() {
                        layui.layer.prompt({
                            'title': '地址',
                            'btn': ['保存', '本地上传'],
                            'btn2': function(index, layero) {
                                // 本地上传
                                tray['message'] = ['upload', 'success'];
                                dark['elem'].find('.moire-operate-hidden').trigger('click');
                            },
                            'shadeClose': true
                        }, function(value, index, elem) {
                            // 外链地址
                            tray['message'] = ['save', 'success'];
                            success([{ 'ossUrl': value }]);
                            layui.layer.close(index);
                        });
                    });
                    // 疏理配置
                    dark['upload'] = fxBase['param']['merge'](dark['upload'], {
                        // 元素
                        'elm': dark['elem'].find('.moire-operate-hidden'),
                        // 类型
                        'fileType': dark['option']['type'],
                        // 多选
                        'multiple': false,
                        // 面积
                        'layerArea': ['600px', '300px'],
                        // 标题
                        'layerTitle': '上传文件',
                        // 签名地址
                        'policyUrl': '/v0/file/aliossSign',
                        // 签名数据
                        'policyData': {
                            // 基础
                            'base': {
                                // 令牌
                                'token': fxApp['user']['base']['token'],
                                // 格式
                                'format': 'json'
                            },
                            // 数据
                            'data': {}
                        },
                        // 签名Header
                        'policyHeader': {
                            'Authorization': layui.data('XCORS').Authorization
                        },
                        // 状态字段
                        'codeFiled': 'code',
                        // 状态代码
                        'codeStatus': 200,
                        // 签名方法
                        'policyMethod': 'get',
                        // AccessId字段
                        'accessidFiled': 'accessid',
                        // Policy字段
                        'policyFiled': 'policy',
                        // 签名字段
                        'signatureFiled': 'signature',
                        // 请求协议
                        'httpStr': 'https',
                        // 文件域
                        'region': 'oss-cn-hangzhou',
                        // 存储空间
                        'bucket': 'zzd-longwan',
                        // 多文件前缀
                        'prefixPath': 'moire/',
                        // 上传成功回调
                        'allUploaded': success,
                        // 上传失败回调
                        'policyFailed': error,
                        // 上传配置
                        'uploadRenderData': {
                            // // 大小限制
                            // 'size': 100
                        }
                    }, dark['upload']);
                    // 成功回调
                    function success(data, index, upload) {
                        // 初始化变量
                        var echo = {};
                        // 移除文件缓存
                        dark['elem'].find('.moire-elem-operate input').val('');
                        // 疏理隐藏图片值
                        echo['data'] = fxBase['text']['explode'](',', $('input[name=' + dark['field'] + ']').val());
                        // 输出子项
                        $.each(data, function(key, value) {
                            echo['data'].push(value['ossUrl']);
                            switch (dark['option']['type']) {
                                default:
                                    // 默认
                                case 'video':
                                    // 视频
                                    dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value['ossUrl'] + '" target="_blank">点击链接</a>' +
                                        dark['delete']['elem'] + '</div>');
                                    break;
                                case 'image':
                                    // 图片
                                    dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value['ossUrl'] + '"' + dark['alt'] + '>' +
                                        dark['delete']['elem'] + '</div>');
                                    break;
                            }
                        });
                        // 疏理隐藏图片值
                        echo['list'] = [];
                        $.each(echo['data'], function(key, value) {
                            if (isBlank(value)) return true;
                            echo['list'].push(value);
                        });
                        $('input[name=' + dark['field'] + ']').val(fxBase['text']['implode'](',', echo['list']));
                        // 请求成功
                        layui.layer.msg(fxBase['base']['lang'](tray['message']), {
                            'icon': 1,
                            'time': 800
                        });
                        // 执行瀑布流
                        dark['elem'].find('.moire-elem-inline').masonry('appended', dark['elem'].find('.moire-elem-inline>div:last'));
                        dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
                            dark['elem'].find('.moire-elem-inline').trigger('resize');
                        });
                        // 更新图片加载器
                        dark['elem'].parents('div[moire-cell]').viewer('update');
                    }
                    // 异常回调
                    function error(index, upload) {}
                    // 绘制上传
                    layui.use(['aliossUploader'], function() {
                        layui.aliossUploader.render(dark['upload']);
                    });
                }
                // 执行瀑布流
                dark['elem'].find('.moire-elem-inline').on('resize', function() {
                    // 文件容器
                    dark['elem'].find('.moire-elem-inline').masonry({
                        'itemSelector': 'div'
                    });
                });
                dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
                    dark['elem'].find('.moire-elem-inline').trigger('resize');
                });
                dark['elem'].find('.moire-elem-inline').trigger('resize');
                break;
        }
        // 渲染之后
        if (isFunction(dark['after'])) {
            dark['after'](dark, base);
        }
    };
    // 完成
    echo['done'] = function() {
        // 渲染完成
        if (isFunction(dark['done'])) {
            dark['done'](dark, base);
        }
    };
    // 输出
    echo['echo'] = function() {
        // 疏理数据
        if (!dark['upload']['switch'] && !dark['delete']['switch']) return true;
        dark['echo'] = [];
        dark['elem'].find('.moire-elem-inline>div').each(function(key, value) {
            switch (dark['option']['type']) {
                default:
                    // 默认
                case 'video':
                    // 视频
                    dark['echo'].push($(value).find('a').attr('href'));
                    break;
                case 'image':
                    // 图片
                    dark['echo'].push($(value).find('img').attr('src'));
                    break;
            }
        });
        dark['echo'] = fxBase['text']['implode'](',', dark['echo']);
        if (dark['echoSwitch'] == 1 && dark['require'] == 1 && isBlank(dark['echo'])) {
            dark['elem'].find('.moire-operate').trigger('click');
            layui.layer.msg(fxBase['base']['lang'](['please', 'upload', dark['label']]), { 'icon': 5, 'anim': 6 });
            return false;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
        // 输出子项
        $.each(dark['data'], function(key, value) {
            switch (dark['option']['type']) {
                default:
                    // 默认
                case 'video':
                    // 视频
                    dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value + '" target="_blank">点击链接</a>' +
                        dark['delete']['elem'] + '</div>');
                    break;
                case 'image':
                    // 图片
                    dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value + '"' + dark['alt'] + '>' +
                        dark['delete']['elem'] + '</div>');
                    break;
            }
        });
        // 执行瀑布流
        dark['elem'].find('.moire-elem-inline').masonry('appended', dark['elem'].find('.moire-elem-inline>div:last'));
        dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
            dark['elem'].find('.moire-elem-inline').trigger('resize');
        });
        // 更新图片加载器
        dark['elem'].parents('div[moire-cell]').viewer('update');
    };
    // 清理
    echo['clean'] = function() {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
    };
    return echo;
};