import Parser from "core/parsers/Parser";
import {IRequest, IResponse} from "types";
import webClient from "libs/axios/webClient";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";

class Vozovoz extends Parser {
    private apiToken: string = "G934UM29wXG2IKYS9iX9oKQCeojkApHSEWAxOC5v";
    constructor(request: IRequest) {
        super(request);

        this.api = {
            url: "https://vozovoz.xyz/api/?token=" + this.apiToken
        }
    }

    async calculate(): Promise<Array<IResponse>> {
        const body = await this.createFormData();
        const response: any = await webClient.post(this.api.url, body, {
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });
        const data = response.data.response;

        const cost = Number(data.service[0]);
        const fullCost = Number(data.price);

        const result = {
            company: "Vozovoz",
            img: "vozovoz_logo.png",
            url: "https://spb.vozovoz.ru/order/create/",
            type: "Aвто",
            cost,
            fullCost,
            minTerm: data.deliveryTime.from,
            maxTerm: data.deliveryTime.to,
            comment: [
                "Стоимость доставки ототправителя до терминала и от терминала до получателя: " + (fullCost - cost)
            ]
        };

        data.service.forEach((elem: any, index: number) => {
            if (index) {
                result.comment.push(elem.name + ": " + elem.price)
            }
        });

        return [result];
    }

    protected createFormData(): string {
        const request = {
            object: "price",
            action: "get",
            params: {
                cargo : {
                    dimension: {
                        max: {
                            height: this.cargo.height,
                            length: this.cargo.length,
                            weight: this.cargo.weight,
                            width: this.cargo.width
                        },
                        quantity: this.cargo.units
                    }
                },
                gateway: {
                    dispatch: {
                        point: {
                            location: this.cityFrom,
                            terminal: "default"
                        }
                    },
                    destination: {
                        point: {
                            location: this.cityTo,
                            terminal: "default"
                        }
                    }
                }
            }
        };
        return JSON.stringify(request);
    }
}

ParsersStorage.add(Vozovoz);

export default Vozovoz;
