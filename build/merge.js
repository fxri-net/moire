// 初始化环境
const path = require('path');
const glob = require("glob");
const fs = require("fs");
// 初始化变量
var tray = {};
tray['argv'] = process.argv;
// 配置链条
tray['chain'] = {
    // 框架-合并文件
    '1.1': [
        // 入口文件
        './base/base.js',
        // 基础函数
        './base/method.js',
        // 基础架构
        './base/master.js',
        // 基础视图
        './view/master.js',
        // 门面视图
        './view/facade.js',
        // 输出文件
        './../moire.min.js',
    ],
    // 框架-添加版权
    '1.2': [
        // 基础函数
        './base/copy.js',
        // 基础框架
        './moire.min.js',
        // 输出文件
        './../moire.min.js',
    ],
    // 插件-合并文件
    '2.1': [
        // 视图物料
        ...glob.sync('./view/material/**/*.js'),
        // 视图模具
        ...glob.sync('./view/mould/**/*.js'),
        // 输出文件
        './../moire.plugin.min.js',
    ],
    // 插件-添加版权
    '2.2': [
        // 基础函数
        './base/copy.js',
        // 扩展插件
        './moire.plugin.min.js',
        // 输出文件
        './../moire.plugin.min.js',
    ],
};
// 加载链条
tray['chain'] = tray['chain'][tray['argv'][2]];
if (!Array.isArray(tray['chain'])) return;
tray['file'] = tray['chain'].pop();
// 读取文件
tray['data'] = '';
tray['chain'].forEach(function(value, index) {
    tray['data'] += index != 0 ? '\n' : '';
    tray['data'] += fs.readFileSync(value);
});
// 写入文件
tray['path'] = path.join(__dirname, tray['file']);
fs.writeFileSync(tray['path'], tray['data']);