import Parser from "core/parsers/Parser";
import {IRequest, IResponse} from "types";
import ParsersStorage from "core/ParsersFactory/ParsersStorage";

class PonyExpress extends Parser {
    constructor(request: IRequest) {
        super(request);

        this.api = {
            url: "https://www.ponyexpress.ru/local/ajax/tariff.php"
        }
    }

    async calculate(): Promise<Array<IResponse>> {
        if (this.cargo.units > 1) {
            return [];
        }

        const data = await this.sendRequest();
        const result = [];

        for (let key in data.result) {
            if (data.result.hasOwnProperty(key)) {
                const deliveryData = data.result[key];
                const terms = deliveryData.delivery.replace(/ /g, "").split("-");
                result.push({
                    company: "PonyExpress",
                    img: "ponyexpress_logo.svg",
                    url: "https://www.ponyexpress.ru/support/servisy-samoobsluzhivaniya/tariff/",
                    type: "Авто",
                    cost: deliveryData.tariff,
                    fullCost: deliveryData.tariffvat,
                    minTerm: terms[0],
                    maxTerm: terms[1] || terms[0],
                    comment: []
                });
            }
        }
        return result;
    }

    protected createFormData(): string {
        const config = `parcel%5Bcurrency_id%5D=4
         &parcel%5Btips_iblock_code%5D=form_tips
         &parcel%5Btips_section_code%5D=pegas
         &parcel%5Bdirection%5D=inner
         &parcel%5Bfrom_country%5D=%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F
         &parcel%5Bfrom_city%5D=${encodeURI(this.cityFrom)}
         &parcel%5Bto_country%5D=%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F
         &parcel%5Bto_city%5D=${encodeURI(this.cityTo)}
         &parcel%5Bweight%5D=${this.cargo.weight}
         &b_volume_l=${this.cargo.length}
         &b_volume_h=${this.cargo.height}
         &b_volume_w=${this.cargo.width}
         &c_volume_l=
         &c_volume_d=
         &t_volume_h=
         &t_volume_b=
         &t_volume_a=
         &t_volume_c=
         &parcel%5Busecurrentdt%5D=0
         &parcel%5Busecurrentdt%5D=1
         &parcel%5Bkgo%5D=0
         &parcel%5Bkgo%5D=1
         &parcel%5Bog%5D=0
         &parcel%5Bisdoc%5D=0`;

        return config.replace(/\r?\n|\r/g, "").replace(/ /g, "");
    }
}

ParsersStorage.add(PonyExpress);

export default PonyExpress;