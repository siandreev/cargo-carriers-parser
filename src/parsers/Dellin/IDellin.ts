import IParserApi from "parsers/types/IParserApi";

interface IDellinApi extends IParserApi {
    urlGetCityId: string,
    urlGetTerminalId: string
}

enum DelllinDelivery {
    AUTO,
    AUTO_EXPRESS,
    AIR,

}

interface IDelllinDeliveryType {
    type: DelllinDelivery,
    caption: string,
    index: number
}

const DellineAutoDelivery: IDelllinDeliveryType = {
    type: DelllinDelivery.AUTO,
    caption: "Авто",
    index: 1
};

const DellineAutoExpressDelivery: IDelllinDeliveryType = {
    type: DelllinDelivery.AUTO_EXPRESS,
    caption: "Авто экспрес",
    index: 4
};

const DellineAirDelivery: IDelllinDeliveryType = {
    type: DelllinDelivery.AIR,
    caption: "Авиа",
    index: 6
};

export {
    IDellinApi,
    DelllinDelivery,
    IDelllinDeliveryType,
    DellineAirDelivery,
    DellineAutoDelivery,
    DellineAutoExpressDelivery
};