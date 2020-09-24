/**
 * 云纹物料-元素-文件
 */
fxView['material']['elem']['file'] = function() {
    // 初始化变量
    var dark,
        echo = {};
    // 数据
    echo['dark'] = dark = {};
    // 初始化
    echo['init'] = function() {
        // 疏理数据
        fxView['machine']['elem'](dark, arguments[0]);
        dark = fxBase['param']['merge'](dark, {
            // 数据
            'data': '',
            // 默认
            'default': ['upload', dark['title']],
            // 替代
            'alt': null,
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
        // 疏理包装
        dark['wrap'] = $('<div></div>');
        dark['wrap'].attr({
            'moire-elem': 'elem'
        });
        // 疏理元素
        dark['elem'] = $('<div><div class="moire-elem-inline"></div></div>');
        dark['elem'].attr({
            'id': dark['id'],
        });
        dark['elem'].val(dark['data']);
        // 疏理输出
        switch (dark['skin']) {
            case 'table':
                // 表格
                dark['templet'] = function(data) {
                    var echo = [];
                    // 疏理数据
                    switch (dark['option']['type']) {
                        default:
                            // 默认
                        case 'video':
                            // 视频
                        case 'image':
                            // 图片
                            echo = !isBlank(data[dark['field']]) ?
                                '<img src="' + data[dark['field']] + '" title="' + dark['title'] + '" style="width: 100%;height: 100%">' :
                                '';
                            break;
                    }
                    return echo;
                };
                break;
            case 'view':
                // 视图
                dark['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-md6'
                });
                dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
                dark['wrap'].children('[moire-key]').html(dark['title'] + dark['requireMark']);
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
                            echo['data'].splice(echo['elem'].index(), 1);
                            $('input[name=' + dark['field'] + ']').val(fxBase['text']['implode'](',', echo['data']));
                            echo['elem'].remove();
                            // 执行瀑布流
                            $('div[moire-elem=elem]').trigger('resize');
                            // 关闭弹窗
                            layui.layer.close(index);
                        });
                    });
                }
                // 输出子项
                $.each(dark['data'], function(key2, value2) {
                    switch (dark['option']['type']) {
                        default:
                            // 默认
                        case 'video':
                            // 视频
                            dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value2 + '" target="_blank">点击链接</a>' +
                                dark['delete']['elem'] + '</div>');
                            break;
                        case 'image':
                            // 图片
                            dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value2 + '"' + dark['alt'] + '>' +
                                dark['delete']['elem'] + '</div>');
                            break;
                    }
                });
                // 疏理上传
                if (dark['upload']['switch']) {
                    dark['elem'].append('<div class="moire-elem-operate">' +
                        '<button type="button" class="layui-btn moire-operate" id="' + dark['id'] + '">' +
                        '<i class="layui-icon">&#xe67c;</i>' + fxBase['base']['lang'](dark['default']) +
                        '</button></div>');
                    // 疏理配置
                    dark['upload'] = fxBase['param']['merge'](dark['upload'], {
                        // 元素
                        'elem': dark['elem'].find('.moire-operate'),
                        // 数据
                        'data': {
                            'base': JSON.stringify({
                                'token': fxApp['user']['base']['token'],
                                'format': 'json'
                            })
                        },
                        // 上传进度
                        'before': before,
                        // 成功回调
                        'done': success,
                        // 异常回调
                        'error': error
                    }, dark['upload']);
                    // 上传进度
                    function before(data) {
                        // 弹出进度
                        fxApp['rank']['file.load'] = layui.layer.load(2);
                    }
                    // 成功回调
                    function success(data, index, upload) {
                        // 初始化变量
                        var echo = {};
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
                            $.each(data['data'], function(key2, value2) {
                                echo['data'].push(value2);
                                switch (dark['option']['type']) {
                                    default:
                                        // 默认
                                    case 'video':
                                        // 视频
                                        dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value2 + '" target="_blank">点击链接</a>' +
                                            dark['delete']['elem'] + '</div>');
                                        break;
                                    case 'image':
                                        // 图片
                                        dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value2 + '"' + dark['alt'] + '>' +
                                            dark['delete']['elem'] + '</div>');
                                        break;
                                }
                            });
                            // 疏理隐藏图片值
                            echo['list'] = [];
                            $.each(echo['data'], function(key2, value2) {
                                if (isBlank(value2)) return true;
                                echo['list'].push(value2);
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
                                $('div[moire-elem=elem]').trigger('resize');
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
                dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
                    $('div[moire-elem=elem]').trigger('resize');
                });
                break;
            case 'view_alioss':
                // 视图-阿里oss
                dark['pack'].append(dark['wrap']);
                dark['wrap'].attr({
                    'class': 'layui-col-xs12 layui-col-md6'
                });
                dark['wrap'].append('<div moire-key="' + dark['type'] + '"></div><div moire-cell="' + dark['type'] + '"></div>');
                dark['wrap'].children('[moire-key]').html(dark['title'] + dark['requireMark']);
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
                            echo['data'].splice(echo['elem'].index(), 1);
                            $('input[name=' + dark['field'] + ']').val(fxBase['text']['implode'](',', echo['data']));
                            echo['elem'].remove();
                            // 执行瀑布流
                            $('div[moire-elem=elem]').trigger('resize');
                            // 关闭弹窗
                            layui.layer.close(index);
                        });
                    });
                }
                // 输出子项
                $.each(dark['data'], function(key2, value2) {
                    switch (dark['option']['type']) {
                        default:
                            // 默认
                        case 'video':
                            // 视频
                            dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value2 + '" target="_blank">点击链接</a>' +
                                dark['delete']['elem'] + '</div>');
                            break;
                        case 'image':
                            // 图片
                            dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value2 + '"' + dark['alt'] + '>' +
                                dark['delete']['elem'] + '</div>');
                            break;
                    }
                });
                // 疏理上传
                if (dark['upload']['switch']) {
                    dark['elem'].append('<div class="moire-elem-operate">' +
                        '<button type="button" class="layui-btn moire-operate" id="' + dark['id'] + '">' +
                        '<i class="layui-icon">&#xe67c;</i>' + fxBase['base']['lang'](dark['default']) +
                        '</button></div>');
                    // 疏理配置
                    dark['upload'] = fxBase['param']['merge'](dark['upload'], {
                        // 元素
                        'elm': dark['elem'].find('.moire-operate'),
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
                        // 疏理隐藏图片值
                        echo['data'] = fxBase['text']['explode'](',', $('input[name=' + dark['field'] + ']').val());
                        // 输出子项
                        $.each(data, function(key2, value2) {
                            echo['data'].push(value2['ossUrl']);
                            switch (dark['option']['type']) {
                                default:
                                    // 默认
                                case 'video':
                                    // 视频
                                    dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value2['ossUrl'] + '" target="_blank">点击链接</a>' +
                                        dark['delete']['elem'] + '</div>');
                                    break;
                                case 'image':
                                    // 图片
                                    dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value2['ossUrl'] + '"' + dark['alt'] + '>' +
                                        dark['delete']['elem'] + '</div>');
                                    break;
                            }
                        });
                        // 疏理隐藏图片值
                        echo['list'] = [];
                        $.each(echo['data'], function(key2, value2) {
                            if (isBlank(value2)) return true;
                            echo['list'].push(value2);
                        });
                        $('input[name=' + dark['field'] + ']').val(fxBase['text']['implode'](',', echo['list']));
                        // 请求成功
                        layui.layer.msg(fxBase['base']['lang'](['上传成功']), {
                            'icon': 1,
                            'time': 800
                        });
                        // 执行瀑布流
                        dark['elem'].find('.moire-elem-inline').masonry('appended', dark['elem'].find('.moire-elem-inline>div:last'));
                        dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
                            $('div[moire-elem=elem]').trigger('resize');
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
                dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
                    $('div[moire-elem=elem]').trigger('resize');
                });
                break;
        }
    };
    // 重置
    echo['reset'] = function() {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
        // 输出子项
        $.each(dark['data'], function(key2, value2) {
            switch (dark['option']['type']) {
                default:
                    // 默认
                case 'video':
                    // 视频
                    dark['elem'].find('.moire-elem-inline').append('<div><a href="' + value2 + '" target="_blank">点击链接</a>' +
                        dark['delete']['elem'] + '</div>');
                    break;
                case 'image':
                    // 图片
                    dark['elem'].find('.moire-elem-inline').append('<div><img src="' + value2 + '"' + dark['alt'] + '>' +
                        dark['delete']['elem'] + '</div>');
                    break;
            }
        });
        // 执行瀑布流
        dark['elem'].find('.moire-elem-inline').masonry('appended', dark['elem'].find('.moire-elem-inline>div:last'));
        dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
            $('div[moire-elem=elem]').trigger('resize');
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