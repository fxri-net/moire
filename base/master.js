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
 * 创建风音基础
 */
var fxBase = new function() { return isObject(fxBase) ? fxBase : {}; };

/**
 * 基础
 */
fxBase['base'] = Object.assign(isObject(fxBase['base']) ? fxBase['base'] : {}, {
    /**
     * 获取模具
     */
    'mould': function() {
        // 初始化变量
        var dark = {};
        dark = {
            // 类型
            'type': null,
            // 单元
            'cell': null,
            // 参数
            'param': []
        };
        dark = fxBase['param']['merge'](dark, arguments[0]);
        dark['type'] = isSet(dark['type']) ? 'moire-type,' + dark['type'] : null;
        dark['cell'] = isSet(dark['cell']) ? 'moire-cell,' + dark['cell'] : null;
        if (isArray(dark['param'])) dark['param'].unshift({});
        return fxBase['dom']['mould'](dark);
    },

    /**
     * 获取模板
     */
    'template': function() {
        // 初始化变量
        var dark = {};
        dark = {
            // 单元
            'cell': null,
            // 参数
            'param': []
        };
        dark = fxBase['param']['merge'](dark, arguments[0]);
        dark['cell'] = isSet(dark['cell']) ? 'moire-cell,' + dark['cell'] : null;
        if (isArray(dark['param'])) dark['param'].unshift({});
        return fxBase['dom']['template'](dark);
    },

    /**
     * 语言
     */
    'lang': function(name) {
        // 初始化变量
        if (!isSet(fxApp['view']['lang']) || !isSet(fxApp['view']['langs'])) return name;
        var langs = fxBase['base']['langList'](name),
            string = fxBase['base']['langParse'](langs);
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * 语言-列表
     */
    'langList': function(name) {
        // 初始化变量
        var langs = [];
        if (isArray(name) || isObject(name)) {
            $.each(name, function(key, value) {
                langs.push(fxBase['base']['langList'](value));
            });
        } else {
            name += '';
            if (!isSet(name)) {
                langs = 'null';
            } else if (name.indexOf(fxApp['view']['langc']['prefix']) === 0) {
                langs = name.substr(fxApp['view']['langc']['prefix'].length);
            } else if (name.indexOf(fxApp['view']['langc']['ignore']) === 0) {
                langs = '';
            } else {
                if (isNumeric(name)) {
                    name = String(name);
                }
                langs = fxApp['view']['langs'][name];
                if (undefined == langs) langs = name;
            }
        }
        return langs;
    },

    /**
     * 语言-解析
     */
    'langParse': function(name) {
        // 初始化变量
        var type = fxApp['view']['lang'],
            string;
        if (isArray(name) || isObject(name)) {
            $.each(name, function(key, value) {
                if (isArray(value) || isObject(value)) {
                    name[key] = fxBase['base']['langParse'](value);;
                }
            });
            switch (type) {
                default:
                case 'en-us':
                    // 英语（美国）
                    string = name.join(' ');
                    break;
                case 'zh-cn':
                    // 中文（简体）
                    string = name.join('');
                    break;
            }
        } else {
            string = name;
        }
        return string;
    },

    /**
     * 最大z-index
     */
    'maxZIndex': function() {
        // 初始化变量
        var dark = fxBase['dom']['maxZIndex']();
        return dark > 0 ? dark : 0;
    },

    /**
     * 打散字符串-去除重复值
     */
    'explode': function() {
        // 初始化变量
        var dark = fxBase['text']['explode'].apply(null, arguments),
            echo = [];
        if (!isSet(arguments[1]) || '' == arguments[1]) return echo;
        $.each(dark, function(key, value) {
            if (!fxBase['param']['inArray'](value, echo)) {
                echo.push(value);
            }
        });
        return echo;
    },

    /**
     * 解析Json
     */
    'json': function() {
        // 初始化变量
        var data = isSet(arguments[0]) ? arguments[0] : null,
            type = isSet(arguments[1]) ? arguments[1] : '';
        type = type.toLowerCase();
        switch (type) {
            case 'encode':
                // 编码
                if (!isJson(data)) {
                    data = JSON.stringify(data);
                }
                break;
            case 'decode':
                // 解码
                if (isJson(data)) {
                    data = JSON.parse(data);
                } else if (isObject(data)) {
                    data = Object.values(data);
                } else if (isString(data)) {
                    data = fxBase['text']['strDecode'](data);
                } else if (!isArray(data)) {
                    data = isSet(data) ? [data] : [];
                }
                break;
        }
        return data;
    }
});

/**
 * 客户端
 */
fxBase['client'] = Object.assign(isObject(fxBase['client']) ? fxBase['client'] : {}, {
    /**
     * 判断IE浏览器版本
     */
    'ieVersion': function() {
        // 取得浏览器的userAgent字符串
        var userAgent = navigator.userAgent;
        // 判断是否IE<11浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        // 判断是否IE的Edge浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return 7;
            } else if (fIEVersion == 8) {
                return 8;
            } else if (fIEVersion == 9) {
                return 9;
            } else if (fIEVersion == 10) {
                return 10;
            } else {
                // IE版本<=7
                return 6;
            }
        } else if (isEdge) {
            // Edge
            return 'edge';
        } else if (isIE11) {
            // IE11
            return 11;
        } else {
            // 不是IE浏览器
            return -1;
        }
    }
});

