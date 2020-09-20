/**
 * 初始化变量
 */
var fxApp = {};
fxApp['script'] = document.getElementsByTagName('script');
fxApp['root'] = fxApp['script'][fxApp['script'].length - 1].src;
fxApp['root'] = fxApp['root'].replace(/^.+:\/{2,}[^\/]+\/([^\?]+)\??.*$/, '\/$1');
fxApp['root'] = fxApp['root'].replace(/^(.+)\/.*$/, '$1');

/**
 * 加载框架
 */
document.write('<script type="text/javascript" src="' + fxApp['root'] + '/base/method.js"></script>');
document.write('<script type="text/javascript" src="' + fxApp['root'] + '/base/master.js"></script>');
document.write('<script type="text/javascript" src="' + fxApp['root'] + '/view/master.js"></script>');