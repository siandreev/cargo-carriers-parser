import { ICargo, IRequest, IResponse, IParserApi} from "parsers/types";

abstract class Parser implements IRequest{
    public cityTo: string;
    public cityFrom: string;
    public cargo: ICargo;
    protected api: IParserApi;

    protected constructor(request: IRequest) {
        Object.assign(this, request);
    }

    public abstract async calculate(): Promise<Array<IResponse>>
}

export default Parser;