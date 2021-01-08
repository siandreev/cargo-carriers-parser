import InputGenerator from "./input/InputGenerator";
import OutputGenerator from "./output/OutputGenerator";
import ParsersManager from "core/ParsersManager";
import {IResponse, IRequest} from "types";

class CollectManager {
    private inputDataframe: Array<IRequest>;
    private inputGenerator: InputGenerator;

    public async initInputDataframe(generateData: boolean = false, saveData: boolean = false, randomize: boolean = true) {
        this.inputGenerator = new InputGenerator();
        if (generateData) {
            console.log("[Info] Input dataframe generation...")
            await this.inputGenerator.generateDataframe(randomize);

            if (saveData) {
                await this.inputGenerator.saveDataframe();
            }
        } else {
            console.log("[Info] Input dataframe loading...")
            await this.inputGenerator.loadDataframe();
        }

        console.log("[Info] Input dataframe has been created...")
        this.inputDataframe = this.inputGenerator.dataframe;
    }

    public async collect() {
        if (!this.inputDataframe.length) {
            await this.initInputDataframe();
        }
        const outputGenerator = new OutputGenerator(this.inputGenerator.cities);

        let _index = 0;
        console.log("[Info] Start parsing requests")

        for (let request of this.inputDataframe) {
            let resultsList: IResponse[] = [];

            const callback = (result: IResponse) => {
                resultsList.push(result);
            }

            const parsersManger = new ParsersManager(request);
            await parsersManger.calculate(callback);
            await outputGenerator.convertAndSave(request, resultsList);

            _index++;
            console.log(`[Info] ${_index} request parsed`)
        }
    }
}

export default CollectManager;
