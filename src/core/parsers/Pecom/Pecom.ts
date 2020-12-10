import Parser from "core/parsers/Parser";
import {io} from "libs/io";
import webClient from "libs/axios/webClient";
import {IRequest, IResponse} from "types";
import IPecomApi from "core/parsers/Pecom/IPecom";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";

class Pecom extends Parser {
    protected cacheLifeTime: number = 24 * 60 * 60 * 1000;
    protected api: IPecomApi;

    constructor(request: IRequest) {
        super(request);

        this.api = {
            url: "http://calc.pecom.ru/bitrix/components/pecom/calc/ajax.php",
            urlGetCityId: "https://pecom.ru/ru/calc/towns.php"
        }
    }

    async calculate(): Promise<Array<IResponse>> {
        const body = await this.createFormData();
        const response: any = await webClient.get(this.api.url + "?" + body);
        const data = response.data;

        const result = [];

        const take = data.take[2];
        const deliver = data.deliver[2];

        const ejectADD = (prop: string) => {
            return isFinite(Number(data[prop]?.["1"])) ? Number(data[prop]?.["1"]) :
                (isFinite(Number(data[prop]?.["2"])) ? Number(data[prop]?.["2"]) : 0)
        }
        const ADD = ejectADD("ADD");
        const ADD1 = ejectADD("ADD_1");
        const ADD2 = ejectADD("ADD_2");
        const ADD3 = ejectADD("ADD_3");
        const ADD4 = ejectADD("ADD_4");

        const avtoTerms = data.periods_days.replace(/ /g, "").split("-");
        const aviaTerms = data.aperiods.slice(data.aperiods.indexOf("Количество суток в пути</b>:") + 29,
            data.aperiods.indexOf("Количество суток в пути</b>:") + 34)
            .replace(/ /g, "")
            .split("-");

        const createTypeResult = (type: string, cost: number, terms: number[]) => {
            const typeResult = {
                company: "ПЭК",
                img: "pecom_logo.PNG",
                url: "https://new.pecom.ru/services-are/shipping-request/",
                type,
                cost,
                fullCost:  cost + take + deliver + ADD + ADD1 + ADD2 + ADD3 + ADD4,
                minTerm: terms[0],
                maxTerm: terms[1] || terms[0],
                comment: [
                    "Стоимость доставки до терминала: " +  take,
                    "Стоимость доставки от терминала: " + deliver
                ]
            };

            ADD > 0 && typeResult.comment.push(data.ADD["2"] + ": " + ADD);
            ADD1 > 0 && typeResult.comment.push(data.ADD_1["1"] + ": " + ADD1);
            ADD3 > 0 && typeResult.comment.push(data.ADD_3["1"] + ": " + ADD3);

            return typeResult;
        }

        if (data.autonegabarit?.length || data.auto?.length) {
            result.push(createTypeResult("Авто",data.autonegabarit?.[2] || data.auto[2], avtoTerms));
        }

        if (data.avia?.length) {
            result.push(createTypeResult("Авиа", data.avia[2], aviaTerms));
        }

        return result;
    }

    protected async createFormData(): Promise<string> {
        const cityFromId = await this.getCityId(this.cityFrom);
        const cityToId = await this.getCityId(this.cityTo);
        const overWeightFlag = (this.cargo.length > 5 || this.cargo.weight > 1000) ? 1 : 0;


        return "places[0][0]=" + this.cargo.width +
        "&places[0][1]=" + this.cargo.length +
        "&places[0][2]=" + this.cargo.height +
        "&places[0][3]=" + this.cargo.volume +
        "&places[0][4]=" + this.cargo.weight +
        "&places[0][5]=" + overWeightFlag +
        "&places[0][6]=" + 1 +
        "&take[town]=" + cityFromId +
        "&deliver[town]=" + cityToId;
    }

    private async getCityId(cityName: string): Promise<string> {
        let citiesInfo: any =
            await io.readFileAsJSON(__dirname,'./codesDictionary.json', 'utf8');

        if (this.mustRefresh(citiesInfo.timestamp)) {
            const response = await webClient.get(this.api.urlGetCityId);
            citiesInfo = {
                timestamp: Date.now(),
                regions: response.data
            };
            await io.writeFile(__dirname, './codesDictionary.json', JSON.stringify(citiesInfo))
        }

        let id = "";
        mainLoop:
        for (let region in citiesInfo.regions) {
            if (citiesInfo.regions.hasOwnProperty(region)) {
                const regionData = citiesInfo.regions[region];
                for (let key in regionData) {
                    if (regionData.hasOwnProperty(key) && regionData[key] === cityName) {
                        id = key;
                        break mainLoop;
                    }
                }
            }
        }

        if (!id) {
            mainLoop:
            for (let region in citiesInfo.regions) {
                if (citiesInfo.regions.hasOwnProperty(region)) {
                    const regionData = citiesInfo.regions[region];
                    for (let key in regionData) {
                        if (regionData.hasOwnProperty(key) && regionData[key].includes(cityName)) {
                            id = key;
                            break mainLoop;
                        }
                    }
                }
            }
        }

        return id;
    }
}

ParsersStorage.add(Pecom);

export default Pecom;