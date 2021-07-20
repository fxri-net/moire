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
 * 云纹物料-元素-文件-皮肤
 */
fxView['machine']['deployer'](['material', 'elem', 'file', 'skin', 'deploy'], {
    // 表格
    'table': function(dark, base, echo, tray) {
        // 初始化变量
        dark['templet'] = function(data) {
            // 初始化变量
            tray['field'] = fxBase['text']['explode']('-_', dark['field']);
            tray['data'] = data;
            // 疏理数据
            $.each(tray['field'], function(key, value) {
                if (!isBlank(tray['data'][value])) {
                    tray['data'] = tray['data'][value];
                } else {
                    tray['data'] = '';
                    return false;
                }
            });
            // 疏理数据
            dark['list'].push(data);
            tray['echo'] = '';
            // 疏理数据
            switch (dark['option']['type']) {
                default:
                    // 默认
                case 'file':
                    // 文件
                case 'video':
                    // 视频
                case 'image':
                    // 图片
                    if (!isBlank(tray['data'])) {
                        tray['echo'] = $('<img>');
                        tray['echo'].attr({
                            'src': tray['data'],
                            'title': dark['title'],
                            'style': 'width: 100%;height: 100%'
                        });
                        tray['echo'] = tray['echo'].prop('outerHTML');
                    }
                    break;
            }
            return tray['echo'];
        };
    },
    // 视图
    'view': function(dark, base, echo, tray) {
        // 初始化变量
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
                    'shadeClose': true,
                    'success': function(layero, index) {
                        // 配置索引
                        tray['layer.index'] = fxBase['text']['implode']('-', [$(layero[0]).attr('times'), fxApp['rank']['self.code'], 'layui']);
                        fxApp['rank']['self.layer.index.set'](tray['layer.index']);
                    },
                    'end': function() {
                        // 销毁索引
                        fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    }
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
                    dark['event']['masonry']();
                    // 销毁索引
                    fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    // 关闭窗口
                    layui.layer.close(index);
                });
            });
        }
        // 疏理上传
        if (dark['upload']['switch']) {
            dark['elem'].append('<div class="moire-elem-operate">' +
                '<button type="button" class="layui-btn moire-operate">' +
                '<i class="layui-icon">&#xe67c;</i>' + fxBase['base']['lang'](dark['default']) +
                '</button>' +
                '<input type="hidden" class="moire-operate-hidden"></div>');
            // 疏理分支
            dark['elem'].find('.moire-operate').on('click', function() {
                if (!dark['option']['panel']) {
                    // 本地上传
                    dark['elem'].find('.moire-operate-hidden').trigger('click');
                    return false;
                }
                layui.layer.prompt({
                    'title': '地址',
                    'btn': ['保存', '本地上传'],
                    'btn2': function(index, layero) {
                        // 本地上传
                        dark['elem'].find('.moire-operate-hidden').trigger('click');
                    },
                    'shadeClose': true,
                    'success': function(layero, index) {
                        // 配置索引
                        tray['layer.index'] = fxBase['text']['implode']('-', [$(layero[0]).attr('times'), fxApp['rank']['self.code'], 'layui']);
                        fxApp['rank']['self.layer.index.set'](tray['layer.index']);
                    },
                    'end': function() {
                        // 销毁索引
                        fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    }
                }, function(value, index, elem) {
                    // 外链地址
                    success({
                        'code': 200,
                        'message': fxBase['base']['lang'](['save', 'success']),
                        'data': [value]
                    });
                    // 销毁索引
                    fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    // 关闭窗口
                    layui.layer.close(index);
                });
            });
            // 疏理配置
            dark['upload'] = fxBase['param']['merge'](dark['upload'], {
                // 元素
                'elem': dark['elem'].find('.moire-operate-hidden'),
                // 数据
                'data': {
                    'base': {
                        'token': fxApp['user']['base']['token'],
                        'format': 'json'
                    }
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
                            case 'file':
                                // 文件
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
                        dark['event']['masonry']();
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
        dark['event']['masonry'] = function() {
            // 文件容器
            dark['elem'].find('.moire-elem-inline').masonry({
                'itemSelector': 'div'
            });
        };
        dark['event']['masonry']();
    },
    // 视图-阿里oss
    'view_alioss': function(dark, base, echo, tray) {
        // 初始化变量
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
                    'shadeClose': true,
                    'success': function(layero, index) {
                        // 配置索引
                        tray['layer.index'] = fxBase['text']['implode']('-', [$(layero[0]).attr('times'), fxApp['rank']['self.code'], 'layui']);
                        fxApp['rank']['self.layer.index.set'](tray['layer.index']);
                    },
                    'end': function() {
                        // 销毁索引
                        fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    }
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
                    dark['event']['masonry']();
                    // 销毁索引
                    fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    // 关闭窗口
                    layui.layer.close(index);
                });
            });
        }
        // 疏理上传
        if (dark['upload']['switch']) {
            dark['elem'].append('<div class="moire-elem-operate">' +
                '<button type="button" class="layui-btn moire-operate">' +
                '<i class="layui-icon">&#xe67c;</i>' + fxBase['base']['lang'](dark['default']) +
                '</button>' +
                '<input type="hidden" class="moire-operate-hidden"></div>');
            // 疏理分支
            dark['elem'].find('.moire-operate').on('click', function() {
                if (!dark['option']['panel']) {
                    // 本地上传
                    tray['message'] = ['upload', 'success'];
                    dark['elem'].find('.moire-operate-hidden').trigger('click');
                    return false;
                }
                layui.layer.prompt({
                    'title': '地址',
                    'btn': ['保存', '本地上传'],
                    'btn2': function(index, layero) {
                        // 本地上传
                        tray['message'] = ['upload', 'success'];
                        dark['elem'].find('.moire-operate-hidden').trigger('click');
                    },
                    'shadeClose': true,
                    'success': function(layero, index) {
                        // 配置索引
                        tray['layer.index'] = fxBase['text']['implode']('-', [$(layero[0]).attr('times'), fxApp['rank']['self.code'], 'layui']);
                        fxApp['rank']['self.layer.index.set'](tray['layer.index']);
                    },
                    'end': function() {
                        // 销毁索引
                        fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    }
                }, function(value, index, elem) {
                    // 外链地址
                    tray['message'] = ['save', 'success'];
                    success([{ 'ossUrl': value }]);
                    // 销毁索引
                    fxApp['rank']['self.layer.index.destroy'](tray['layer.index']);
                    // 关闭窗口
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
                        case 'file':
                            // 文件
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
                    dark['event']['masonry']();
                });
                // 更新图片加载器
                dark['elem'].parents('div[moire-cell]').viewer('update');
            }
            // 异常回调
            function error(index, upload) {}
            // 绘制上传
            layui.aliossUploader.render(dark['upload']);
        }
        // 执行瀑布流
        dark['event']['masonry'] = function() {
            // 文件容器
            dark['elem'].find('.moire-elem-inline').masonry({
                'itemSelector': 'div'
            });
        };
        dark['event']['masonry']();
    }
});
fxView['machine']['deployer'](['material', 'elem', 'file', 'skin', 'echo'], {
    // 视图,视图-阿里oss
    'view,view_alioss': function(dark, base, echo, tray) {
        // 初始化变量
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
    }
});
fxView['machine']['deployer'](['material', 'elem', 'file', 'skin', 'reset'], {
    // 视图,视图-阿里oss
    'view,view_alioss': function(dark, base, echo, tray) {
        // 格式化数据
        $.each(dark['upload']['data'], function(key, value) {
            dark['upload']['data'][key] = JSON.stringify(value);
        });
        // 疏理数据
        dark['elem'].find('.moire-elem-inline').masonry('destroy', dark['elem'].find('.moire-elem-inline>div'));
        dark['elem'].find('.moire-elem-inline>div').remove();
        // 输出子项
        $.each(dark['data'], function(key, value) {
            switch (dark['option']['type']) {
                default:
                    // 默认
                case 'file':
                    // 文件
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
        dark['elem'].find('.moire-elem-inline').imagesLoaded(function() {
            dark['event']['masonry']();
        });
        dark['event']['masonry']();
        // 更新图片加载器
        dark['elem'].parents('div[moire-cell]').viewer('update');
    }
});
fxView['machine']['deployer'](['material', 'elem', 'file', 'skin', 'clean'], {
    // 视图,视图-阿里oss
    'view,view_alioss': function(dark, base, echo, tray) {
        // 疏理数据
        dark['elem'].find('.moire-elem-inline>div').remove();
        dark['event']['masonry']();
    }
});