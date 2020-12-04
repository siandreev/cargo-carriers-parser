import {
    IDelllinDeliveryType,
    DellineAutoExpressDelivery,
    DellineAutoDelivery,
    DellineAirDelivery,
    IDellinApi
} from "./IDellin";
import Parser from "parsers/Parser";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";
import {IRequest, IResponse} from "parsers/types";
import webClient from "core/axios/webClient";
import io from "core/libs/io";
import round from "core/libs/round";
import iterateOnObject from "core/libs/iterateOnObject";
import querystring from "querystring";

class Dellin extends Parser {
    protected api: IDellinApi;
    private todayDate: string;
    constructor(request: IRequest) {
        super(request)

        this.api = {
            url: "https://www.dellin.ru/api/calculation.json",
            urlGetCityId: "https://spb.dellin.ru/api/cities/search.json",
            urlGetTerminalId: "https://spb.dellin.ru/api/v1/terminals"
        }
        this.todayDate = new Date().toISOString().slice(0,10);
    }

    async calculate(): Promise<Array<IResponse>> {
        const results = await Promise.all([
            this.calculateForType(DellineAutoDelivery),
            this.calculateForType(DellineAutoExpressDelivery),
            this.calculateForType(DellineAirDelivery)
        ]);

        return results.filter(elem => elem);
    }

    private async calculateForType(deliveryType: IDelllinDeliveryType): Promise<IResponse> {
        const body = await this.createFormData(deliveryType);
        const response: any = await webClient.post(this.api.url, body, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36",
                "Origin": "https://spb.baikalsr.ru",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": "https://spb.baikalsr.ru/tools/calculator/"
            }
        });

        const data = response.data;

        if (!(data[deliveryType.outputKey] > 0)) {
            return null;
        }

        return {
            company: "Деловые линии",
            img: "delline_logo.PNG",
            url: "https://www.dellin.ru/requests/",
            type: deliveryType.caption,
            cost: data[deliveryType.outputKey],
            fullCost: data[deliveryType.outputKey] + data.derivalToDoor + data.arrivalToDoor,
            minTerm: this.calculateTerm(data.recipient_terminal_arrival_date),
            maxTerm: this.calculateTerm(data.recipient_terminal_arrival_date),
            comment: [
                "Стоимость доставки от отправителя до терминала: " +data.derivalToDoor,
                "Стоимость доставки от терминала до получателя: " + data.arrivalToDoor,
                "Стоимость страхования дверь-дверь: " + data.insurance,
                "Стоимость информирования о статусе: " + data.fatal_informing
            ]
        };
    }

    private async createFormData(deliveryType: IDelllinDeliveryType): Promise<string> {
        const request: any = await io.readFileAsJSON(__dirname,'./request.json', 'utf8');

        const [cityFromId, terminalFromId] = await this.getCityAndTerminalId(this.cityFrom, true);
        const [cityToId, terminalToId] = await this.getCityAndTerminalId(this.cityTo, false);

        request.delivery_type = deliveryType.index;
        request.produceDate = this.todayDate;

        request.derival_point_code = cityFromId;
        request.derival_terminal_city_code = cityFromId;
        request.derival_terminal_id = terminalFromId;
        request.arrival_point_code = cityToId;
        request.arrival_terminal_city_code = cityToId;
        request.arrival_terminal_id = terminalToId;

        request.quantity = this.cargo.units;
        request.max_length = this.cargo.length;
        request.max_width = this.cargo.width;
        request.max_height = this.cargo.height;
        request.max_weight = this.cargo.weight;

        request.total_volume = round(this.cargo.length * this.cargo.width * this.cargo.height * this.cargo.units, 2);
        request.total_weight = round(this.cargo.weight * this.cargo.units, 2);
        if (this.cargo.length > 3 || this.cargo.width > 3 || this.cargo.height > 3 || this.cargo.weight > 100) {
            request.oversized_weight = request.total_weight;
            request.oversized_volume = request.total_volume;
        }

        const parsed: any = {};
        for (let elem of iterateOnObject(request)) {
            parsed[elem.path] = elem.value;
        }

        return querystring.stringify(parsed);
    }

    private async getCityAndTerminalId(cityName: string, isOrigin: boolean): Promise<Array<number>> {
        const cityResponse = await webClient.get(this.api.urlGetCityId, {
            params : {q: cityName}
        });
        const cityCode = cityResponse.data[0].code;

        const terminalResponse = await webClient.get(this.api.urlGetTerminalId, {
            params : {
                requestType: "cargo-single",
                [isOrigin ? "derival_point_code" : "arrival_point_code"]:  cityCode,
                direction: isOrigin ? "derival" : "arrival",
                closestTerminal: 1
            }
        });
        const terminalCode = terminalResponse.data[0].id;
        return [cityCode, terminalCode];
    }

    private calculateTerm(arrivalDate : string) {
        const date1: any = new Date(this.todayDate);
        const date2: any = new Date(arrivalDate);
        return (date2 - date1) / (1000 * 60 * 60 * 24);
    }
}

ParsersStorage.add(Dellin);

export default Dellin;