import ParsersStorage from "./ParsersStorage";
import Parser from "parsers/Parser";

class ParsersFactory {
    constructor() {
    }

    createParser(parserName: string): Parser {
        return ParsersStorage.parsers[parserName]();
    }

    createAllParsers(): Array<Parser> {
        const parsersArray = [];
        for (let key  in ParsersStorage.parsers) {
            parsersArray.push(ParsersStorage.parsers[key]())
        }
        return parsersArray;
    }
}