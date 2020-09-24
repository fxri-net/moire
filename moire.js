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
 * 初始化变量
 */
var fxApp = {
    /**
     * 环境
     */
    'env': {
        /**
         * 版本
         */
        'version': 'v0.2'
    }
};
fxApp['env']['script'] = document.getElementsByTagName('script');
fxApp['env']['script'] = fxApp['env']['script'][fxApp['env']['script'].length - 1].src;
fxApp['env']['script'] = fxApp['env']['script'].replace(/\/[^\/]*$/, '');

/**
 * 加载框架
 */
document.write('<script type="text/javascript" src="' + fxApp['env']['script'] + '/base/method.js?version=' + fxApp['env']['version'] + '"></script>');
document.write('<script type="text/javascript" src="' + fxApp['env']['script'] + '/base/master.js?version=' + fxApp['env']['version'] + '"></script>');
document.write('<script type="text/javascript" src="' + fxApp['env']['script'] + '/view/master.js?version=' + fxApp['env']['version'] + '"></script>');