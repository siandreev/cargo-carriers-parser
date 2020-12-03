import ParsersStorage from "./ParsersStorage";
import Parser from "parsers/Parser";
import IRequest from "parsers/types/IRequest";

class ParsersFactory {
    private readonly request: IRequest;

    constructor(request: IRequest) {
        this.request = request;
    }

    createParser(parserName: string ): Parser {
        return new ParsersStorage.parsers[parserName](this.request);
    }

    createAllParsers(): Array<Parser> {
        const parsersArray = [];
        for (let key  in ParsersStorage.parsers) {
            parsersArray.push(new ParsersStorage.parsers[key](this.request))
        }
        return parsersArray;
    }
}

export default ParsersFactory;