import webClient from "core/axios/webClient";
import { GlavDostavkaResponse, GlavDostavkaCargo, CitiesInfo, CityCode } from "./IGlavDostavka";
import DateTimeFormat = Intl.DateTimeFormat;

function glavDostavka(cityFrom: string, cityTo: string, date: DateTimeFormat, cargo: GlavDostavkaCargo): any {
    const volume: number = Math.round(cargo.length * cargo.height * cargo.length);
    const wei = 0;
}

async function getGlavCity(city: string): Promise<any> {
    const mustRefresh = (date: number):boolean => {
        return (Date.now() - date) > 24 * 60 * 60 * 1000;
    }

    const json = await global.readFile('./codesDictionary', 'utf8');
    const citiesInfo: CitiesInfo = JSON.parse(json);

    if (mustRefresh(citiesInfo.timestamp)) {
        const updatedJson: string = await webClient.get("https://glav-dostavka.ru/api/calc/?responseFormat=json&method=api_city");
        const updatedCitiesInfo: CitiesInfo = {
            timestamp: Date.now(),
            cities: JSON.parse(updatedJson)
        };
        global.writeFile(JSON.stringify(updatedCitiesInfo))
    }



    const url = "https://glav-dostavka.ru/api/calc/?responseFormat=json&method=api_city";

}

export default glavDostavka;

