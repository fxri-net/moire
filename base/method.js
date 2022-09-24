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
 * 创建本地存储
 */
var fxLocal = new function() { return isObject(fxLocal) ? fxLocal : {}; };

/**
 * 设置数据
 */
fxLocal['set'] = function() {
    // 初始化变量
    var key = isSet(arguments[0]) ? arguments[0] : null,
        value = isSet(arguments[1]) ? arguments[1] : null;
    return localStorage.setItem(key, JSON.stringify(value));
};

/**
 * 获取数据
 */
fxLocal['get'] = function() {
    // 初始化变量
    var key = isSet(arguments[0]) ? arguments[0] : null;
    return JSON.parse(localStorage.getItem(key));
};

/**
 * 移除数据
 */
fxLocal['remove'] = function() {
    // 初始化变量
    var key = isSet(arguments[0]) ? arguments[0] : null;
    return localStorage.removeItem(key);
};

/**
 * 清除数据
 */
fxLocal['clear'] = function() {
    // 初始化变量
    return localStorage.clear();
};

/**
 * 创建会话存储
 */
var fxSession = new function() { return isObject(fxSession) ? fxSession : {}; };

/**
 * 设置数据
 */
fxSession['set'] = function() {
    // 初始化变量
    var key = isSet(arguments[0]) ? arguments[0] : null,
        value = isSet(arguments[1]) ? arguments[1] : null;
    return sessionStorage.setItem(key, JSON.stringify(value));
};

/**
 * 获取数据
 */
fxSession['get'] = function() {
    // 初始化变量
    var key = isSet(arguments[0]) ? arguments[0] : null;
    return JSON.parse(sessionStorage.getItem(key));
};

/**
 * 移除数据
 */
fxSession['remove'] = function() {
    // 初始化变量
    var key = isSet(arguments[0]) ? arguments[0] : null;
    return sessionStorage.removeItem(key);
};

/**
 * 清除数据
 */
fxSession['clear'] = function() {
    // 初始化变量
    return sessionStorage.clear();
};

/**
 * 校验Json
 */
function isJson(str) {
    // 初始化变量
    try {
        var obj = JSON.parse(str);
        return typeof obj == 'object' && obj;
    } catch (e) {}
    return false;
}

/**
 * 校验空值
 */
function isEmpty(data) {
    // 初始化变量
    switch (Object.prototype.toString.call(data)) {
        case '[object Null]':
        case '[object Undefined]':
            // NULL-未定义
            return true;
        case '[object Boolean]':
        case '[object Number]':
            // 布尔-数字
            return !data;
        case '[object String]':
            // 字符串
            data = parseInt(data) + '' == data ? parseInt(data) : data;
            if (typeof data === 'number') {
                data = !data;
            } else {
                data = !data.length;
            }
            return data;
        case '[object Array]':
            // 数组
            return !data.length;
        case '[object Object]':
            // 对象
            return !Object.keys(data).length;
    }
    return false;
}

/**
 * 校验UNDEFINED
 */
function isUndefined(data) {
    // 初始化变量
    return data === undefined;
}

/**
 * 校验NULL
 */
function isNull(data) {
    // 初始化变量
    return data === null;
}

/**
 * 校验变量
 */
function isSet(data) {
    // 初始化变量
    return data !== null && data !== undefined;
}

/**
 * 校验空白
 */
function isBlank(data) {
    // 初始化变量
    return !isSet(data) || data === '';
}

/**
 * 校验数组
 */
function isArray(data) {
    // 初始化变量
    return Array.isArray(data);
}

/**
 * 校验对象
 */
function isObject(data) {
    // 初始化变量
    return $.isPlainObject(data) || Object.prototype.toString.call(data) == '[object Arguments]';
}

/**
 * 校验数组或对象
 */
function isAorO(data) {
    // 初始化变量
    return isArray(data) || isObject(data);
}

/**
 * 校验元素
 */
function isHtml(data) {
    var elem = document.createElement('div');
    try {
        if (data instanceof $) return true;
        elem.appendChild(data.cloneNode(true));
        return data.nodeType == 1;
    } catch (e) {}
    return data == window || data == document;
}

/**
 * 校验方法
 */
function isFunction(data) {
    // 初始化变量
    return typeof data === 'function';
}

/**
 * 校验字符串
 */
function isString(data) {
    // 初始化变量
    return typeof(data) == 'string';
}

/**
 * 校验数字
 */
function isNumeric(data) {
    // 初始化变量
    switch (typeof data) {
        case 'string':
            // 字符串
        case 'number':
            // 数值
            return parseFloat(data) == data && !isNaN(data);
    }
    return false;
}

/**
 * 校验手机
 */
function isMobile(data) {
    // 初始化变量
    var reg = /^1\d{10}$/;
    return reg.test(data);
}

/**
 * 校验邮箱
 */
function isEmail(data) {
    // 初始化变量
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    return reg.test(data);
}

/**
 * 校验金额
 */
function isMoney(data) {
    // 初始化变量
    var reg = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
    return reg.test(data);
}

/**
 * 历史-替换当前URL
 */
if (!isFunction(history.replaceState)) {
    history.replaceState = function() {}
}

/**
 * 对象-合并元素
 */
if (!isFunction(Object.assign)) {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

/**
 * 对象-获取键名
 */
if (!isFunction(Object.keys)) {
    Object.keys = (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;
        return function(obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');
            var result = [];
            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) result.push(prop);
            }
            if (hasDontEnumBug) {
                for (var i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                }
            }
            return result;
        }
    })();
};

/**
 * 对象-获取键值
 */
if (!isFunction(Object.values)) {
    Object.values = function(obj) {
        if (obj !== Object(obj))
            throw new TypeError('Object.values called on a non-object');
        var val = [],
            key;
        for (key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                val.push(obj[key]);
            }
        }
        return val;
    }
}