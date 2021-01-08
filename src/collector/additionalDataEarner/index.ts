import IRequest from "IRequest";
import getDistances from "./cityDistanceEarner";
import {IAdditionalData} from "collector/additionalDataEarner/IAdditionalData";
import getCitiesPopulation from "collector/additionalDataEarner/cityPopulationEarner";

class AdditionalDataEarner {
    private readonly cities: string[];
    private distanceMatrix: number[][];
    private populations: number[];

    constructor(cities: string[]) {
        this.cities = cities;
    }

    public async getAdditionalData(request: IRequest): Promise<IAdditionalData> {
        if (!this.distanceMatrix) {
            this.distanceMatrix = await getDistances(this.cities);
        }
        const indexFrom = this.cities.indexOf(request.cityFrom);
        const indexTo = this.cities.indexOf(request.cityTo);
        const distance = this.distanceMatrix[indexFrom][indexTo];

        if (!this.populations) {
            this.populations = await  getCitiesPopulation(this.cities);
        }
        const cityFromPopulation = this.populations[this.cities.indexOf(request.cityFrom)];
        const cityToPopulation = this.populations[this.cities.indexOf(request.cityTo)];

        return {
            distance,
            cityFromPopulation,
            cityToPopulation
        }
    }

}

export default AdditionalDataEarner;
