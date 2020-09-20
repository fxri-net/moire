/**
 * 创建风音视图
 */
var fxView = new function() {};

/**
 * 定制
 */
fxView['custom'] = {};

/**
 * 数据
 */
fxView['data'] = {
    /**
     * 缓存
     */
    cache: {},

    /**
     * 部署
     */
    deploy: {},

    /**
     * 输出
     */
    echo: {}
};

/**
 * 工厂
 */
fxView['factory'] = {
    /**
     * 模具
     */
    mould: {},

    /**
     * 模板
     */
    template: {},

    /**
     * 工具
     */
    tool: {}
};

/**
 * 架子
 */
fxView['shelf'] = {};

/**
 * 商店
 */
fxView['store'] = {};

/**
 * 视图商店-处理
 */
fxView['store']['deal'] = function() {
    // 初始化变量
    var dark = {
        // 地址
        url: null,
        // 类型
        type: 'post',
        // 缓存
        cache: false,
        // 数据
        data: {
            // 基础
            base: {
                // 令牌
                token: fxApp['user']['base']['token'],
                // 格式
                format: 'json'
            },
            // 数据
            data: {}
        },
        // 成功回调
        success: success,
        // 失败回调
        error: error,
        // 扩展
        extend: {
            // 元素
            elem: null,
            // 提示
            tips: true
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
                time: 800,
                tips: fxBase['math']['rand'](1, 4),
                tipsMore: true
            });
        } else if (data['code'] == 200) {
            // 请求成功
            layui.layer.msg(data['message'], {
                time: 800
            });
        } else {
            // 请求失败
            $.toast({
                text: data['message'],
                icon: 'error',
                hideAfter: 2000,
                position: 'top-right',
                stack: 3
            });
        }
    }
    // 失败回调
    function error(data) {
        // 请求失败
        $.toast({
            text: data['responseText'],
            icon: 'error',
            hideAfter: 2000,
            position: 'top-right',
            stack: 3
        });
    }
    return dark['echo'];
};

/**
 * 视图商店-采购
 */
fxView['store']['purchase'] = function() {
    // 初始化变量
    var dark = {
        // 地址
        url: null,
        // 异步
        async: false,
        // 数据
        data: {
            // 基础
            base: {
                // 页码
                page: 1,
                // 条数
                limit: -1
            }
        },
        // 成功回调
        success: success,
        // 失败回调
        error: error,
        // 扩展
        extend: {
            // 提示
            tips: false,
            // 等级
            level: 1,
            // 键钥
            key: 'id',
            // 键值
            value: null,
            // 联结
            nexus: ' - '
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
 * 视图商店-供应
 */
fxView['store']['supply'] = function() {
    // 初始化变量
    fxView['shelf'] = {
        // 属性
        attr: {},
        // 基础
        base: {},
        // 数据
        data: {},
        // 视图
        view: {
            // 元素
            elem: null,
            // 模型
            model: {
                // 主键
                key: 'id'
            },
            // 参数
            param: null
        }
    };
    fxView['shelf'] = fxBase['param']['merge'](fxView['shelf'], arguments[0]);
    // 数据采购
    $.each(fxView['shelf']['base'], function(key, value) {
        if (!isBlank(value['url'])) {
            value = fxBase['param']['merge']({
                // 扩展
                extend: {
                    // 映射
                    mapping: { 0: key }
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
 * 视图商店-门面
 */
fxView['store']['facade'] = function() {
    // 初始化变量
    var dark = {
        // 元素
        elem: null
    };
    dark = fxBase['param']['merge'](dark, arguments[0]);
    // 检查配置
    if (isObject(fxView['data']['deploy'][dark['elem']])) {
        dark['data'] = fxBase['param']['merge']({
            // 基础
            base: {
                // 元素
                elem: null
            }
        }, fxView['data']['deploy'][dark['elem']]);
    } else {
        dark['data'] = {
            // 基础
            base: fxBase['param']['merge']({
                // 元素
                elem: null
            }, dark)
        };
    }
    // 替换标题
    if (isBlank(fxApp['view']['elems'][dark['elem']])) {
        $('title').html(fxBase['base']['lang']([fxApp['view']['name'], dark['elem'], ' - ', 'site title']));
        fxApp['title'] = $('title').html();
    }
    // 执行视图
    if (isFunction(fxView['factory']['mould'][dark['data']['base']['elem']])) {
        fxView['factory']['mould'][dark['data']['base']['elem']](dark['data']);
    } else if (isFunction(fxView['custom'][dark['data']['base']['elem']])) {
        fxView['custom'][dark['data']['base']['elem']](dark['data']);
    } else {
        return fxView['factory']['tool']['message']({ text: ['view', 'not configured'] });
    }
};