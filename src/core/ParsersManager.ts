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

    async calculate(callback: (result: IResponse) => void) {
        const promises: Array<Promise<Array<IResponse>>> = this.parsers.map(parser => parser.calculate());
        promises.forEach(promise => promise
            .then((results: Array<IResponse>) => {
                results.forEach(result  =>
                    callback(result)
                );
            })
            .catch(e => console.log(e))
        );

        const result = await Promise.allSettled(promises);
        return;
    }
}

export default ParsersManager;