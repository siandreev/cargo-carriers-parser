import {io} from "libs/io";
import IConfig from "collector/input/IInputGenerator";
import {IRequest} from "types";

class InputGenerator {
    public dataframe: Array<IRequest> = [];
    public async generateDataframe(): Promise<void> {
        let config: IConfig =
            await io.readFileAsJSON(__dirname,'./config.json', 'utf8') as IConfig;

        let _i = 0;
        const totalIterationNumber = config.cities.length * (config.cities.length - 1) *
            config.cargo.length.length *
            config.cargo.width.length *
            config.cargo.height.length *
            config.cargo.weight.length *
            config.cargo.units.length;

        for (let cityFrom of config.cities) {
            for (let cityTo of config.cities) {
                if (cityFrom === cityTo) {
                    continue;
                }
                console.log("Dataframe generation: iteration " + _i + " of " + totalIterationNumber);
                for (let length of config.cargo.length) {
                    for (let width of config.cargo.width) {
                        for (let height of config.cargo.height) {
                            for (let weight of config.cargo.weight) {
                                for (let units of config.cargo.units) {
                                    _i++;
                                    this.dataframe.push({
                                        cityFrom, cityTo, cargo: {
                                            length,
                                            width,
                                            height,
                                            weight,
                                            units
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
        return;
    }

    public async loadDataframe(): Promise<void> {
        const loadedDataframe = await io.readFilesAsCSV(__dirname,'./dataframe.csv', 'utf8')as (string | number)[][];
        this.dataframe = loadedDataframe.slice(1).map(arr => ({
            cityFrom: arr[0] as string,
            cityTo: arr[1] as string,
            cargo: {
                length: Number(arr[2]),
                width: Number(arr[3]),
                height: Number(arr[4]),
                weight: Number(arr[5]),
                units: Number(arr[6])
            }
        }));
    }

    public async saveDataframe(): Promise<void> {
        if (this.dataframe.length) {
            const parsedDataframe = this.dataframe.map(request => [
                request.cityFrom,
                request.cityTo,
                request.cargo.length,
                request.cargo.width,
                request.cargo.height,
                request.cargo.weight,
                request.cargo.units
            ]);
            await io.writeFileAsCSV(__dirname,'./dataframe.csv', parsedDataframe ,{
                header: true,
                columns: ['cityFrom', 'cityTo', 'length', 'width', 'height', 'weight', 'units']
            },'utf8');
        }
    }
}

export default InputGenerator;