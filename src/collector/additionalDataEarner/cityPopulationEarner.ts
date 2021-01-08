import {io} from "libs/io";


export default async function getCitiesPopulation(cities: string[]): Promise<number[]> {
    const citiesPopulationDatabase = await io.readFilesAsCSV(__dirname,'./cities.csv', 'utf8')as (string | number)[][];

    const populations: number[] = [];
    for (let city of cities) {
        populations.push(
            citiesPopulationDatabase.find(cityInfo => cityInfo[0] === city)[1] as number
        );
    }
    return populations;
}
