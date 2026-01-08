/**
 * [INPUT]: 依赖 ./atom, ./batch
 * [OUTPUT]: 对外提供 atom, Atom, batch
 * [POS]: @singularity/core 的入口文件，统一导出所有公共 API
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export { atom, type Atom } from './atom';
export { batch } from './batch';
