import {io} from "libs/io";
import {IConfig, IRandomConfig, IExactConfig} from "collector/input/IInputGenerator";
import {IRequest} from "types";
import random from "libs/random";

class InputGenerator {
    public dataframe: Array<IRequest> = [];

    get cities(): string[] {
         return Array.from(
             this.dataframe.reduce(
                (acc: Set<string>, request: IRequest) => {
                    acc.add(request.cityFrom);
                    acc.add(request.cityTo);
                    return acc;
                },
                new Set()
             )
         )
    }

    public async generateDataframe(randomised: boolean = true): Promise<void> {
        let config: IConfig =
            await io.readFileAsJSON(__dirname,'./config.json', 'utf8') as IConfig;

        if (randomised) {
            this.generateRandomDataset(config.random);
            return;
        }

        this.generateExactDataset(config.exact);
    }

    private generateExactDataset(config: IExactConfig): void {
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
                console.log("Exact dataframe generation: iteration " + _i + " of " + totalIterationNumber);
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
    }

    private generateRandomDataset(config: IRandomConfig): void {
        let _i = 0;
        const totalIterationNumber = config.cities.length * (config.cities.length - 1) *
            config.cargo.sizes.length *
            config.cargo.weight.length *
            config.cargo.units.length;

        for (let cityFrom of config.cities) {
            for (let cityTo of config.cities) {
                if (cityFrom === cityTo) {
                    continue;
                }
                console.log("Randomize dataframe generation: iteration " + _i + " of " + totalIterationNumber);
                for (let size of config.cargo.sizes) {
                    for (let weight of config.cargo.weight) {
                        for (let units of config.cargo.units) {
                            _i++;
                            size.length
                            this.dataframe.push({
                                cityFrom, cityTo, cargo: {
                                    length: random(size.length.min, size.length.max, 1),
                                    width: random(size.width.min, size.width.max, 1),
                                    height: random(size.height.min, size.height.max, 1),
                                    weight: random(weight.min, weight.max, 1),
                                    units
                                }
                            })
                        }
                    }
                }
            }
        }
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
