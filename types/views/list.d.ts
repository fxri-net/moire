/**
 * 列表装配
 * 纯装配负责列归一、排序与分页切片，渲染只做 DOM 组装与适配层增强
 */
import type { UiAdapter } from '../adapters/layui';
import type { Translate } from '../i18n';
import type { ListSchema } from '../schema';
import type { ListAssembler, ListAssembly, ListQuery } from './types';
/**
 * 装配列表
 * 先归一列与排序，再切片分页；页码越界时钳制到合法区间，空数据固定为第 1 页
 * @param schema 列表声明
 * @param query 列表查询
 * @returns 列表装配结果
 * @example assembleList({ columns: [{ name: 'id' }], rows, limit: 20 }, { page: 2 })
 */
export declare function assembleList(schema: ListSchema, query?: ListQuery): ListAssembly;
/**
 * 创建列表装配器
 * @param ui 界面适配，缺省不做控件增强
 * @param translate 取词条函数
 * @returns 列表装配器
 * @example const list = createListAssembler(ui, i18n.t)
 */
export declare function createListAssembler(ui: UiAdapter | undefined, translate: Translate): ListAssembler;
/**
 * 读取选中行的主键
 * 只返回已勾选且主键非空的行，供工具层直接使用
 * @param elem 列表根元素
 * @returns 主键集合
 * @example readSelection(document.querySelector('.moire-list'))
 */
export declare function readSelection(elem: Element): readonly string[];
