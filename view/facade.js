/**
 * Layui设定
 */
fxView['layui'] = {
    /**
     * 初始化
     */
    'init': function() {
        // 初始化变量
        var dark = {
            // 类型
            'type': null,
            // 编号
            'id': null,
            // 插件
            'plugin': {
                // 单选
                'radio': false
            }
        };
        var tray = {};
        dark = fxBase['param']['merge'](dark, arguments[0]);
        switch (dark['type']) {
            case 'table':
                // 表格
                var elem = $('.layui-table-view .layui-table td[data-edit=text]');
                elem.off('click');
                elem.on('click', function() {
                    if (isNull($(this).attr('fxy-edit'))) return false;
                    $(this).removeAttr('fxy-edit');
                });
                elem.off('dblclick');
                elem.on('dblclick', function() {
                    $(this).attr('fxy-edit', 1);
                    $(this).trigger('click');
                });
                break;
            case 'select':
                // 选择框
                // 重设快捷按钮
                if (!dark['plugin']['radio']) {
                    tray['btns'] = ['select', 'remove', 'reverse'];
                } else {
                    tray['btns'] = ['remove'];
                }
                layui.formSelects.btns(dark['id'], tray['btns'], {
                    'show': 'name',
                    'space': '6px'
                });
                $('.xm-select-parent .xm-form-select dl dt').each(function() {
                    if ($(this).text() != '') {
                        $(this).html($(this).html() +
                            '<span class="xm-select-tips-sm">' +
                            '<a fxy-type="1">' + fxBase['base']['lang'](['lay 全选']) + '</a>' +
                            '<a fxy-type="2">' + fxBase['base']['lang'](['lay 清空']) + '</a>' +
                            '<a fxy-type="3">' + fxBase['base']['lang'](['lay 反选']) + '</a>' +
                            '</span>')
                    }
                });
                $('.xm-select-parent .xm-select').height('');
                $('.xm-select-tips-sm').off('click');
                $('.xm-select-tips-sm').on('click', function(event) {
                    var elem = $(event.target);
                    if (!elem.is('a')) return false;
                    elem.parents('dt').nextUntil('dt').each(function(index, item) {
                        item = $(item);
                        if (item.hasClass('xm-dis-disabled')) return true;
                        switch (elem.attr('fxy-type')) {
                            default:
                                // 未知
                                return true;
                            case '1':
                                // 全选
                                if (item.hasClass('xm-select-this')) return true;
                                break;
                            case '2':
                                // 清空
                                if (!item.hasClass('xm-select-this')) return true;
                                break;
                            case '3':
                                // 反选
                                break;
                        }
                        item.find('i:not(.icon-expand)').trigger('click');
                    });
                    return false;
                });
                // 重设搜索文本
                fxView['layui']['select']({ 'elem': $('.xm-select-label') });
                break;
        }
    },

    /**
     * select扩展
     */
    'select': function() {
        // 初始化变量
        var dark = {
            // 元素
            'elem': null,
            // 开关
            'switch': true
        };
        var tray = {};
        dark = fxBase['param']['merge'](dark, arguments[0]);
        if (isNull(dark['elem'])) {
            console.log(fxBase['base']['lang'](['please', 'choice', 'valid', 'HTML', 'label']));
            return;
        }
        $(dark['elem']).off('mousedown', start);
        $(dark['elem']).off('touchstart', start);
        if (!dark['switch']) return;
        $(dark['elem']).on('mousedown', start);
        $(dark['elem']).on('touchstart', start);
        // 开始
        function start(event) {
            // 初始化变量
            var touch;
            // 识别触摸类型
            if (event.originalEvent.targetTouches) {
                touch = event.originalEvent.targetTouches[0];
            } else {
                touch = event;
                // 判断是否点击鼠标左键
                if (event.button != 0) return;
            }
            // 配置环境
            tray['elem'] = $(this);
            if (tray['elem'].children('span').length == 0) return;
            tray['parent'] = tray['elem'].parent();
            tray['elemW'] = tray['elem'].find('span:last').offset().left + tray['elem'].find('span:last').outerWidth(true) + parseInt(tray['elem'].css('padding-left')) - tray['elem'].find('span:first').offset().left;
            if (tray['elemW'] <= tray['parent'].width()) return;
            var domLeft = tray['elem'].offset().left,
                curLeft = parseFloat(tray['elem'].css('left'));
            dark['getX'] = touch.pageX - (domLeft + (curLeft - domLeft));
            // 注册移动事件
            $(document).on('mousemove', move);
            $(this).on('touchmove', move);
            // 注册结束事件
            $(document).on('mouseup', end);
            $(this).on('touchend', end);
        }
        // 移动
        function move(event) {
            // 初始化变量
            var touch;
            // 识别触摸类型
            if (event.originalEvent.targetTouches) {
                touch = event.originalEvent.targetTouches[0];
            } else {
                touch = event;
            }
            var nowX = touch.pageX - dark['getX'],
                elemX = tray['parent'].width() - tray['elemW'] - 28;
            // 计算边界
            if (nowX > 0) {
                nowX = 0;
            } else if (nowX < elemX) {
                nowX = elemX;
            }
            // 校准位置
            tray['elem'].css({
                'left': nowX
            });
        }
        // 结束
        function end() {
            // 解除拖拽事件
            $(document).off('mousemove', move);
            $(document).off('mouseup', end);
            $(this).off('touchmove', move);
            $(this).off('touchend', end);
        }
    }
};