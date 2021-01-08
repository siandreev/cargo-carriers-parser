import ParsersFactory from "core/ParsersFactory/ParsersFactory";
import Parser from "core/parsers/Parser";
import IRequest from "types/IRequest";
import IResponse from "types/IResponse";
import round from "libs/round";

class ParsersManager {
    private readonly parsers: Array<Parser>;

    constructor(request: IRequest) {
        const factory = new ParsersFactory(request);
        this.parsers = factory.createAllParsers();
    }

    public async calculate(callback: (result: IResponse) => void) {
        const promises: Array<Promise<Array<IResponse>>> = this.parsers.map(parser => parser.calculate());
        promises.forEach(promise => promise
            .then((results: Array<IResponse>) => {
                results.forEach(result  =>
                    callback(ParsersManager.roundResult(result))
                );
            })
            .catch(e => console.log(e))
        );

        await Promise.allSettled(promises);
        return;
    }

    private static roundResult(response: IResponse): IResponse {
        const rounded = Object.assign({}, response);
        rounded.cost = round(rounded.cost);
        rounded.fullCost = round(rounded.fullCost);
        return rounded;
    }
}

export default ParsersManager;
