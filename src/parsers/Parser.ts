import { ICargo, IRequest, IResponse, IParserApi} from "parsers/types";
import webClient from "core/axios/webClient";

abstract class Parser implements IRequest{
    public cityTo: string;
    public cityFrom: string;
    public cargo: ICargo;
    protected api: IParserApi;

    protected constructor(request: IRequest) {
        Object.assign(this, request);
    }

    protected async sendRequest(...args: any) {
        const body = await this.createFormData(...args);
        const response: any = await webClient.post(this.api.url, body, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36",
                "Origin": "https://glav-dostavka.ru",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": "https://glav-dostavka.ru/clients/calc/,",
                "Accept": "application/json, text/javascript, */*; q=0.01"
            }
        });
        return  response.data;
    }

    protected abstract createFormData(...args: any): Promise<string> | string | void

    public abstract async calculate(): Promise<Array<IResponse>>
}

export default Parser;