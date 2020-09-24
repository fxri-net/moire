/**
 * 初始化变量
 */
var fxApp = {
    /**
     * 环境
     */
    'env': {}
};
fxApp['env']['script'] = document.getElementsByTagName('script');
fxApp['env']['script'] = fxApp['env']['script'][fxApp['env']['script'].length - 1].src;
fxApp['env']['script'] = fxApp['env']['script'].replace(/\/[^\/]*$/, '');

/**
 * 加载框架
 */
document.write('<script type="text/javascript" src="' + fxApp['env']['script'] + '/base/method.js"></script>');
document.write('<script type="text/javascript" src="' + fxApp['env']['script'] + '/base/master.js"></script>');
document.write('<script type="text/javascript" src="' + fxApp['env']['script'] + '/view/master.js"></script>');