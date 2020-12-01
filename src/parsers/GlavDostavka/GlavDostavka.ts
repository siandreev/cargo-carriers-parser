import webClient from "core/axios/webClient";
import io from "core/io";
import querystring from "querystring";
import iterateOnObject from "core/iterateOnObject";
import Parser from "parsers/Parser";

import { CitiesInfo, IGlavDostavkaApi } from "./IGlavDostavka";
import {IRequest, IResponse} from "parsers/types";


class GlavDostavka extends Parser {
    protected api: IGlavDostavkaApi;
    private cacheLifeTime: number = 24 * 60 * 60 * 1000;
    constructor(request: IRequest) {
        super(request)

        this.api = {
            url: "https://glav-dostavka.ru/ajax.php",
            urlGetCityId: "https://glav-dostavka.ru/api/calc/?responseFormat=json&method=api_city"
        }
    }

    async calculate(): Promise<Array<IResponse>> {
        const body = await this.createFormData();
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
        const data = response.data;

        const result: IResponse = {
            company: "ГлавДоставка",
            img: "glavdost_logo.jpeg",
            url: "https://glav-dostavka.ru/clients/calc/",
            type: "Авто",
            cost: data.results['0'].sum_debit,
            fullCost:  data.results['0'].sum_debit +  data.results['2'].sum_debit +  data.results['3'].sum_debit,
            minTerm: data.arrival_period.min,
            maxTerm: data.arrival_period.max,
            comment: [
                "Стоимость доставки до терминала: " +  data.results['2'].sum_debit,
                "Стоимость доставки от терминала: " + data.results['3'].sum_debit,
                "Стоимость страхования: " + data.results['1'].sum_debit,
                "Дополнительная плата за экспресс доставку: " + data.results['4'].sum_debit,
            ]
        };

        return [result];
    }

    private async createFormData(): Promise<string> {
        const request: any = await io.readFileAsJSON(__dirname,'./request.json', 'utf8');

        const cityFromId: number = await this.getCityId(this.cityFrom);
        const cityToId: number = await this.getCityId(this.cityTo);
        const dates: any = await this.getMinDeliveryDate(cityFromId, cityToId);

        request.from.city.id = cityFromId;
        request.from.city.parent_city_id = cityFromId;
        request.to.city.id = cityToId;
        request.to.city.parent_city_id = cityToId;

        request.delivery_date = dates.delivery_date;
        request.pickup_date = dates.pickup_date;

        request.cargo_detailed.amount = this.cargo.units;
        request.cargo_detailed.height = this.cargo.height;
        request.cargo_detailed.width = this.cargo.width;
        request.cargo_detailed.length = this.cargo.length;
        request.cargo_detailed.weight = this.cargo.weight;
        request.cargo_detailed.volume = Math.round(this.cargo.height * this.cargo.width * this.cargo.length);
        request.cargo_detailed.total_volume = Math.round(request.cargo_detailed.volume * this.cargo.units);
        request.cargo_detailed.total_weight = Math.round(request.cargo_detailed.weight * this.cargo.units);

        const parsed: any = {};
        for (let elem of iterateOnObject(request)) {
           parsed[elem.path] = elem.value;
        }

        return querystring.stringify(parsed);
    }

    private mustRefresh(date: number):boolean {
        return (Date.now() - date) > this.cacheLifeTime;
    }

    private async getCityId(cityName: string): Promise<number> {
        let citiesInfo: CitiesInfo =
            await io.readFileAsJSON(__dirname,'./codesDictionary.json', 'utf8') as CitiesInfo;

        if (this.mustRefresh(citiesInfo.timestamp)) {
            const response = await webClient.get(this.api.urlGetCityId);
            citiesInfo = {
                timestamp: Date.now(),
                cities: response.data
            };
            await io.writeFile(__dirname, './codesDictionary.json', JSON.stringify(citiesInfo))
        }

        return citiesInfo.cities.find(city => city.name === cityName)?.id;
    }

    private async getMinDeliveryDate(fromCityId: number, toCityId: number): Promise<Object> {
        const tomorrow = new Date();
        tomorrow.setDate(new Date().getDate()+1);
        const pickup_date = (new Date(tomorrow).toISOString().slice(0,10)) + " 00:00";

        const request: any = {};
        request.action = "CalcMinDeliveryDate";
        request.from_city_id = fromCityId;
        request.to_city_id = toCityId;
        request.pickup_date = pickup_date;
        request.from_storehouse_id = 22764543;
        request.giveout_storehouse_id = undefined;
        request.express_shipping = 0;
        request.noresponse = 1;

        const query = querystring.stringify(request);

        const response: any = await webClient.post(this.api.url, query, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36",
                "Origin": "https://glav-dostavka.ru",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": "https://glav-dostavka.ru/clients/calc/,",
                "Accept": "application/json, text/javascript, */*; q=0.01"
            }
        });

        return {
            delivery_date: response.data.delivery_date.substring(0, 10),
            pickup_date: pickup_date.substring(0, 10)
        };
    }
}

export default GlavDostavka;