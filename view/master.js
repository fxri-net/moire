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
 * 创建风音视图
 */
var fxView = new function() { return isObject(fxView) ? fxView : {}; };

/**
 * 缓存
 */
fxView['cache'] = {
    /**
     * 输出
     */
    'echo': {},

    /**
     * 元素
     */
    'elem': {},

    /**
     * 视图
     */
    'view': {}
};

/**
 * 定制
 */
fxView['custom'] = {};

/**
 * 部署
 */
fxView['deploy'] = {
    /**
     * 视图
     */
    'view': {}
};

/**
 * 加工
 */
fxView['machine'] = {};

/**
 * 物料
 */
fxView['material'] = {
    /**
     * 元素
     */
    'elem': {},

    /**
     * 模板
     */
    'template': {}
};

/**
 * 模具
 */
fxView['mould'] = {
    /**
     * 工具
     */
    'tool': {},

    /**
     * 视图
     */
    'view': {}
};

/**
 * 货架
 */
fxView['shelf'] = {};

/**
 * 商店
 */
fxView['store'] = {};

/**
 * 云纹商店-处理
 */
fxView['store']['deal'] = function() {
    // 初始化变量
    var dark = {
        // 地址
        'url': null,
        // 类型
        'type': 'post',
        // 缓存
        'cache': false,
        // 数据
        'data': {
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
        // 成功回调
        'success': success,
        // 失败回调
        'error': error,
        // 扩展
        'extend': {
            // 元素
            'elem': null,
            // 提示
            'tips': true
        }
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    dark['echo'] = {};
    $.ajax(dark);
    // 成功回调
    function success(data) {
        dark['echo'] = data;
        // 提示消息
        if (!dark['extend']['tips']) return;
        if (data['code'] == -1) {
            // 系统异常
            data['message'] = fxBase['base']['lang'](['system', 'abend']);
        }
        if (data['code'] == 200 && !isNull(dark['extend']['elem'])) {
            // 请求成功
            layui.layer.tips(data['message'], $(dark['extend']['elem']), {
                'time': 800,
                'tips': fxBase['math']['rand'](1, 4),
                'tipsMore': true
            });
        } else if (data['code'] == 200) {
            // 请求成功
            layui.layer.msg(data['message'], {
                'time': 800
            });
        } else {
            // 请求失败
            $.toast({
                'text': data['message'],
                'icon': 'error',
                'hideAfter': 2000,
                'position': 'top-right',
                'stack': 3
            });
        }
    }
    // 失败回调
    function error(data) {
        // 请求失败
        $.toast({
            'text': data['responseText'],
            'icon': 'error',
            'hideAfter': 2000,
            'position': 'top-right',
            'stack': 3
        });
    }
    return dark['echo'];
};

/**
 * 云纹商店-采购
 */
fxView['store']['purchase'] = function() {
    // 初始化变量
    var dark = {
        // 地址
        'url': null,
        // 异步
        'async': false,
        // 数据
        'data': {
            // 基础
            'base': {
                // 页码
                'page': 1,
                // 条数
                'limit': -1
            }
        },
        // 成功回调
        'success': success,
        // 失败回调
        'error': error,
        // 扩展
        'extend': {
            // 提示
            'tips': false,
            // 等级
            'level': 1,
            // 键钥
            'key': null,
            // 键钥-联结
            'keyNexus': '-',
            // 键值
            'value': null,
            // 键值-联结
            'valueNexus': ' - '
        }
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 疏理数据
    if (isBlank(dark['extend']['key'])) {
        dark['extend']['key'] = ['id'];
    } else if (!isArray(dark['extend']['key']) && !isObject(dark['extend']['key'])) {
        dark['extend']['key'] = fxBase['text']['explode'](',', dark['extend']['key']);
    }
    if (isBlank(dark['extend']['value'])) {
        dark['extend']['value'] = ['id', 'name'];
    } else if (!isArray(dark['extend']['value']) && !isObject(dark['extend']['value'])) {
        dark['extend']['value'] = fxBase['text']['explode'](',', dark['extend']['value']);
    }
    dark['echo'] = {
        // 键钥
        'key': {},
        // 键值
        'value': {}
    };
    fxView['store']['deal'](dark);
    // 成功回调
    function success(data) {
        if (data['code'] == 200) {
            // 请求成功
            if (dark['extend']['level'] != 2) {
                data['data'] = [data['data']];
            }
            $.each(data['data'], function(key, value) {
                dark['echo']['value'][key] = {};
                $.each(value, function(key2, value2) {
                    // 疏理键钥
                    dark['echo']['key'] = [];
                    $.each(dark['extend']['key'], function(key3, value3) {
                        dark['echo']['key'].push(!isUndefined(value2[value3]) ? value2[value3] : value3);
                    });
                    dark['echo']['key'] = fxBase['text']['implode'](dark['extend']['keyNexus'], dark['echo']['key']);
                    // 疏理键值
                    dark['echo']['value'][key][dark['echo']['key']] = [];
                    $.each(dark['extend']['value'], function(key3, value3) {
                        dark['echo']['value'][key][dark['echo']['key']].push(!isUndefined(value2[value3]) ? value2[value3] : value3);
                    });
                    dark['echo']['value'][key][dark['echo']['key']] =
                        fxBase['text']['implode'](dark['extend']['valueNexus'], dark['echo']['value'][key][dark['echo']['key']]);
                });
            });
        }
    }
    // 失败回调
    function error(data) {}
    return dark['echo']['value'];
};

/**
 * 云纹商店-供应
 */
fxView['store']['supply'] = function() {
    // 初始化变量
    fxView['shelf'] = {
        // 属性
        'attr': {},
        // 基础
        'base': {},
        // 数据
        'data': {},
        // 视图
        'view': {
            // 元素
            'elem': null,
            // 模型
            'model': {
                // 主键
                'key': 'id'
            },
            // 接口
            'api': {},
            // 页面
            'page': {},
            // 参数
            'param': null
        }
    };
    fxView['shelf'] = fxBase['param']['merge'](fxView['shelf'], arguments[0]);
    // 数据采购
    $.each(fxView['shelf']['base'], function(key, value) {
        if (!isBlank(value['url'])) {
            value = fxBase['param']['merge']({
                // 扩展
                'extend': {
                    // 映射
                    'mapping': { 0: key }
                }
            }, value);
            $.each(fxView['store']['purchase'](value), function(key2, value2) {
                // 数据上架
                value['extend']['mapping'][key2] = !isBlank(value['extend']['mapping'][key2]) ? value['extend']['mapping'][key2] : key2;
                fxView['shelf']['data'][value['extend']['mapping'][key2]] = value2;
            });
        } else {
            // 数据上架
            fxView['shelf']['data'][key] = value;
        }
    });
};

/**
 * 云纹商店-门面
 */
fxView['store']['facade'] = function() {
    // 初始化变量
    var dark = {
        // 元素
        'elem': null
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (isObject(fxView['deploy']['view'][dark['elem']])) {
        dark['data'] = fxBase['param']['merge']({
            // 基础
            'base': {
                // 元素
                'elem': null
            }
        }, fxView['deploy']['view'][dark['elem']]);
    } else {
        dark['data'] = {
            // 基础
            'base': fxBase['param']['merge']({
                // 元素
                'elem': null
            }, dark)
        };
    }
    // 替换标题
    if (isBlank(fxApp['view']['elems'][dark['elem']])) {
        $('title').html(fxBase['base']['lang']([fxApp['view']['name'], dark['elem'], ' - ', 'site title']));
        fxApp['env']['title'] = $('title').html();
    }
    // 执行视图
    if (isFunction(fxView['mould']['view'][dark['data']['base']['elem']])) {
        fxView['mould']['view'][dark['data']['base']['elem']](dark['data']);
    } else if (isFunction(fxView['custom'][dark['data']['base']['elem']])) {
        fxView['custom'][dark['data']['base']['elem']](dark['data']);
    } else {
        return fxView['mould']['tool']['message']({ 'text': ['view', 'not configured'] });
    }
};

/**
 * 云纹加工-元素
 */
fxView['machine']['elem'] = function() {
    // 初始化变量
    var dark = fxBase['param']['merge'](arguments[0], {
        // 基础属性->↓
        // 编号
        'id': '',
        // 字段
        'field': '',
        // 输出
        'echo': null,
        // 基础属性->↑
        // 视图属性->↓
        // 标题
        'title': '',
        // 必填
        'require': 0,
        // 选项
        'option': {},
        // 货架
        'shelf': {},
        // 皮肤
        'skin': null,
        // 开始
        'before': null,
        // 之后
        'after': null,
        // 完成
        'done': null
        // 视图属性->↑
    }, arguments[1]);
    dark = fxBase['param']['merge'](dark, {
        // 标签
        'label': [dark['title']]
    }, dark);
    // 疏理数据
    dark['label'] = fxBase['base']['lang'](dark['label']);
    dark['requireMark'] = dark['require'] == 1 ? '<span>*</span>' : '';
    return dark;
};

/**
 * 云纹加工-路径
 */
fxApp['env']['factory'] = fxApp['env']['script'] + '/view/';

/**
 * 云纹加工-加载器
 */
fxView['machine']['loader'] = function() {
    // 初始化变量
    var dark = {
        // 插件
        0: [],
        // 模块
        1: {
            // 车间
            'workshop': null,
            // 装配
            'assembly': null,
            // 门面
            'facade': 'facade.js',
            // 版本
            'version': fxApp['env']['version'],
        },
        // 回调
        2: null,
        // 路径
        3: fxApp['env']['factory']
    };
    dark = fxBase['param']['merge'](dark, arguments);
    // 疏理数据
    dark['plugins'] = dark[0];
    dark['module'] = dark[1];
    dark['callback'] = isFunction(dark[2]) ? dark[2] : null;
    dark['path'] = isString(dark[2]) ? dark[2] : dark[3];
    if (isBlank(dark['plugins'])) {
        dark['plugins'] = [];
    } else if (!isArray(dark['plugins']) && !isObject(dark['plugins'])) {
        dark['plugins'] = fxBase['text']['explode'](',', dark['plugins']);
    }
    // 加载插件
    $.each(dark['plugins'], function(key, value) {
        // 检查装配
        dark['plugin'] = fxView[dark['module']['workshop']][dark['module']['assembly']][value];
        if (isFunction(dark['plugin']) || dark['plugin'] === true) return true;
        fxView[dark['module']['workshop']][dark['module']['assembly']][value] = true;
        // 疏理模块
        dark['model'] = fxBase['text']['implode']('/', [dark['module']['workshop'], dark['module']['assembly'], value, dark['module']['facade']]);
        // 疏理版本
        if (!isBlank(dark['module']['version'])) {
            dark['model'] = fxBase['text']['implode']('?', [dark['model'], 'version=' + dark['module']['version']]);
        }
        // 加载模块
        document.write('<script type="text/javascript" src="' + dark['path'] + dark['model'] + '"></script>');
    });
    // 执行回调
    if (isFunction(dark['callback'])) {
        $(document).ready(function() {
            dark['callback']();
        });
    }
};