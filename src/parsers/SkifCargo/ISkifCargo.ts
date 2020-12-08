import IParserApi from "parsers/types/IParserApi";

interface ISkifCargoApi extends IParserApi{
    urlGetCityId: string
}

interface ISkifDeliveryType {
    express_service: boolean,
    caption: string
}

const SkifDelivery: ISkifDeliveryType = {
    express_service: false,
    caption: "Авто"
}

const SkifDeliveryExpress: ISkifDeliveryType = {
    express_service: true,
    caption: "Авто экспресс"
}

export {ISkifCargoApi, SkifDelivery, SkifDeliveryExpress, ISkifDeliveryType};