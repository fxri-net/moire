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
fxView['cache'] = Object.assign(isObject(fxView['cache']) ? fxView['cache'] : {}, {
    /**
     * 输出
     */
    'echo': {},

    /**
     * 元素
     */
    'elem': {},

    /**
     * 插件
     */
    'plugin': [],

    /**
     * 视图
     */
    'view': {}
});

/**
 * 定制
 */
fxView['custom'] = Object.assign(isObject(fxView['custom']) ? fxView['custom'] : {}, {});

/**
 * 部署
 */
fxView['deploy'] = Object.assign(isObject(fxView['deploy']) ? fxView['deploy'] : {}, {});

/**
 * 加工
 */
fxView['machine'] = Object.assign(isObject(fxView['machine']) ? fxView['machine'] : {}, {});

/**
 * 物料
 */
fxView['material'] = Object.assign(isObject(fxView['material']) ? fxView['material'] : {}, {});

/**
 * 模具
 */
fxView['mould'] = Object.assign(isObject(fxView['mould']) ? fxView['mould'] : {}, {});

/**
 * 货架
 */
fxView['shelf'] = Object.assign(isObject(fxView['shelf']) ? fxView['shelf'] : {}, {});

/**
 * 商店
 */
fxView['store'] = Object.assign(isObject(fxView['store']) ? fxView['store'] : {}, {});

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
        if (data['code'] == 200 && isSet(dark['extend']['elem'])) {
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
        // 类型
        'type': 'get',
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
                    // 索引
                    'index': {}
                }
            }, value);
            // 疏理索引
            if (isEmpty(value['extend']['index'])) {
                value['extend']['index'] = { 0: key };
            }
            $.each(fxView['store']['purchase'](value), function(key2, value2) {
                // 数据上架
                value['extend']['index'][key2] = !isBlank(value['extend']['index'][key2]) ? value['extend']['index'][key2] : key2;
                fxView['shelf']['data'][value['extend']['index'][key2]] = value2;
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
    if (isObject(fxView['machine']['caller'](['deploy', 'view', dark['elem']]))) {
        dark['data'] = fxBase['param']['merge']({
            // 基础
            'base': {
                // 元素
                'elem': null
            }
        }, fxView['machine']['caller'](['deploy', 'view', dark['elem']]));
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
    if (isBlank(fxView['machine']['caller'](['view', 'elems', dark['elem']], null, fxApp))) {
        fxApp['view']['subtitle'] = fxBase['base']['lang']([dark['elem']]);
        fxApp['view']['title'] = fxBase['base']['lang']([fxApp['view']['name'], dark['elem']]);
        $('title').html(fxBase['base']['lang']([fxApp['view']['title'], ' - ', 'site title']));
        fxApp['env']['title'] = $('title').html();
    }
    // 执行视图
    if (isFunction(fxView['machine']['caller'](['custom', dark['data']['base']['elem']]))) {
        fxView['machine']['caller'](['custom', dark['data']['base']['elem']], [dark['data']]);
    } else if (isFunction(fxView['machine']['caller'](['mould', 'view', dark['data']['base']['elem'], 'main']))) {
        fxView['machine']['caller'](['mould', 'view', dark['data']['base']['elem'], 'main'], [dark['data']]);
    } else {
        // 执行消息
        fxView['machine']['caller'](['mould', 'tool', 'message', 'main'], [{ 'text': [dark['data']['base']['elem'], 'plugin', 'not loaded'] }]);
        // 关闭窗口
        if (top.fxApp['rank']['self.layer.index.list'].length > 0) {
            fxApp['rank']['self.layer.close'](top.fxApp['rank']['self.layer.index.list'][0]);
        }
    }
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
        // 配置
        1: {
            // 名称
            'name': [],
            // 路径
            'path': null,
            // 主机
            'web': fxApp['env']['factory'],
            // 版本
            'version': fxApp['env']['version']
        },
        // 回调
        2: null
    };
    dark = fxBase['param']['merge'](dark, arguments);
    // 疏理数据
    dark['plugin'] = dark[0];
    dark['config'] = dark[1];
    dark['callback'] = dark[2];
    // 解析插件
    if (isBlank(dark['plugin'])) {
        dark['plugin'] = [];
    } else if (!isArray(dark['plugin']) && !isObject(dark['plugin'])) {
        dark['plugin'] = fxBase['text']['explode'](',', dark['plugin']);
    }
    // 解析名称
    if (isBlank(dark['config']['name'])) {
        dark['config']['name'] = [];
    } else if (!isArray(dark['config']['name']) && !isObject(dark['config']['name'])) {
        dark['config']['name'] = fxBase['text']['explode'](',', dark['config']['name']);
    }
    // 加载插件
    $.each(dark['plugin'], function(key, value) {
        // 加载名称
        $.each(dark['config']['name'], function(key2, value2) {
            // 检查路径
            if (!isSet(dark['config']['path']) || !isSet(value2)) return true;
            // 疏理插件
            dark['model'] = [dark['config']['web'], dark['config']['path'], '/', value, '/', value2];
            dark['model'] = fxBase['text']['implode']('', dark['model']);
            // 疏理版本
            if (!isBlank(dark['config']['version'])) {
                dark['model'] = fxBase['text']['implode']('', [dark['model'], '?version=', dark['config']['version']]);
            }
            // 检查装配
            if (fxBase['param']['inArray'](dark['model'], fxView['cache']['plugin'])) return true;
            fxView['cache']['plugin'].push(dark['model']);
            // 加载模块
            document.write('<script type="text/javascript" src="' + dark['model'] + '"></script>');
        });
    });
    // 执行回调
    if (isFunction(dark['callback'])) {
        $(document).ready(function() {
            dark['callback']();
        });
    }
};

/**
 * 云纹加工-部署器
 */
fxView['machine']['deployer'] = function() {
    // 初始化变量
    var dark = {
        // 链条
        0: [],
        // 数据
        1: null,
        // 基础
        2: null
    };
    dark = fxBase['param']['merge'](dark, arguments);
    // 疏理数据
    dark['chain'] = dark[0];
    dark['data'] = dark[1];
    dark['base'] = isSet(dark[2]) ? dark[2] : fxView;
    // 检查数据
    if (!isArray(dark['chain'])) return false;
    // 裂变数据
    if (isObject(dark['data'])) {
        // 疏理数据
        dark['echo'] = {};
        $.each(dark['data'], function(key, value) {
            // 配置数据
            key = fxBase['text']['explode'](',', key);
            $.each(key, function(key2, value2) {
                dark['echo'][value2] = value;
            });
        });
        dark['data'] = dark['echo'];
    }
    // 加载链条
    $.each(dark['chain'].reverse(), function(key, value) {
        // 裂变链条
        value = fxBase['text']['explode'](',', value);
        // 配置数据
        dark['echo'] = {};
        $.each(value, function(key2, value2) {
            dark['echo'][value2] = dark['data'];
        });
        dark['data'] = dark['echo'];
    });
    dark['base'] = fxBase['param']['merge'](dark['base'], dark['data']);
};

/**
 * 云纹加工-访问器
 */
fxView['machine']['caller'] = function() {
    // 初始化变量
    var dark = {
        // 链条
        0: [],
        // 参数
        1: null,
        // 基础
        2: null
    };
    dark = fxBase['param']['merge'](dark, arguments);
    // 疏理数据
    dark['chain'] = dark[0];
    dark['data'] = dark[1];
    dark['base'] = isSet(dark[2]) ? dark[2] : fxView;
    // 检查数据
    if (!isArray(dark['chain'])) return false;
    // 加载链条
    dark['exit'] = true;
    dark['name'] = '';
    $.each(dark['chain'], function(key, value) {
        // 初始化变量
        dark['name'] = value;
        // 检查基础
        if (isUndefined(dark['base'][dark['name']])) return dark['exit'] = false;
        // 配置数据
        dark['base'] = dark['base'][dark['name']];
    });
    // 检查数据
    if (!dark['exit']) {
        dark['echo'] = undefined;
    } else if (isFunction(dark['base']) && isArray(dark['data'])) {
        dark['echo'] = dark['base'].apply(null, dark['data']);
    } else {
        dark['echo'] = dark['base'];
    }
    return dark['echo'];
};

/**
 * 云纹加工-参数器
 */
fxView['machine']['darker'] = function() {
    // 初始化变量
    var dark = fxBase['param']['merge'](arguments[0], {
        // 基础属性->↓
        // 编号
        'id': '',
        // 字段
        'field': '',
        // 数据
        'data': null,
        // 数据-原始
        'dataRaw': null,
        // 数据-前缀
        'dataPrefix': '',
        // 数据-后缀
        'dataSuffix': '',
        // 数据-输出
        'dataEcho': null,
        // 输出
        'echo': null,
        // 列表
        'list': [],
        // 基础属性->↑
        // 视图属性->↓
        // 事件
        'event': {},
        // 标题
        'title': '',
        // 定义
        'define': 0,
        // 必填
        'require': 0,
        // 选项
        'option': {},
        // 货架
        'shelf': {}
        // 视图属性->↑
    }, isObject(arguments[1]) ? arguments[1] : {});
    dark = fxBase['param']['merge'](dark, {
        // 标签
        'label': [dark['title']]
    }, dark);
    // 疏理数据
    dark['label'] = fxBase['base']['lang'](dark['label']);
    dark['requireMark'] = dark['require'] == 1 ? '<span>*</span>' : '';
    if (dark['define'] == 1 && !isSet(dark['data'])) {
        dark['requireMark'] += fxBase['base']['lang']([
            '<span>', '(', 'field', '[', fxApp['view']['langc']['prefix'] + dark['field'], ']', 'undefined', ')', '</span>'
        ]);
    }
    // 加载皮肤
    dark['skins'] = fxView['machine']['caller'](['material', 'elem', dark['type'], 'skin']);
    return dark;
};