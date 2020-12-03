import ParsersFactory from "core/ParsersFactory/ParsersFactory";
import Parser from "parsers/Parser";
import IRequest from "parsers/types/IRequest";
import IResponse from "parsers/types/IResponse";

class ParsersManager {
    private readonly parsers: Array<Parser>;

    constructor(request: IRequest) {
        const factory = new ParsersFactory(request);
        this.parsers = factory.createAllParsers();
    }

    calculate(callback: Function) {
        const promises: Array<Promise<Array<IResponse>>> = this.parsers.map(parser => parser.calculate());
        promises.forEach(promise => promise
            .then((results: Array<IResponse>) => {
                results.forEach(result  =>
                    callback(
                        {status: "progress", result}
                    )
                );
            })
            .catch(e => console.log(e))
        );
        Promise.all(promises).finally(() =>
            callback(
                {status: "done"}
            )
        );
    }
}

export default ParsersManager;