import Parser from "core/parsers/Parser";
import {IBaikalsrApi} from "./IBaikalsr";
import {IRequest, IResponse} from "types";
import webClient from "libs/axios/webClient";
import {io} from "libs/io";
import iterateOnObject from "libs/iterateOnObject";
import querystring from "querystring";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";

class Baikalsr extends Parser {
    protected api: IBaikalsrApi;
    constructor(request: IRequest) {
        super(request)

        this.api = {
            url: "https://spb.baikalsr.ru/json/api_calculator.json",
            urlGetCityId: "https://api.baikalsr.ru/v1/fias/citiesfull"
        }
    }

    async calculate(): Promise<Array<IResponse>> {
        const data = await this.sendRequest();

        const result: IResponse = {
            company: "Байкал сервис",
            img: "baikalsr_logo.png",
            url: "https://spb.baikalsr.ru/tools/calculator/",
            type: "Авто",
            cost: data.price.int,
            fullCost: data.total.int,
            minTerm: data.transit.int,
            maxTerm: data.transit.int,
            comment: [
                "Стоимость доставки от отправителя до терминала: " +  data.from.delivery_full.int,
                "Стоимость доставки от терминала до получателя: " + data.to.delivery_incity.int,
                "Стоимость страхования: " + data.insurance.int,
                "Стоимость может зависеть от времени забора груза; рассчитана для забора днем и доставки утром"
            ]
        };
        return [result];

    }

    protected async createFormData(): Promise<string> {
        const request: any = await io.readFileAsJSON(__dirname,'./request.json', 'utf8');

        const cityFromId: number = await this.getCityId(this.cityFrom);
        const cityToId: number = await this.getCityId(this.cityTo);

        request.from.guid = cityFromId;
        request.from.title = this.cityFrom;
        request.to.guid = cityToId;
        request.to.title = this.cityTo;

        request.cargo[0].units = this.cargo.units;
        request.cargo[0].length = this.cargo.length;
        request.cargo[0].width = this.cargo.width;
        request.cargo[0].height = this.cargo.height;
        request.cargo[0].volume = this.cargo.length * this.cargo.width * this.cargo.height;
        request.cargo[0].weight = this.cargo.weight;
        request.cargo[0].oversized = Number(this.cargo.weight >= 1000 ||
            (this.cargo.length + this.cargo.width + this.cargo.height >= 4));

        const parsed: any = {};
        for (let elem of iterateOnObject(request)) {
            parsed[elem.path] = elem.value;
        }

        return querystring.stringify(parsed);
    }

    private async getCityId(cityName: string): Promise<number> {
        const response = await webClient.get(this.api.urlGetCityId, {
            params : {text: cityName}
        });
        return response.data[0].guid;
    }
}

ParsersStorage.add(Baikalsr);

export default Baikalsr;