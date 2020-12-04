import Parser from "parsers/Parser";
import {IRequest, IResponse} from "parsers/types";
import {IEnegriaApi, IEnegriaCitiesInfo} from "./IEnegria";
import io from "core/libs/io";
import webClient from "core/axios/webClient";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";


class Energia extends Parser {
    private cacheLifeTime: number = 24 * 60 * 60 * 1000;
    protected api: IEnegriaApi;
    constructor(request: IRequest) {
        super(request);
        this.api = {
            url: "https://api2.nrg-tk.ru/v2/price",
            urlGetCitiesList: "https://api2.nrg-tk.ru/v2/cities"
        };
    }

    async calculate(): Promise<Array<IResponse>> {
        const data = await this.sendRequest();

        const result = [];

        for (let transfer of data.transfer) {
            const terms = transfer.interval.split(" ")[0];
            const resp = {
                company: "Энергия",
                img: "energia_logo.PNG",
                url: "https://nrg-tk.ru/client/calculator/",
                type: transfer.type,
                cost: transfer.price,
                fullCost: transfer.price + data.request.price + data.delivery.price,
                minTerm: terms.split("-")[0],
                maxTerm: terms.split("-")[1] || terms.split("-")[0],
                comment: [
                    "Стоимость доставки ототправителя до терминала: " + data.request.price,
                    "Стоимость доставки от терминала до получателя: " + data.delivery.price
                ]
            };
            if (transfer.oversize?.price > 0) {
                resp.comment.push("Стоимость доставки может быть увеличена (из-за превышения габаритов и/или большой массы груза) до: " + transfer.oversize.price);
            }

            result.push(resp);
        }

        return result;
    }

    protected async createFormData(): Promise<string> {
        const request: any = {
            cover: 0,
            idCurrency: 1,
            idCityFrom: await this.getCityId(this.cityFrom),
            idCityTo: await this.getCityId(this.cityTo),
            declaredCargoPrice: 1,
            items: [],
            CityFromServices: []
        }

        for (let i = 0; i < this.cargo.units; i++) {
            request.items.push({
                length: this.cargo.length,
                width: this.cargo.width,
                height: this.cargo.height,
                weight: this.cargo.weight
            });
        }

        return JSON.stringify(request);
    }

    private async getCityId(name: string): Promise<number> {
        const cityList = await this.getCitiesDictionary();
        return cityList.find(city => city.name === name)?.id;
    }

    private async getCitiesDictionary(): Promise<Array<any>> {
        let citiesInfo: IEnegriaCitiesInfo =
            await io.readFileAsJSON(__dirname,'./codesDictionary.json', 'utf8') as IEnegriaCitiesInfo;

        if (this.mustRefresh(citiesInfo.timestamp)) {
            const response = await webClient.get(this.api.urlGetCitiesList);
            citiesInfo = {
                timestamp: Date.now(),
                cityList: response.data.cityList
            };
            await io.writeFile(__dirname, './codesDictionary.json', JSON.stringify(citiesInfo))
        }

        return citiesInfo.cityList;
    }

    private mustRefresh(date: number):boolean {
        return (Date.now() - date) > this.cacheLifeTime;
    }
}

ParsersStorage.add(Energia);

export default Energia;