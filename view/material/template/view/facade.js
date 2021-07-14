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
 * 云纹物料-模板-视图
 */
fxView['machine']['deployer'](['material', 'template', 'view'], {
    'search': '' +
        '<form class="layui-form layui-elem-quote layui-col-space5 moire-clear moire-search"></form>',
    'table': '' +
        '<div id="moire-table" class="moire-table" lay-filter="moire-table"></div>',
    'view': '' +
        '<form class="layui-form moire-view">' +
        '<div class="layui-table moire-clear moire-table">' +
        '</div>' +
        '<div class="moire-buttons">' +
        '<div class="moire-button"></div>' +
        '<div class="moire-button"></div>' +
        '</div>' +
        '</form>',
    'video': '<video class="video-js media-video"></video>',
    'image': '<img class="media-image">',
});