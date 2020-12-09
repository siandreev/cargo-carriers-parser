import ParsersFactory from "core/ParsersFactory/ParsersFactory";
import Parser from "core/parsers/Parser";
import IRequest from "types/IRequest";
import IResponse from "types/IResponse";

class ParsersManager {
    private readonly parsers: Array<Parser>;

    constructor(request: IRequest) {
        const factory = new ParsersFactory(request);
        this.parsers = factory.createAllParsers();
    }

    calculate(processingCallback: (result: IResponse) => void, doneCallback: () => void) {
        const promises: Array<Promise<Array<IResponse>>> = this.parsers.map(parser => parser.calculate());
        promises.forEach(promise => promise
            .then((results: Array<IResponse>) => {
                results.forEach(result  =>
                    processingCallback(result)
                );
            })
            .catch(e => console.log(e))
        );

        Promise.allSettled(promises).finally(() =>
            doneCallback()
        );
    }
}

export default ParsersManager;