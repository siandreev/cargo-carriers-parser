import {IResponse} from "index";
import IRequest from "IRequest";
import {io} from "libs/io";
import AdditionalDataEarner from "collector/additionalDataEarner";
import {IAdditionalData} from "collector/additionalDataEarner/IAdditionalData";


class OutputGenerator {
    private readonly additionalDataEarner: AdditionalDataEarner;
    constructor(cities: string[]) {
        this.additionalDataEarner = new AdditionalDataEarner(cities);
    }

    public async convertAndSave(request: IRequest, responses: IResponse[]): Promise<void> {
        const additionalData = await this.getAdditionalData(request);
        const rows = responses.map(response => [
            request.cityFrom,
            request.cityTo,
            request.cargo.length,
            request.cargo.width,
            request.cargo.height,
            request.cargo.weight,
            request.cargo.units,
            response.company,
            response.type,
            response.cost,
            response.fullCost,
            response.minTerm,
            response.maxTerm,
            ...Object.values(additionalData)
        ]);
        await io.appendFileAsCSV(__dirname,'./dataframe.csv', rows ,{},'utf8');
    }

    public async convertAndSaveFrame(frameResults: {request: IRequest, responses: IResponse[]}[]): Promise<void> {
        for (let result of frameResults) {
            await this.convertAndSave(result.request, result.responses);
        }
    }

    private getAdditionalData(request: IRequest): Promise<IAdditionalData> {
        return this.additionalDataEarner.getAdditionalData(request)
    }
}

export default OutputGenerator;
