import {IResponse} from "index";
import IRequest from "IRequest";
import {io} from "libs/io";


class OutputGenerator {
    public async convertAndSave(request: IRequest, responses: IResponse[]): Promise<void> {
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
            response.maxTerm
        ]);
        await io.appendFileAsCSV(__dirname,'./dataframe.csv', rows ,{},'utf8');
    }

    public async convertAndSaveFrame(frameResults: {request: IRequest, responses: IResponse[]}[]): Promise<void> {
        for (let result of frameResults) {
            await this.convertAndSave(result.request, result.responses);
        }
    }

    private async getAdditionalData() {

    }
}

export default OutputGenerator;