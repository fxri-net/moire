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
 * 云纹物料-模板-工具
 */
fxView['machine']['deployer'](['material', 'template', 'tool'], {
    'tips': '',
    'tips-text': '<textarea readonly></textarea>',
    'view-search': '' +
        '<button moire-cell="submit" class="layui-btn moire-bg-green-light moire-submit" lay-filter="moire-submit" lay-submit>search</button>' +
        '<button moire-cell="reset" class="layui-btn layui-btn-primary moire-reset" type="button">reset</button>' +
        '<button moire-cell="clear" class="layui-btn layui-btn-primary moire-clean" type="button">clear</button>',
    'view-edit': '' +
        '<button moire-cell="submit" class="layui-btn layui-btn-sm moire-bg-green-light moire-submit" lay-filter="moire-submit" lay-submit>save</button>' +
        '<button moire-cell="reset" class="layui-btn layui-btn-sm layui-btn-primary moire-reset" type="button">reset</button>' +
        '<button moire-cell="clear" class="layui-btn layui-btn-sm layui-btn-primary moire-clean" type="button">clear</button>' +
        '<button moire-cell="close" class="layui-btn layui-btn-sm layui-btn-danger moire-bg-red-light moire-close" type="button">close</button>',
    'table-head': '' +
        '<button moire-cell="add" class="layui-btn layui-btn-sm moire-bg-green-light" lay-event="add">add</button>' +
        '<button moire-cell="delete" class="layui-btn layui-btn-sm layui-btn-danger moire-bg-red-light" lay-event="delete">delete</button>' +
        '<button moire-cell="import" class="layui-btn layui-btn-sm layui-btn-primary" lay-event="import">import</button>' +
        '<button moire-cell="export" class="layui-btn layui-btn-sm layui-btn-primary" lay-event="export">export</button>' +
        '<button moire-cell="upload" class="layui-btn layui-btn-sm layui-btn-primary" lay-event="upload">upload</button>' +
        '<button moire-cell="download" class="layui-btn layui-btn-sm layui-btn-primary" lay-event="download">download</button>' +
        '<button moire-cell="link" class="layui-btn layui-btn-sm layui-btn-primary" lay-event="link">link</button>',
    'table-cell': '' +
        '<a moire-cell="view" class="layui-btn layui-btn-xs layui-btn-primary" lay-event="view">view</a>' +
        '<a moire-cell="edit" class="layui-btn layui-btn-xs moire-bg-green-light" lay-event="edit">edit</a>' +
        '<a moire-cell="delete" class="layui-btn layui-btn-xs layui-btn-danger moire-bg-red-light" lay-event="delete">delete</a>' +
        '<a moire-cell="link" class="layui-btn layui-btn-xs layui-btn-primary" lay-event="link">link</a>',
});