interface IParsersStorage {
    add: Function,
    parsers: {
        [key: string]: Function
    }
}

const ParsersStorage: IParsersStorage = {
    add(Class: Function) {
        this.parsers[Class.name] = Class;
    },
    parsers : { }
}

export default ParsersStorage;