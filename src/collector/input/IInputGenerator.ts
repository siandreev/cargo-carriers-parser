interface IConfig {
    exact: IExactConfig,
    random: IRandomConfig
}

interface IExactConfig {
    cities: Array<string>,
    cargo: {
        length: Array<number>,
        height: Array<number>,
        width: Array<number>,
        weight: Array<number>,
        units: Array<number>
    }
}

interface IRandomConfig {
    cities: Array<string>,
    cargo: {
        sizes: Array<
            {
                length: IInterval,
                height: IInterval,
                width: IInterval
            }
        >,
        weight: Array<{min: number, max: number}>,
        units: Array<number>
    }
}

interface IInterval {
    min: number, max: number
}

export {IConfig, IRandomConfig, IExactConfig};
