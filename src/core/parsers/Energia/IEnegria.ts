import IParserApi from "types/IParserApi";

interface IEnegriaApi extends IParserApi {
    urlGetCitiesList: string
}

interface IEnegriaCitiesInfo {
    timestamp: number,
    cityList: Array<any>
}

export {IEnegriaApi, IEnegriaCitiesInfo};