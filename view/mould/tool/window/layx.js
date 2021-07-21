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
 * 云纹模具-工具-窗口-皮肤
 */
fxView['machine']['deployer'](['mould', 'tool', 'window', 'skin', 'layx'], function() {
    // 初始化变量
    var dark = fxBase['param']['merge']({
        // 副标题
        'subtitle': null,
        // 状态
        'status': null,
        // 选项
        'option': {
            // 图标或标题栏左边内容
            'icon': false,
            // 宽度
            'width': '50%',
            // 高度
            'height': '50%',
            // 最小宽度
            'minWidth': 200,
            // 最小高度
            'minHeight': 200,
            // 存储窗口位置、大小信息
            'storeStatus': false,
            // 控制窗口拖动到顶部自动最大化
            'dragInTopToMax': false,
            // 控制初始化窗口时超出可视区域自动最大化
            'isOverToMax': false,
            // 窗口位置
            'position': 'ct',
            // 是否显示控制标题栏
            'control': true,
            // ESC关闭
            'escKey': false,
            // 嵌入窗口样式
            'style': '',
            // 控制标题栏样式
            'controlStyle': '',
            // 窗口背景颜色
            'bgColor': '#fff',
            // 窗口阴影
            'shadow': true,
            // 窗口边框
            'border': false,
            // 设置圆角
            'borderRadius': '0',
            // 窗口皮肤
            'skin': 'default',
            // 焦点前置
            'focusToReveal': true,
            // 窗口类型
            'type': 'url',
            // 设置提示框图标
            'dialogIcon': '',
            // 是否浮动窗口
            'floatTarget': false,
            // 浮动方向
            'floatDirection': 'ct',
            // 窗口存在闪烁
            'existFlicker': true,
            // 是否自动获取页面标题
            'useFrameTitle': false,
            // 主窗口透明度
            'opacity': 1,
            // 窗口阻隔、遮罩
            'shadable': false,
            // 是否点击阻隔关闭窗口
            'shadeDestroy': false,
            // 是否为只读窗口
            'readonly': false,
            // 窗口内容加载时显示文本
            'loadingText': '内容正在加载中，请稍后',
            // 置顶按钮
            'stickMenu': true,
            // 是否允许置顶/取消置顶操作
            'stickable': true,
            // 最小化按钮
            'minMenu': true,
            // 是否允许最小化操作
            'minable': true,
            // 最大化按钮
            'maxMenu': true,
            // 是否允许最大化操作
            'maxable': true,
            // 关闭按钮
            'closeMenu': true,
            // 是否允许关闭操作
            'closable': true,
            // 是否允许恢复操作
            'restorable': true,
            // 自动关闭窗口
            'autodestroy': true,
            // 自动关闭提示文本
            'autodestroyText': '此窗口将在 <strong>{second}</strong> 秒内自动关闭.',
            // 是否允许拖曳调整大小
            'resizable': true,
            // 设置拖曳调整大小限制项
            'resizeLimit': {
                // 是否限制上边拖曳大小
                t: false,
                // 是否限制右边拖曳大小
                r: false,
                // 是否限制下边拖曳大小
                b: false,
                // 是否限制左边拖曳大小
                l: false,
                // 是否限制左上边拖曳大小
                lt: false,
                // 是否限制右上边拖曳大小
                rt: false,
                // 是否限制左下边拖曳大小
                lb: false,
                // 是否限制右下边拖曳大小
                rb: false
            },
            // 是否允许拖动窗口位置
            'movable': true,
            // 设置拖动窗口位置限制项
            'moveLimit': {
                // 是否禁止垂直拖动
                vertical: false,
                // 是否禁止水平拖动
                horizontal: false,
                // 是否允许左边拖出
                leftOut: true,
                // 是否允许右边拖出
                rightOut: true,
                // 是否允许上边拖出，此设置不管是false还是true，窗口都不能拖出窗体
                topOut: true,
                // 是否允许下边拖出
                bottomOut: true,
            },
            // 窗口获取焦点
            'focusable': true,
            // 是否总是置顶
            'alwaysOnTop': false,
            // 允许双击控制栏功能
            'allowControlDbclick': true,
            // 状态栏
            'statusBar': '',
            // 控制状态栏样式
            'statusBarStyle': '',
            // 事件监听
            'event': {
                // 加载事件
                onload: {
                    // 加载之前
                    before: function(layxWindow, winform) {
                        // 初始化变量
                        tray['area'] = JSON.parse(JSON.stringify(winform.area));
                        // 配置皮肤
                        $(layxWindow).addClass('moire-window');
                    },
                    // 加载之后
                    after: function(layxWindow, winform) {
                        // 窗口最大化
                        layx.max(dark['window'].id);
                        // 配置数据
                        fxView['machine']['deployer'](['rank'], {
                            // 起源-窗口
                            'parent.window': window,
                            // 本身-弹窗-索引
                            'self.layer.index': dark['index']
                        }, $(layxWindow).find('iframe').prop('contentWindow').fxApp);
                        // 窗口调整
                        $(top.window).on('resize', function() {
                            // 初始化变量
                            if (dark['status'] != 'max') return;
                            layx.max(dark['window'].id);
                        });
                    }
                },
                // 最小化事件
                onmin: {
                    // 最小化之前
                    before: function(layxWindow, winform) {},
                    // 最小化之后
                    after: function(layxWindow, winform) {
                        dark['status'] = winform.status;
                    }
                },
                // 最大化事件
                onmax: {
                    // 最大化之前
                    before: function(layxWindow, winform) {},
                    // 最大化之后
                    after: function(layxWindow, winform) {
                        dark['status'] = winform.status;
                    }
                },
                // 恢复事件
                onrestore: {
                    // 恢复之前
                    before: function(layxWindow, winform) {},
                    // 恢复之后
                    after: function(layxWindow, winform) {
                        dark['status'] = winform.status;
                    }
                },
                // 关闭事件
                ondestroy: {
                    // 关闭之前，inside 区分用户点击内置关闭按钮还是自动调用，用户关闭之前传递的参数，escKey表示是否是按下esc触发
                    before: function(layxWindow, winform, params, inside, escKey) {},
                    // 关闭之后
                    after: function() {
                        // 销毁索引
                        fxApp['rank']['self.layer.index.destroy'](dark['index']);
                    }
                },
                // 隐藏/显示窗口时间
                onvisual: {
                    before: function(layxWindow, winform, params, inside, status) {},
                    after: function(layxWindow, winform, status) {}
                },
                // 移动事件
                onmove: {
                    // 移动之前
                    before: function(layxWindow, winform) {
                        // 初始化变量
                        tray['area']['z-index'] = $(layxWindow).css('z-index');
                        tray['left'] = winform.area.left;
                        tray['top'] = winform.area.top;
                        // 设置舷边
                        tray['siteLeft'] = tray['touchX'] - tray['left'];
                        tray['siteTop'] = tray['touchY'] - tray['top'];
                        tray['left'] = tray['left'] + tray['siteLeft'] - (tray['siteLeft'] / winform.area.width * tray['area']['width']);
                        tray['top'] = tray['top'] + tray['siteTop'] - (tray['siteTop'] / winform.area.height * tray['area']['height']);
                        // 设置范围
                        layx.setPosition(dark['window'].id, [tray['top'], tray['left']]);
                        layx.setSize(dark['window'].id, { 'width': tray['area']['width'], 'height': tray['area']['height'] });
                    },
                    // 移动中
                    progress: function(layxWindow, winform) {
                        // 初始化变量
                        tray['left'] = winform.area.left;
                        tray['top'] = winform.area.top;
                        tray['width'] = winform.area.width;
                        tray['height'] = winform.area.height;
                        // 执行触碰
                        dark['move']['touch']();
                        // 执行投影
                        dark['move']['shadow']();
                    },
                    // 移动之后
                    after: function(layxWindow, winform) {
                        // 初始化变量
                        tray['left'] = winform.area.left;
                        tray['top'] = winform.area.top;
                        // 执行触碰
                        dark['move']['touch']();
                        // 执行投影
                        tray['shadow'] = false;
                        dark['move']['shadow']();
                        // 设置范围
                        layx.setPosition(dark['window'].id, [tray['top'], tray['left']]);
                        layx.setSize(dark['window'].id, { 'width': tray['width'], 'height': tray['height'] });
                    }
                },
                // 拖曳事件
                onresize: {
                    // 拖曳之前
                    before: function(layxWindow, winform) {},
                    // 拖曳中
                    progress: function(layxWindow, winform) {},
                    // 拖曳之后
                    after: function(layxWindow, winform) {
                        // 初始化变量
                        tray['area'] = JSON.parse(JSON.stringify(winform.area));
                    }
                },
                // 获取焦点事件
                onfocus: function(layxWindow, winform) {
                    // // 配置索引
                    // fxApp['rank']['self.layer.index.set'](dark['index']);
                },
                // 窗口存在事件
                onexist: function(layxWindow, winform) {},
                // 窗口组切换事件
                onswitch: {
                    // 切换之前
                    before: function(layxWindow, winform, frameId) {},
                    // 切换之后
                    after: function(layxWindow, winform, frameId) {}
                },
                // 置顶事件
                onstick: {
                    // 置顶之前
                    before: function(layxWindow, winform) {},
                    // 置顶之后
                    after: function(layxWindow, winform) {}
                }
            }
        },
        // 移动
        'move': {
            // 触碰
            'touch': function() {
                // 设置定时器
                if (false !== dark['move']['touchTimer']) {
                    clearTimeout(dark['move']['touchTimer']);
                    dark['move']['touchTimer'] = false;
                }
                // 配置墙壁
                tray['wallWidth'] = window.innerWidth;
                tray['wallHeight'] = window.innerHeight;
                tray['wallCorner'] = dark['move']['touchCorner'];
                tray['wallEdge'] = dark['move']['touchEdge'];
                // 配置方向
                tray['shadow'] = true;
                if (tray['touchX'] <= tray['wallCorner'] && tray['touchY'] <= tray['wallCorner']) {
                    // 左上角
                    tray['left'] = 0;
                    tray['top'] = 0;
                    tray['width'] = tray['wallWidth'] / 2;
                    tray['height'] = tray['wallHeight'] / 2;
                } else if (tray['touchX'] >= tray['wallWidth'] - tray['wallCorner'] && tray['touchY'] <= tray['wallCorner']) {
                    // 右上角
                    tray['left'] = tray['wallWidth'] / 2;
                    tray['top'] = 0;
                    tray['width'] = tray['wallWidth'] / 2;
                    tray['height'] = tray['wallHeight'] / 2;
                } else if (tray['touchX'] >= tray['wallWidth'] - tray['wallCorner'] && tray['touchY'] >= tray['wallHeight'] - tray['wallCorner']) {
                    // 右下角
                    tray['left'] = tray['wallWidth'] / 2;
                    tray['top'] = tray['wallHeight'] / 2;
                    tray['width'] = tray['wallWidth'] / 2;
                    tray['height'] = tray['wallHeight'] / 2;
                } else if (tray['touchX'] <= tray['wallCorner'] && tray['touchY'] >= tray['wallHeight'] - tray['wallCorner']) {
                    // 左下角
                    tray['left'] = 0;
                    tray['top'] = tray['wallHeight'] / 2;
                    tray['width'] = tray['wallWidth'] / 2;
                    tray['height'] = tray['wallHeight'] / 2;
                } else if (tray['touchY'] <= tray['wallEdge']) {
                    // 上边
                    tray['left'] = 0;
                    tray['top'] = 0;
                    tray['width'] = tray['wallWidth'];
                    tray['height'] = tray['wallHeight'] / 2;
                } else if (tray['touchX'] >= tray['wallWidth'] - tray['wallEdge']) {
                    // 右边
                    tray['left'] = tray['wallWidth'] / 2;
                    tray['top'] = 0;
                    tray['width'] = tray['wallWidth'] / 2;
                    tray['height'] = tray['wallHeight'];
                } else if (tray['touchY'] >= tray['wallHeight'] - tray['wallEdge']) {
                    // 下边
                    tray['left'] = 0;
                    tray['top'] = tray['wallHeight'] / 2;
                    tray['width'] = tray['wallWidth'];
                    tray['height'] = tray['wallHeight'] / 2;
                } else if (tray['touchX'] <= tray['wallEdge']) {
                    // 左边
                    tray['left'] = 0;
                    tray['top'] = 0;
                    tray['width'] = tray['wallWidth'] / 2;
                    tray['height'] = tray['wallHeight'];
                } else {
                    tray['shadow'] = false;
                }
            },
            // 触碰-墙角
            'touchCorner': 50,
            // 触碰-墙边
            'touchEdge': 20,
            // 触碰-时间
            'touchTime': 1000,
            // 投影
            'shadow': function() {
                // 初始化变量
                tray['shadowElem'] = $('.moire-window-shadow');
                // 校验投影
                if (!tray['shadow'] && false !== dark['move']['shadowTimer']) {
                    return false;
                } else if (!tray['shadow']) {
                    // 设置定时器
                    dark['move']['shadowTimer'] = setTimeout(function() {
                        tray['shadowElem'].hide();
                    }, dark['move']['shadowTime']);
                    // 设置范围
                    tray['shadowElem'].css({
                        'opacity': 0
                    });
                    return false;
                } else if (false !== dark['move']['shadowTimer']) {
                    // 设置定时器
                    clearTimeout(dark['move']['shadowTimer']);
                    dark['move']['shadowTimer'] = false;
                    // 设置范围
                    tray['shadowElem'].attr({
                        'style': null
                    });
                    tray['shadowElem'].show();
                    tray['shadowElem'].css({
                        'left': tray['touchX'],
                        'top': tray['touchY'],
                        'width': 0,
                        'height': 0,
                        'opacity': 1,
                        'transition': 'all 0.3s'
                    });
                }
                // 设置范围
                tray['shadowElem'].css({
                    'left': tray['left'] + dark['move']['shadowZoom'],
                    'top': tray['top'] + dark['move']['shadowZoom'],
                    'width': tray['width'] - (dark['move']['shadowZoom'] * 2),
                    'height': tray['height'] - (dark['move']['shadowZoom'] * 2),
                    'z-index': tray['area']['z-index'] - 1
                });
            },
            // 投影-缩放
            'shadowZoom': 10,
            // 投影-时间
            'shadowTime': 300
        }
    }, fxView['shelf']['view']);
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (!isSet(dark['page'][dark['elem']])) {
        return fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': ['feature', 'not configured'] }]);
    }
    // 疏理数据
    if (!isBlank(dark['param'][dark['model']['key']])) {
        dark['data'] = '&data[' + dark['model']['key'] + ']=' + dark['param'][dark['model']['key']];
    } else {
        dark['data'] = '';
    }
    // 打开弹窗
    dark['option'] = fxBase['param']['merge']({
        // 唯一ID
        'id': md5(dark['page'][dark['elem']] + dark['data']),
        // 标题
        'title': fxBase['base']['lang']([fxApp['view']['name'], dark['subtitle']]),
        // 窗口地址
        'url': dark['page'][dark['elem']] + dark['data'],
    }, dark['option']);
    dark['window'] = layx.open(dark['option']);
    dark['index'] = fxBase['text']['implode']('-', [dark['window'].id, fxApp['rank']['self.code'], 'layx']);
    // 配置索引
    fxApp['rank']['self.layer.index.set'](dark['index']);
    // 监听鼠标位置
    $(dark['window'].layxWindow).on('mousemove touchmove mouseleave', function(event) {
        // 初始化变量
        var touch;
        // 识别触摸类型
        if (event.originalEvent.targetTouches) {
            touch = event.originalEvent.targetTouches[0];
        } else {
            touch = event;
        }
        tray['touchX'] = touch.pageX;
        tray['touchY'] = touch.pageY;
    });
    // 监听鼠标离开
    $(document).on('mouseleave', function(event) {
        // 设置定时器
        dark['move']['touchTimer'] = setTimeout(function() {
            $(dark['window'].layxWindow).trigger('mouseup');
        }, dark['move']['touchTime']);
    });
});
// 执行完成
$(document).ready(function() {
    // 添加阴影
    $('head').append('<style type="text/css">.moire-window-shadow {' +
        'position: fixed;' +
        'left: 0;' +
        'top: 0;' +
        'display: none;' +
        'width: 0;' +
        'height: 0;' +
        'box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 24px;' +
        '}</style>');
    $('body').append('<div class="moire-window-shadow"></div>');
});