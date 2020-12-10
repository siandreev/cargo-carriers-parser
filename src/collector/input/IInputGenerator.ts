interface IConfig {
    cities: Array<string>,
    cargo: {
        length: Array<number>,
        height: Array<number>,
        width: Array<number>,
        weight: Array<number>,
        units: Array<number>
    }
}

export default IConfig;