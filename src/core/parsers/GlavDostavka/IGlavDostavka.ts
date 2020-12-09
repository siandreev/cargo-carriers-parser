import IParserApi from "types/IParserApi";

interface CityCode {
    id: number,
    name: string
}

interface CitiesInfo {
    timestamp: number,
    cities: Array<CityCode>
}

interface IGlavDostavkaApi extends IParserApi{
    urlGetCityId: string
}

export {IGlavDostavkaApi, CityCode, CitiesInfo};