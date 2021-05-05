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
 * 云纹模具-工具-窗口-服务
 */
// 配置天梯
fxView['machine']['deployer'](['rank'], {
    // 本身-编码
    'self.code': md5(window.location.href + fxBase['text']['mtime']()),
    // 本身-弹窗-窗口
    'self.layer.window': {},
    // 本身-弹窗-索引-列表
    'self.layer.index.list': [],
    // 本身-弹窗-索引-设置
    'self.layer.index.set': function() {
        // 初始化变量
        var dark = {
            // 索引
            0: null
        };
        dark = fxBase['param']['merge'](dark, arguments);
        if (!isArray(top.fxApp['rank']['self.layer.index.list']) || !isSet(dark[0])) return false;
        // 销毁索引
        fxApp['rank']['self.layer.index.destroy'](dark[0]);
        // 插入索引
        top.fxApp['rank']['self.layer.index.list'].unshift(dark[0]);
    },
    // 本身-弹窗-索引-销毁
    'self.layer.index.destroy': function() {
        // 初始化变量
        var dark = {
            // 索引
            0: null
        };
        dark = fxBase['param']['merge'](dark, arguments);
        if (!isArray(top.fxApp['rank']['self.layer.index.list']) || !isSet(dark[0])) return false;
        // 销毁索引
        dark['index'] = fxBase['param']['arraySearch'](dark[0], top.fxApp['rank']['self.layer.index.list']);
        if (false !== dark['index']) {
            top.fxApp['rank']['self.layer.index.list'].splice(dark['index'], 1);
        }
    },
    // 本身-弹窗-关闭
    'self.layer.close': function() {
        // 初始化变量
        var dark = {
            // 索引
            0: null
        };
        dark = fxBase['param']['merge'](dark, arguments);
        if (!isSet(dark[0])) return false;
        dark['data'] = fxBase['text']['explode']('-', dark[0]);
        dark['window'] = top.fxApp['rank']['self.layer.window'][dark['data'][1]];
        if (!isSet(dark['window'])) return false;
        // 销毁索引
        fxApp['rank']['self.layer.index.destroy'](dark[0]);
        // 关闭窗口
        switch (dark['data'][2]) {
            case 'layui':
                // Layui
                dark['window'].layui.layer.close(dark['data'][0]);
                break;
            case 'layx':
                // LayX
                dark['window'].layx.destroy(dark['data'][0]);
                break;
        }
    },
    // 起源-元素-表格-重载
    'parent.layui.table.reload': function() {
        // 初始化变量
        var dark = {
            // 表名
            0: null
        };
        dark = fxBase['param']['merge'](dark, arguments);
        if (!isSet(fxApp['rank']['parent.window']) || !isSet(dark[0])) return false;
        // 重载表格
        fxApp['rank']['parent.window'].layui.table.reload(dark[0]);
    }
}, fxApp);
// 配置窗口
top.fxApp['rank']['self.layer.window'][fxApp['rank']['self.code']] = window;
// 监听键盘
$(document).on('keydown', function(event) {
    // 关闭窗口
    if (event.keyCode == 27 && top.fxApp['rank']['self.layer.index.list'].length > 0) {
        fxApp['rank']['self.layer.close'](top.fxApp['rank']['self.layer.index.list'][0]);
    }
});