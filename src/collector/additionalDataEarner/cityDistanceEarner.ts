import {Client, TravelMode, UnitSystem} from "@googlemaps/google-maps-services-js";

export default async function getDistances(cities: string[]): Promise<number[][]> {
    const client = new Client({});
    const response = await client.distancematrix({
        params: {
            origins: cities,
            destinations: cities,
            mode: TravelMode.driving,
            units: UnitSystem.metric,
            key: process.env.GOOGLE_MAPS_API_KEY
        }
    });
    return response.data.rows.map(row => row.elements.map(elem => elem.distance.value));
}
