import Parser from "parsers/Parser";
import {IRequest, IResponse} from "parsers/types";
import querystring from "querystring";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";
import round from "core/libs/round";

class RailContinent extends Parser {
    constructor(request: IRequest) {
        super(request);

        this.api = {
            url: "https://www.railcontinent.ru/ajax/calc.php"
        }
    }

    async calculate(): Promise<Array<IResponse>> {
        const rawData = await this.sendRequest();
        if (rawData.result !== "success") {
            return [];
        }
        const data = rawData.data.auto;
        const terms = data.duration.replace(/ /g, "").split("-");

        return [{
            company: "Рейл континент",
            img: "railcontinent_logo.png",
            url: "https://www.railcontinent.ru/tarify/calc/",
            type: "Авто",
            cost: data.price,
            fullCost: Number(data.price) + Number(data.pricePickup) + Number(data.priceDelivery),
            minTerm: terms[0],
            maxTerm: terms[1] || terms[0],
            comment: [
                "Стоимость доставки от отправителя до терминала: " + round(data.pricePickup, 2),
                "Стоимость доставки от терминала до получателя: " + round(data.priceDelivery, 2),
                "Стоимость изготовителя упаковки: " + round(data.pricePackage, 2),
                "Cтоимость возврата документов: " + round(data.priceDocuments, 2),
                "Cкидка при онлайн заказе: " + round(data.sale, 2)
            ]
        }]
    }

    protected createFormData(): string{
        const units = this.cargo.units;
        const request = {
            city_from: this.cityFrom,
            city_from_obl: "",
            city_to: this.cityTo,
            city_to_obl: "",
            weight: units === 1 ? this.cargo.weight : this.cargo.weight * units,
            volume: units === 1 ? this.cargo.volume : this.cargo.volume * units,
            length: units === 1 ? this.cargo.length : "",
            width: units === 1 ? this.cargo.width : "",
            height: units === 1 ? this.cargo.height : "",
        }

        return querystring.stringify(request);
    }
}

ParsersStorage.add(RailContinent);

export default RailContinent;