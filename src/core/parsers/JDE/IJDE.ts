import IParserApi from "types/IParserApi";

interface IJDEApi extends IParserApi{
    urlGetCityId: string,
    urlGetNearOtpr: string
}

interface JDECityIdPair {
    VTTN_ID_MST: string,
    VTTN_ID_KG: string
}

interface IJDEDeliveryType {
    code: number,
    caption: string
}

const JDEDelivery: IJDEDeliveryType = {
    code: 0,
    caption: "Авто"
}

const JDEExpressDelivery: IJDEDeliveryType = {
    code: 2,
    caption: "Авто экспресс"
}

export {IJDEApi, JDECityIdPair, IJDEDeliveryType, JDEDelivery, JDEExpressDelivery};