/**
 * HTML元素
 */
fxBase['dom'] = Object.assign(isObject(fxBase['dom']) ? fxBase['dom'] : {}, {
    /**
     * 设置/获取样式
     */
    'css': function() {
        // 初始化变量
        var dark = {};
        dark['elem'] = isSet(arguments[0]) ? arguments[0] : null;
        dark['name'] = isSet(arguments[1]) ? arguments[1] : null;
        dark['value'] = isSet(arguments[2]) ? arguments[2] : null;
        if (!isSet(dark['elem'])) return;
        if (undefined == dark['elem'].length) {
            dark['elem'] = [dark['elem']];
        }
        dark['elem'] = dark['elem'][0];
        if (isObject(dark['name'])) {
            $.each(dark['name'], function(key, value) {
                dark['elem'].style[key] = value;
            });
        } else if (!isSet(dark['value'])) {
            dark['style'] = window.getComputedStyle(dark['elem'], null) || dark['elem'].currentStyle;
            return dark['style'][dark['name']];
        } else if (isSet(dark['name'])) {
            dark['elem'].style[dark['name']] = dark['value'];
        }
    },

    /**
     * 设置/获取样式
     */
    'style': function() {
        // 初始化变量
        var dark = {};
        dark['elem'] = isSet(arguments[0]) ? arguments[0] : null;
        dark['name'] = isSet(arguments[1]) ? arguments[1] : null;
        dark['value'] = isSet(arguments[2]) ? arguments[2] : null;
        if (!isSet(dark['elem'])) return;
        dark['elem'] = $(dark['elem']);
        if (isObject(dark['name'])) {
            $.each(dark['name'], function(key, value) {
                dark['elem'].css(key, value);
            });
        } else if (!isSet(dark['value'])) {
            dark['list'] = dark['elem'].attr('style');
            if (!isSet(dark['list'])) {
                dark['list'] = '';
            } else if (!isString(dark['list'])) {
                dark['list'] = Stzring(dark['list']);
            }
            dark['list'] = fxBase['text']['explode'](';', dark['list']);
            dark['style'] = {};
            $.each(dark['list'], function(key, value) {
                dark['split'] = fxBase['text']['explode'](':', value);
                if (dark['split'].length != 2) return true;
                dark['style'][$.trim(dark['split'][0])] = $.trim(dark['split'][1]);
            });
            return dark['style'][dark['name']];
        } else if (isSet(dark['name'])) {
            dark['elem'].css(dark['name'], dark['value']);
        }
    },

    /**
     * 获取模具
     */
    'mould': function() {
        // 初始化变量
        var dark = {
            // 元素
            'elem': null,
            // 类型
            'type': null,
            // 单元
            'cell': null,
            // 标题
            'title': null,
            // 参数
            'param': []
        };
        dark = fxBase['param']['merge'](dark, arguments[0]);
        if (!isSet(dark['elem'])) {
            console.log(fxBase['base']['lang'](['lack', 'element']));
            return;
        }
        // 疏理数据
        if (isBlank(dark['type'])) {
            dark['type'] = [];
        } else if (!isArray(dark['type']) && !isObject(dark['type'])) {
            dark['type'] = fxBase['text']['explode'](',', dark['type']);
        }
        if (isBlank(dark['title'])) {
            dark['title'] = [];
        } else if (!isArray(dark['title']) && !isObject(dark['title'])) {
            dark['title'] = fxBase['text']['explode'](',', dark['title']);
        }
        // 疏理元素
        dark['pack'] = $('<div></div>');
        dark['elem'] = $('<div></div>').append($(dark['elem']).html());
        // 疏理类型
        $(dark['type']).each(function(key, value) {
            if (key === 0 || value === '') return true;
            if (value != '*') {
                value = '[' + dark['type'][0] + '=' + value + ']';
            } else {
                value = '[' + dark['type'][0] + ']';
            }
            dark['pack'].append(dark['elem'].children(value).html());
        });
        // 疏理单元
        if (isSet(dark['cell'])) {
            dark['elem'].html('');
            dark['cell'] = fxBase['text']['explode'](',', dark['cell']);
            $(dark['cell']).each(function(key, value) {
                if (key === 0 || value === '') return true;
                if (value != '*') {
                    value = '[' + dark['cell'][0] + '=' + value + ']';
                } else {
                    value = '[' + dark['cell'][0] + ']';
                }
                // 疏理单元列表
                dark['pack'].find(value).each(function(key2, value2) {
                    dark['elem'].append($(value2).attr(dark['param'][key]).prop('outerHTML'));
                });
            });
            // 疏理参数
            dark['param'][key] = isObject(dark['param'][key]) ? dark['param'][key] : {};
            // 疏理标题
            dark['elem'].children().each(function(key, value) {
                // 疏理标题
                if (!isSet(dark['title'][key]) || dark['title'][key] == '') {
                    dark['title'][key] = $(value).html();
                }
                $(value).html(fxBase['base']['lang'](fxBase['text']['explode']('.', dark['title'][key])));
            });
        } else {
            dark['elem'].html(dark['pack'].children());
        }
        return dark['elem'];
    },

    /**
     * 获取模板
     */
    'template': function() {
        // 初始化变量
        var dark = {
            // 库存
            'stock': fxView['material']['template'],
            // 元素
            'elem': null,
            // 类型
            'type': null,
            // 单元
            'cell': null,
            // 标题
            'title': null,
            // 参数
            'param': []
        };
        dark = fxBase['param']['merge'](dark, arguments[0]);
        if (!isSet(dark['elem'])) {
            console.log(fxBase['base']['lang'](['lack', 'element']));
            return;
        }
        // 疏理数据
        if (isBlank(dark['type'])) {
            dark['type'] = [];
        } else if (!isArray(dark['type']) && !isObject(dark['type'])) {
            dark['type'] = fxBase['text']['explode'](',', dark['type']);
        }
        if (isBlank(dark['title'])) {
            dark['title'] = [];
        } else if (!isArray(dark['title']) && !isObject(dark['title'])) {
            dark['title'] = fxBase['text']['explode'](',', dark['title']);
        }
        // 疏理元素
        dark['pack'] = $('<div></div>');
        dark['elem'] = dark['stock'][dark['elem']];
        // 疏理类型
        $(dark['type']).each(function(key, value) {
            if (value != '*') {
                value = dark['elem'][value];
            } else {
                value = fxBase['text']['implode']('', Object.values(dark['elem']));
            }
            dark['pack'].append(value);
        });
        // 疏理单元
        dark['elem'] = $('<div></div>');
        if (isSet(dark['cell'])) {
            dark['cell'] = fxBase['text']['explode'](',', dark['cell']);
            $(dark['cell']).each(function(key, value) {
                if (key === 0 || value === '') return true;
                if (value != '*') {
                    value = '[' + dark['cell'][0] + '=' + value + ']';
                } else {
                    value = '[' + dark['cell'][0] + ']';
                }
                // 疏理参数
                dark['param'][key] = isObject(dark['param'][key]) ? dark['param'][key] : {};
                // 疏理单元列表
                dark['pack'].find(value).each(function(key2, value2) {
                    dark['elem'].append($(value2).attr(dark['param'][key]).prop('outerHTML'));
                });
            });
            // 疏理标题
            dark['elem'].children().each(function(key, value) {
                // 疏理标题
                if (!isSet(dark['title'][key]) || dark['title'][key] == '') {
                    dark['title'][key] = $(value).html();
                }
                $(value).html(fxBase['base']['lang'](fxBase['text']['explode']('.', dark['title'][key])));
            });
        } else {
            dark['elem'].html(dark['pack'].children());
        }
        return dark['elem'];
    },

    /**
     * 拖拽事件
     */
    'drag': function() {
        // 初始化变量
        var dark = {
            // 元素
            'elem': null,
            // 延时
            'time': 0,
            // 目标
            'target': null,
            // 墙壁
            'wall': false,
            // 堆叠
            'z_index': fxBase['base']['maxZIndex']() + 1,
            // 样式
            'css': {},
            // 边界
            'edge': $(document),
            // 边界-左
            'edgeX': null,
            // 边界-上
            'edgeY': null,
            // 开关
            'switch': true
        };
        var tray = {};
        dark = fxBase['param']['merge'](dark, arguments[0]);
        if (!isSet(dark['elem'])) {
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
            dark['is_move'] = false;
            tray['elem'] = dark['target'] ? $(dark['target']) : $(this);
            tray['z_index'] = fxBase['dom']['style'](tray['elem'], 'z-index');
            tray['href'] = tray['elem'].attr('href');
            tray['elem'].css('z-index', dark['z_index']);
            tray['elem'].attr('href', 'javascript:void(0);');
            dark['css']['select'] = $('body').css('user-select');
            fxApp['rank']['timer.mouse.drag'] = setTimeout(function() {
                var domLeft = tray['elem'].offset().left,
                    domTop = tray['elem'].offset().top,
                    curLeft = parseFloat(tray['elem'].css('left')),
                    curTop = parseFloat(tray['elem'].css('top'));
                dark['getX'] = touch.pageX - (domLeft + (curLeft - domLeft));
                dark['getY'] = touch.pageY - (domTop + (curTop - domTop));
                $('body').css('user-select', 'none');
                // 注册移动事件
                $(document).on('mousemove', move);
                $(this).on('touchmove', move);
            }, dark['time']);
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
                nowY = touch.pageY - dark['getY'],
                nowW, nowH, edgeX, edgeY;
            dark['is_move'] = true;
            // 计算墙壁
            if (true === dark['wall']) {
                nowW = tray['elem'].outerWidth(true);
                nowH = tray['elem'].outerHeight(true);
                edgeX = isSet(dark['edgeX']) ? dark['edgeX'] : dark['edge'].scrollLeft();
                edgeY = isSet(dark['edgeY']) ? dark['edgeY'] : dark['edge'].scrollTop();
                if (nowX < edgeX) {
                    nowX = edgeX;
                } else if (nowX > $(document).outerWidth(true) - nowW + edgeX) {
                    nowX = $(document).outerWidth(true) - nowW + edgeX;
                }
                if (nowY < edgeY) {
                    nowY = edgeY;
                } else if (nowY > $(document).outerHeight(true) - nowH + edgeY) {
                    nowY = $(document).outerHeight(true) - nowH + edgeY;
                }
            }
            // 校准位置
            tray['elem'].css({
                'left': nowX,
                'top': nowY
            });
        }
        // 结束
        function end(event) {
            // 删除定时器
            clearTimeout(fxApp['rank']['timer.mouse.drag']);
            // 解除拖拽事件
            $('body').css('user-select', dark['css']['select']);
            $(document).off('mousemove', move);
            $(document).off('mouseup', end);
            $(this).off('touchmove', move);
            $(this).off('touchend', end);
            tray['elem'].css('z-index', tray['z_index']);
            if (!isSet(tray['href'])) {
                tray['elem'].removeAttr('href');
            } else if (!dark['is_move']) {
                tray['elem'].attr('href', tray['href']);
            } else {
                // 删除定时器
                clearTimeout(fxApp['rank']['timer.mouse.drag']);
                fxApp['rank']['timer.mouse.drag'] = setTimeout(function() {
                    tray['elem'].attr('href', tray['href']);
                }, 10);
            }
        }
    },

    /**
     * 触发事件
     */
    'trigger': function() {
        // 初始化变量
        function trigger() {
            // 替换地址
            window.location.replace($(this).attr('fxy-href'));
        }
        $(document).off('click', trigger);
        $(document).on('click', 'a[fxy-href]', trigger);
    },

    /**
     * 最大z-index
     */
    'maxZIndex': function() {
        // 初始化变量
        var selfZ = Math.max.apply(null,
            $.map($('body *'), function(elem, index) {
                if ($(elem).css('position') != 'static')
                    return parseInt($(elem).css('z-index')) || -1;
            }));
        var parentZ = Math.max.apply(null,
            $.map($(parent.document).find('body *'), function(elem, index) {
                if ($(elem).css('position') != 'static')
                    return parseInt($(elem).css('z-index')) || -1;
            }));
        return selfZ > parentZ ? selfZ : parentZ;
    }
});

