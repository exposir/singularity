# @singularity/react

> Singularity 的 React 适配器

## 安装

```bash
pnpm add @singularity/core @singularity/react
```

## 快速开始

```tsx
import { atom, computed } from "@singularity/core";
import { useAtom, useAtomValue } from "@singularity/react";

// 定义状态（可在组件外部）
const count = atom(0);
const double = computed(() => count.get() * 2);

function Counter() {
  // 读取状态
  const value = useAtom(count);
  const doubleValue = useAtomValue(double);

  return (
    <div>
      <button onClick={() => count.set((v) => v + 1)}>Count: {value}</button>
      <p>Double: {doubleValue}</p>
    </div>
  );
}
```

## API

### `useAtom<T>(atom: Atom<T>): T`

订阅 atom 并返回当前值，值变化时自动重渲染。

```tsx
const value = useAtom(count);
```

支持 selector：

```tsx
const name = useAtom(userAtom, (user) => user.name);
```

### `useAtomValue<T>(atom: Atom<T> | Computed<T>): T`

只读订阅，适用于 computed 值。

```tsx
const double = useAtomValue(doubleComputed);
```

## 特性

- ✅ 基于 `useSyncExternalStore`，无撕裂
- ✅ 支持 React 18 并发模式
- ✅ 支持 SSR
- ✅ 细粒度更新，只重渲染订阅了变化 atom 的组件

## License

MIT
