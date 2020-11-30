import webClient from "core/axios/webClient";
import io from "core/io";
import iterateOnObject from "core/iterateOnObject";
import querystring from "querystring";
import { CitiesInfo, CityCode, IGlavDostavkaApi } from "./IGlavDostavka";
import DateTimeFormat = Intl.DateTimeFormat;
import Parser from "parsers/Parser";
import {IRequest, IResponse} from "parsers/types";

class GlavDostavka extends Parser {
    protected api: IGlavDostavkaApi;
    private cacheLifeTime: number = 24 * 60 * 60 * 1000;
    constructor(request: IRequest) {
        super(request)

        this.api = {
            url: "https://glav-dostavka.ru/ajax.php",
            urlGetCityId: "https://glav-dostavka.ru/api/calc/?responseFormat=json&method=api_city"
        }
    }

    async calculate(): Promise<IResponse> {
        const volume: number = Math.round(this.cargo.length * this.cargo.height * this.cargo.length);
        return Promise.resolve(undefined);
    }

    private async createFormData(): Promise<string> {
        const request: any = await io.readFileAsJSON(__dirname,'./request.json', 'utf8');

        const cityFromId: number = await this.getCityId(this.cityFrom);
        const cityToId: number = await this.getCityId(this.cityTo);

        request.from.city.id = cityFromId;
        request.from.city.parent_city_id = cityFromId;
        request.to.city.id = cityToId;
        request.to.city.parent_city_id = cityToId;

        request.cargo_detailed.amount = this.cargo.units;
        request.cargo_detailed.height = this.cargo.height;
        request.cargo_detailed.width = this.cargo.width;
        request.cargo_detailed.length = this.cargo.length;
        request.cargo_detailed.weight = this.cargo.weight;
        request.cargo_detailed.volume = Math.round(this.cargo.height * this.cargo.width * this.cargo.length);
        request.cargo_detailed.total_volume = Math.round(request.cargo_detailed.volume * this.cargo.units);
        request.cargo_detailed.total_weight = Math.round(request.cargo_detailed.weight * this.cargo.units);


        const parsed: any = {};

        for (let elem of iterateOnObject(request)) {
           parsed[elem.path] = elem.value;
        }

        return querystring.stringify(parsed);
    }

    private mustRefresh(date: number):boolean {
        return (Date.now() - date) > this.cacheLifeTime;
    }

    private async getCityId(cityName: string): Promise<number> {
        let citiesInfo: CitiesInfo =
            await io.readFileAsJSON(__dirname,'./codesDictionary', 'utf8') as CitiesInfo;

        if (this.mustRefresh(citiesInfo.timestamp)) {
            const updatedJson: string = await webClient.get(this.api.urlGetCityId);
            citiesInfo = {
                timestamp: Date.now(),
                cities: JSON.parse(updatedJson)
            };
            await io.writeFile(__dirname, './codesDictionary', JSON.stringify(citiesInfo))
        }

        return citiesInfo.cities.find(city => city.name === cityName)?.id;
    }
}

export default GlavDostavka;
/*
async function glavDostavka(cityFrom: string, cityTo: string, date: DateTimeFormat, cargo: GlavDostavkaCargo): any {
    const volume: number = Math.round(cargo.length * cargo.height * cargo.length);

    const request = `
          action=OrderManageCalculator
          &is_template=0
          &order_id=
          &service_id=46
          &express_shipping=0
          &from%5Bcity%5D%5Bid%5D=${cityFromId} !
          &from%5Bcity%5D%5Bparent_city_id%5D=${cityFromId}  !
          &from%5Bclient%5D%5Bis_new%5D=1
          &from%5Bclient%5D%5Bclient_id%5D=
          &to%5Bcity%5D%5Bid%5D=${cityToId} !
          &to%5Bcity%5D%5Bparent_city_id%5D=${cityToId} !
          &to%5Bclient%5D%5Bis_new%5D=1
          &to%5Bclient%5D%5Bclient_id%5D=
          &pickup%5Baddress_contact%5D%5Baddress%5D=&pickup%5Baddress_contact%5D%5Bcontact_id%5D=&pickup%5Bdatetime%5D%5Btime_mode%5D=0&pickup%5Bdatetime%5D%5Btime%5D=&pickup%5Bdatetime%5D%5Bfrom_time%5D=&pickup%5Bdatetime%5D%5Bto_time%5D=&pickup%5Benabled%5D=1&delivery%5Baddress_contact%5D%5Baddress%5D=&delivery%5Baddress_contact%5D%5Bcontact_id%5D=&delivery%5Bdatetime%5D%5Btime_mode%5D=0&delivery%5Bdatetime%5D%5Btime%5D=&delivery%5Bdatetime%5D%5Bfrom_time%5D=&delivery%5Bdatetime%5D%5Bto_time%5D=&delivery%5Benabled%5D=1&payer%5Btype%5D=from&payer%5Bclient%5D%5Bis_new%5D=1&payer%5Bclient%5D%5Bclient_id%5D=&payer%5Bvat_system%5D%5Bid%5D=osn&payer%5Bvat_system%5D%5Btitle%5D=%D0%9D%D0%94%D0%A1+20%25
          &cargo_detailed%5B0%5D%5Bitem_id%5D=1
          &cargo_detailed%5B0%5D%5Bone_place%5D=1
&cargo_detailed%5B0%5D%5Bonly_volume%5D=0
&cargo_detailed%5B0%5D%5Bamount%5D=${item["units"]} !
&cargo_detailed%5B0%5D%5Bheight%5D=${item["height"]} !
&cargo_detailed%5B0%5D%5Blength%5D='.$item["length"]. !
&cargo_detailed%5B0%5D%5Bwidth%5D='.$item["width"]. !
&cargo_detailed%5B0%5D%5Bvolume%5D='.$item["volume"]. !
&cargo_detailed%5B0%5D%5Bweight%5D='.$item["weight"]. !
&cargo_detailed%5B0%5D%5Bhard_pack%5D=0'.
&cargo_detailed%5B0%5D%5Bpallet%5D=0'.
&cargo_detailed%5B0%5D%5Btotal_volume%5D='.$item["totalVolume"]. !
&cargo_detailed%5B0%5D%5Btotal_weight%5D='.$item["totalWeight"]. !
&cargo_total_height='.
&cargo_total_length='.
&cargo_total_width='.
&is_insurance_enabled=1'.
&appraised_value=0'.
&appraised_value_currency=RUB'.
&adr=0'.
&is_pickup_enabled=1'.
&is_delivery_enabled=1'.
&pickup_date='.$date1.
&delivery_date='.substr($deliverydate,0,10);
    `

}
*/