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
 * 云纹模具-工具-导出
 */
fxView['mould']['tool']['export'] = function() {
    // 初始化变量
    var dark = fxBase['param']['merge']({
        // 条数
        'limit': 100000
    }, fxView['shelf']['view']);
    var tray = {};
    dark = fxBase['param']['merge'](dark, arguments[0]);
    tray[dark['model']['key']] = [];
    // 检查配置
    if (!isSet(dark['api']['export'])) {
        return fxView['mould']['tool']['message']({ 'text': ['feature', 'not configured'] });
    }
    // 疏理数据
    if (!isArray(dark['param'])) {
        dark['param'] = [dark['param']];
    }
    // 提取数据
    $.each(dark['param'], function(key, value) {
        if (isNumeric(value) || isString(value)) {
            tray[dark['model']['key']].push(value);
        } else if (isObject(value) && isSet(value[dark['model']['key']])) {
            tray[dark['model']['key']].push(value[dark['model']['key']]);
        }
    });
    if (isEmpty(tray[dark['model']['key']]) && (!isObject(fxView['cache']['echo']['list']) || fxView['cache']['echo']['list']['extend']['total_count'] > dark['limit'])) {
        tray['message'] = '推荐将数据筛选至' + dark['limit'] + '条以内，数据过多将有可能导出失败';
        // 导出数据过多提示
        layui.layer.confirm(tray['message'], { 'title': false, 'closeBtn': false }, function(index) {
            // 关闭弹窗
            layui.layer.close(index);
            // 成功回调
            success();
        });
    } else {
        // 成功回调
        success();
    }
    // 成功回调
    function success() {
        // 获取参数
        tray['param'] = fxBase['param']['url']({
            'type': '2.1'
        });
        // 设置令牌
        tray['param']['base']['token'] = fxApp['user']['base']['token'];
        // 设置数据
        if (!isEmpty(tray[dark['model']['key']])) {
            tray['param']['data'][dark['model']['key']] = tray[dark['model']['key']];
        }
        // 设置条数
        tray['param']['base']['page'] = 1;
        tray['param']['base']['limit'] = -1;
        // 配置地址
        tray['url'] = fxBase['param']['url']({
            'type': '1.1',
            'url': dark['api']['export'],
            'param': tray['param']
        });
        window.open(tray['url']);
    }
};