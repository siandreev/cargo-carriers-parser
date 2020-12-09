import Parser from "core/parsers/Parser";
import {IRequest, IResponse} from "types";
import webClient from "libs/axios/webClient";
import querystring from "querystring";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";
import iterateOnObject from "libs/iterateOnObject";
import round from "libs/round";

class ZhdAliance extends Parser {

    constructor(request: IRequest) {
        super(request);

        this.api = {
            url: "https://zhdalians.ru/ajcost/",
            urlGetCityId: "https://zhdalians.ru/cityindex/"
        }
    }

    async calculate(): Promise<Array<IResponse>> {
        const data = await this.sendRequest();

        const cost = Number(data.cost.Price);
        const terminalCost = round(data.cost.PriceIntake, 2);
        const deliveryCost = round(data.cost.PriceDelivery, 2);
        const terms = data.cost.Total_days.replace(/ /g, "").split("-");

        return [{
            company: "ЖелдорАльянс",
            img: "zhdalians_logo.PNG",
            url: "https://zhdalians.ru/calculator/",
            type: "ЖД",
            cost,
            fullCost:  cost + terminalCost + deliveryCost,
            minTerm: terms[0],
            maxTerm: terms[1] || terms[0],
            comment: [
                "Стоимость доставки ототправителя до терминала: " + terminalCost,
                "Стоимость доставки от терминала до получателя: " + deliveryCost
            ]
        }]
    }

    protected async createFormData(): Promise<string> {
        const cityFromId = await this.getCityId(this.cityFrom);
        const cityToId = await this.getCityId(this.cityTo);

        const request = {
            ShippingOptions: {
                From_City_ID: cityFromId,
                To_City_ID: cityToId,
                Weight: this.cargo.weight * this.cargo.units,
                Volume: this.cargo.volume * this.cargo.units,
                Temperature: 1,
                Lathing: 1,
                Verification: 1,
                jeka: 1
            }
        }

        const parsed: any = {};
        for (let elem of iterateOnObject(request)) {
            parsed[elem.path] = elem.value;
        }

        return querystring.stringify(parsed);
    }

    private async getCityId(cityName: string) {
        const response = await webClient.get(this.api.urlGetCityId + "?search=" + encodeURI(cityName));
        return response.data.returnId[0];
    }
}

ParsersStorage.add(ZhdAliance);

export default ZhdAliance;