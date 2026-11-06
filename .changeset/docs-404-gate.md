---
'@fxri/moire': patch
---

- 优化：文档站校验补 404 两条断言（`search: false`、`sitemap.transformItems`），并在构建后核验产物
- 修复：产物断言改为从 `404.md` 读取一级标题比对搜索索引，避免改标题后检查静默失效
- 修复：产物断言步骤改为显式经 node 执行，避免 Linux 上因缺执行位报 `EACCES`
