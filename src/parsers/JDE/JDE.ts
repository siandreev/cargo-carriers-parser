import webClient from "core/axios/webClient";
import dateFormat from "dateformat";
import io from "core/libs/io";
import Parser from "parsers/Parser";
import {IRequest, IResponse} from "parsers/types";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";
import {IJDEApi, JDECityIdPair, IJDEDeliveryType, JDEDelivery, JDEExpressDelivery} from "./IJDE";


class JDE extends Parser {
    protected api: IJDEApi;
    constructor(request: IRequest) {
        super(request)

        this.api = {
            url: "https://i.jde.ru/rqst/CalcAPI/",
            urlGetCityId: "https://i.jde.ru/rqst/GetAddr/",
            urlGetNearOtpr: "https://i.jde.ru/rqst/GetNearOtpr/"
        }

        dateFormat.masks.jde = "dd.mm.yyyy";
    }

    async calculate(): Promise<Array<IResponse>> {
        const results = await Promise.allSettled([
            this.calculateForType(JDEDelivery),
            this.calculateForType(JDEExpressDelivery)
        ]);

        const successfulPromises: PromiseFulfilledResult<IResponse>[] =
            results.filter(elem => elem.status === "fulfilled") as PromiseFulfilledResult<IResponse>[];
        return successfulPromises.map(elem => elem.value).filter(elem => elem);
    }

    private async calculateForType(deliveryType: IJDEDeliveryType): Promise<IResponse> {
        let rawData = await this.sendRequest(deliveryType);
        rawData = rawData.result[0];
        const data = rawData.TTN[0];
        const costToTerminal = Number(rawData.ADN.VAEX_SUM_BASE);
        const costToDoor = Number(rawData.ADO.VAEX_SUM_BASE);

        return {
            company: "ЖелДорЭкспедиция",
            img: "jde_logo.svg",
            url: "https://www.jde.ru/online/calculator.html",
            type: deliveryType.caption,
            cost: Number(data.VTTN_PLAN_SUM),
            fullCost:  Number(data.VTTN_PLAN_SUM) + Number(costToTerminal) + Number(costToDoor),
            minTerm: data.VTTN_SROK_MIN,
            maxTerm: data.VTTN_SROK_MAX,
            comment: [
                "Стоимость доставки ототправителя до терминала: " + costToTerminal,
                "Стоимость доставки от терминала до получателя: " + costToDoor,
                "В стоимость включено страхование и оформление документов.",
                "Стоимость страхования: " + data.VTTN_INS_SUM,
                "Стоимость оформления: " + data.VTTN_EXEC_DOC_SUM
            ]

        };
    }

    protected async createFormData(deliveryType: IJDEDeliveryType): Promise<string> {
        const request: any = await io.readFileAsJSON(__dirname,'./request.json', 'utf8');

        const cityFromIdPair: JDECityIdPair = await this.getCityId(this.cityFrom);
        const cityToIdPair: JDECityIdPair = await this.getCityId(this.cityTo);

        request.VTTN_ID_KG_OTPR = cityFromIdPair.VTTN_ID_KG;
        request.VTTN_ID_KG_NAZN = cityToIdPair.VTTN_ID_KG;
        request.VTTN_ID_MST_OTPR = cityFromIdPair.VTTN_ID_MST;
        request.VTTN_ID_MST_NAZN = cityToIdPair.VTTN_ID_MST;

        request.VTTN_KOL_MEST = this.cargo.units;
        request.VTTN_VES = this.cargo.weight;
        request.VTTN_OBYOM = this.cargo.volume;
        request.VTTN_DZAGR = dateFormat(new Date(), "jde");

        request.VTTN_deliv = deliveryType.code;

        request.ADO.VAEX_ID_MST_EXP = cityFromIdPair.VTTN_ID_MST;
        request.ADN.VAEX_ID_MST_EXP = cityToIdPair.VTTN_ID_MST;

        return JSON.stringify(request);
    }

    private async getCityId(cityName: string): Promise<JDECityIdPair> {
        const cityResponse: any = await webClient.get(encodeURI(this.api.urlGetCityId + cityName));
        const cityCode = cityResponse.data.result[0][0].ID_KLADR_ADDRESS;

        const nearOtprResponse: any = await webClient.get(this.api.urlGetNearOtpr + cityCode +
            "/" + this.cargo.weight + "/" + this.cargo.volume + "/0/0/0");
        const VTTN_ID_KG = nearOtprResponse.data.result[0].MST_AEX.content[0].MST_ID_KG;
        const VTTN_ID_MST = nearOtprResponse.data.result[0].MST_AEX.content[0].ID_MST;

        return {VTTN_ID_MST, VTTN_ID_KG}
    }
}

ParsersStorage.add(JDE);

export default JDE;