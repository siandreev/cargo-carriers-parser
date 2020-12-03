import IRequest from "parsers/types/IRequest";
import Parser from "parsers/Parser";

interface IParsersStorage {
    add: Function,
    parsers: {
        [key: string]: new (request: IRequest) => Parser
    }
}

const ParsersStorage: IParsersStorage = {
    add(Class: Function) {
        this.parsers[Class.name] = Class;
    },
    parsers : { }
}

export default ParsersStorage;