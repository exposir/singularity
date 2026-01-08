/**
 * - [INPUT]: Unsorted number array
 * - [OUTPUT]: Sorted number array
 * - [POS]: Performance Playground / Algorithm Demo
 * - [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

/**
 * Dual-Pivot Quicksort implementation.
 * 
 * 哥，必须讲清楚：在现代 JS 引擎(V8)中，原生的 `Array.prototype.sort` 通常是 C++ 实现的 Timsort，
 * 极度优化且贴合底层。纯 JS 实现的排序在绝大多数通用场景下无法超越原生方法。
 * 
 * 但为了追求算法层面的极致，这里实现了 Vladimir Yaroslavskiy 的 Dual-Pivot Quicksort。
 * 这是快速排序的究极进化体，在 JDK 7+ 中被用作默认的基础类型排序算法。
 * 
 * 相比传统单轴快排 (Legacy Single-Pivot)，它通过选取两个基准点 (P1, P2) 将数据分为三路 (Left < P1 < Middle < P2 < Right)。
 * 这种三路划分不仅大幅减少了递归高度，其连续的内存扫描模式更对现代 CPU 的 L1/L2 Cache 极度友好，
 * 从而在理论和实战中都获得了超越传统快排的性能表现。
 * 
 * Performance Note:
 * 对于 TypedArrays (Int32Array等)，Radix Sort 可能更快。
 * 对于普通 Arrays，原生 sort 最快。
 * 此代码主要用于展示算法美学与复杂控制流的优雅处理。
 */

export function dualPivotQuickSort(arr: number[]): number[] {
    sort(arr, 0, arr.length - 1);
    return arr;
}

function sort(a: number[], left: number, right: number): void {
    if (right - left < 27) { // Insertion sort for small arrays
        for (let i = left + 1; i <= right; i++) {
            const temp = a[i];
            let j = i;
            while (j > left && a[j - 1] > temp) {
                a[j] = a[j - 1];
                j--;
            }
            a[j] = temp;
        }
        return;
    }

    const div = Math.floor((right - left) / 7);
    let m1 = left + div;
    let m2 = right - div;
    let m3 = left + Math.floor((right - left) / 2); // Middleware pivot candidate

    // Media-of-3 swap to pick pivots? Actually use 5 points for better pivots
    // Cheap approximation
    if (a[m1] > a[m2]) swap(a, m1, m2);
    if (a[m1] > a[m3]) swap(a, m1, m3);
    if (a[m2] > a[m3]) swap(a, m2, m3);
    
    // Pivots
    const pivot1 = a[m1];
    const pivot2 = a[m2];
    
    // Move pivots to ends to avoid bounds checks
    // Actually standard Dual Pivot uses a[left] and a[right] as pivots.
    // Let's swap strictly to allow standard algorithm structure
    swap(a, m1, left);
    swap(a, m2, right);

    const p1 = a[left];
    const p2 = a[right];
    
    // P1 must be less than P2
    if (p1 > p2) {
        swap(a, left, right);
        // Correct pivots after swap
        // No, p1 and p2 local vars are just values.
        // We need to ensure a[left] <= a[right] for the algorithm invariant.
        // But we just swapped. If p1 > p2, then a[left] > a[right].
        // So we swap them.
        // Re-read pivots from array to be safe or just swap values.
    } 
    // Standard re-implementation with correct indices:

    // 1. Ensure a[left] <= a[right]
    if (a[left] > a[right]) swap(a, left, right);
    
    const pivotLeft = a[left];
    const pivotRight = a[right];
    
    let l = left + 1;
    let k = left + 1;
    let g = right - 1;
    
    while (k <= g) {
        if (a[k] < pivotLeft) {
            swap(a, k, l);
            l++;
        } else if (a[k] > pivotRight) {
            while (k < g && a[g] > pivotRight) {
                g--;
            }
            swap(a, k, g);
            g--;
            
            if (a[k] < pivotLeft) {
                swap(a, k, l);
                l++;
            }
        }
        k++;
    }
    
    l--;
    g++;
    
    swap(a, left, l);
    swap(a, right, g);
    
    sort(a, left, l - 1);
    sort(a, l + 1, g - 1);
    sort(a, g + 1, right);
}

function swap(arr: number[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
