import Parser from "parsers/Parser";
import io from "core/libs/io";
import querystring from "querystring";
import {IResponse, IRequest} from "parsers/types";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";

class MagicTrans extends Parser {
    constructor(request: IRequest) {
        super(request);

        this.api = {
            url: "https://magic-trans.ru/include/mt-calculation-full.php"
        }
    }

    async calculate(): Promise<Array<IResponse>> {
        const rawData = await this.sendRequest();
        const data = rawData.calculation_data;

        const cost = Number(data.branch_delivery.replace(/ /g,""));
        const takeCostCost = Number(data.take_cargo_cost.replace(/ /g,""));
        const giveCargoCost = Number(data.give_cargo_cost.replace(/ /g,""));
        const saveCost = Number(data.save.replace(/ /g,""));

        const terms = data.period.split(" ")[0];

        const result: IResponse = {
            company: "Magic Trans",
            img: "magictrans_logo.png",
            url: "https://magic-trans.ru/otpravit-zayavku/",
            type: "Авто",
            cost,
            fullCost:  cost + takeCostCost + giveCargoCost + saveCost,
            minTerm: terms.split("-")[0],
            maxTerm: terms.split("-")[1] || terms.split("-")[0],
            comment: [
                "Стоимость доставки до терминала: " +  takeCostCost,
                "Стоимость доставки от терминала: " + giveCargoCost,
                "Стоимость возврата документов: " + data.return_document,
                "Наценка на режимный груз: " + data.sensitive_cargo,
            ]
        };

        return [result];
    }

    protected async createFormData():  Promise<string>  {
        const json_params_cargo = JSON.stringify({
            "0": {
                packing: "none",
                long: this.cargo.length,
                width: this.cargo.width,
                height: this.cargo.height,
                weight: this.cargo.weight,
                count: this.cargo.units,
                volume: this.cargo.volume
            }
        });

        const json_other_params = JSON.stringify({
            box: "",
            bag: "",
            save:"",
            sensitive_cargo :true,
            return_document:true
        });

        const request = 'city_form=' + encodeURI(this.cityFrom) +
        '&city_to=' + encodeURI(this.cityTo) +
        '&take_cargo=true' +
        '&give_cargo=true' +
        '&json_params_cargo=' + json_params_cargo +
        '&json_other_params=' + json_other_params;

        return request;
    }
}

ParsersStorage.add(MagicTrans);

export default MagicTrans;