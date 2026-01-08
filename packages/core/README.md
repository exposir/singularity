# @singularity/core

> 天生简单，天生可追踪的状态管理核心

## 安装

```bash
pnpm add @singularity/core
```

## 快速开始

```typescript
import { atom, batch } from "@singularity/core";

// 创建原子状态
const count = atom(0);

// 读取
console.log(count.get()); // 0

// 写入
count.set(1);
count.set((prev) => prev + 1); // 函数式更新

// 订阅变化
const unsubscribe = count.subscribe(() => {
  console.log("count changed:", count.get());
});

// 批量更新（只触发一次通知）
batch(() => {
  count.set(10);
  count.set(20);
});

// 时间旅行（开发模式）
console.log(count.history()); // 查看变更历史
count.restore(0); // 恢复到某个历史状态
```

## API

### `atom<T>(initial: T)`

创建一个原子状态。

| 方法             | 说明                         |
| :--------------- | :--------------------------- |
| `get()`          | 获取当前值                   |
| `set(value)`     | 设置新值，支持函数式更新     |
| `subscribe(fn)`  | 订阅变化，返回取消订阅函数   |
| `history()`      | 获取变更历史（仅开发模式）   |
| `restore(index)` | 恢复到历史状态（仅开发模式） |

### `batch(fn)`

批量执行多个状态更新，结束后统一触发通知。

### `computed<T>(read: () => T)`

创建一个派生状态，自动追踪依赖并缓存结果。

```typescript
const count = atom(0);
const double = computed(() => count.get() * 2);

console.log(double.get()); // 0
count.set(5);
console.log(double.get()); // 10
```

| 方法            | 说明                           |
| :-------------- | :----------------------------- |
| `get()`         | 获取派生值（惰性计算，有缓存） |
| `subscribe(fn)` | 订阅变化                       |

### `effect(fn)`

创建一个副作用，依赖变化时自动重新执行。

```typescript
const count = atom(0);

const e = effect(() => {
  console.log("count is", count.get());
  return () => console.log("cleanup");
});

count.set(1); // 输出: cleanup, count is 1

e.dispose(); // 停止监听
```

| 方法        | 说明                   |
| :---------- | :--------------------- |
| `dispose()` | 停止监听并执行 cleanup |

## License

MIT
