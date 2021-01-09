export default function<T>(arr: Array<T>, size: number):Array<Array<T>> {
    return Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
}
