interface GlavDostavkaCargo {
    length: number,
    width: number,
    height: number,
    weight: number
}

interface GlavDostavkaResponse {
    costs: number,
    terms: number,
    type: string,
    description: string
}

interface CityCode {
    id: number,
    name: string
}

interface CitiesInfo {
    timestamp: number,
    cities: Array<CityCode>

}

export {GlavDostavkaCargo, GlavDostavkaResponse, CityCode, CitiesInfo};