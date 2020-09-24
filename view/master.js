/**
 * 创建风音视图
 */
var fxView = new function() { return isObject(fxView) ? fxView : {}; };

/**
 * 定制
 */
fxView['custom'] = {};

/**
 * 部署
 */
fxView['deploy'] = {
    /**
     * 缓存
     */
    'cache': {},

    /**
     * 输出
     */
    'echo': {},

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
            'key': 'id',
            // 键值
            'value': null,
            // 联结
            'nexus': ' - '
        }
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 疏理数据
    if (isBlank(dark['extend']['value'])) {
        dark['extend']['value'] = ['id', 'name'];
    }
    dark['echo'] = {};
    fxView['store']['deal'](dark);
    // 成功回调
    function success(data) {
        if (data['code'] == 200) {
            // 请求成功
            if (dark['extend']['level'] != 2) {
                data['data'] = [data['data']];
            }
            $.each(data['data'], function(key, value) {
                dark['echo'][key] = {};
                $.each(value, function(key2, value2) {
                    dark['echo'][key][value2[dark['extend']['key']]] = [];
                    $.each(dark['extend']['value'], function(key3, value3) {
                        dark['echo'][key][value2[dark['extend']['key']]].push(value2[value3]);
                    });
                    dark['echo'][key][value2[dark['extend']['key']]] =
                        fxBase['text']['implode'](dark['extend']['nexus'], dark['echo'][key][value2[dark['extend']['key']]]);
                });
            });
        }
    }
    // 失败回调
    function error(data) {}
    return dark['echo'];
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
    dark = fxBase['param']['merge'](arguments[0], {
        // 编号
        'id': '',
        // 字段
        'field': '',
        // 标题
        'title': '',
        // 必填
        'require': 0,
        // 货架
        'shelf': {},
        // 皮肤
        'skin': null
    }, arguments[1]);
    dark['requireMark'] = dark['require'] == 1 ? '<span>*</span>' : '';
    dark['requireText'] = dark['require'] == 1 ? 'required' : null;
    return dark;
};

/**
 * 云纹物料-加载器
 */
fxView['material']['loader'] = function() {
    // 初始化变量
    var dark = [
        // 插件
        [],
        // 回调
        null,
        // 路径
        fxApp['env']['script']
    ];
    dark = fxBase['param']['merge'](1, dark, arguments);
    // 疏理数据
    dark['plugin'] = dark[0];
    dark['callback'] = isFunction(dark[1]) ? dark[1] : null;
    dark['path'] = isString(dark[1]) ? dark[1] : dark[2];
    if (isBlank(dark['plugin'])) {
        dark['plugin'] = [];
    } else if (!isArray(dark['plugin']) && !isObject(dark['plugin'])) {
        dark['plugin'] = fxBase['text']['explode'](',', dark['plugin']);
    }
    // 加载插件
    $.each(dark['plugin'], function(key, value) {
        if (isFunction(fxView['material']['elem'][value])) return true;
        document.write('<script type="text/javascript" src="' +
            dark['path'] + '/plugin/' + value + '/facade.js?version=' + fxApp['view']['version'] + '"></script>');
    });
    // 执行回调
    $(document).ready(function() {
        if (isFunction(dark['callback'])) {
            dark['callback']();
        }
    });
};