// 初始化环境
const path = require('path');
const glob = require("glob");
const fs = require("fs");
// 初始化变量
var tray = {};
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
// 读取文件
tray['data'] = '';
tray['chain'].forEach(function(value, index) {
    tray['data'] += '\n' + fs.readFileSync(value);
});
// 写入文件
tray['path'] = path.join(__dirname, './../moire.min.js');
fs.writeFileSync(tray['path'], tray['data']);