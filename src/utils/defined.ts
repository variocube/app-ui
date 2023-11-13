
export function defined<T>(x: T | undefined): x is T {
    return x !== undefined;
}