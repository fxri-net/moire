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
 * 校验Json
 */
function isJson(str) {
    // 初始化变量
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
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
    return data === undefined ? true : false;
}

/**
 * 校验NULL
 */
function isNull(data) {
    // 初始化变量
    return data === null || data === undefined ? true : false;
}

/**
 * 校验空白
 */
function isBlank(data) {
    // 初始化变量
    return isNull(data) || data === '' ? true : false;
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
    switch (Object.prototype.toString.call(data)) {
        case '[object Object]':
            // 对象
        case '[object Arguments]':
            // 类数组对象
            return true;
    }
    return false;
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
    return typeof data === 'number' && !isNaN(data);
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
 * 初始化未知方法
 */
if (!isFunction(history.replaceState)) {
    history.replaceState = function() {}
}