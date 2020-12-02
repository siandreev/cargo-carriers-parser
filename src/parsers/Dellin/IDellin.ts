import IParserApi from "parsers/types/IParserApi";

interface IDellinApi extends IParserApi {
    urlGetCityId: string,
    urlGetTerminalId: string
}

interface IDelllinDeliveryType {
    caption: string,
    index: number,
    outputKey: string
}

const DellineAutoDelivery: IDelllinDeliveryType = {
    caption: "Авто",
    index: 1,
    outputKey: "intercity"
};

const DellineAutoExpressDelivery: IDelllinDeliveryType = {
    caption: "Авто экспрес",
    index: 4,
    outputKey: "express"
};

const DellineAirDelivery: IDelllinDeliveryType = {
    caption: "Авиа",
    index: 6,
    outputKey: "avia"
};

export {
    IDellinApi,
    IDelllinDeliveryType,
    DellineAirDelivery,
    DellineAutoDelivery,
    DellineAutoExpressDelivery
};