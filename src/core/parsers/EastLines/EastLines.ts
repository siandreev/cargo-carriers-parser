import Parser from "core/parsers/Parser";
import {IResponse, IRequest} from "types";
import querystring from "querystring";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";

class EastLines extends Parser {
    private car: number;
    private car2: number;
    constructor(request: IRequest) {
        super(request);
        this.api = {url: "https://www.eastlines.ru/"};
    }

    async calculate(): Promise<Array<IResponse>> {
        const data = await this.sendRequest();

        const results = [];
        data.price = Number(data.price.replace(/ /g,''));
        data.price2 = Number(data.price2.replace(/ /g,''));
        const term = data.transportertime_time.split(" ")[0];

        if (isFinite(data?.price) && data.price > 0 ) {
            results.push({
                company: "EastLines",
                img: "eastlines_logo.png",
                url: "https://www.eastlines.ru/raschet-stoimosti/",
                type: "Авто",
                cost: data.price,
                fullCost: data.price,
                minTerm: term,
                maxTerm: term,
                comment: [
                    "Выделенный транспорт. ",
                    "Тип транспорта: " + EastLines.getCarDescriptionByType(this.car)
                ]
            });
        }

        if (isFinite(data?.price2) && data.price2 > 0 ) {
            results.push({
                company: "EastLines",
                img: "eastlines_logo.png",
                url: "https://www.eastlines.ru/raschet-stoimosti/",
                type: "Авто",
                cost: data.price2,
                fullCost: data.price2,
                minTerm: term,
                maxTerm: term,
                comment: [
                    "Догрузка транспорта. ",
                    "Тип транспорта: " + EastLines.getCarDescriptionByType(this.car2)
                ]
            });
        }


        return results;
    }

    protected createFormData(): string {
        const volume = this.cargo.length * this.cargo.width * this.cargo.height * this.cargo.units;
        const weight = this.cargo.weight * this.cargo.units;

        /* ⚠️Опасный для психики участок */
        let car = 44;
        let car2 = 0;

        if (volume >= 51)
            car = 44;
        else
        if (weight <= 10000)
        {
            if (weight >= 5001)
            {
                car = 43;
                car2 = 44;
            }
            else
            if (weight >= 3001)
            {
                car = 40;
                car2 = 43;
            }
            else
            if (volume >= 26)
            {
                car = 40;
                car2 = 40;
            }
            else
            if (weight >= 1500)
            {
                car = 38;
                car2 = 40;
            }
            else
            if (volume >= 19)
            {
                car = 38;
                car2 = 38;
            }
            else
            {
                car = 36;
                car2 = 38;
            }
        }
        if (weight === 1500 && volume <= 18) {
            car = 36;
        }
        /* Конец опасного для психики участка */

        const request = {
            action: "getCalcInfo",
            module: "calc",
            city1: this.cityFrom,
            city2: this.cityTo,
            car,
            car2,
            car_weight: Math.max(weight, 500)
        };

        this.car = car;
        this.car2 = car2;

        return querystring.stringify(request);
    }

    private static getCarDescriptionByType(type: number): string {
        switch (type) {
            case 36:
                return "Тент с г/п 1.5 тонны";
            case 38:
                return "Тент с г/п 3 тонны";
            case 40:
                return "Тент с г/п 5 тонн";
            case 43:
                return "Тент с г/п 10 тонн";
            case 44:
                return "Тент с г/п 20 тонн";
            default:
                return "";
        }
    }
}

ParsersStorage.add(EastLines);

export default EastLines;