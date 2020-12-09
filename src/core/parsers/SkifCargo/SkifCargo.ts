import Parser from "core/parsers/Parser";
import {IRequest, IResponse} from "types";
import {ISkifCargoApi, ISkifDeliveryType, SkifDeliveryExpress, SkifDelivery} from "core/parsers/SkifCargo/ISkifCargo";
import io from "libs/io";
import disabledSSLClient from "libs/axios/disabledSSLClient";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";
import dateFormat from "dateformat";
import round from "libs/round";

class SkifCargo extends Parser {
    protected api: ISkifCargoApi;
    protected cacheLifeTime: number = 24 * 60 * 60 * 1000;
    constructor(request: IRequest) {
        super(request);

        this.api = {
            url: "https://skif-cargo.ru/calc/",
            urlGetCityId: "https://skif-cargo.ru/getTowns/"
        }

        dateFormat.masks.skif = "yyyy-mm-dd";
    }

    async calculate(): Promise<Array<IResponse>> {
        const results = await Promise.allSettled([
            this.calculateForType(SkifDelivery),
            this.calculateForType(SkifDeliveryExpress)
        ]);

        const successfulPromises: PromiseFulfilledResult<IResponse>[] =
            results.filter(elem => elem.status === "fulfilled") as PromiseFulfilledResult<IResponse>[];
        return successfulPromises.map(elem => elem.value).filter(elem => elem);
    }

    protected async calculateForType(type: ISkifDeliveryType): Promise<IResponse> {
        const body = await this.createFormData(type);
        const response: any = await disabledSSLClient.post(this.api.url, body, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });
        const data = response.data;

        const cost = Number(data.total_cost);
        const terminalCost = round(data.pickup_service_cost, 2);
        const deliveryCost = round(data.delivery_service_cost, 2);
        const term = ((Number(new Date(data.city_to_dates[0])) - Number(new Date(data.city_from_dates[0]))) / (24 * 60 * 60 * 1000));

        return {
            company: "Скиф Карго",
            img: "skif_logo.PNG",
            url: "https://www.skif-cargo.ru/calc/",
            type: type.caption,
            cost,
            fullCost:  cost + terminalCost + deliveryCost,
            minTerm: term,
            maxTerm: term,
            comment: [
                "Стоимость доставки ототправителя до терминала: " + terminalCost,
                "Стоимость доставки от терминала до получателя: " + deliveryCost,
                "В стоимость включено страхование (" + (cost - round(data.transport_cost)) + ")",
                "Стоимость жесткой упаковки: " + round(data.rigid_packings_service_cost)
            ]
        }
    }

    protected async createFormData(type: ISkifDeliveryType): Promise<string> {
        const request: any = await io.readFileAsJSON(__dirname,'./request.json', 'utf8');

        const cityFromId = await this.getCityId(this.cityFrom);
        const cityToId = await this.getCityId(this.cityTo);

        request.calc_fields.city_from_id = cityFromId;
        request.calc_fields.city_from = this.cityFrom;
        request.calc_fields.city_to_id = cityToId;
        request.calc_fields.city_to = this.cityTo;

        request.calc_fields.common_cargo_weight = this.cargo.weight;
        request.calc_fields.common_cargo_volume = this.cargo.volume;
        request.calc_fields.common_cargo_amount = this.cargo.units;

        request.calc_fields.cargo_pickup_date = dateFormat(new Date(), "skif");
        request.calc_fields.cargo_delivery_date = dateFormat(new Date(), "skif");

        request.calc_fields.express_service = type.express_service;

        if (this.cargo.length > 2.4 || this.cargo.width > 2.4 || this.cargo.height > 2.4 ||
            this.cargo.weight > 900 || this.cargo.length + this.cargo.width + this.cargo.height) {
            request.calc_fields.is_overall = true;
        }

        return JSON.stringify(request);
    }

    private async getCityId(cityName: string) {
        const citiesList = await this.getCitiesList(cityName, __dirname, disabledSSLClient);
        return citiesList.find(city => city.town_name === cityName)?.town_id;
    }
}

ParsersStorage.add(SkifCargo);

export default SkifCargo;