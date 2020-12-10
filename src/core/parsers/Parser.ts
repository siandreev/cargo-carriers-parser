import { ICargo, IRequest, IResponse, IParserApi} from "types";
import webClient from "libs/axios/webClient";
import {io} from "libs/io";
import round from "libs/round";

abstract class Parser implements IRequest{
    public cityTo: string;
    public cityFrom: string;
    public cargo: ICargo;
    protected api: IParserApi;
    protected cacheLifeTime?: number;

    protected constructor(request: IRequest) {
        Object.assign(this, request);
        this.cargo.volume = round(this.cargo.length * this.cargo.width * this.cargo.height);
    }

    protected async sendRequest(...args: any) {
        try {
            const body = await this.createFormData(...args);
            const response: any = await webClient.post(this.api.url, body, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json, text/javascript, */*; q=0.01"
                }
            });
            return  response.data;
        }

        catch (e) {
            console.log(e)
        }
    }

    protected abstract createFormData(...args: any): Promise<string> | string | void

    public abstract async calculate(): Promise<Array<IResponse>>

    protected mustRefresh(date: number): boolean {
        return (Date.now() - date) > this.cacheLifeTime;
    }

    protected async getCitiesList(cityName: string, dirname: string, webClient: any): Promise<any[]> {
        let citiesInfo: any =
            await io.readFileAsJSON(dirname,'./codesDictionary.json', 'utf8');

        if (this.mustRefresh(citiesInfo.timestamp)) {
            const response = await webClient.get(this.api.urlGetCityId);
            citiesInfo = {
                timestamp: Date.now(),
                cities: response.data
            };
            await io.writeFile(dirname, './codesDictionary.json', JSON.stringify(citiesInfo))
        }

        return citiesInfo.cities;
    }
}

export default Parser;