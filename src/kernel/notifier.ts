/**
 * 通知器
 * 统一收口消息出口，订阅者与外部实现同时收到通知
 */

import type { NoticeListener, Notify } from './types'

/** 通知器 */
export interface Notifier {
  /** 发出通知 */
  notify: Notify
  /** 订阅通知，返回退订函数 */
  subscribe(listener: NoticeListener): () => void
}

/**
 * 创建通知器
 * @param fallback 外部通知实现，缺省只分发给订阅者
 * @returns 通知器
 * @example createNotifier().notify({ message: '已保存' })
 */
export function createNotifier(fallback?: Notify): Notifier {
  const listeners = new Set<NoticeListener>()
  return {
    notify: (notice) => {
      fallback?.(notice)
      // 复制一份再分发，避免订阅者在回调里退订导致遍历错位
      for (const listener of [...listeners]) listener(notice)
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
