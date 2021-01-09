import {Client, TravelMode, UnitSystem} from "@googlemaps/google-maps-services-js";
import chunks from "libs/chunks";


const client = new Client({});
const MAX_ELEMENTS_LIMIT = 100;

export default async function getDistances(cities: string[]): Promise<number[][]> {
    const maxRowLength = Math.floor(MAX_ELEMENTS_LIMIT / cities.length);
    const citiesChunks: string[][] = chunks<string>(cities, maxRowLength);

    const matrices = await Promise.all(citiesChunks.map(chunk => getMatrix(chunk, cities)));
    return matrices.reduce((acc, elem) => acc.concat(elem), []);
}

async function getMatrix(chuck: string[], allCities: string[]): Promise<number[][]> {
    const response = await client.distancematrix({
        params: {
            origins: chuck,
            destinations: allCities,
            mode: TravelMode.driving,
            units: UnitSystem.metric,
            key: process.env.GOOGLE_MAPS_API_KEY
        }
    });
    return response.data.rows.map(row => row.elements.map(elem => elem.distance.value));
}
