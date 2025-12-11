/**
 * Layer Intelligence - Performance Utilities
 * Debounce and throttle functions for efficient auditing
 */

/**
 * Creates a debounced function that delays invoking the provided function
 * until after `wait` milliseconds have elapsed since the last time it was invoked.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function debounced(...args: Parameters<T>): void {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, wait);
    };
}

/**
 * Creates a throttled function that only invokes the provided function
 * at most once per every `limit` milliseconds.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;
    let lastArgs: Parameters<T> | null = null;

    return function throttled(...args: Parameters<T>): void {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
                if (lastArgs !== null) {
                    func(...lastArgs);
                    lastArgs = null;
                }
            }, limit);
        } else {
            lastArgs = args;
        }
    };
}

/**
 * Simple memoization for functions with a single argument
 */
export function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
    const cache = new Map<T, R>();

    return function memoized(arg: T): R {
        if (cache.has(arg)) {
            return cache.get(arg)!;
        }

        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
}

/**
 * Memoization with cache size limit (LRU-like behavior)
 */
export function memoizeWithLimit<T extends string | number, R>(
    fn: (arg: T) => R,
    maxSize: number = 100
): (arg: T) => R {
    const cache = new Map<T, R>();

    return function memoized(arg: T): R {
        if (cache.has(arg)) {
            // Move to end (most recently used)
            const value = cache.get(arg)!;
            cache.delete(arg);
            cache.set(arg, value);
            return value;
        }

        const result = fn(arg);

        // Evict oldest if at capacity
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            if (firstKey !== undefined) {
                cache.delete(firstKey);
            }
        }

        cache.set(arg, result);
        return result;
    };
}

/**
 * Process items in batches to avoid blocking the main thread
 */
export async function processBatched<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 50,
    delayMs: number = 0
): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(processor));
        results.push(...batchResults);

        // Allow UI to update between batches
        if (delayMs > 0 && i + batchSize < items.length) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }

    return results;
}

/**
 * Measure execution time of an async function
 */
export async function measureTime<T>(
    fn: () => Promise<T>
): Promise<{ result: T; durationMs: number }> {
    const start = performance.now();
    const result = await fn();
    const durationMs = performance.now() - start;
    return { result, durationMs };
}
