function* iterateOnObject(object: Object): any {
    for (let key in object) {
        yield* recursiveIterator((object as any)[key], key);
    }

}

function* recursiveIterator(input: any, path: string): any {
    switch (typeof input) {
        case "object":
            if (Array.isArray(input)) {
                for (let i = 0; i < input.length; i++) {
                    yield* recursiveIterator(input[i], `${path}[${i}]`)
                }
            } else {
                for (let key in input) {
                    yield* recursiveIterator(input[key], `${path}[${key}]`);
                }
            }
            break;
        default:
            yield {value: input, path};
    }
}

function createGenerator(object: Object) {
    return iterateOnObject(object);
}

export default createGenerator;