/**
 * 文件
 */
fxBase['file'] = Object.assign(isObject(fxBase['file']) ? fxBase['file'] : {}, {
    /**
     * 获取类方法
     */
    'classMethod': function(object) {
        // 初始化变量
        if (!isObject(object)) return;
        var echo = {
            'param': {},
            'method': []
        };
        $.each(object, function(key, value) {
            if (value != null) {
                echo['param'][key] = value;
            } else {
                echo['method'].push(key);
            }
        });
        return echo;
    },

    /**
     * 获取路径后缀名
     */
    'pathExt': function(path) {
        // 初始化变量
        last_len = path.lastIndexOf('.');
        len = path.length;
        ext = path.substring(last_len + 1, len);
        return ext;
    }
});

/**
 * 数学
 */
fxBase['math'] = Object.assign(isObject(fxBase['math']) ? fxBase['math'] : {}, {
    /**
     * 获取随机数
     */
    'rand': function(min, max) {
        // 初始化变量
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }
        if (min > max) {
            var hold = max;
            max = min;
            min = hold;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

/**
 * 参数
 */
fxBase['param'] = Object.assign(isObject(fxBase['param']) ? fxBase['param'] : {}, {

    /**
     * 定义参数
     */
    'define': function() {
        // 初始化变量
        var param = isSet(arguments[0]) ? arguments[0] : null,
            mode = isSet(arguments[1]) ? arguments[1] : null,
            echo = {};
        // 校验入参
        if (!isArray(param)) {
            return false;
        }
        // 疏理入参
        switch (mode) {
            default:
                // 默认
                echo = param;
                break;
            case '1.1.1':
                // 数组覆盖-融合-值不存在
                echo = param[0];
                $.each(param[1], function(key, value) {
                    if (!isSet(echo[key])) {
                        echo[key] = value;
                    }
                });
                break;
            case '1.1.2':
                // 数组覆盖-融合-值不存在或为空字符串
                echo = param[0];
                $.each(param[1], function(key, value) {
                    if (!isSet(echo[key]) || '' === echo[key]) {
                        echo[key] = value;
                    }
                });
                break;
            case '1.1.3':
                // 数组覆盖-融合-值不存在或为非数组
                echo = param[0];
                $.each(param[1], function(key, value) {
                    if (!isSet(echo[key])) {
                        echo[key] = value;
                    }
                });
                $.each(param[1], function(key, value) {
                    echo[key] = fxBase['base']['json'](echo[key], 'decode');
                });
                break;
            case '1.2.1':
                // 数组覆盖-赋空-值不存在
                echo = param[0];
                $.each(param[1], function(key, value) {
                    if (!isSet(echo[value])) {
                        echo[value] = null;
                    }
                });
                break;
            case '1.2.2':
                echo = param[0];
                $.each(param[1], function(key, value) {
                    if (!isSet(echo[value]) || '' === echo[value]) {
                        echo[value] = null;
                    }
                });
                break;
            case '1.2.3':
                // 数组覆盖-赋空-值不存在或为非数组
                echo = param[0];
                $.each(param[1], function(key, value) {
                    echo[value] = fxBase['base']['json'](isSet(echo[value]) ? echo[value] : null, 'decode');
                });
                break;
            case '1.2.4':
                // 数组覆盖-赋空-值拆分数组
                echo = param[0];
                $.each(param[1], function(key, value) {
                    if (!isSet(echo[value]) || '' === echo[value]) {
                        echo[value] = {};
                    } else if (isString(echo[value]) || isNumeric(echo[value])) {
                        echo[value] = fxBase['text']['explode'](',', echo[value]);
                    } else if (!isArray(echo[value])) {
                        echo[value] = {};
                    }
                });
                break;
            case '1.3.1':
                // 数组覆盖-倒融合-值不存在
                echo = param[0];
                $.each(param[1], function(key, value) {
                    if (isSet(value)) {
                        echo[key] = value;
                    }
                });
                break;
            case '1.3.2':
                // 数组覆盖-倒融合-赋空-值不存在
                echo = param[0];
                $.each(param[1], function(key, value) {
                    if (isSet(value)) {
                        echo[key] = value;
                    } else if (!isSet(echo[key]) || '' === echo[key]) {
                        echo[key] = null;
                    }
                });
                break;
            case '2.1.1':
                // 数组新建-融合-值不存在
                $.each(param[1], function(key, value) {
                    if (!isSet(param[0][key])) {
                        echo[key] = value;
                    } else {
                        echo[key] = param[0][key];
                    }
                });
                break;
            case '2.1.2':
                // 数组新建-融合-值不存在或为空字符串
                $.each(param[1], function(key, value) {
                    if (!isSet(param[0][key]) || '' === param[0][key]) {
                        echo[key] = value;
                    } else {
                        echo[key] = param[0][key];
                    }
                });
                break;
            case '2.2.1':
                // 数组新建-赋空-值不存在
                $.each(param[1], function(key, value) {
                    if (!isSet(param[0][value])) {
                        echo[value] = null;
                    } else {
                        echo[value] = param[0][value];
                    }
                });
                break;
            case '2.2.2':
                // 数组新建-赋空-值不存在或为空字符串
                $.each(param[1], function(key, value) {
                    if (!isSet(param[0][value]) || '' === param[0][value]) {
                        echo[value] = null;
                    } else {
                        echo[value] = param[0][value];
                    }
                });
                break;
        }
        return echo;
    },

    /**
     * 合并数组
     */
    'merge': function() {
        // 初始化变量
        var args = [],
            echo = [],
            limit;
        // 疏理入参
        $.each(arguments, function(key, value) {
            args.push(value);
        });
        // 疏理限制
        limit = args.shift();
        limit = isSet(limit) ? limit : -1;
        if (!isNumeric(limit)) {
            args.unshift(limit);
            limit = -1;
        }
        // 执行合并
        if (args.length < 2) {
            return args.shift();
        } else if (args.length > 2) {
            echo[0] = args.shift();
            args.unshift(limit);
            echo[1] = fxBase['param']['merge'].apply(null, args);
        } else {
            echo = args;
        }
        return fxBase['param']['cover'](echo, limit);
    },

    /**
     * 覆盖数组
     */
    'cover': function() {
        // 初始化变量
        var args = isSet(arguments[0]) ? arguments[0] : null,
            limit = isSet(arguments[1]) ? arguments[1] : -1;
        if (limit > 0) {
            limit--;
        }
        if (!isArray(args[0]) && !isObject(args[0])) {
            args[0] = args[1];
        } else if (isArray(args[1]) || isObject(args[1])) {
            // 数组融合，已存在配置参数则覆盖
            $.each(args[1], function(key, value) {
                if (!isSet(args[0][key])) {
                    args[0][key] = value;
                } else if ((isArray(value) || isObject(value)) && limit !== 0) {
                    args[0][key] = fxBase['param']['cover']([args[0][key], value], limit);
                } else {
                    args[0][key] = value;
                }
            });
        }
        return args[0];
    },

    /**
     * 设置/获取URL
     */
    'url': function() {
        // 初始化变量
        var dark = {
            // 类型
            'type': null,
            // 窗口
            'window': window,
            // 地址
            'url': null,
            // 名称
            'name': null,
            // 参数
            'param': {}
        };
        dark = fxBase['param']['merge'](dark, arguments[0]);
        switch (dark['type']) {
            case '1.1':
                // 组装地址
                dark['param'] = fxBase['param']['merge'](fxBase['param']['url']({
                    'type': '2.1',
                    'window': dark['window']
                }), dark['param']);
            case '1.2':
                // 组装地址
                // 解析地址
                dark['url'] = !isBlank(dark['url']) ? dark['url'] : dark['window'].location.pathname;
                dark['url'] = fxBase['text']['explode']('?', dark['url'], 2);
                // 疏理数据
                dark['url'] = [dark['url'][0]];
                dark['param'] = fxBase['param']['merge'](fxBase['text']['strDecode'](dark['url'][1]), dark['param']);
                dark['param'] = fxBase['text']['strEncode'](dark['param']);
                // 拼接地址
                if (!isBlank(dark['param'])) {
                    dark['url'].push(dark['param']);
                }
                return fxBase['text']['implode']('?', dark['url']);
            case '2.1':
                // 获取参数
                // 解析地址
                dark['url'] = !isBlank(dark['url']) ? dark['url'] : dark['window'].location.href;
                dark['url'] = fxBase['text']['explode']('?', dark['url'], 2);
                // 解析数据
                dark['param'] = fxBase['text']['strDecode'](dark['url'][1]);
                if (isSet(dark['name'])) {
                    return dark['param'][dark['name']];
                }
                return dark['param'];
        }
    },

    /**
     * 搜索数组
     */
    'inArray': function() {
        // 初始化变量
        for (var i in arguments[1]) {
            if (arguments[1][i] == arguments[0]) {
                return true;
            }
        }
        return false;
    }
});

/**
 * 文本
 */
fxBase['text'] = Object.assign(isObject(fxBase['text']) ? fxBase['text'] : {}, {
    /**
     * 获取时间
     */
    'time': function() {
        // 初始化变量
        var time = isSet(arguments[0]) ? arguments[0] : +new Date(),
            milli = isSet(arguments[1]) ? arguments[1] : false;
        time = parseInt(time);
        var date = new Date(time + 8 * 3600 * 1000);
        if (!isNumeric(date)) return date;
        if (milli) {
            date = date.toJSON().replace('T', ' ').replace('Z', ' ');
        } else {
            date = date.toJSON().slice(0, -5).replace('T', ' ');
        }
        return date;
    },

    /**
     * 毫秒时间
     */
    'mtime': function() {
        // 初始化变量
        var mtime = isSet(arguments[0]) ? arguments[0] : null,
            echo = null;
        if (isNumeric(mtime)) {
            mtime = String(mtime);
            if (mtime.length != 13) {
                return false;
            }
            echo = fxBase['text']['time'](mtime, true);
        } else if (isString(mtime)) {
            mtime = mtime.replace(/-/g, '/');
            echo = new Date(mtime).getTime();
        } else {
            echo = new Date().getTime();
        }
        return echo;
    },

    /**
     * 格式化时间
     */
    'ftime': function() {
        // 初始化变量
        var time = isSet(arguments[0]) ? arguments[0] : null,
            type = isSet(arguments[1]) ? arguments[1] : null,
            echo = [];
        time = parseInt(time);
        // 时间列表
        var time_list = {};
        // 时间开关
        var time_switch = {
            0: false,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
        };
        // 时间名称
        var time_name = {
            0: 'millisecond',
            1: 'sec',
            2: 'minute',
            3: 'hour',
            4: 'day',
            5: 'month',
            6: 'year',
        };
        var time_all = time;
        switch (type) {
            default:
            case '1.1':
                // 秒
                break;
            case '1.2':
                // 毫秒
                time_switch[0] = true;
                break;
        }
        // 毫秒
        if (time_switch[0]) {
            time_list[0] = time_all % 1000;
            time_all = parseInt(time_all / 1000);
        }
        // 秒
        if (time_switch[1]) {
            time_list[1] = time_all % 60;
            time_all = parseInt(time_all / 60);
        }
        // 分钟
        if (time_switch[2]) {
            time_list[2] = time_all % 60;
            time_all = parseInt(time_all / 60);
        }
        // 小时
        if (time_switch[3]) {
            time_list[3] = time_all % 24;
            time_all = parseInt(time_all / 24);
        }
        // 天
        if (time_switch[4]) {
            time_list[4] = time_all % 30;
            time_all = parseInt(time_all / 30);
        }
        // 月
        if (time_switch[5]) {
            time_list[5] = time_all % 12;
            time_all = parseInt(time_all / 12);
        }
        // 年
        if (time_switch[6]) {
            time_list[6] = time_all;
        }
        // 去除0
        $.each(time_list, function(key, value) {
            if (value == 0) {
                delete time_list[key];
            }
        });
        $.each(time_list, function(key, value) {
            if (!isSet(value)) return true;
            echo.unshift(time_name[key]);
            echo.unshift(String(value));
        });
        echo = fxBase['base']['lang'](echo);
        return echo;
    },

    /**
     * 替换字符串
     */
    'replace': function(find, replace, string) {
        // 初始化变量
        var find = new RegExp(find, 'g');
        string += '';
        return string.replace(find, replace);
    },

    /**
     * 打散字符串
     */
    'explode': function() {
        // 初始化变量
        var dark = {
            // 表达式
            0: null,
            // 数据
            1: null,
            // 疏理
            2: null,
            // 类型
            3: null
        };
        dark = fxBase['param']['merge'](dark, arguments);
        // 疏理数据
        separator = dark[0];
        data = dark[1];
        howmany = isNumeric(dark[2]) ? dark[2] : null;
        type = isString(dark[2]) ? dark[2] : dark[3];
        // 疏理类型
        switch (type) {
            case 'regular':
                // 正则表达式
                separator = new RegExp(separator, 'g');
                break;
        }
        // 处理数据
        if (isString(data) || isNumeric(data)) {
            data += '';
            data = data.split(separator);
            if (isSet(howmany) && howmany == 0) {
                data = [fxBase['text']['implode'](separator, data)];
            } else if (isSet(howmany) && howmany >= 0 && data.length > howmany) {
                data.unshift(fxBase['text']['implode'](separator, data.slice(howmany - 1)));
                data = data.slice(0, howmany);
                data.push(data.shift());
            } else if (isSet(howmany) && howmany < 0) {
                data = data.slice(0, howmany);
            }
        } else if (!isSet(data)) {
            data = [''];
        } else if (!isArray(data) && !isObject(data)) {
            data = [data];
        }
        return data;
    },

    /**
     * 组合字符串
     */
    'implode': function() {
        // 初始化变量
        var separator = isSet(arguments[0]) ? arguments[0] : null,
            data = isSet(arguments[1]) ? arguments[1] : null;
        if (isObject(data)) {
            data = Object.values(data);
        }
        if (isArray(data)) {
            data = data.join(separator);
        } else if (!isSet(data)) {
            data = [];
        }
        return data;
    },

    /**
     * 填充字符串
     */
    'strPad': function() {
        // 初始化变量
        var string = isSet(arguments[0]) ? arguments[0] : null,
            length = isSet(arguments[1]) ? arguments[1] : null,
            pad_string = isSet(arguments[2]) ? arguments[2] : ' ',
            pad_type = isSet(arguments[3]) ? arguments[3] : '1';
        // 疏理数据
        string += '';
        pad_type += '';
        switch (pad_type) {
            case '0':
                // 左边
                string = string.padStart(length, pad_string);
                break;
            case '1':
                // 右边
                string = string.padEnd(length, pad_string);
                break;
            case '2':
                // 两边
                string = string.padStart(Math.floor((length - string.length) / 2 + string.length), pad_string);
                string = string.padEnd(length, pad_string);
                break;
        }
        return string;
    },

    /**
     * 处理字符串-编码
     */
    'strEncode': function() {
        // 初始化变量
        var array = isSet(arguments[0]) ? arguments[0] : {},
            echo = [];
        // 解析数据
        $.each(array, function(key, value) {
            // 解析数据
            value = fxBase['text']['strEncodeMerge'](value);
            if (!isArray(value)) {
                value = [value];
            }
            // 疏理数据
            $.each(value, function(key2, value2) {
                echo.push(key + value2);
            });
        });
        echo = fxBase['text']['implode']('&', echo);
        return echo;
    },

    /**
     * 处理字符串-编码-合并数组
     */
    'strEncodeMerge': function(data) {
        // 初始化变量
        var tray = [];
        if (!isArray(data) && !isObject(data)) {
            data = encodeURIComponent(data);
            return '=' + data;
        }
        $.each(data, function(key, value) {
            value = fxBase['text']['strEncodeMerge'](value);
            if (isObject(data)) {
                tray.push('[' + key + ']' + value);
            } else {
                tray.push('[]' + value);
            }
        });
        return tray;
    },

    /**
     * 处理字符串-解码
     */
    'strDecode': function() {
        // 初始化变量
        var string = isSet(arguments[0]) ? arguments[0] : null,
            echo = {};
        // 解析数据
        string = fxBase['text']['explode']('&', string);
        $.each(string, function(key, value) {
            // 解析数据
            value = fxBase['text']['explode']('=', value, 2);
            if (isBlank(value[0]) && !isSet(value[1])) return true;
            // 疏理数据
            try {
                value[0] = isSet(value[0]) ? decodeURIComponent(value[0]) : value[0];
            } catch (e) {}
            try {
                value[1] = isSet(value[1]) ? decodeURIComponent(value[1]) : value[1];
            } catch (e) {}
            // 解析键钥
            value[0] = fxBase['text']['replace']('^([^\[]*)', '[$1]', value[0]);
            value[2] = echo;
            value = fxBase['text']['strDecodeMerge'](value);
            // 合并数据
            echo = fxBase['param']['merge'](echo, value[2]);
        });
        return echo;
    },

    /**
     * 处理字符串-解码-合并数组
     */
    'strDecodeMerge': function(data) {
        // 初始化变量
        var tray = {};
        tray['find'] = new RegExp(/^\[([^\]]*)\]/);
        tray['key'] = data[0].match(tray['find']);
        data[0] = fxBase['text']['replace']('^\\[[^\\]]*\\]', '', data[0]);
        if (isEmpty(tray['key'])) {
            return {};
        }
        // 解析数据
        data[2] = isSet(data[2]) ? data[2] : [];
        if (tray['key'][0] != '[]' && isArray(data[2])) {
            data[2] = fxBase['param']['merge']({}, data[2]);
        }
        if (tray['key'][0] == '[]') {
            tray['key'][1] = -1;
            $.each(data[2], function(key, value) {
                if (!isNumeric(key) || Math.floor(key) != key) return true;
                tray['key'][1] = tray['key'][1] > key ? tray['key'][1] : key;
            });
            tray['key'][1]++;
        }
        // 疏理数据
        if (isSet(data[0].match(tray['find']))) {
            data[2][tray['key'][1]] = fxBase['text']['strDecodeMerge']([data[0], data[1], data[2][tray['key'][1]]])[2];
        } else if (isArray(data[2])) {
            data[2].push(data[1]);
        } else {
            data[2][tray['key'][1]] = data[1];
        }
        return data;
    }
});

/**
 * 创建风音应用
 */
var fxApp = new function() { return isObject(fxApp) ? fxApp : {}; };

/**
 * 基础
 */
fxApp['base'] = {};

/**
 * 数据
 */
fxApp['data'] = {};

/**
 * 用户
 */
fxApp['user'] = {};

/**
 * 视图
 */
fxApp['view'] = {};

/**
 * 天梯
 */
fxApp['rank'] = {};

/**
 * 控制台
 */
fxApp['console'] = Object.assign(isObject(fxApp['console']) ? fxApp['console'] : {}, {
    /**
     * 应用
     */
    'app': function() {
        // 初始化变量
        var dark = {
            // 环境
            'env': {
                // 标题
                'title': $('title').html()
            }
        };
        fxApp = fxBase['param']['merge'](fxApp, dark, arguments[0]);
    },

    /**
     * 环境
     */
    'env': function() {
        // 初始化变量
        var dark = $('.moire-data').html();
        dark = JSON.parse(isSet(dark) ? dark : '{}');
        $.each(dark, function(key, value) {
            fxApp[key] = fxBase['param']['merge'](fxApp[key], value);
        });
    },

    /**
     * 版权信息
     */
    'copyright': function() {
        // 初始化变量
        var dark = {
            // 开关
            'switch': true
        };
        dark = fxBase['param']['merge'](dark, arguments[0]);
        // 判断顶页面
        if (dark['switch'] !== true || self != top) return;
        // 输出版权
        console.log('%c' + fxBase['base']['lang'](['site console1']) + '\n%c' + fxBase['base']['lang'](['site console2']), 'color: #9173a9;', 'color: #a6a7d7;');
    },

    /**
     * 自动清理日志
     */
    'clear': function() {
        // 初始化变量
        var dark = {
            // 开关
            'switch': true
        };
        dark = fxBase['param']['merge'](dark, arguments[0]);
        // 判断顶页面
        if (dark['switch'] !== true || self != top) return;
        // 计时器
        clearInterval(fxApp['rank']['timer.console.clear']);
        fxApp['rank']['timer.console.clear'] = setInterval(function() {
            console.clear();
            fxApp['console']['copyright'](true);
            console.log(fxBase['text']['time']() + '\n' + fxBase['base']['lang'](['log', 'auto', 'clear', ',', 'interval', '60', 'minute']));
        }, 60 * 60 * 1000);
    }
});

/**
 * 记录IE版本
 */
fxApp['env']['ie'] = fxBase['client']['ieVersion']();