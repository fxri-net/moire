// 初始化环境
const path = require('path');
const glob = require("glob");
const fs = require("fs");
// 初始化变量
var tray = {};
tray['argv'] = process.argv;
switch (tray['argv'][2]) {
    default:
        // 未知
        return;
    case '1':
        // 合并文件
        tray['chain'] = [
            // 入口文件
            './moire.base.js',
            // 基础函数
            './base/method.js',
            // 基础架构
            './base/master.js',
            // 基础视图
            './view/master.js',
            // 门面视图
            './view/facade.js',
            // 视图物料
            ...glob.sync('./view/material/**/*.js'),
            // 视图模具
            ...glob.sync('./view/mould/**/*.js'),
        ];
        break;
    case '2':
        // 添加版权
        tray['chain'] = [
            // 基础函数
            './moire.copy.js',
            // 完整框架
            './moire.min.js',
        ];
        break;
}
// 读取文件
tray['data'] = '';
tray['chain'].forEach(function(value, index) {
    tray['data'] += index != 0 ? '\n' : '';
    tray['data'] += fs.readFileSync(value);
});
// 写入文件
tray['path'] = path.join(__dirname, './../moire.min.js');
fs.writeFileSync(tray['path'], tray['data']);